from typing import Any, List, Optional, TypedDict

from langchain_core.messages import AIMessage, BaseMessage
from langchain_core.prompts import ChatPromptTemplate

from app.agent.tools import Create_ticket
from app.config import get_chat_model
from app.core.rag import get_rag


class CustomerState(TypedDict, total=False):
    messages: List[Any]
    intent: str
    ticket_id: str
    sources: List[dict]
    human_request_count: int


class IntentEnum(str):
    CONSULT = "consult"
    COMPLAINT = "complaint"
    AFTER_SALES = "after_sales"
    HUMAN = "human"


INTENT_KEYWORDS = {
    IntentEnum.AFTER_SALES: ["退货", "换货", "售后", "维修", "保养", "质量问题"],
    IntentEnum.COMPLAINT: ["投诉", "不满意", "态度差", "举报", "差评"],
    IntentEnum.HUMAN: ["人工", "转人工", "客服", "真人", "电话"],
}

SYSTEM_PROMPT = """你是萃华珠宝官网的 AI 珠宝顾问。

回答风格：
1. 简洁、温暖、专业，不夸张营销。
2. 优先依据知识库回答，不编造政策、价格、电话、地址。
3. 如果知识库不足，说明可以继续补充订单/商品信息或转人工。
4. 和珠宝、门店、售后、会员、物流、发票相关的问题，要给出清晰步骤。

知识库：
{context}
"""


def detect_intent(state: CustomerState):
    last_content = _last_user_text(state["messages"])
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(keyword in last_content for keyword in keywords):
            return {"intent": intent}
    return {"intent": IntentEnum.CONSULT}


def handle_consult(state: CustomerState):
    question = _last_user_text(state["messages"])
    docs = get_rag().search(question, k=3)
    context = "\n\n".join(doc.content for doc in docs) or "暂无匹配知识。"
    reply = _invoke_llm(question, context)

    if reply is None:
        reply = _build_fallback_answer(question, docs)

    return {
        "messages": state["messages"] + [AIMessage(content=reply)],
        "sources": [
            {"source": doc.source, "score": str(doc.score), "content": doc.content[:160]}
            for doc in docs
        ],
    }


def handle_complaint(state: CustomerState):
    question = _last_user_text(state["messages"])
    ticket_message = Create_ticket("投诉", question)
    ticket_id = _extract_ticket_id(ticket_message)
    reply = (
        "非常抱歉给您带来不好的体验，我已经先为您记录投诉内容。"
        f"{ticket_message} 为了便于客服跟进，您也可以继续补充购买渠道、订单号或门店信息。"
    )
    return {
        "messages": state["messages"] + [AIMessage(content=reply)],
        "ticket_id": ticket_id,
        "sources": [],
    }


def handle_after_sales(state: CustomerState):
    question = _last_user_text(state["messages"])
    docs = get_rag().search(question, k=3)
    context = "\n\n".join(doc.content for doc in docs)
    reply = _invoke_llm(
        question,
        context,
        extra_instruction="用户正在咨询售后，请先表达理解，再给出可执行步骤。",
    )
    if reply is None:
        reply = _build_fallback_answer(question, docs, prefix="我理解您想处理售后问题。")
    return {
        "messages": state["messages"] + [AIMessage(content=reply)],
        "sources": [
            {"source": doc.source, "score": str(doc.score), "content": doc.content[:160]}
            for doc in docs
        ],
    }


def handle_human(state: CustomerState):
    human_request_count = state.get("human_request_count", 0) + 1
    if human_request_count < 3:
        reply = (
            "我可以先帮您看一下。请问您具体遇到了什么问题？"
            "比如珠宝选购、门店服务、物流发票或售后问题，我都可以先为您解答。"
        )
    else:
        reply = (
            "好的，已为您转接人工客服，请稍候。"
            "您也可以拨打客服热线 400-888-8888（9:00-21:00）。"
        )
    return {
        "messages": state["messages"] + [AIMessage(content=reply)],
        "ticket_id": "",
        "sources": [],
        "human_request_count": human_request_count,
    }


def route_by_intent(state: CustomerState):
    return state.get("intent", IntentEnum.CONSULT)


def _invoke_llm(
    question: str,
    context: str,
    extra_instruction: str = "",
) -> Optional[str]:
    model = get_chat_model()
    if model is None:
        return None

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT + ("\n" + extra_instruction if extra_instruction else "")),
            ("user", "{question}"),
        ]
    )
    response = (prompt | model).invoke({"question": question, "context": context})
    return getattr(response, "content", None)


def _build_fallback_answer(question: str, docs: list, prefix: str = "") -> str:
    if not docs:
        base = "这个问题我暂时没有在知识库中找到明确答案。您可以补充商品、订单或门店信息，我会继续帮您判断；也可以输入“转人工”。"
        return f"{prefix}{base}" if prefix else base

    snippets = []
    for doc in docs[:2]:
        content = doc.content.replace("#", "").strip()
        snippets.append(content)

    answer = "\n\n".join(snippets)
    if len(answer) > 520:
        answer = answer[:520].rstrip() + "..."

    if prefix:
        return f"{prefix}\n\n{answer}"
    return answer


def _last_user_text(messages: List[Any]) -> str:
    if not messages:
        return ""
    message = messages[-1]
    if isinstance(message, dict):
        return str(message.get("content", ""))
    return str(getattr(message, "content", ""))


def _extract_ticket_id(text: str) -> str:
    marker = "TKT-"
    index = text.find(marker)
    if index == -1:
        return ""
    return text[index : index + 12]


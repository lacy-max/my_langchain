from typing import Any, List, Optional, TypedDict

from langchain_core.messages import AIMessage
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
    IntentEnum.AFTER_SALES: [
        "退货",
        "换货",
        "售后",
        "维修",
        "保养",
        "质量问题",
        "断了",
        "坏了",
        "破损",
        "损坏",
        "瑕疵",
        "掉钻",
        "开裂",
        "变形",
        "项链断",
        "衣服质量",
        "商品质量",
    ],
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
    if _is_quality_issue(question):
        reply = _build_quality_after_sales_reply(question)
        return {
            "messages": state["messages"] + [AIMessage(content=reply)],
            "sources": [
                {
                    "source": doc.source,
                    "score": str(doc.score),
                    "content": doc.content[:160],
                }
                for doc in docs
            ],
        }

    context = "\n\n".join(doc.content for doc in docs)
    reply = _invoke_llm(
        question,
        context,
        extra_instruction=(
            "用户正在咨询售后。回复必须简短，像真人客服：先安抚，再给出下一步。"
            "不要大段解释政策，不要复制知识库条款。"
        ),
    )
    if reply is None:
        reply = _build_after_sales_reply(question)
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
        reply = "请问您遇到什么问题了？我也可以先帮您看看哦。"
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


def _build_quality_after_sales_reply(text: str) -> str:
    action = "办理退货退款" if _wants_return(text) else "安排退换货或其他售后方案"
    return (
        "很抱歉给您带来不好的购物体验。关于商品质量问题，请您提供订单号、问题照片或视频，以及签收时间。"
        f"我们会优先为您核实处理；若商品符合质量问题售后条件，会协助您尽快{action}。"
    )


def _build_after_sales_reply(text: str) -> str:
    if _is_quality_issue(text):
        return _build_quality_after_sales_reply(text)

    return (
        "很抱歉给您带来不便。请您提供订单号、商品情况和相关凭证，我会帮您尽快核实处理。"
    )


def _is_quality_issue(text: str) -> bool:
    keywords = [
        "断了",
        "坏了",
        "破损",
        "损坏",
        "瑕疵",
        "掉钻",
        "开裂",
        "变形",
        "质量问题",
        "项链断",
        "衣服质量",
        "商品质量",
    ]
    return any(keyword in text for keyword in keywords)


def _wants_return(text: str) -> bool:
    keywords = ["退货", "退款", "退掉", "不要了", "退换货"]
    return any(keyword in text for keyword in keywords)

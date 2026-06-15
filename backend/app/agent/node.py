from typing import Any, List, Literal, Optional, TypedDict

from langchain_core.messages import AIMessage
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field

from app.agent.tools import Create_ticket
from app.config import get_chat_model
from app.core.rag import get_rag
from app.services import product_service


class CustomerState(TypedDict, total=False):
    messages: List[Any]
    intent: str
    ticket_id: str
    sources: List[dict]
    human_request_count: int


class ConversationDecision(BaseModel):
    action: Literal["conversation", "knowledge", "products"]
    reply: str = ""
    query: str = ""
    confidence: float = Field(default=0, ge=0, le=1)


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
    decision = _understand_conversation(state["messages"])
    if decision.action == "conversation":
        reply = decision.reply.strip() or "请继续告诉我您的想法，我会结合当前对话帮助您。"
        return {
            "messages": state["messages"] + [AIMessage(content=reply)],
            "ticket_id": state.get("ticket_id", ""),
            "sources": [],
        }

    if decision.action == "products":
        reply = _answer_with_products(state["messages"])
        return {
            "messages": state["messages"] + [AIMessage(content=reply)],
            "ticket_id": state.get("ticket_id", ""),
            "sources": [],
        }

    query = decision.query.strip() or _last_user_text(state["messages"])
    docs = get_rag().search(query, k=3)
    context = "\n\n".join(doc.content for doc in docs) or "暂无匹配知识。"
    reply = _answer_with_knowledge(state["messages"], context)

    if reply is None:
        reply = _build_fallback_answer(query, docs)

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


def _message_text(message: Any) -> str:
    if isinstance(message, dict):
        return str(message.get("content", ""))
    return str(getattr(message, "content", ""))


def _understand_conversation(messages: List[Any]) -> ConversationDecision:
    model = get_chat_model()
    if model is None:
        return ConversationDecision(
            action="conversation",
            reply="当前对话理解模型未配置，暂时无法准确处理您的问题。",
            confidence=1,
        )

    conversation = "\n".join(
        f"{_message_role(message)}：{_message_text(message)}"
        for message in messages[-12:]
    )
    try:
        classifier = model.with_structured_output(ConversationDecision)
        decision = classifier.invoke(
            "你是商城多轮会话路由器。必须从第一条到最后一条阅读带角色的完整会话，"
            "理解最后一条用户消息在当前上下文中的真实含义，并选择所需能力。\n"
            "action=conversation：已有会话信息足以直接回应，例如确认、拒绝、暂缓、"
            "澄清、寒暄、结束话题，或只需基于会话内容回答。reply中给出自然回复。\n"
            "action=knowledge：需要商城政策或知识资料，例如会员、售后、物流、支付、"
            "发票、门店服务。query中写出结合上下文改写后的完整检索问题。\n"
            "action=products：需要推荐、筛选、比较或了解商城商品。商品事实将在下一步"
            "从实时目录读取，此处不要编造商品，query可写用户的完整商品需求。\n"
            "不要依靠固定短语或特定场景模板。相同字面表达在不同上下文中可以走不同"
            "路线。reply仅在conversation时填写，最多2句话。\n\n"
            f"完整会话：\n{conversation}"
        )
        if decision.confidence < 0.6:
            return ConversationDecision(
                action="conversation",
                reply="我还没有完全理解您的意思，可以再补充一点吗？",
                confidence=decision.confidence,
            )
        return decision
    except Exception:
        return ConversationDecision(
            action="conversation",
            reply="当前对话理解服务暂时不可用，请稍后再试。",
            confidence=1,
        )


def _message_role(message: Any) -> str:
    if isinstance(message, dict):
        role = str(message.get("role", message.get("type", "")))
    else:
        role = str(getattr(message, "type", ""))
    return "用户" if role in {"human", "user"} else "助手"


def _answer_with_products(messages: List[Any]) -> str:
    model = get_chat_model()
    if model is None:
        return "当前商品顾问服务未配置，暂时无法完成商品推荐。"

    products, _ = product_service.list_products(page=1, page_size=100)
    catalog = "\n".join(
        f"- {product.name}｜{product.price:.0f}元｜{product.category}｜"
        f"{product.description}｜链接：/container/products/{product.id}"
        for product in products
    )
    conversation = "\n".join(
        f"{_message_role(message)}：{_message_text(message)}"
        for message in messages[-12:]
    )
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "你是商城商品顾问。请从第一条到最后一条理解完整会话中的用户需求，"
                "包括但不限于预算、对象、用途、品类、风格和用户后续修改。"
                "只能依据实时商品目录回答，不得编造目录中没有的商品、价格、材质、"
                "库存、保值属性或优惠。有符合条件的商品时，只展示推荐结果和推荐理由，"
                "不要解释未入选商品、超预算商品、筛选过程或库存情况。"
                "只有完全没有符合条件的商品时，才简要说明无法满足的核心条件，并只追问"
                "一个最有助于继续筛选的问题。最多推荐3件，回复最多3句话。"
                "推荐商品时必须把商品名称写成可点击的 Markdown 链接，链接地址必须使用"
                "实时目录中的地址，格式为[简称](链接)。简称需根据完整商品名提炼为"
                "有辨识度的3到4个中文字符，不能单独输出裸链接。",
            ),
            (
                "user",
                "完整会话：\n{conversation}\n\n实时商品目录：\n{catalog}",
            ),
        ]
    )
    try:
        response = (prompt | model).invoke(
            {"conversation": conversation, "catalog": catalog}
        )
        reply = str(getattr(response, "content", "")).strip()
        return reply or "当前没有找到合适的商品，请补充您的筛选偏好。"
    except Exception:
        return "商品顾问暂时无法响应，请稍后再试。"


def _answer_with_knowledge(messages: List[Any], context: str) -> Optional[str]:
    model = get_chat_model()
    if model is None:
        return None

    conversation = "\n".join(
        f"{_message_role(message)}：{_message_text(message)}"
        for message in messages[-12:]
    )
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                SYSTEM_PROMPT
                + "\n请结合完整会话理解用户当前问题，只使用知识库资料回答。",
            ),
            (
                "user",
                "完整会话：\n{conversation}\n\n知识库资料：\n{context}",
            ),
        ]
    )
    response = (prompt | model).invoke(
        {"conversation": conversation, "context": context}
    )
    return getattr(response, "content", None)


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

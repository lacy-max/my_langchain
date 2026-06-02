from typing import Any, List, TypedDict
from langchain_core.prompts import ChatPromptTemplate
from app.agent.tools import Create_ticket
from app.core.rag import get_rag
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from app.config import model

class CustomerState(TypedDict):
    messages: List[Any]   # 对话历史
    intent: str
    ticket_id: str
class IntentEnum(str):
    CONSULT = "consult"
    COMPLAINT = "complaint"
    AFTER_SALES = "after_sales"
    HUMAN = "human"
INTENT_KEYWORDS = {
    IntentEnum.AFTER_SALES: ["退货", "换货", "售后", "不想要了", "质量问题"],
    IntentEnum.COMPLAINT: ["投诉", "不满意", "态度差", "举报", "差评"],
    IntentEnum.HUMAN: ["人工", "转人工", "客服", "真人"],
}
def detect_intent(state: CustomerState):
      last_content = state["messages"][-1].content
      for intent, keywords in INTENT_KEYWORDS.items():
          if any(kw in last_content for kw in keywords):
            return {"intent": intent}
      return {"intent": IntentEnum.CONSULT}
          
def handle_consult(state):
    """处理咨询 - 回复用户 采用rag检索"""
    last_content = state["messages"][-1].content
    retriever = get_rag()
    if retriever is not None:
        results = retriever.invoke(last_content)
        context = "\n\n".join([d.page_content for d in results])
        prompt = ChatPromptTemplate.from_messages([
            ("system", 
            f"""你是一个温暖、体贴的智能客服助手。

            【当前场景】：用户遇到了商品质量问题，情绪可能比较着急或失望。

            【回答要求】：
            1. **首先表达歉意和理解**（例如：“非常抱歉给您带来不好的体验”、“我完全理解您的心情”）
            2. **然后给出清晰、可执行的解决方案**（例如：申请退货流程、联系人工客服、上传照片等）
            3. **不要使用示例邮箱或网址**（如 example.com）
            4. **语气要温暖、自然**，像真人客服一样。

            【知识库参考】：
              {context}"""),
            ("user", "{question}")
        ])
        chain = prompt | model
        response = chain.invoke({"question": last_content})
        return {
            "messages": state["messages"] + [{"role": "assistant", "content": response.content}]
        }
    else:
        return {
            "messages": state["messages"] + [{"role": "assistant", "content": f"您说的问题，小懒暂时无法给您解答，我需要查询后回复您，谢谢您的理解"}]
        }
    
    
def handle_complaint(state):
    """处理投诉咨询"""
    last_content = state["messages"][-1].content
    if last_content:
        ticket_id = Create_ticket("投诉", last_content)
        prompt = ChatPromptTemplate.from_messages([
            ("system", 
            f"""你是一个智能客服助手，负责处理用户的投诉咨询。当用户投诉时，她的心情很不好。您需要先安抚用户，表达你非常理解客户的感受，然后根据用户的问题，创建工单。
            工单号：{ticket_id}"""),
            ("user", "{question}")
        ])
        chain = prompt | model
        response = chain.invoke({"question": last_content})
        return {
            "messages": state["messages"] + [{"role": "assistant", "content": response.content + f"工单号：{ticket_id}"}]
        }
   
def handle_after_sales(state):
    """处理售后咨询"""
    last_content = state["messages"][-1].content
    if last_content:
        ticket_id = Create_ticket("售后", last_content)
        prompt = ChatPromptTemplate.from_messages([
            ("system", 
            f"""你是一个智能客服助手，负责处理用户的售后咨询。当用户要退货，换货时，为什么具体什么原因，要退或者换，然后你再根据用户提出的问题，给出具体的流程和要求，如果对于你不是特别清楚的，你
            可以说我会帮你创建工单号，后面会有专业的客服处理。工单号：{ticket_id}
        """),
            ("user", "{question}")
        ])
        chain = prompt | model
        response = chain.invoke({"question": last_content})
        return {
            "messages": state["messages"] + [{"role": "assistant", "content": response.content + f"工单号：{ticket_id}"}]
        }
    pass
def handle_human(state):
    """转人工 - 记录会话到数据库"""
    last_content = state["messages"][-1].content
    res = AIMessage(content="正在为您转接人工客服，请稍候... 或拨打客服热线 400-123-4567")
    return {"messages": state["messages"] + [res]}
    pass
def route_by_intent(state):
    """根据意图路由"""
    intent = state.get("intent","consult")
    return intent
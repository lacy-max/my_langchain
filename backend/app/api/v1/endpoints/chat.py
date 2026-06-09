from fastapi import APIRouter
from langchain_core.messages import HumanMessage

from app.agent import agent
from app.models.chat import ChatRequest, ChatResponse


router = APIRouter(prefix="/chat", tags=["聊天"])


@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    config = {"configurable": {"thread_id": request.session_id}}
    input_state = {"messages": [HumanMessage(content=request.message)]}
    result = agent.invoke(input_state, config=config)

    last_message = result["messages"][-1]
    if isinstance(last_message, dict):
        reply = last_message.get("content", "")
    else:
        reply = getattr(last_message, "content", "")

    return ChatResponse(
        success=True,
        message="success",
        user_id=request.session_id,
        data={
            "reply": reply,
            "intent": result.get("intent", "consult"),
            "ticket_id": result.get("ticket_id", ""),
            "sources": result.get("sources", []),
        },
    )

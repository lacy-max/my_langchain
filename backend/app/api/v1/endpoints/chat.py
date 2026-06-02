from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage
from app.agent import agent
from app.models.chat import ChatRequest, ChatResponse

router = APIRouter()
router = APIRouter(prefix="/chat", tags=["聊天"])
@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # 使用前端传递的 session_id 作为 thread_id
    config = {"configurable": {"thread_id": request.session_id}}
    
    # 构建输入状态（只需要传入最新消息，MemorySaver 会自动加载历史）
    input_state = {"messages": [HumanMessage(content=request.message)]}
    result = agent.invoke(input_state, config=config)
    print(result["messages"])
    
   # 获取最后一条消息
    last_message = result["messages"][-1]

        # 兼容两种格式
    if isinstance(last_message, dict):
        reply = last_message.get("content", "")
    else:
        reply = getattr(last_message, "content", "")

    return ChatResponse(
        success=True,
        message="success",
        user_id=request.session_id,  # 或者从请求中获取实际的 user_id
        data={"reply": reply}
)
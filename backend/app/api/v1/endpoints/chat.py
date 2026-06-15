from uuid import uuid4

from fastapi import APIRouter, Cookie, Header, Query, Response
from langchain_core.messages import AIMessage, HumanMessage

from app.agent import agent
from app.models.chat import ChatHistoryResponse, ChatRequest, ChatResponse
from app.services import chat_history_service


router = APIRouter(prefix="/chat", tags=["聊天"])


def _owner_id(user_id: str | None, anonymous_id: str | None) -> str:
    return user_id or anonymous_id or f"anonymous:{uuid4()}"


def _set_anonymous_cookie(
    response: Response,
    owner_id: str,
    user_id: str | None,
    anonymous_id: str | None,
) -> None:
    if not user_id and not anonymous_id:
        response.set_cookie(
            key="chat_owner_id",
            value=owner_id,
            httponly=True,
            samesite="lax",
            max_age=60 * 60 * 24 * 365,
        )


@router.get("/history", response_model=ChatHistoryResponse)
async def chat_history(
    response: Response,
    session_id: str = Query(..., min_length=1),
    x_user_id: str | None = Header(None),
    chat_owner_id: str | None = Cookie(None),
):
    owner_id = _owner_id(x_user_id, chat_owner_id)
    _set_anonymous_cookie(response, owner_id, x_user_id, chat_owner_id)
    rows = chat_history_service.list_messages(
        owner_id,
        session_id,
    )
    return ChatHistoryResponse(
        data=[
            {
                "id": row["id"],
                "role": row["role"],
                "content": row["content"],
                "intent": row["metadata"].get("intent", ""),
                "ticket_id": row["metadata"].get("ticket_id", ""),
                "sources": row["metadata"].get("sources", []),
                "created_at": row["created_at"],
            }
            for row in rows
        ]
    )


@router.post("", response_model=ChatResponse)
async def chat_endpoint(
    request: ChatRequest,
    response: Response,
    x_user_id: str | None = Header(None),
    chat_owner_id: str | None = Cookie(None),
):
    owner_id = _owner_id(x_user_id, chat_owner_id)
    _set_anonymous_cookie(response, owner_id, x_user_id, chat_owner_id)
    stored_messages = chat_history_service.list_messages(
        owner_id,
        request.session_id,
    )
    previous_messages = [
        HumanMessage(content=item["content"])
        if item["role"] == "user"
        else AIMessage(content=item["content"])
        for item in stored_messages
    ]
    chat_history_service.add_message(
        owner_id,
        request.session_id,
        "user",
        request.message,
    )

    config = {
        "configurable": {
            "thread_id": f"{owner_id}:{request.session_id}",
        }
    }
    input_state = {
        "messages": previous_messages + [HumanMessage(content=request.message)]
    }
    result = agent.invoke(input_state, config=config)

    last_message = result["messages"][-1]
    if isinstance(last_message, dict):
        reply = last_message.get("content", "")
    else:
        reply = getattr(last_message, "content", "")

    response_data = {
        "reply": reply,
        "intent": result.get("intent", "consult"),
        "ticket_id": result.get("ticket_id", ""),
        "sources": result.get("sources", []),
    }
    assistant_message = chat_history_service.add_message(
        owner_id,
        request.session_id,
        "assistant",
        reply,
        metadata=response_data,
    )

    return ChatResponse(
        success=True,
        message="success",
        user_id=request.session_id,
        data={**response_data, "message_id": assistant_message["id"]},
    )

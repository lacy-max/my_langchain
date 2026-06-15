from typing import Dict, List, Literal
from pydantic import BaseModel, Field


class ChatHistoryMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatHistoryItem(ChatHistoryMessage):
    id: str
    intent: str = ""
    ticket_id: str = ""
    sources: List[Dict[str, object]] = Field(default_factory=list)
    created_at: str


class ChatHistoryResponse(BaseModel):
    success: bool = True
    data: List[ChatHistoryItem] = Field(default_factory=list)

class ChatSource(BaseModel):
    source: str
    score: str
    content: str

class ChatResponse(BaseModel):
    success: bool
    message: str
    user_id: str
    data: Dict[str, object]

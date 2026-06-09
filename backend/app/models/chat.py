from typing import Dict, List, Optional
from pydantic import BaseModel

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatSource(BaseModel):
    source: str
    score: str
    content: str

class ChatResponse(BaseModel):
    success: bool
    message: str
    user_id: str
    data: Dict[str, object]

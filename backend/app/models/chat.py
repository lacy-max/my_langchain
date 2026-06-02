from typing import Dict
from pydantic import BaseModel

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    success: bool
    message: str
    user_id: str
    data:Dict[str, str]

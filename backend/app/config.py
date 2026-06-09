import os
from typing import Optional


DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")

_chat_model = None


def get_chat_model() -> Optional[object]:
    """Lazy-load the chat model so the API can start without optional LLM deps."""
    global _chat_model
    if _chat_model is not None:
        return _chat_model

    if not DEEPSEEK_API_KEY:
        return None

    try:
        from langchain_openai import ChatOpenAI
    except Exception:
        return None

    _chat_model = ChatOpenAI(
        model=DEEPSEEK_MODEL,
        temperature=0.35,
        api_key=DEEPSEEK_API_KEY,
        base_url=DEEPSEEK_BASE_URL,
    )
    return _chat_model


import os
from typing import Optional


DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek-chat")
DASHSCOPE_API_KEY = os.getenv("DASHSCOPE_API_KEY", "")
DASHSCOPE_BASE_URL = os.getenv(
    "DASHSCOPE_BASE_URL",
    "https://dashscope.aliyuncs.com/compatible-mode/v1",
)
DASHSCOPE_CHAT_MODEL = os.getenv("DASHSCOPE_CHAT_MODEL", "qwen-plus")

_chat_model = None


def get_chat_model() -> Optional[object]:
    """Lazy-load the chat model so the API can start without optional LLM deps."""
    global _chat_model
    if _chat_model is not None:
        return _chat_model

    if DEEPSEEK_API_KEY:
        api_key = DEEPSEEK_API_KEY
        base_url = DEEPSEEK_BASE_URL
        model_name = DEEPSEEK_MODEL
    elif DASHSCOPE_API_KEY:
        api_key = DASHSCOPE_API_KEY
        base_url = DASHSCOPE_BASE_URL
        model_name = DASHSCOPE_CHAT_MODEL
    else:
        return None

    try:
        from langchain_openai import ChatOpenAI
    except Exception:
        return None

    _chat_model = ChatOpenAI(
        model=model_name,
        temperature=0.2,
        api_key=api_key,
        base_url=base_url,
    )
    return _chat_model

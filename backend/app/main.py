from fastapi import FastAPI
from fastapi import APIRouter, HTTPException
from app.api.v1.endpoints.login import router as login_router
from app.api.v1.endpoints.products import router as products_router
from app.api.v1.endpoints.stores import router as stores_router
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.services.chat_history_service import initialize_database

try:
    from app.api.v1.endpoints.chat import router as chat_router
except ModuleNotFoundError as exc:
    chat_router = APIRouter(prefix="/chat", tags=["聊天"])

    @chat_router.post("")
    async def chat_unavailable():
        raise HTTPException(
            status_code=503,
            detail=f"聊天服务依赖未安装或版本不兼容：{exc.name}",
        )

@asynccontextmanager
async def startup_event(app: FastAPI):
    initialize_database()
    yield
app = FastAPI(title="智能客服系统", lifespan=startup_event)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:3001"],   # 允许的前端地址（可以添加多个）
    allow_credentials=True,
    allow_methods=["*"],                       # 允许所有 HTTP 方法（GET, POST, PUT, DELETE 等）
    allow_headers=["*"],                       # 允许所有请求头
)

# 注册路由
app.include_router(login_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(products_router, prefix="/api/v1")
app.include_router(stores_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "API 运行中"}

from fastapi import FastAPI
from app.api.v1.endpoints.login import router as login_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="智能客服系统")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],   # 允许的前端地址（可以添加多个）
    allow_credentials=True,
    allow_methods=["*"],                       # 允许所有 HTTP 方法（GET, POST, PUT, DELETE 等）
    allow_headers=["*"],                       # 允许所有请求头
)

# 注册路由
app.include_router(login_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "API 运行中"}
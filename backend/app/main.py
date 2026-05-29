from fastapi import FastAPI
from app.api.v1.endpoints.login import router as login_router

app = FastAPI(title="智能客服系统")

# 注册路由
app.include_router(login_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "API 运行中"}
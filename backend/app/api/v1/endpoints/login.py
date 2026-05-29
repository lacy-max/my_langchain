from fastapi import APIRouter, HTTPException
from app.models.login import LoginRq, LoginRs
from app.core.security import authenticate_user

router = APIRouter(prefix="/login", tags=["登录"])
@router.post("", response_model=LoginRs)
async def login(login_rq: LoginRq):
    print(login_rq)
    user_id = authenticate_user(login_rq.username, login_rq.password)
    print(user_id)
    if not user_id:
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    return LoginRs(success=True, message="登录成功", user_id=user_id)
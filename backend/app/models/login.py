from pydantic import BaseModel

class LoginRq(BaseModel):
    username: str
    password: str

class LoginRs(BaseModel):
    success: bool
    message: str
    user_id: str
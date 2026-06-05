from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.thingsboard import tb_login, tb_get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


class LoginResponse(BaseModel):
    token: str
    refreshToken: str
    user: dict


@router.post("/login", response_model=LoginResponse)
async def login(body: LoginRequest):
    try:
        data = await tb_login(body.username, body.password)
    except Exception as e:
        raise HTTPException(status_code=401, detail="Neispravni podaci za prijavu")
    token = data.get("token", "")
    try:
        user = await tb_get_current_user(token)
    except Exception:
        user = {}
    return LoginResponse(token=token, refreshToken=data.get("refreshToken", ""), user=user)

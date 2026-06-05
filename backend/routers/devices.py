from fastapi import APIRouter, Header, HTTPException
from services.thingsboard import (
    tb_get_current_user,
    tb_get_devices,
    tb_get_tenant_devices,
)

router = APIRouter(prefix="/api/devices", tags=["devices"])


def _extract_token(authorization: str) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Nedostaje autorizacijski token")
    return authorization.removeprefix("Bearer ")


@router.get("")
async def get_devices(authorization: str = Header(...)):
    token = _extract_token(authorization)
    try:
        user = await tb_get_current_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Nevažeći token")

    authority = user.get("authority", "")
    try:
        if authority == "TENANT_ADMIN":
            result = await tb_get_tenant_devices(token)
        else:
            customer_id = user.get("customerId", {}).get("id")
            if not customer_id:
                return {"data": [], "totalElements": 0}
            result = await tb_get_devices(token, customer_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"ThingsBoard greška: {e}")

    return result

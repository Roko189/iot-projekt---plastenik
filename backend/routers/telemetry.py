from fastapi import APIRouter, Header, HTTPException, Query
from services.thingsboard import tb_get_latest_telemetry, tb_get_history_telemetry

router = APIRouter(prefix="/api/telemetry", tags=["telemetry"])

GREENHOUSE_KEYS = "temperature,humidity,illuminance"


def _extract_token(authorization: str) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Nedostaje autorizacijski token")
    return authorization.removeprefix("Bearer ")


@router.get("/{device_id}/latest")
async def get_latest(device_id: str, authorization: str = Header(...)):
    token = _extract_token(authorization)
    try:
        data = await tb_get_latest_telemetry(token, device_id, GREENHOUSE_KEYS)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"ThingsBoard greška: {e}")
    return data


@router.get("/{device_id}/history")
async def get_history(
    device_id: str,
    start_ts: int = Query(..., description="Unix timestamp ms"),
    end_ts: int = Query(..., description="Unix timestamp ms"),
    interval: int = Query(3600000, description="Agregacijski interval ms"),
    agg: str = Query("AVG", description="Agregacijska funkcija: AVG, MIN, MAX, SUM"),
    authorization: str = Header(...),
):
    token = _extract_token(authorization)
    try:
        data = await tb_get_history_telemetry(
            token, device_id, GREENHOUSE_KEYS, start_ts, end_ts, interval, agg
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"ThingsBoard greška: {e}")
    return data

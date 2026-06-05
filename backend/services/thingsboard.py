import os
import httpx
from typing import Any

TB_BASE = os.getenv("TB_BASE_URL", "http://161.53.133.253:8080")


async def tb_login(username: str, password: str) -> dict:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{TB_BASE}/api/auth/login",
            json={"username": username, "password": password},
            timeout=10,
        )
        resp.raise_for_status()
        return resp.json()


async def tb_get(path: str, token: str, params: dict | None = None) -> Any:
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TB_BASE}{path}",
            headers={"X-Authorization": f"Bearer {token}"},
            params=params,
            timeout=15,
        )
        resp.raise_for_status()
        return resp.json()


async def tb_get_current_user(token: str) -> dict:
    return await tb_get("/api/auth/user", token)


async def tb_get_devices(token: str, customer_id: str, page: int = 0, page_size: int = 50) -> dict:
    return await tb_get(
        f"/api/customer/{customer_id}/devices",
        token,
        {"pageSize": page_size, "page": page},
    )


async def tb_get_tenant_devices(token: str, page: int = 0, page_size: int = 50) -> dict:
    return await tb_get(
        "/api/tenant/devices",
        token,
        {"pageSize": page_size, "page": page},
    )


async def tb_get_latest_telemetry(token: str, device_id: str, keys: str) -> dict:
    return await tb_get(
        f"/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries",
        token,
        {"keys": keys},
    )


async def tb_get_history_telemetry(
    token: str,
    device_id: str,
    keys: str,
    start_ts: int,
    end_ts: int,
    interval: int = 60000,
    agg: str = "AVG",
    limit: int = 500,
) -> dict:
    return await tb_get(
        f"/api/plugins/telemetry/DEVICE/{device_id}/values/timeseries",
        token,
        {
            "keys": keys,
            "startTs": start_ts,
            "endTs": end_ts,
            "interval": interval,
            "agg": agg,
            "limit": limit,
        },
    )

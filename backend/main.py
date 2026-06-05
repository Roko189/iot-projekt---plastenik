import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, devices, telemetry

app = FastAPI(title="Greenhouse Monitor API", version="1.0.0")

_origins_env = os.getenv("ALLOWED_ORIGINS", "")
_extra = [o.strip() for o in _origins_env.split(",") if o.strip()]
ALLOWED_ORIGINS = ["http://localhost:5173", "http://localhost:3000"] + _extra

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(devices.router)
app.include_router(telemetry.router)


@app.get("/health")
async def health():
    return {"status": "ok"}

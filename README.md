# Greenhouse Monitor

Pametni sustav praćenja uvjeta u plasteniku — web aplikacija koja se spaja na ThingsBoard IoT platformu.

## Arhitektura

```
ThingsBoard (localhost:8080)
        │
        ▼
FastAPI Backend (localhost:8000)   ← proxy, autentikacija
        │
        ▼
React Frontend (localhost:5173)    ← dashboard za korisnika
```

## Preduvjeti

- **ThingsBoard** pokrenut lokalno na portu `8080`
- **Python 3.11+**
- **Node.js 18+** i npm

## Pokretanje

### 1. Backend

```bat
start-backend.bat
```

Ili ručno:
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API dokumentacija: http://localhost:8000/docs

### 2. Frontend

```bat
start-frontend.bat
```

Ili ručno:
```bash
cd frontend
npm install
npm run dev
```

Aplikacija: http://localhost:5173

## Konfiguracija ThingsBoard uređaja

Uređaji trebaju slati telemetriju s ključevima:
- `temperature` — temperatura zraka (°C)
- `humidity` — relativna vlaga zraka (%)
- `illuminance` — razina osvjetljenja (lux)

## Korisničke uloge

- **TENANT_ADMIN** — vidi sve uređaje tenanta
- **CUSTOMER_USER** — vidi samo uređaje dodijeljene svom customeru

## Značajke

- Prijava putem ThingsBoard korisničkog računa
- Prikaz svih plastenika (uređaja) korisnika
- Real-time prikaz senzora (osvježavanje svakih 10s)
- Status uvjeta (optimalno / upozorenje / kritično)
- Povijesni grafovi: 1h, 6h, 24h, 7d, 30d

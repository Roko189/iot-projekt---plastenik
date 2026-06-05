@echo off
echo Pokretanje Greenhouse Monitor backend servera...
cd /d "%~dp0backend"

if not exist ".venv" (
    echo Kreiranje virtualnog okruženja...
    python -m venv .venv
)

call .venv\Scripts\activate.bat
pip install -r requirements.txt --quiet

echo.
echo Backend pokrenut na: http://localhost:8000
echo API dokumentacija: http://localhost:8000/docs
echo.
uvicorn main:app --reload --host 0.0.0.0 --port 8000

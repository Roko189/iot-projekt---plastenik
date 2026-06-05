@echo off
echo Pokretanje Greenhouse Monitor frontend servera...
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo Instaliranje Node.js ovisnosti...
    npm install
)

echo.
echo Frontend pokrenut na: http://localhost:5173
echo.
npm run dev

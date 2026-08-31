@echo off
rem Sobe o site local de testes em http://localhost:3000
rem (banco SQLite local, separado da producao; mainnet real na wallet)
cd /d "%~dp0"
echo Garantindo o client do banco local...
call npm run dev:gen >nul 2>&1
echo Subindo em http://localhost:3000 (Ctrl+C para parar)
start "" http://localhost:3000
call npm run dev

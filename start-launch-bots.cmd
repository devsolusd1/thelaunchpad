@echo off
rem Dia do launch: sobe os DOIS bots da Padcore de uma vez.
rem  - janela 1 (esta): monitor de fees com split automatico a cada 30min
rem  - janela 2: buyback & burn do $PAD em loop
rem Requisitos no .env: TREASURY_SECRET_BASE58, BOT_DATABASE_URL,
rem PLATFORM_TOKEN_MINT, BOT_PAD_FEES_WALLET.
cd /d "%~dp0"
echo Gerando client do banco de producao...
call npm run bots:gen >nul 2>&1
echo Abrindo o buyback ^& burn em outra janela...
start "Padcore - Buyback & Burn" cmd /k node bots\buyback-burn.js --loop
node bots\monitor.js --auto
rem (chegou aqui = saiu do monitor com [q])
echo.
echo Feche tambem a janela do buyback antes de rodar "npm run dev:gen".
pause

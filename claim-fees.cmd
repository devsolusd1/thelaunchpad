@echo off
rem Claim universal de fees DBC — cola uma secret key e clama todas as fees
rem (partner + creator) de qualquer config/pool DBC que essa wallet controla.
rem A secret fica so nesta janela (variavel de ambiente local) e e' limpa no fim.
setlocal enabledelayedexpansion
cd /d "%~dp0"
echo Gerando client do banco...
call npm run bots:gen >nul 2>&1

echo.
echo Cole a SECRET KEY da wallet (base58 da Phantom/Solflare, ou array [1,2,...]):
set /p CLAIM_SECRET=^>
echo.
set /p DODRY=Rodar em modo teste primeiro (dry-run)? [S/n]:
if /i "%DODRY%"=="n" (
  node bots\claim-any.js
) else (
  node bots\claim-any.js --dry-run
  echo.
  set /p GO=Clamar de verdade agora? [s/N]:
  if /i "!GO!"=="s" node bots\claim-any.js
)

set CLAIM_SECRET=
echo.
echo Restaurando client do dev local...
call npm run dev:gen >nul 2>&1
endlocal
pause

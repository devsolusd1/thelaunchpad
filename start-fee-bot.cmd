@echo off
rem Painel de fees da Padcore — clique duas vezes ou rode no cmd.
rem Gera o client Postgres (Neon), abre o monitor e, ao sair com [q],
rem devolve o client sqlite do dev local.
cd /d "%~dp0"
echo Gerando client do banco de producao...
call npm run bots:gen >nul 2>&1
node bots\monitor.js %*
echo Restaurando client do dev local...
call npm run dev:gen >nul 2>&1
echo Pronto.
pause

@echo off
echo Adding Node.js to PATH...
SET "PATH=%PATH%;C:\Program Files\nodejs"
echo Starting Claro Recharge PoC...
call npm install
call npm run dev
pause

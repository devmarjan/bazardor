@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist node_modules (
  echo Package install hocche, ektu opekkha korun...
  call npm install
)
start "" http://localhost:3000
call npm run dev
pause

@echo off
echo Starting Full Stack Movie Platform...
cd backend
start cmd /k "npm install && node server.js"
cd ../frontend
start cmd /k "npm install && npm run dev"
echo Both servers are starting! Backend at :5000, Frontend at :5173
pause

@echo off
echo Testing DevOps Projects API...
echo.

echo 1. Testing GET /api/devops-projects
curl -s http://localhost:5000/api/devops-projects
echo.
echo.

echo 2. Testing POST /api/devops-projects
curl -s -X POST http://localhost:5000/api/devops-projects -H "Content-Type: application/json" -d "{\"title\":\"Test Project\",\"description\":\"Test\",\"githubUrl\":\"https://github.com/test\",\"tags\":[\"test\"],\"icon\":\"🧪\",\"difficulty\":\"Beginner\"}"
echo.
echo.

echo Done!
pause

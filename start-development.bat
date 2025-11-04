@echo off
title 求职导航应用 - 开发环境
color 0A

echo ========================================
echo    求职导航应用 - 开发环境
echo ========================================
echo.

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未安装Node.js
    echo 请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo 💾 数据库: SQLite
echo 🤖 AI服务: 智谱AI

echo.
echo 🚀 启动开发服务器...
echo.

REM 启动SQLite版本后端服务器
echo 📡 启动后端服务器 (端口3000)...
start "后端服务器" cmd /k "cd backend && node server.js"

REM 等待2秒
timeout /t 2 /nobreak >nul

REM 启动前端开发服务器
echo 🌐 启动前端开发服务器 (端口8080)...
start "前端服务器" cmd /k "npm run dev"

echo.
echo ✅ 开发环境启动完成！
echo.
echo 📱 前端地址: http://localhost:8080
echo 🔗 后端API: http://localhost:3000
echo 📊 健康检查: http://localhost:3000/health
echo 💾 数据库: SQLite (backend/data/database.sqlite)
echo.
echo 💡 提示:
echo - 前端支持热重载，修改代码会自动刷新
echo - 后端支持自动重启，修改代码会自动重启服务
echo - SQLite数据库文件会自动创建
echo - 按Ctrl+C可以停止对应的服务
echo.
echo 🔧 数据库优势:
echo - ✅ 无需安装额外数据库软件
echo - ✅ 数据存储在本地文件中
echo - ✅ 完整的SQL功能支持
echo - ✅ AI功能完全可用
echo - ✅ 适合开发和小型部署
echo.

pause






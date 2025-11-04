@echo off
chcp 65001 > nul
echo ========================================
echo 🚀 启动Android开发环境
echo ========================================

echo.
echo 📋 1. 启动后端服务器...
start "后端服务器" cmd /k "cd /d %~dp0backend && set MONGODB_URI=mongodb+srv://2389235774_db_user:lyypJs5vS7DpxYd2@cluster0.dcdnszd.mongodb.net/job-navigation?retryWrites=true&w=majority && set ZHIPU_API_KEY=43a7dfe5176748f0ba6cb13e0d963641.dGJdRvjJxrZy7q6f && set AI_PROVIDER=zhipu && node server.js"

echo.
echo ⏳ 等待后端启动...
timeout /t 5 /nobreak > nul

echo.
echo 🎨 2. 启动前端开发服务器...
start "前端服务器" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ⏳ 等待前端启动...
timeout /t 8 /nobreak > nul

echo.
echo 📱 3. 构建并同步到Android...
cd /d %~dp0
call npm run build
call npx cap sync android

echo.
echo 🔧 4. 打开Android Studio...
call npx cap open android

echo.
echo ========================================
echo ✅ 开发环境启动完成！
echo ========================================
echo.
echo 📋 下一步操作：
echo   1. 在Android Studio中启动虚拟机
echo   2. 点击Run按钮运行应用
echo   3. 如果界面空白，检查网络连接
echo.
echo 🌐 测试地址：
echo   • 浏览器: http://localhost:8080
echo   • 后端API: http://localhost:3000
echo   • Android API: http://10.0.2.2:3000
echo.
echo 👤 测试账号: 12345678900 / 123456
echo.
pause







@echo off
echo 🏠 本地生产环境设置
echo.

echo 这个脚本会将你的应用配置为本地生产模式
echo 适用于无法立即部署到云端的情况
echo.

echo 1. 设置生产环境变量...
set NODE_ENV=production

echo 2. 启动后端服务器（生产模式）...
start "Backend Server" cmd /k "cd backend && npm start"

echo 3. 等待服务器启动...
timeout /t 5

echo 4. 构建前端生产版本...
npm run build

echo 5. 同步到Android...
npx cap sync android

echo 6. 复制资源...
npx cap copy android

echo 7. 打开Android Studio...
npx cap open android

echo.
echo ✅ 本地生产环境设置完成！
echo.
echo 📱 在Android Studio中：
echo 1. 构建签名APK
echo 2. 安装到手机测试
echo.
echo 🌐 当前配置：
echo - 后端服务器：http://192.168.112.212:3000
echo - 数据库：本地SQLite
echo - 模式：生产环境
echo.
echo 📝 注意：
echo - 手机需要连接到同一WiFi网络
echo - 电脑需要保持开启状态
echo - 这是临时解决方案，建议后续部署到云端
echo.
pause
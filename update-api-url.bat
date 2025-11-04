@echo off
echo 🔧 更新API地址配置
echo.

echo 🌐 你的GitHub仓库: https://github.com/XY9555/job-navigation-app
echo 📡 预期的API地址格式: https://job-navigation-api.onrender.com
echo.
set /p API_URL="请输入你的Render API地址 (例如: https://job-navigation-api.onrender.com): "

if "%API_URL%"=="" (
    echo ❌ 错误：API地址不能为空
    pause
    exit /b 1
)

echo.
echo 正在更新配置文件...

:: 创建临时PowerShell脚本来替换文件内容
echo $content = Get-Content 'src/config/api-config.js' -Raw > temp_update.ps1
echo $content = $content -replace 'https://job-navigation-api\.onrender\.com/api', '%API_URL%/api' >> temp_update.ps1
echo Set-Content 'src/config/api-config.js' $content >> temp_update.ps1

powershell -ExecutionPolicy Bypass -File temp_update.ps1
del temp_update.ps1

echo ✅ API地址已更新为: %API_URL%/api
echo.

echo 🔨 开始构建生产版本...
call npm run build

echo 📱 同步到Android...
call npx cap sync android

echo 📋 复制资源...
call npx cap copy android

echo.
echo ✅ 更新完成！
echo.
echo 📱 接下来：
echo 1. 在Android Studio中构建签名APK
echo 2. 安装到手机测试
echo 3. 你的APP现在可以独立运行了！
echo.
pause
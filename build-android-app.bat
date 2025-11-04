@echo off
title 求职导航应用 - Android构建脚本
color 0B

echo ========================================
echo    求职导航应用 - Android构建脚本
echo ========================================
echo.

REM 检查环境
echo 🔍 检查开发环境...

REM 检查Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未安装Node.js
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

REM 检查npm依赖
if not exist "node_modules" (
    echo 📦 安装前端依赖...
    npm install
)

if not exist "backend/node_modules" (
    echo 📦 安装后端依赖...
    cd backend
    npm install
    cd ..
)

echo.
echo 🏗️  开始构建应用...
echo.

REM 构建前端
echo 📱 构建前端应用...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 前端构建失败
    pause
    exit /b 1
)
echo ✅ 前端构建完成

REM 同步到Capacitor
echo 🔄 同步到Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Capacitor同步失败
    pause
    exit /b 1
)
echo ✅ Capacitor同步完成

echo.
echo 📱 准备Android构建...

REM 检查Android环境
if not defined ANDROID_HOME (
    echo ⚠️  警告: ANDROID_HOME环境变量未设置
    echo 正在尝试自动检测...
    
    if exist "%LOCALAPPDATA%\Android\Sdk" (
        set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
        echo ✅ 找到Android SDK: %ANDROID_HOME%
    ) else (
        echo ❌ 未找到Android SDK
        echo 请安装Android Studio并设置SDK路径
        echo 然后运行: setup-android-env.bat
        pause
        exit /b 1
    )
)

echo ✅ Android SDK: %ANDROID_HOME%

REM 选择构建方式
echo.
echo 请选择构建方式:
echo 1. 在Android Studio中打开项目 (推荐)
echo 2. 命令行构建APK
echo 3. 仅打开项目，不构建
echo.
set /p choice="请输入选择 (1-3): "

if "%choice%"=="1" (
    echo 🚀 在Android Studio中打开项目...
    call npx cap open android
    echo.
    echo 📋 在Android Studio中的操作步骤:
    echo 1. 等待项目加载完成
    echo 2. 点击 Build → Clean Project
    echo 3. 点击 Build → Rebuild Project  
    echo 4. 点击运行按钮或按 Shift+F10
    echo.
) else if "%choice%"=="2" (
    echo 🔨 命令行构建APK...
    cd android
    call gradlew assembleDebug
    if %errorlevel% neq 0 (
        echo ❌ APK构建失败
        cd ..
        pause
        exit /b 1
    )
    echo ✅ APK构建完成
    echo 📁 APK位置: android\app\build\outputs\apk\debug\app-debug.apk
    cd ..
) else if "%choice%"=="3" (
    echo 📂 仅打开项目...
    call npx cap open android
) else (
    echo ❌ 无效选择
    pause
    exit /b 1
)

echo.
echo ✅ 构建流程完成！
echo.
echo 💡 开发提示:
echo - 使用 start-development.bat 启动开发环境
echo - 修改代码后运行此脚本重新构建
echo - 生产环境请使用 npm run build 构建优化版本
echo.

pause











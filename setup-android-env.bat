@echo off
echo 正在配置Android开发环境...

REM 设置Android SDK路径（请根据实际安装路径修改）
set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%

REM 添加到PATH
set PATH=%ANDROID_HOME%\tools;%ANDROID_HOME%\tools\bin;%ANDROID_HOME%\platform-tools;%PATH%

echo Android SDK路径: %ANDROID_HOME%
echo.

REM 检查SDK是否存在
if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
    echo ✅ Android SDK 配置成功
    echo ADB版本:
    "%ANDROID_HOME%\platform-tools\adb.exe" version
) else (
    echo ❌ Android SDK 未找到
    echo 请确保Android Studio已正确安装并设置SDK路径
    echo 常见SDK路径:
    echo   %LOCALAPPDATA%\Android\Sdk
    echo   C:\Android\Sdk
    echo   %USERPROFILE%\AppData\Local\Android\Sdk
)

echo.
echo 如果SDK路径不正确，请：
echo 1. 打开Android Studio
echo 2. File → Settings → Appearance ^& Behavior → System Settings → Android SDK
echo 3. 复制SDK路径并修改此脚本中的ANDROID_HOME变量

pause











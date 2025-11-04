@echo off
echo 📱 手机APP调试日志查看工具
echo.
echo ⚠️ 请确保已完成以下步骤：
echo 1. 手机已开启开发者选项
echo 2. 已启用USB调试
echo 3. 手机已通过USB连接到电脑
echo.

echo 🔍 检查ADB是否可用...
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ADB工具未安装或未在PATH中
    echo.
    echo 📥 请下载Android SDK Platform Tools:
    echo https://developer.android.com/studio/releases/platform-tools
    echo.
    echo 或者使用Android Studio自带的ADB:
    echo 通常位于: C:\Users\%USERNAME%\AppData\Local\Android\Sdk\platform-tools\
    echo.
    pause
    exit /b 1
)

echo ✅ ADB工具已就绪
echo.

echo 🔌 检查设备连接...
adb devices
echo.

echo 📋 如果看到设备列表为空或显示"unauthorized"，请：
echo 1. 检查手机是否弹出"允许USB调试"对话框，点击"确定"
echo 2. 确保手机已解锁
echo 3. 尝试重新连接USB线
echo.

echo 🚀 开始查看APP日志...
echo 按 Ctrl+C 停止日志查看
echo.
echo 现在请在手机上打开您的APP，然后查看下方日志：
echo ================================================
adb logcat -s chromium:V SystemWebViewClient:V Console:V WebView:V

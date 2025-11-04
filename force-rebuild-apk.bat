@echo off
echo 🔥 强制重新构建APK - 清理所有缓存
echo.

echo 第1步：停止所有Android相关进程...
taskkill /f /im "Android Studio*" 2>nul
taskkill /f /im "gradle*" 2>nul
taskkill /f /im "java*" 2>nul

echo.
echo 第2步：清理Android构建缓存...
if exist "android\app\build" rmdir /s /q "android\app\build"
if exist "android\.gradle" rmdir /s /q "android\.gradle"
if exist "android\app\src\main\assets\public" rmdir /s /q "android\app\src\main\assets\public"

echo.
echo 第3步：清理前端构建...
if exist "dist" rmdir /s /q "dist"

echo.
echo 第4步：重新构建前端...
call npm run build

echo.
echo 第5步：同步到Android...
call npx cap sync android

echo.
echo 第6步：打开Android Studio...
call npx cap open android

echo.
echo ✅ 清理完成！现在在Android Studio中：
echo.
echo 🔥 重要：必须按以下顺序操作：
echo 1. File → Invalidate Caches and Restart → Invalidate and Restart
echo 2. 等待Android Studio重启完成
echo 3. Build → Clean Project
echo 4. Build → Rebuild Project  
echo 5. Build → Generate Signed Bundle/APK
echo 6. 选择APK，选择release构建类型
echo 7. 构建新的APK
echo.
echo 🎯 新APK特征：
echo - 文件大小可能不同
echo - 创建时间是今天
echo - 版本号或构建时间戳更新
echo.
echo 📱 安装前请：
echo - 卸载旧版本APP
echo - 重启手机
echo - 安装新APK
echo.
pause
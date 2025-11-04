# 🚀 手动部署步骤指南

## 当前状态 ✅
- ✅ Git仓库已初始化
- ✅ 所有代码已提交到本地Git
- ✅ 项目文件已准备完毕

## 接下来的步骤

### 1. 创建GitHub仓库
1. 访问 [github.com](https://github.com)
2. 登录你的账号（如果没有请先注册）
3. 点击右上角 "+" → "New repository"
4. 仓库名称：`job-navigation-app`
5. 设置为 **Public**
6. **不要**勾选 "Add a README file"
7. 点击 "Create repository"

### 2. 推送代码到GitHub
复制以下命令到命令行执行（替换 `你的用户名` 为实际用户名）：

```bash
git branch -M main
git remote add origin https://github.com/你的用户名/job-navigation-app.git
git push -u origin main
```

### 3. 部署到Render
1. 访问 [render.com](https://render.com)
2. 点击 "Get Started for Free"
3. 使用GitHub账号登录
4. 点击 "New +" → "Web Service"
5. 选择你的 `job-navigation-app` 仓库
6. 配置如下：
   - **Name**: `job-navigation-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
7. 点击 "Create Web Service"

### 4. 创建数据库
1. 在Render控制台，点击 "New +" → "PostgreSQL"
2. 配置：
   - **Name**: `job-navigation-db`
   - **Plan**: `Free`
3. 点击 "Create Database"
4. 等待创建完成，复制 "External Database URL"

### 5. 设置环境变量
在Web Service的 "Environment" 页面添加：
- `NODE_ENV` = `production`
- `ZHIPU_API_KEY` = `你的智谱AI密钥`
- `DATABASE_URL` = `复制的数据库URL`

### 6. 等待部署完成
- 部署通常需要5-10分钟
- 在 "Logs" 页面查看部署进度
- 完成后记录你的API地址（类似：https://job-navigation-api.onrender.com）

### 7. 更新APP配置
运行以下命令并输入你的API地址：
```bash
update-api-url.bat
```

### 8. 构建最终APK
1. 等待构建完成
2. 在Android Studio中构建签名APK
3. 安装到手机测试

## 🎉 完成！
你的APP现在可以完全独立运行，不依赖电脑！

## 需要帮助？
如果遇到任何问题，请告诉我具体的错误信息。
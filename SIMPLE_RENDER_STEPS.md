# 🚀 超简单Render部署步骤

## 第一步：访问Render
1. 打开 https://render.com
2. 点击 "Get Started for Free"
3. 选择 "GitHub" 登录

## 第二步：创建Web Service
1. 点击 "New +" 按钮
2. 选择 "Web Service"
3. 找到并选择 `XY9555/job-navigation-app`
4. 填写配置：
   - Name: `job-navigation-api`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. 点击 "Create Web Service"

## 第三步：创建数据库
1. 点击 "New +" 按钮
2. 选择 "PostgreSQL"
3. Name: `job-navigation-db`
4. 点击 "Create Database"
5. 等待创建完成，复制 "External Database URL"

## 第四步：添加环境变量
1. 回到你的Web Service (`job-navigation-api`)
2. 点击 "Environment" 选项卡
3. 点击 "Add Environment Variable"
4. 添加三个变量：
   ```
   NODE_ENV = production
   ZHIPU_API_KEY = [你的智谱AI密钥]
   DATABASE_URL = [复制的数据库URL]
   ```
5. 点击 "Save Changes"

## 第五步：等待部署
- 查看 "Logs" 选项卡
- 等待看到 "✅ 数据库连接成功"
- 记录你的API地址

## 完成！
你的API地址格式：`https://job-navigation-api.onrender.com`
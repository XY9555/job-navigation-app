# 🔧 Render环境变量配置详细指南

## 📍 如何找到Environment页面

### 第一步：进入你的Web Service
1. 登录 [render.com](https://render.com)
2. 在Dashboard（控制台）中，你会看到你创建的服务
3. 点击你的服务名称：`job-navigation-api`

### 第二步：找到Environment选项卡
在服务详情页面，你会看到顶部有几个选项卡：
```
Overview | Logs | Environment | Settings | ...
```
点击 **"Environment"** 选项卡

### 第三步：添加环境变量
在Environment页面，你会看到：
- 一个 "Add Environment Variable" 按钮
- 或者一个表格，显示 "Key" 和 "Value" 列

### 第四步：添加三个环境变量

点击 "Add Environment Variable" 或 "+" 按钮，分别添加：

#### 变量1：
- **Key**: `NODE_ENV`
- **Value**: `production`

#### 变量2：
- **Key**: `ZHIPU_API_KEY`
- **Value**: `你的智谱AI密钥`（从你的智谱AI账号获取）

#### 变量3：
- **Key**: `DATABASE_URL`
- **Value**: `从PostgreSQL数据库复制的连接URL`

### 第五步：保存配置
- 添加完所有变量后，点击 "Save Changes" 或 "Deploy"
- Render会自动重新部署你的服务

## 🗄️ 如何获取DATABASE_URL

### 获取数据库连接URL：
1. 在Render控制台，找到你创建的数据库：`job-navigation-db`
2. 点击数据库名称进入详情页
3. 在 "Connections" 部分，复制 "External Database URL"
4. URL格式类似：
   ```
   postgresql://user:password@host:port/database
   ```

## 🔑 如何获取ZHIPU_API_KEY

如果你忘记了智谱AI密钥：
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 登录你的账号
3. 进入 "API Keys" 或 "密钥管理"
4. 复制你的API密钥

## 📱 界面说明

### Render界面布局：
```
┌─────────────────────────────────────┐
│ Render Dashboard                    │
├─────────────────────────────────────┤
│ Services:                           │
│ ┌─────────────────────────────────┐ │
│ │ job-navigation-api              │ │ ← 点击这里
│ │ Web Service                     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 服务详情页面：
```
┌─────────────────────────────────────┐
│ job-navigation-api                  │
├─────────────────────────────────────┤
│ Overview | Logs | Environment | ... │ ← 点击Environment
├─────────────────────────────────────┤
│ Environment Variables               │
│ ┌─────────────────────────────────┐ │
│ │ + Add Environment Variable      │ │ ← 点击这里
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## ⚠️ 常见问题

### Q: 找不到Environment选项卡？
A: 确保你点击的是Web Service，不是数据库

### Q: 添加变量后没有生效？
A: 需要点击"Save Changes"或等待自动重新部署

### Q: DATABASE_URL格式错误？
A: 确保复制的是"External Database URL"，不是Internal URL

## 🎯 完成检查

添加完环境变量后，你应该看到：
```
NODE_ENV = production
ZHIPU_API_KEY = sk-xxxxxxxxxx
DATABASE_URL = postgresql://user:pass@host:port/db
```

## 📞 需要帮助？

如果你在任何步骤遇到困难，请告诉我：
1. 你当前在哪个页面
2. 你看到了什么
3. 遇到了什么问题

我会提供更具体的指导！
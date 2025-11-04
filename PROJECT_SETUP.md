# 求职导航应用 - 完整开发指南

## 🎯 项目概述

这是一个基于 Vue.js + Capacitor + Node.js + MongoDB 的求职导航移动应用，集成了AI大模型功能。

### 核心功能
- 📱 跨平台移动应用 (Android/iOS)
- 🔐 用户认证系统
- 📄 智能简历管理
- 🤖 AI简历评测
- 💼 职位匹配分析
- 🎯 面试问题生成
- 👤 个人信息管理

## 🛠️ 技术架构

### 前端技术栈
- **框架**: Vue.js 3 + Vite
- **移动端**: Capacitor
- **路由**: Vue Router
- **状态管理**: 本地存储 + API
- **UI**: 自定义CSS组件

### 后端技术栈
- **运行环境**: Node.js
- **Web框架**: Express.js
- **数据库**: MongoDB + Mongoose
- **认证**: JWT
- **AI集成**: 支持多种大模型API

### AI服务支持
- OpenAI GPT系列
- 阿里云通义千问
- 智谱AI GLM系列
- Anthropic Claude

## 🚀 快速开始

### 1. 环境准备

#### 必需软件
- Node.js 16+ 
- MongoDB 4.4+
- Android Studio (Android开发)
- Git

#### 可选软件
- VS Code (推荐编辑器)
- MongoDB Compass (数据库管理)
- Postman (API测试)

### 2. 项目安装

```bash
# 克隆项目
git clone <your-repo-url>
cd AResume

# 安装前端依赖
npm install

# 安装后端依赖
cd backend
npm install
cd ..
```

### 3. 环境配置

#### 后端配置
```bash
# 复制环境配置模板
copy backend\env-template.txt backend\.env

# 编辑 backend\.env 文件，填入以下配置：
```

```env
# 基本配置
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/job-navigation
JWT_SECRET=your-super-secret-jwt-key

# AI服务配置 (选择一个)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key

# 或使用通义千问
# AI_PROVIDER=qianwen
# QIANWEN_API_KEY=your-qianwen-api-key

# 或使用智谱AI
# AI_PROVIDER=zhipu
# ZHIPU_API_KEY=your-zhipu-api-key
```

#### Android配置
```bash
# 运行Android环境检查
setup-android-env.bat
```

### 4. 启动开发环境

#### 方式1: 使用启动脚本 (推荐)
```bash
start-development.bat
```

#### 方式2: 手动启动
```bash
# 启动MongoDB
net start MongoDB

# 启动后端 (终端1)
cd backend
npm run dev

# 启动前端 (终端2)
npm run dev
```

### 5. 构建Android应用

```bash
# 运行构建脚本
build-android-app.bat
```

## 📱 开发工作流

### 日常开发
1. 运行 `start-development.bat` 启动开发环境
2. 在浏览器中访问 `http://localhost:8080` 进行前端开发
3. 使用 `http://localhost:3000` 测试后端API
4. 修改代码会自动热重载

### Android调试
1. 运行 `build-android-app.bat` 构建应用
2. 在Android Studio中打开项目
3. 连接设备或启动模拟器
4. 点击运行按钮

### 实时调试
1. 在Capacitor配置中启用开发服务器
2. 修改 `capacitor.config.ts`:
```typescript
server: {
  url: 'http://localhost:8080',
  cleartext: true
}
```
3. 重新同步: `npx cap sync android`

## 🔧 AI服务接入

### OpenAI接入
```javascript
// 获取API密钥: https://platform.openai.com/api-keys
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-api-key
```

### 通义千问接入
```javascript
// 获取API密钥: https://dashscope.aliyun.com/
AI_PROVIDER=qianwen
QIANWEN_API_KEY=your-api-key
```

### 智谱AI接入
```javascript
// 获取API密钥: https://open.bigmodel.cn/
AI_PROVIDER=zhipu
ZHIPU_API_KEY=your-api-key
```

### 自定义AI服务
在 `backend/services/aiService.js` 中添加新的提供商支持。

## 📊 API文档

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新Token

### 用户接口
- `GET /api/users/profile` - 获取用户信息
- `PUT /api/users/profile` - 更新用户信息
- `POST /api/users/avatar` - 上传头像

### 简历接口
- `GET /api/resumes` - 获取简历列表
- `POST /api/resumes` - 创建简历
- `PUT /api/resumes/:id` - 更新简历
- `DELETE /api/resumes/:id` - 删除简历

### AI功能接口
- `POST /api/ai/evaluate-resume/:id` - 简历评测
- `POST /api/ai/job-matching` - 职位匹配
- `POST /api/ai/interview-questions` - 面试问题生成

## 🔍 测试指南

### 功能测试清单
- [ ] 用户注册/登录
- [ ] 个人信息管理
- [ ] 简历创建/编辑
- [ ] AI简历评测
- [ ] 职位匹配分析
- [ ] 面试问题生成
- [ ] Android应用运行

### API测试
```bash
# 健康检查
curl http://localhost:3000/health

# 用户注册
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"phone":"13800138000","password":"123456","name":"测试用户"}'
```

## 🚀 部署指南

### 开发环境
- 前端: `npm run dev` (http://localhost:8080)
- 后端: `npm run dev` (http://localhost:3000)

### 生产环境
```bash
# 构建前端
npm run build

# 启动后端
cd backend
NODE_ENV=production npm start
```

### Android发布
1. 构建release版本
2. 签名APK
3. 上传到应用商店

## 🛠️ 故障排除

### 常见问题

#### 1. MongoDB连接失败
```bash
# 检查MongoDB服务
sc query MongoDB

# 启动MongoDB
net start MongoDB
```

#### 2. Android SDK未找到
```bash
# 运行环境检查脚本
setup-android-env.bat

# 手动设置环境变量
set ANDROID_HOME=C:\Users\[用户名]\AppData\Local\Android\Sdk
```

#### 3. AI API调用失败
- 检查API密钥是否正确
- 确认网络连接
- 查看后端日志

#### 4. 前端API调用失败
- 确认后端服务运行
- 检查CORS配置
- 验证API地址

### 调试技巧
1. 查看浏览器开发者工具
2. 检查后端控制台日志
3. 使用Android Studio Logcat
4. 启用详细错误日志

## 📈 性能优化

### 前端优化
- 代码分割和懒加载
- 图片压缩和优化
- 缓存策略
- 减少API调用

### 后端优化
- 数据库索引优化
- API响应缓存
- 请求限流
- 错误处理优化

### 移动端优化
- 减少包体积
- 优化启动速度
- 内存使用优化
- 网络请求优化

## 📝 开发规范

### 代码规范
- 使用ESLint进行代码检查
- 统一的命名规范
- 注释和文档
- Git提交规范

### 项目结构
```
AResume/
├── src/              # 前端源码
├── backend/          # 后端源码
├── android/          # Android项目
├── dist/             # 构建输出
└── docs/             # 项目文档
```

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

## 📄 许可证

MIT License

---

## 🆘 获取帮助

- 查看项目文档
- 提交Issue
- 联系开发团队

**祝您开发愉快！** 🎉











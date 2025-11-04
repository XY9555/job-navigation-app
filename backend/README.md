# 求职导航后端 API

基于 Node.js + Express + MongoDB 的求职导航应用后端服务。

## 功能特性

- 🔐 用户认证系统（注册、登录、JWT）
- 👤 用户信息管理（个人资料、头像上传）
- 📄 简历管理（CRUD操作、状态管理）
- 🤖 AI功能集成（简历评测、职位匹配、面试问题生成）
- 📁 文件上传（头像、简历文件）
- 🔒 安全防护（Helmet、限流、输入验证）

## 技术栈

- **运行环境**: Node.js 16+
- **Web框架**: Express.js
- **数据库**: MongoDB
- **认证**: JWT (JSON Web Tokens)
- **文件上传**: Multer
- **数据验证**: Express Validator
- **密码加密**: bcryptjs
- **安全防护**: Helmet, CORS, Rate Limiting

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 环境配置

复制配置文件并修改：

```bash
cp config.js config.local.js
```

修改 `config.local.js` 中的配置：

```javascript
module.exports = {
  port: 3000,
  mongodb: {
    uri: 'mongodb://localhost:27017/job-navigation'
  },
  jwt: {
    secret: 'your-super-secret-jwt-key',
    expiresIn: '7d'
  }
};
```

### 3. 启动 MongoDB

确保 MongoDB 服务正在运行：

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 4. 启动服务

开发模式（自动重启）：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

服务将在 `http://localhost:3000` 启动。

## API 文档

### 认证相关

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| POST | `/api/auth/refresh` | 刷新Token | ❌ |
| POST | `/api/auth/forgot-password` | 忘记密码 | ❌ |
| POST | `/api/auth/reset-password` | 重置密码 | ❌ |

### 用户管理

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/users/profile` | 获取用户信息 | ✅ |
| PUT | `/api/users/profile` | 更新用户信息 | ✅ |
| POST | `/api/users/avatar` | 上传头像 | ✅ |
| PUT | `/api/users/avatar` | 更新头像(base64) | ✅ |
| DELETE | `/api/users/avatar` | 删除头像 | ✅ |
| PUT | `/api/users/password` | 修改密码 | ✅ |
| PUT | `/api/users/settings` | 更新设置 | ✅ |
| DELETE | `/api/users/account` | 注销账户 | ✅ |

### 简历管理

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| GET | `/api/resumes` | 获取简历列表 | ✅ |
| GET | `/api/resumes/:id` | 获取简历详情 | ✅ |
| POST | `/api/resumes` | 创建简历 | ✅ |
| PUT | `/api/resumes/:id` | 更新简历 | ✅ |
| DELETE | `/api/resumes/:id` | 删除简历 | ✅ |
| POST | `/api/resumes/:id/copy` | 复制简历 | ✅ |
| PATCH | `/api/resumes/:id/status` | 更新状态 | ✅ |
| PATCH | `/api/resumes/:id/privacy` | 更新隐私设置 | ✅ |
| GET | `/api/resumes/:id/stats` | 获取统计信息 | ✅ |

### AI 功能

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/api/ai/evaluate-resume/:id` | 简历评测 | ✅ |
| POST | `/api/ai/job-matching` | 职位匹配分析 | ✅ |
| POST | `/api/ai/interview-questions` | 生成面试问题 | ✅ |
| POST | `/api/ai/optimize-resume/:id` | 简历优化建议 | ✅ |

## 数据模型

### 用户模型 (User)

```javascript
{
  phone: String,        // 手机号
  password: String,     // 密码（加密）
  name: String,         // 姓名
  email: String,        // 邮箱
  avatar: String,       // 头像URL
  bio: String,          // 个人简介
  gender: String,       // 性别
  birthDate: Date,      // 生日
  isActive: Boolean,    // 账户状态
  settings: Object,     // 用户设置
  createdAt: Date,      // 创建时间
  updatedAt: Date       // 更新时间
}
```

### 简历模型 (Resume)

```javascript
{
  userId: ObjectId,           // 用户ID
  title: String,              // 简历标题
  personalInfo: Object,       // 个人信息
  jobIntention: Object,       // 求职意向
  education: [Object],        // 教育经历
  workExperience: [Object],   // 工作经历
  projects: [Object],         // 项目经历
  skills: [Object],           // 技能
  certificates: [Object],     // 证书
  languages: [Object],        // 语言能力
  selfEvaluation: String,     // 自我评价
  status: String,             // 状态
  isPublic: Boolean,          // 是否公开
  evaluation: Object,         // 评测结果
  stats: Object,              // 统计信息
  createdAt: Date,            // 创建时间
  updatedAt: Date             // 更新时间
}
```

## 错误处理

API 返回统一的错误格式：

```javascript
{
  "success": false,
  "message": "错误描述",
  "errors": [...]  // 详细错误信息（可选）
}
```

常见状态码：
- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未认证
- `403` - 无权限
- `404` - 资源不存在
- `500` - 服务器错误

## 安全特性

- JWT Token 认证
- 密码 bcrypt 加密
- 请求限流防护
- CORS 跨域配置
- Helmet 安全头设置
- 输入数据验证
- 文件上传安全检查

## 开发说明

### 目录结构

```
backend/
├── models/          # 数据模型
├── routes/          # 路由处理
├── middleware/      # 中间件
├── uploads/         # 上传文件
├── config.js        # 配置文件
├── server.js        # 服务入口
└── package.json     # 项目配置
```

### 添加新功能

1. 在 `models/` 中定义数据模型
2. 在 `routes/` 中添加路由处理
3. 在 `middleware/` 中添加中间件（如需要）
4. 在 `server.js` 中注册路由

## 部署

### 环境变量

生产环境需要设置以下环境变量：

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/job-navigation
JWT_SECRET=your-production-secret
```

### Docker 部署

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 许可证

MIT License










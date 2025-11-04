# AI API 配置指南

## 概述
本项目支持多种AI服务提供商，您可以选择其中一种进行配置。推荐使用智谱AI（国内访问稳定）或OpenAI。

## 配置步骤

### 1. 创建环境变量文件
在 `backend` 目录下创建 `.env` 文件（如果不存在的话）：

```bash
cd backend
copy env-template.txt .env
```

### 2. 选择AI服务提供商并获取API Key

#### 选项1：智谱AI（推荐 - 国内访问稳定）
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并完成实名认证
3. 在控制台创建API Key
4. 新用户通常有免费额度

在 `.env` 文件中配置：
```
AI_PROVIDER=zhipu
ZHIPU_API_KEY=your-zhipu-api-key-here
```

#### 选项2：OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册账号并绑定支付方式
3. 在API Keys页面创建新的API Key

在 `.env` 文件中配置：
```
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key-here
```

#### 选项3：阿里云通义千问
1. 访问 [阿里云通义千问](https://dashscope.aliyun.com/)
2. 开通服务并获取API Key

在 `.env` 文件中配置：
```
AI_PROVIDER=qianwen
QIANWEN_API_KEY=your-qianwen-api-key-here
```

#### 选项4：Claude (Anthropic)
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册并获取API Key

在 `.env` 文件中配置：
```
AI_PROVIDER=claude
CLAUDE_API_KEY=your-claude-api-key-here
```

### 3. 完整的 .env 配置示例

```env
# 服务器配置
PORT=3000
NODE_ENV=development

# 数据库配置
MONGODB_URI=mongodb://localhost:27017/job-navigation

# JWT配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# 文件上传配置
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# AI服务配置 - 选择一个提供商
AI_PROVIDER=zhipu

# 智谱AI配置 (推荐)
ZHIPU_API_KEY=your-actual-api-key-here

# OpenAI配置
# OPENAI_API_KEY=sk-your-openai-api-key

# 阿里云通义千问配置
# QIANWEN_API_KEY=your-qianwen-api-key

# Claude配置
# CLAUDE_API_KEY=your-claude-api-key

# 前端地址（CORS配置）
FRONTEND_URL=http://localhost:8081
```

### 4. 重启服务
配置完成后，重启后端服务：

```bash
cd backend
npm start
```

## 测试AI配置

运行测试脚本验证AI配置是否正确：

```bash
cd backend
node test-ai-evaluation.js
```

如果配置正确，您应该看到AI返回的真实评测结果，而不是默认的75分。

## 常见问题

### Q: 为什么评测结果还是0分或75分？
A: 可能的原因：
1. API Key未正确配置
2. API Key已过期或无效
3. 网络连接问题
4. API额度已用完

### Q: 哪个AI服务最适合？
A: 推荐顺序：
1. **智谱AI** - 国内访问稳定，有免费额度
2. **OpenAI** - 效果最好，但需要国外网络
3. **通义千问** - 阿里云服务，稳定性好
4. **Claude** - Anthropic服务，效果也很好

### Q: 如何获得免费额度？
A: 
- 智谱AI：新用户注册通常有免费额度
- OpenAI：新用户有一定免费额度，但需要绑定支付方式
- 通义千问：阿里云新用户有免费额度

## 安全提醒

⚠️ **重要**：
1. 不要将API Key提交到代码仓库
2. 定期轮换API Key
3. 监控API使用量，避免超额费用
4. 在生产环境中使用更强的JWT密钥

## 获取帮助

如果遇到配置问题，请：
1. 检查API Key是否正确复制
2. 确认选择的AI_PROVIDER与配置的API Key匹配
3. 查看后端控制台的错误日志
4. 运行测试脚本进行诊断






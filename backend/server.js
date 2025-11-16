// 求职导航应用服务器
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// 数据库配置 - 统一使用本地配置（SQLite）
const { testConnection, syncDatabase, sequelize } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全中间件
app.use(helmet());

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP 15分钟内最多100个请求
});
app.use(limiter);

// CORS配置 - 支持移动端APP
app.use(cors({
  origin: function (origin, callback) {
    // 允许没有 origin 的请求（移动端APP）
    if (!origin) return callback(null, true);
    
    // 允许的源列表
    const allowedOrigins = [
      'http://localhost:8080',         // 前端开发服务器
      'http://localhost:3000',         // 本地测试
      'http://127.0.0.1:8080',        // 本地回环地址
      'http://127.0.0.1:3000',        // 本地回环地址
      'https://localhost',            // HTTPS本地
      'http://localhost'              // HTTP本地
    ];
    
    // 检查是否在允许列表中
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    return callback(null, true); // 在生产环境中临时允许所有源
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 处理预检请求 - 完全开放CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '服务器运行正常',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'SQLite',
    version: '1.0.0'
  });
});



// 初始化数据库
async function initializeDatabase() {
  console.log('🔗 初始化SQLite数据库...');
  
  // 确保数据目录存在
  const fs = require('fs');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('📁 创建数据目录');
  }
  
  // 测试连接
  const connected = await testConnection();
  if (connected) {
    // 同步数据库表
    await syncDatabase();
    console.log('✅ SQLite数据库初始化完成');
  } else {
    console.log('❌ SQLite数据库初始化失败');
  }
}

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/resumes', require('./routes/resumes'));
app.use('/api/ai', require('./routes/ai'));

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({ 
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 启动服务器
async function startServer() {
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 服务器运行在端口 ${PORT}`);
    console.log(`📱 前端地址: http://localhost:8080`);
    console.log(`🔗 API地址: http://localhost:${PORT}`);
    console.log('💾 数据库: SQLite');
    console.log('🤖 AI服务: 智谱AI');
  });
}

startServer().catch(console.error);

module.exports = app;
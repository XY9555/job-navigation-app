// 求职导航应用服务器
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// 数据库配置 - 统一使用本地配置（SQLite）
const { testConnection, syncDatabase } = require('./config/database');

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
      'http://localhost:8080', 
      'http://localhost:3000',
      'http://10.0.2.2:3000',  // Android模拟器
      'http://192.168.112.212:3000',  // 你的电脑IP
      'http://192.168.112.212:8080',  // 前端开发服务器
      'capacitor://localhost',  // Capacitor应用
      'ionic://localhost',      // Ionic应用
      'file://',               // 本地文件协议
      'https://localhost',     // HTTPS本地
      'http://localhost'       // HTTP本地
    ];
    
    // 检查是否在允许列表中
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // 检查局域网IP模式
    if (/^http:\/\/192\.168\.\d+\.\d+:(3000|8080)$/.test(origin)) {
      return callback(null, true);
    }
    
    // 检查是否是Capacitor应用（通常没有origin或特殊格式）
    if (origin.startsWith('capacitor://') || origin.startsWith('ionic://')) {
      return callback(null, true);
    }
    
    // 允许所有移动端请求（临时调试）
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 解析JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

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

// 创建测试用户端点（仅用于调试）
app.post('/api/create-test-user', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    
    // 检查用户是否已存在
    const existingUser = await User.findOne({ 
      where: { phone: '13800138000' } 
    });

    if (existingUser) {
      // 更新密码
      const hashedPassword = await bcrypt.hash('123456', 10);
      await existingUser.update({ 
        password: hashedPassword,
        username: '测试用户'
      });
      
      return res.json({
        success: true,
        message: '测试用户已更新',
        user: {
          id: existingUser.id,
          username: '测试用户',
          phone: '13800138000',
          email: existingUser.email
        },
        loginInfo: {
          phone: '13800138000',
          password: '123456'
        }
      });
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash('123456', 10);
    
    const testUser = await User.create({
      username: '测试用户',
      phone: '13800138000',
      password: hashedPassword,
      email: 'test@example.com',
      avatar: null,
      settings: JSON.stringify({
        notifications: true,
        theme: 'light',
        language: 'zh-CN'
      })
    });

    res.json({
      success: true,
      message: '测试用户创建成功',
      user: {
        id: testUser.id,
        username: testUser.username,
        phone: testUser.phone,
        email: testUser.email
      },
      loginInfo: {
        phone: '13800138000',
        password: '123456'
      }
    });
    
  } catch (error) {
    console.error('创建测试用户失败:', error);
    res.status(500).json({
      success: false,
      message: '创建测试用户失败',
      error: error.message
    });
  }
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

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    database: 'SQLite',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

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
// 创建测试用户脚本
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/database');
const User = require('./models/User');

async function createTestUser() {
  try {
    console.log('🔗 连接数据库...');
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 同步数据库表
    await sequelize.sync();
    console.log('✅ 数据库表同步完成');

    // 检查用户是否已存在
    const existingUser = await User.findOne({ 
      where: { phone: '13800138000' } 
    });

    if (existingUser) {
      console.log('⚠️ 测试用户已存在，更新密码...');
      
      // 更新密码
      const hashedPassword = await bcrypt.hash('123456', 10);
      await existingUser.update({ password: hashedPassword });
      
      console.log('✅ 测试用户密码已更新');
      console.log('📱 登录信息:');
      console.log('   手机号: 13800138000');
      console.log('   密码: 123456');
      console.log('   用户名:', existingUser.username);
      
      return;
    }

    // 创建新的测试用户
    console.log('👤 创建测试用户...');
    
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

    console.log('🎉 测试用户创建成功！');
    console.log('📱 登录信息:');
    console.log('   手机号: 13800138000');
    console.log('   密码: 123456');
    console.log('   用户ID:', testUser.id);
    console.log('   用户名:', testUser.username);
    
  } catch (error) {
    console.error('❌ 创建测试用户失败:', error);
  } finally {
    await sequelize.close();
    console.log('🔚 数据库连接已关闭');
  }
}

// 运行脚本
createTestUser();


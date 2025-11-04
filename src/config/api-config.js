// API配置文件
// 根据不同环境配置不同的API地址

// 开发环境配置
const DEV_CONFIG = {
  // 请将此IP地址替换为你的电脑实际IP地址
  // 
  // 🔍 如何查看IP地址：
  // Windows: 
  //   1. 按 Win+R，输入 cmd，按回车
  //   2. 输入 ipconfig 并按回车
  //   3. 查找 "IPv4 地址" 这一行
  //   4. 例如：IPv4 地址 . . . . . . . . . . . . : 192.168.1.100
  //
  // Mac/Linux: 
  //   1. 打开终端
  //   2. 输入 ifconfig 并按回车
  //   3. 查找 inet 地址（不是127.0.0.1）
  //
  // 📱 常见IP地址格式：
  //   - 192.168.1.xxx (家庭路由器)
  //   - 192.168.0.xxx (家庭路由器)
  //   - 10.0.0.xxx (企业网络)
  //   - 172.16.xxx.xxx (企业网络)
  
  LOCAL_IP: '192.168.112.212', // ✅ 已更新为你的实际IP地址
  PORT: 3000
};

// 检测运行环境
const isCapacitor = typeof window !== 'undefined' && window.Capacitor !== undefined;
const isAndroid = isCapacitor && window.Capacitor.getPlatform() === 'android';
const isIOS = isCapacitor && window.Capacitor.getPlatform() === 'ios';
const isWeb = !isCapacitor;

// 获取API基础URL
export const getApiBaseUrl = () => {
  // 在Capacitor环境中，优先使用云端API
  if (isCapacitor) {
    // 移动端APP始终使用云端API
    return 'https://job-navigation-api.onrender.com/api';
  }
  
  // 只有在Web开发环境中才使用本地API
  if (process.env.NODE_ENV === 'production') {
    return 'https://job-navigation-api.onrender.com/api';
  }
  
  // Web浏览器开发环境
  return `http://localhost:${DEV_CONFIG.PORT}/api`;
};

// 导出配置
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000, // 30秒超时，给云端API更多时间
  RETRY_ATTEMPTS: 3
};

// 调试信息
console.log('🔧 API配置信息:');
console.log('- 运行环境:', process.env.NODE_ENV);
console.log('- 平台:', isCapacitor ? window.Capacitor.getPlatform() : 'web');
console.log('- API地址:', API_CONFIG.BASE_URL);
console.log('- 本地IP:', DEV_CONFIG.LOCAL_IP);
console.log('- 端口:', DEV_CONFIG.PORT);

// 网络连接测试函数
export const testNetworkConnection = async () => {
  const testUrl = `${API_CONFIG.BASE_URL}/health`;
  console.log('🔍 测试网络连接:', testUrl);
  
  try {
    const response = await fetch(testUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    const data = await response.json();
    console.log('✅ 网络连接测试成功:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ 网络连接测试失败:', error);
    return { success: false, error: error.message };
  }
};

// 保存API配置到localStorage，方便调试
if (typeof window !== 'undefined') {
  localStorage.setItem('apiBaseUrl', API_CONFIG.BASE_URL);
  localStorage.setItem('apiConfig', JSON.stringify({
    baseUrl: API_CONFIG.BASE_URL,
    platform: isCapacitor ? window.Capacitor.getPlatform() : 'web',
    environment: process.env.NODE_ENV,
    localIP: DEV_CONFIG.LOCAL_IP,
    port: DEV_CONFIG.PORT
  }));
  
  // 自动测试网络连接（仅在 Capacitor 环境中）
  if (isCapacitor) {
    setTimeout(() => {
      testNetworkConnection().then(result => {
        if (result.success) {
          console.log('🎉 移动端网络连接正常');
        } else {
          console.error('⚠️ 移动端网络连接异常:', result.error);
        }
      });
    }, 2000);
  }
}
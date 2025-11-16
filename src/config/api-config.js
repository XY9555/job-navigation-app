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

// Web浏览器环境
const isWeb = true;

// 获取API基础URL
export const getApiBaseUrl = () => {
  // 浏览器环境始终使用本地API
  return `http://localhost:${DEV_CONFIG.PORT}/api`;
};

// 备用API地址列表
export const BACKUP_API_URLS = [
  'https://job-navigation-api.onrender.com/api',
  // 可以添加更多备用地址
];

// 测试API连接
export const testApiConnection = async (apiUrl) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('API连接测试失败:', error);
    return false;
  }
};

// 导出配置
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 60000, // 60秒超时
  RETRY_ATTEMPTS: 1
};

// 调试信息
console.log('🔧 API配置信息:');
console.log('- 运行环境:', process.env.NODE_ENV);
console.log('- 平台:', 'web');
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
    platform: 'web',
    environment: process.env.NODE_ENV,
    localIP: DEV_CONFIG.LOCAL_IP,
    port: DEV_CONFIG.PORT
  }));
  
  // 移除自动网络测试，避免阻塞应用启动
  console.log('📱 API配置已加载，跳过自动网络测试');
}
// 网络连接检查工具
import { API_CONFIG } from '@/config/api-config.js';

class NetworkChecker {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.log('🌐 网络已连接');
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.log('📵 网络已断开');
      });
    }
  }

  // 检查基本网络连接
  async checkBasicConnectivity() {
    if (!navigator.onLine) {
      return { success: false, error: '设备未连接到网络' };
    }

    try {
      // 尝试连接到一个可靠的服务
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        timeout: 5000
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: '无法连接到互联网' };
    }
  }

  // 检查 API 服务器连接
  async checkAPIConnectivity() {
    const apiUrl = `${API_CONFIG.BASE_URL}/health`;
    
    try {
      console.log('🔍 检查API连接:', apiUrl);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache: 'no-cache',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ API连接成功:', data);
        return { 
          success: true, 
          data,
          status: response.status,
          statusText: response.statusText
        };
      } else {
        console.error('❌ API响应错误:', response.status, response.statusText);
        return { 
          success: false, 
          error: `API服务器响应错误: ${response.status} ${response.statusText}`,
          status: response.status
        };
      }
    } catch (error) {
      console.error('❌ API连接失败:', error);
      
      let errorMessage = 'API连接失败';
      if (error.name === 'AbortError') {
        errorMessage = 'API连接超时';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = '无法连接到API服务器，请检查网络设置';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'API跨域请求被阻止';
      }
      
      return { 
        success: false, 
        error: errorMessage,
        originalError: error.message
      };
    }
  }

  // 全面网络诊断
  async diagnoseNetwork() {
    console.log('🔍 开始网络诊断...');
    
    const results = {
      timestamp: new Date().toISOString(),
      deviceOnline: navigator.onLine,
      platform: window.Capacitor?.getPlatform?.() || 'web',
      userAgent: navigator.userAgent,
      apiUrl: API_CONFIG.BASE_URL
    };

    // 检查基本连接
    console.log('1️⃣ 检查基本网络连接...');
    results.basicConnectivity = await this.checkBasicConnectivity();

    // 检查API连接
    console.log('2️⃣ 检查API服务器连接...');
    results.apiConnectivity = await this.checkAPIConnectivity();

    // 输出诊断结果
    console.log('📊 网络诊断结果:', results);
    
    return results;
  }

  // 显示用户友好的错误信息
  getErrorMessage(diagnostics) {
    if (!diagnostics.deviceOnline) {
      return '设备未连接到网络，请检查WiFi或移动数据连接';
    }

    if (!diagnostics.basicConnectivity.success) {
      return '无法连接到互联网，请检查网络设置';
    }

    if (!diagnostics.apiConnectivity.success) {
      const error = diagnostics.apiConnectivity.error;
      if (error.includes('超时')) {
        return '服务器响应超时，请稍后重试';
      } else if (error.includes('跨域')) {
        return '网络配置问题，请联系技术支持';
      } else {
        return `服务器连接失败：${error}`;
      }
    }

    return '网络连接正常';
  }
}

// 创建全局实例
const networkChecker = new NetworkChecker();

export default networkChecker;
export { NetworkChecker };


// 离线模式处理器
export class OfflineHandler {
  static isOnline() {
    return navigator.onLine;
  }
  
  static setupOfflineHandling() {
    // 监听网络状态变化
    window.addEventListener('online', () => {
      console.log('🌐 网络已连接');
      this.showNetworkStatus('网络已连接', 'success');
    });
    
    window.addEventListener('offline', () => {
      console.log('📵 网络已断开');
      this.showNetworkStatus('网络已断开，部分功能可能不可用', 'warning');
    });
  }
  
  static showNetworkStatus(message, type = 'info') {
    // 在Capacitor环境中显示网络状态
    if (window.Capacitor) {
      // 可以使用Toast插件或简单的alert
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }
  
  static async testConnection(apiUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.error('连接测试失败:', error);
      return false;
    }
  }
  
  static getOfflineData(key) {
    try {
      const data = localStorage.getItem(`offline_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('读取离线数据失败:', error);
      return null;
    }
  }
  
  static setOfflineData(key, data) {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('保存离线数据失败:', error);
    }
  }
}
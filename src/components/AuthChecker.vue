<template>
  <div v-if="showDebug" class="auth-debug-panel">
    <div class="debug-header">
      <h4>🔍 认证调试面板</h4>
      <button @click="toggleDebug" class="close-btn">×</button>
    </div>
    <div class="debug-content">
      <div class="debug-item">
        <strong>登录状态:</strong> {{ authStatus.isLoggedIn ? '✅ 已登录' : '❌ 未登录' }}
      </div>
      <div class="debug-item">
        <strong>Token:</strong> {{ authStatus.hasToken ? '✅ 存在' : '❌ 不存在' }}
      </div>
      <div class="debug-item">
        <strong>用户信息:</strong> {{ authStatus.hasUserInfo ? '✅ 存在' : '❌ 不存在' }}
      </div>
      <div class="debug-item">
        <strong>API地址:</strong> {{ authStatus.apiUrl }}
      </div>
      <div class="debug-item">
        <strong>网络状态:</strong> {{ authStatus.isOnline ? '✅ 在线' : '❌ 离线' }}
      </div>
      <div class="debug-item">
        <strong>平台:</strong> {{ authStatus.platform }}
      </div>
      <div class="debug-actions">
        <button @click="testConnection" class="test-btn">测试连接</button>
        <button @click="clearAuth" class="clear-btn">清除认证</button>
        <button @click="mockLogin" class="mock-btn">模拟登录</button>
      </div>
      <div v-if="testResult" class="test-result">
        <strong>测试结果:</strong> {{ testResult }}
      </div>
    </div>
  </div>
  
  <!-- 调试按钮 -->
  <button v-if="!showDebug && isDevelopment" @click="toggleDebug" class="debug-toggle">
    🔍
  </button>
</template>

<script>
import { AndroidDebugger } from '@/utils/android-debug.js';

export default {
  name: 'AuthChecker',
  data() {
    return {
      showDebug: false,
      testResult: '',
      authStatus: {
        isLoggedIn: false,
        hasToken: false,
        hasUserInfo: false,
        apiUrl: '',
        isOnline: true,
        platform: 'web'
      }
    }
  },
  
  computed: {
    isDevelopment() {
      return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
    }
  },
  
  mounted() {
    this.updateAuthStatus();
    
    // 监听存储变化
    window.addEventListener('storage', this.updateAuthStatus);
    
    // 监听网络状态变化
    window.addEventListener('online', this.updateAuthStatus);
    window.addEventListener('offline', this.updateAuthStatus);
  },
  
  beforeUnmount() {
    window.removeEventListener('storage', this.updateAuthStatus);
    window.removeEventListener('online', this.updateAuthStatus);
    window.removeEventListener('offline', this.updateAuthStatus);
  },
  
  methods: {
    updateAuthStatus() {
      const token = localStorage.getItem('userToken');
      const userInfo = localStorage.getItem('userInfo');
      const apiConfig = JSON.parse(localStorage.getItem('apiConfig') || '{}');
      
      this.authStatus = {
        isLoggedIn: !!(token && userInfo),
        hasToken: !!token,
        hasUserInfo: !!userInfo,
        apiUrl: apiConfig.baseUrl || 'unknown',
        isOnline: navigator.onLine,
        platform: 'web'
      };
      
      AndroidDebugger.log('认证状态更新', this.authStatus);
    },
    
    toggleDebug() {
      this.showDebug = !this.showDebug;
      if (this.showDebug) {
        this.updateAuthStatus();
      }
    },
    
    async testConnection() {
      this.testResult = '测试中...';
      
      try {
        const apiConfig = JSON.parse(localStorage.getItem('apiConfig') || '{}');
        const testUrl = `${apiConfig.baseUrl}/health`;
        
        AndroidDebugger.log('开始连接测试', { url: testUrl });
        
        const response = await fetch(testUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });
        
        if (response.ok) {
          this.testResult = '✅ 连接成功';
          AndroidDebugger.log('连接测试成功');
        } else {
          this.testResult = `❌ 连接失败: ${response.status}`;
          AndroidDebugger.log('连接测试失败', { status: response.status });
        }
      } catch (error) {
        this.testResult = `❌ 连接错误: ${error.message}`;
        AndroidDebugger.log('连接测试错误', error);
      }
    },
    
    clearAuth() {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      this.updateAuthStatus();
      this.testResult = '认证信息已清除';
      AndroidDebugger.log('认证信息已清除');
    },
    
    mockLogin() {
      const mockToken = 'mock-token-' + Date.now();
      const mockUser = {
        id: 1,
        phone: '13800138000',
        name: '测试用户'
      };
      
      localStorage.setItem('userToken', mockToken);
      localStorage.setItem('userInfo', JSON.stringify(mockUser));
      this.updateAuthStatus();
      this.testResult = '✅ 模拟登录成功';
      AndroidDebugger.log('模拟登录成功', mockUser);
    }
  }
}
</script>

<style scoped>
.auth-debug-panel {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 300px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  font-size: 12px;
}

.debug-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
  border-radius: 8px 8px 0 0;
}

.debug-header h4 {
  margin: 0;
  font-size: 14px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
}

.debug-content {
  padding: 12px;
}

.debug-item {
  margin-bottom: 8px;
  line-height: 1.4;
}

.debug-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.debug-actions button {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 11px;
}

.test-btn { border-color: #007bff; color: #007bff; }
.clear-btn { border-color: #dc3545; color: #dc3545; }
.mock-btn { border-color: #28a745; color: #28a745; }

.test-result {
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 11px;
}

.debug-toggle {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  border: none;
  font-size: 16px;
  cursor: pointer;
  z-index: 9998;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
</style>
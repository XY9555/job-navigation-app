<template>
  <div class="login-container">
    <!-- 背景图片 -->
    <!-- <img src="/images/bg-login.jpg" alt="背景" class="bg-image" /> -->
    
    <!-- 内容区域 -->
    <div class="content">
      <!-- 返回按钮 -->
      <div class="header">
        <button class="back-btn" @click="goBack">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <h1 class="page-title">登录</h1>
      </div>
      
      <!-- 登录表单 -->
      <div class="login-form">
        <div class="form-group">
          <input
            v-model="loginForm.phone"
            type="tel"
            placeholder="请输入手机号"
            class="input-field"
            maxlength="11"
          />
        </div>
        
        <div class="form-group">
          <input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            class="input-field"
          />
          <button class="password-toggle" @click="togglePassword">
            <svg v-if="showPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1 1l22 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <button class="login-btn" @click="handleLogin" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '登录中...' : '登录' }}
        </button>
        
        <div class="form-links">
          <router-link to="/register" class="link">注册账号</router-link>
          <router-link to="/forgot-password" class="link">忘记密码</router-link>
        </div>
        
        <!-- 网络诊断按钮 -->
        <button class="diagnostic-btn" @click="runNetworkDiagnostic" type="button">
          🔍 网络诊断
        </button>
        
        <!-- 离线模式按钮 -->
        <button class="offline-btn" @click="enableOfflineMode" type="button">
          🔄 启用离线模式
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      showPassword: false,
      loading: false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    async handleLogin() {
      this.loading = true
      
      try {
        // 调用真实API进行登录
        // 使用移动端专用API
        const { MobileAPI } = await import('@/utils/mobile-request.js');
        const result = await MobileAPI.login(this.loginForm.phone, this.loginForm.password);
        
        if (result.ok && result.data.success) {
          // 保存登录状态
          localStorage.setItem('userToken', result.data.data.token)
          localStorage.setItem('userInfo', JSON.stringify(result.data.data.user))
          
          alert('登录成功！')
          // 跳转到首页
          this.$router.replace('/home')
        } else {
          alert(result.data.message || '登录失败，请检查用户名和密码')
        }
      } catch (error) {
        console.error('登录错误:', error)
        
        // 显示详细错误信息
        let errorMessage = '登录失败：' + error.message;
        
        // 如果是网络错误，提供更多信息
        if (error.message.includes('fetch') || error.message.includes('network') || error.message.includes('Failed to fetch')) {
          errorMessage += '\n\n可能的原因：\n1. 网络连接问题\n2. 服务器暂时不可用\n3. 防火墙阻止连接\n\n请点击"网络诊断"按钮检查连接状态';
        }
        
        alert(errorMessage);
      } finally {
        this.loading = false
      }
    },
    
    async runNetworkDiagnostic() {
      try {
        alert('开始网络诊断，请稍候...');
        
        // 使用移动端专用API测试连接
        const { MobileAPI } = await import('@/utils/mobile-request.js');
        const result = await MobileAPI.healthCheck();
        
        if (result.ok) {
          alert('✅ 网络连接正常！\n服务器响应：' + JSON.stringify(result.data, null, 2));
        } else {
          alert('❌ 网络连接异常\n状态码：' + result.status + '\n响应：' + JSON.stringify(result.data, null, 2));
        }
      } catch (error) {
        alert('❌ 网络诊断失败：' + error.message + '\n\n请检查：\n1. 手机网络连接\n2. WiFi设置\n3. 防火墙设置');
      }
    },
    
    async enableOfflineMode() {
      try {
        const { OfflineMode } = await import('@/utils/offline-mode.js');
        
        if (confirm('启用离线模式？\n\n离线模式下：\n✅ 可以正常使用基本功能\n❌ AI功能将不可用\n\n确定启用吗？')) {
          OfflineMode.enable();
          OfflineMode.showOfflineNotice();
          
          // 尝试离线登录
          if (this.loginForm.phone && this.loginForm.password) {
            try {
              const result = OfflineMode.mockLogin(this.loginForm.phone, this.loginForm.password);
              
              // 保存登录状态
              localStorage.setItem('userToken', result.data.token);
              localStorage.setItem('userInfo', JSON.stringify(result.data.user));
              
              alert('离线模式登录成功！');
              this.$router.replace('/home');
            } catch (error) {
              alert('离线登录失败：' + error.message);
            }
          } else {
            alert('离线模式已启用，请输入手机号和密码进行离线登录');
          }
        }
      } catch (error) {
        alert('启用离线模式失败：' + error.message);
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
}

.content {
  position: relative;
  z-index: 2;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 60px;
  padding-top: 40px;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  padding: 8px;
  margin-right: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 320px;
  margin: 0 auto;
  width: 100%;
}

.form-group {
  position: relative;
  margin-bottom: 24px;
}

.input-field {
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.password-toggle {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
}

.login-btn {
  width: 100%;
  padding: 16px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.link:hover {
  color: #333;
  text-decoration: underline;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.diagnostic-btn {
  width: 100%;
  padding: 12px;
  background: #17a2b8;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.3s ease;
}

.diagnostic-btn:hover {
  background: #138496;
}

.offline-btn {
  width: 100%;
  padding: 12px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.3s ease;
}

.offline-btn:hover {
  background: #5a6268;
}
</style>


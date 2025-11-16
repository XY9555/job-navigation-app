<template>
  <div class="forgot-password-container">
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
        <h1 class="page-title">忘记密码</h1>
      </div>
      
      <!-- 重置密码表单 -->
      <div class="reset-form">
        <div class="form-group">
          <input
            v-model="resetForm.phone"
            type="tel"
            placeholder="请输入手机号"
            class="input-field"
            maxlength="11"
          />
        </div>
        
        <div class="form-group">
          <input
            v-model="resetForm.code"
            type="text"
            placeholder="请输入验证码"
            class="input-field code-input"
            maxlength="6"
          />
          <button class="code-btn" @click="sendCode" :disabled="codeCountdown > 0">
            {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
          </button>
        </div>
        
        <div class="form-group">
          <input
            v-model="resetForm.newPassword"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入新密码"
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
        
        <button class="reset-btn" @click="handleReset" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '重置中...' : '重置密码' }}
        </button>
        
        <div class="form-links">
          <router-link to="/login" class="link">返回登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  data() {
    return {
      resetForm: {
        phone: '',
        code: '',
        newPassword: ''
      },
      showPassword: false,
      loading: false,
      codeCountdown: 0
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    togglePassword() {
      this.showPassword = !this.showPassword
    },
    
    async sendCode() {
      if (!this.resetForm.phone) {
        alert('请输入手机号')
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.resetForm.phone)) {
        alert('请输入正确的手机号')
        return
      }
      
      try {
        // 调用后端API发送验证码
        const { authAPI } = await import('@/services/api.js');
        const result = await authAPI.sendCode(this.resetForm.phone);
        
        if (result.success) {
          alert('验证码已发送到您的手机（测试环境固定为：123456）')
          
          // 开始倒计时
          this.codeCountdown = 60
          const timer = setInterval(() => {
            this.codeCountdown--
            if (this.codeCountdown <= 0) {
              clearInterval(timer)
            }
          }, 1000)
        } else {
          alert(result.message || '发送失败，请重试')
        }
      } catch (error) {
        console.error('发送验证码失败:', error)
        alert('发送失败：' + error.message)
      }
    },
    
    async handleReset() {
      if (!this.resetForm.phone || !this.resetForm.code || !this.resetForm.newPassword) {
        alert('请填写完整信息')
        return
      }
      
      if (!/^1[3-9]\d{9}$/.test(this.resetForm.phone)) {
        alert('请输入正确的手机号')
        return
      }
      
      if (this.resetForm.newPassword.length < 6) {
        alert('密码长度不能少于6位')
        return
      }
      
      this.loading = true
      
      try {
        // 调用后端API重置密码
        const { authAPI } = await import('@/services/api.js');
        const result = await authAPI.resetPassword({
          phone: this.resetForm.phone,
          code: this.resetForm.code,
          newPassword: this.resetForm.newPassword
        });
        
        if (result.success) {
          alert('密码重置成功！请使用新密码登录')
          this.$router.replace('/login')
        } else {
          alert(result.message || '重置失败，请重试')
        }
      } catch (error) {
        console.error('重置密码失败:', error)
        alert('重置失败：' + error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.forgot-password-container {
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

.reset-form {
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

.code-input {
  padding-right: 120px;
}

.code-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.code-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.reset-btn {
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

.reset-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.reset-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-links {
  display: flex;
  justify-content: center;
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
</style>


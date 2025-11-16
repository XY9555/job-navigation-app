<template>
  <div class="bind-email-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">邮箱绑定</h1>
    </div>
    
    <div class="content">
      <div class="form-card">
        <div class="form-group">
          <label class="form-label">邮箱地址</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="请输入邮箱地址"
            class="input-field"
          />
        </div>
        
        <div class="form-group">
          <label class="form-label">验证码</label>
          <div class="code-wrapper">
            <input
              v-model="form.code"
              type="text"
              placeholder="请输入验证码"
              class="input-field code-input"
              maxlength="6"
            />
            <button class="code-btn" @click="sendCode" :disabled="codeCountdown > 0">
              {{ codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码' }}
            </button>
          </div>
        </div>
        
        <button class="submit-btn" @click="handleSubmit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '绑定中...' : '确认绑定' }}
        </button>
      </div>
      
      <div class="tips-card">
        <div class="tips-title">💡 温馨提示</div>
        <ul class="tips-list">
          <li>绑定邮箱后可用于找回密码</li>
          <li>测试环境验证码固定为：123456</li>
          <li>请确保邮箱地址真实有效</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BindEmail',
  data() {
    return {
      form: {
        email: '',
        code: ''
      },
      codeCountdown: 0,
      loading: false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    async sendCode() {
      if (!this.form.email) {
        alert('请输入邮箱地址')
        return
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.form.email)) {
        alert('请输入正确的邮箱地址')
        return
      }
      
      try {
        alert('验证码已发送到您的邮箱（测试环境固定为：123456）')
        
        // 开始倒计时
        this.codeCountdown = 60
        const timer = setInterval(() => {
          this.codeCountdown--
          if (this.codeCountdown <= 0) {
            clearInterval(timer)
          }
        }, 1000)
      } catch (error) {
        alert('发送失败：' + error.message)
      }
    },
    
    async handleSubmit() {
      if (!this.form.email || !this.form.code) {
        alert('请填写完整信息')
        return
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.form.email)) {
        alert('请输入正确的邮箱地址')
        return
      }
      
      if (this.form.code !== '123456') {
        alert('验证码错误')
        return
      }
      
      this.loading = true
      
      try {
        const { userAPI } = await import('@/services/api.js')
        const result = await userAPI.updateProfile({
          email: this.form.email
        })
        
        if (result.success) {
          alert('邮箱绑定成功！')
          this.$router.go(-1)
        } else {
          alert(result.message || '绑定失败')
        }
      } catch (error) {
        console.error('绑定邮箱失败:', error)
        alert('绑定失败：' + error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.bind-email-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  padding: 8px;
  margin-right: 16px;
  cursor: pointer;
  border-radius: 8px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.content {
  padding: 20px;
}

.form-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.code-wrapper {
  display: flex;
  gap: 12px;
}

.code-input {
  flex: 1;
}

.code-btn {
  padding: 12px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.code-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.code-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tips-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
}

.tips-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
  padding-left: 16px;
  position: relative;
}

.tips-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #667eea;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>

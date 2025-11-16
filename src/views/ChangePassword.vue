<template>
  <div class="change-password-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">修改密码</h1>
    </div>
    
    <div class="content">
      <div class="form-card">
        <div class="form-group">
          <label class="form-label">当前密码</label>
          <div class="input-wrapper">
            <input
              v-model="form.oldPassword"
              :type="showOldPassword ? 'text' : 'password'"
              placeholder="请输入当前密码"
              class="input-field"
            />
            <button class="password-toggle" @click="showOldPassword = !showOldPassword">
              <svg v-if="showOldPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                <path d="M1 1l22 22" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">新密码</label>
          <div class="input-wrapper">
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="请输入新密码（至少6位）"
              class="input-field"
            />
            <button class="password-toggle" @click="showNewPassword = !showNewPassword">
              <svg v-if="showNewPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                <path d="M1 1l22 22" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">确认新密码</label>
          <div class="input-wrapper">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入新密码"
              class="input-field"
            />
            <button class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="showConfirmPassword" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                <path d="M1 1l22 22" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        <button class="submit-btn" @click="handleSubmit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '提交中...' : '确认修改' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      loading: false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    async handleSubmit() {
      if (!this.form.oldPassword || !this.form.newPassword || !this.form.confirmPassword) {
        alert('请填写完整信息')
        return
      }
      
      if (this.form.newPassword.length < 6) {
        alert('新密码长度不能少于6位')
        return
      }
      
      if (this.form.newPassword !== this.form.confirmPassword) {
        alert('两次输入的新密码不一致')
        return
      }
      
      if (this.form.oldPassword === this.form.newPassword) {
        alert('新密码不能与当前密码相同')
        return
      }
      
      this.loading = true
      
      try {
        const { userAPI } = await import('@/services/api.js')
        const result = await userAPI.changePassword({
          oldPassword: this.form.oldPassword,
          newPassword: this.form.newPassword
        })
        
        if (result.success) {
          alert('密码修改成功！请重新登录')
          localStorage.removeItem('userToken')
          localStorage.removeItem('userInfo')
          this.$router.replace('/login')
        } else {
          alert(result.message || '修改失败')
        }
      } catch (error) {
        console.error('修改密码失败:', error)
        alert('修改失败：' + error.message)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.change-password-container {
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

.input-wrapper {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 15px;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
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

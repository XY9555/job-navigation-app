<template>
  <div class="security-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">账户安全</h1>
    </div>
    
    <div class="content">
      <div class="security-section">
        <div class="security-item" @click="changePassword">
          <div class="item-icon">🔒</div>
          <div class="item-content">
            <div class="item-title">修改密码</div>
            <div class="item-desc">定期更换密码保障账户安全</div>
          </div>
          <div class="item-arrow">›</div>
        </div>
        
        <div class="security-item" @click="bindPhone">
          <div class="item-icon">📱</div>
          <div class="item-content">
            <div class="item-title">手机绑定</div>
            <div class="item-desc">已绑定：{{ maskPhone(userInfo?.phone) }}</div>
          </div>
          <div class="item-arrow">›</div>
        </div>
        
        <div class="security-item" @click="bindEmail">
          <div class="item-icon">✉️</div>
          <div class="item-content">
            <div class="item-title">邮箱绑定</div>
            <div class="item-desc">{{ userInfo?.email || '未绑定' }}</div>
          </div>
          <div class="item-arrow">›</div>
        </div>
      </div>
      
      <div class="danger-section">
        <h3 class="section-title">危险操作</h3>
        <button class="danger-btn" @click="deleteAccount">
          注销账户
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountSecurity',
  data() {
    return {
      userInfo: null
    }
  },
  mounted() {
    this.loadUserInfo()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    loadUserInfo() {
      const userInfoStr = localStorage.getItem('userInfo')
      if (userInfoStr) {
        this.userInfo = JSON.parse(userInfoStr)
      }
    },
    changePassword() {
      this.$router.push('/change-password')
    },
    bindPhone() {
      alert('手机号已在注册时绑定，暂不支持修改')
    },
    bindEmail() {
      this.$router.push('/bind-email')
    },
    deleteAccount() {
      if (confirm('确定要注销账户吗？此操作不可恢复！')) {
        alert('账户注销功能暂未开放')
      }
    },
    maskPhone(phone) {
      if (!phone) return '未绑定'
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  }
}
</script>

<style scoped>
.security-container {
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

.security-section, .danger-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.security-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.security-item:last-child {
  border-bottom: none;
}

.security-item:hover {
  background: #f8f9fa;
}

.item-icon {
  font-size: 24px;
  margin-right: 16px;
}

.item-content {
  flex: 1;
}

.item-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.item-desc {
  font-size: 14px;
  color: #666;
}

.item-arrow {
  font-size: 20px;
  color: #ccc;
}


.danger-btn {
  width: 100%;
  padding: 16px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.danger-btn:hover {
  background: #ff3742;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
}
</style>




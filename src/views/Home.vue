<template>
  <div class="home-container">

    <!-- 顶部标题区域 -->
    <div class="header">
      <h1 class="app-title">求职导航服务</h1>
      <p class="app-subtitle">帮助求职者分析简历的智能助手</p>
    </div>
    
    <!-- 主要功能卡片 -->
    <div class="main-card">
      <!-- 功能按钮网格 -->
      <div class="feature-grid">
        <!-- 创作个人简历 -->
        <div class="feature-item green" @click="navigateTo('/my-resume')">
          <div class="feature-icon">
            📄
          </div>
          <div class="feature-title">创作个人简历</div>
        </div>
        
        <!-- 简历评测 -->
        <div class="feature-item purple" @click="navigateTo('/resume-evaluation')">
          <div class="feature-icon">
            📊
          </div>
          <div class="feature-title">简历评测</div>
        </div>
        
        <!-- 职位匹配分析 -->
        <div class="feature-item purple" @click="navigateTo('/job-matching')">
          <div class="feature-icon">
            🎯
          </div>
          <div class="feature-title">职位匹配分析</div>
        </div>
        
        <!-- 面试问题生成 -->
        <div class="feature-item blue" @click="navigateTo('/interview-questions')">
          <div class="feature-icon">
            💬
          </div>
          <div class="feature-title">面试问题生成</div>
        </div>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav">
      <router-link to="/home" class="nav-item active">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="nav-text">首页</div>
      </router-link>
      
      <router-link to="/my-resume" class="nav-item">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="nav-text">我的简历</div>
      </router-link>
      
      <router-link to="/my-profile" class="nav-item">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="nav-text">我的</div>
      </router-link>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    navigateTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding-bottom: 120px;
}

.header {
  text-align: center;
  padding: 60px 20px 40px;
  color: #333;
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #2c3e50;
}

.app-subtitle {
  font-size: 16px;
  color: #666;
  font-weight: 400;
}

.main-card {
  margin: 0 20px;
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 14px;
  height: 440px;
}

.feature-item {
  border-radius: 16px;
  padding: 28px 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.feature-item.green {
  background: linear-gradient(135deg, #a8d8ea 0%, #b8e6b8 100%);
  color: white;
}

.feature-item.purple {
  background: linear-gradient(135deg, #b19cd9 0%, #c9a9dd 100%);
  color: white;
}

.feature-item.blue {
  background: linear-gradient(135deg, #74b9ff 0%, #81ecec 100%);
  color: white;
}

.feature-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 42px;
}

.feature-title {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}


.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e9ecef;
  display: flex;
  padding: 16px 0 32px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9999;
  height: 80px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #999;
  transition: color 0.3s ease;
  padding: 8px;
}

.nav-item.active {
  color: #667eea;
}

.nav-item:hover {
  color: #667eea;
}

.nav-icon {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
}

@media (max-width: 375px) {
  .main-card {
    margin: 0 12px;
    padding: 24px 16px;
  }
  
  .feature-grid {
    gap: 12px;
  }
  
  .feature-item {
    padding: 20px 12px;
  }
  
  .feature-item.large {
    padding: 32px 16px;
  }
}
</style>


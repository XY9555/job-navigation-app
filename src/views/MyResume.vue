<template>
  <div class="resume-container">
    <!-- 头部 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">我的简历</h1>
    </div>
    

    
    
    <!-- 内容区域 -->
    <div class="content">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <div class="loading-text">加载简历列表中...</div>
      </div>
      
      <!-- 错误状态 -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ error }}</div>
        <button class="retry-btn" @click="loadResumes">重试</button>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="resumeList.length === 0" class="empty-state">
        <div class="empty-icon">📄</div>
        <div class="empty-title">还没有简历</div>
        <div class="empty-desc">点击下方按钮创建您的第一份简历</div>
      </div>
      
      <!-- 简历列表 -->
      <div v-else class="resume-list">
        <div 
          v-for="resume in resumeList" 
          :key="resume.id"
          class="resume-card"
          @click="editResume(resume)"
        >
          <div class="resume-header">
            <div class="resume-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="resume-title" @click.stop="renameResume(resume)">
              {{ resume.title }}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="edit-icon">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2-2v-7" stroke="currentColor" stroke-width="2"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <button class="delete-btn" @click.stop="deleteResume(resume)">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          
          <div class="resume-info">
            <div class="info-row">
              <span class="label">{{ getResumeName(resume) }}</span>
              <span class="value">{{ getResumeGenderAge(resume) }}</span>
            </div>
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="value">{{ getResumePhone(resume) }}</span>
            </div>
            <div class="info-row">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="value">{{ getResumeEmail(resume) }}</span>
            </div>
            <div class="info-row">
              <span class="status-badge" :class="resume.status">
                {{ getStatusText(resume.status) }}
              </span>
              <span class="update-time">{{ formatTime(resume.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 添加按钮 -->
      <div class="add-resume-btn" @click="addNewResume">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2"/>
          <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2"/>
        </svg>
      </div>
    </div>
    
    <!-- 底部导航 -->
    <div class="bottom-nav">
      <router-link to="/home" class="nav-item">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2"/>
            <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="nav-text">首页</div>
      </router-link>
      
      <router-link to="/my-resume" class="nav-item active">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
            <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="nav-text">我的简历</div>
      </router-link>
      
      <router-link to="/my-profile" class="nav-item">
        <div class="nav-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            <path d="M6 21V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V21" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="nav-text">我的</div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyResume',
  data() {
    return {
      resumeList: [],
      loading: true,
      error: null,
      showDebug: false
    }
  },
  
  async mounted() {
    await this.loadResumes()
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    

    
    // 加载简历列表
    async loadResumes() {
      try {
        this.loading = true
        this.error = null
        
        console.log('📡 开始加载简历列表...')
        
        // 直接尝试获取token，如果失败就登录
        let token = localStorage.getItem('userToken')
        
        // 如果没有token，先登录
        if (!token) {
          console.log('🔄 没有token，先登录...')
          const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: '13800138000', password: '123456' })
          })
          
          const loginData = await loginResponse.json()
          
          if (loginData.success && loginData.data && loginData.data.token) {
            token = loginData.data.token
            localStorage.setItem('userToken', token)
            localStorage.setItem('userInfo', JSON.stringify(loginData.data.user))
            console.log('✅ 登录成功')
          } else {
            throw new Error('登录失败: ' + (loginData.message || '未知错误'))
          }
        }
        
        // 使用token获取简历列表
        const response = await fetch('http://localhost:3000/api/resumes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        // 如果401错误，清除token并重新登录
        if (response.status === 401) {
          console.log('🔄 token过期，重新登录...')
          localStorage.removeItem('userToken')
          localStorage.removeItem('userInfo')
          
          const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: '13800138000', password: '123456' })
          })
          
          const loginData = await loginResponse.json()
          
          if (loginData.success && loginData.data && loginData.data.token) {
            token = loginData.data.token
            localStorage.setItem('userToken', token)
            localStorage.setItem('userInfo', JSON.stringify(loginData.data.user))
            
            // 重新请求简历列表
            const retryResponse = await fetch('http://localhost:3000/api/resumes', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            
            if (!retryResponse.ok) {
              throw new Error(`HTTP ${retryResponse.status}: ${retryResponse.statusText}`)
            }
            
            const retryData = await retryResponse.json()
            
            if (retryData.success) {
              const allResumes = retryData.data || []
              this.resumeList = allResumes
              console.log('✅ 简历列表加载成功:', allResumes.length, '总记录')
            } else {
              throw new Error(retryData.message || '加载简历列表失败')
            }
            
            return // 成功返回
          } else {
            throw new Error('重新登录失败: ' + (loginData.message || '未知错误'))
          }
        }
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('📝 API响应:', data)
        
        if (data.success) {
          // 显示所有简历记录，不再过滤
          const allResumes = data.data || []
          this.resumeList = allResumes
          
          console.log('✅ 简历列表加载成功:', allResumes.length, '总记录')
        } else {
          throw new Error(data.message || '加载简历列表失败')
        }
        
      } catch (error) {
        console.error('❌ 加载简历列表失败:', error)
        this.error = error.message
        
        // 检查是否是认证错误
        if (error.message.includes('token') || error.message.includes('认证') || error.message.includes('Failed to fetch')) {
          console.log('🔄 认证失败，清理token并跳转到登录页')
          localStorage.removeItem('userToken')
          localStorage.removeItem('userInfo')
          this.$router.push('/login')
        }
      } finally {
        this.loading = false
      }
    },
    
    // 编辑简历
    editResume(resume) {
      this.$router.push(`/fill-resume-1?id=${resume.id}`)
    },
    
    // 删除简历
    async deleteResume(resume) {
      if (!confirm(`确定要删除"${resume.title}"吗？此操作不可恢复。`)) {
        return
      }
      
      try {
        const token = localStorage.getItem('userToken')
        if (!token) {
          throw new Error('没有有效的登录token')
        }
        
        const apiResponse = await fetch(`http://localhost:3000/api/resumes/${resume.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!apiResponse.ok) {
          throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`)
        }
        
        const response = await apiResponse.json()
        
        if (response.success) {
          // 从列表中移除
          const index = this.resumeList.findIndex(item => item.id === resume.id)
          if (index > -1) {
            this.resumeList.splice(index, 1)
          }
          console.log('✅ 简历删除成功')
        } else {
          throw new Error(response.message || '删除失败')
        }
        
      } catch (error) {
        console.error('❌ 删除简历失败:', error)
        alert('删除失败：' + error.message)
      }
    },
    
    // 添加新简历
    async addNewResume() {
      // 检查登录状态
      const token = localStorage.getItem('userToken')
      if (!token) {
        alert('请先登录后再创建简历')
        this.$router.push('/login')
        return
      }
      
      try {
        const token = localStorage.getItem('userToken')
        if (!token) {
          throw new Error('没有有效的登录token')
        }
        
        // 创建新简历
        const newResumeData = {
          title: `简历${this.resumeList.length + 1}`,
          personalInfo: {
            name: '',
            phone: '',
            email: '',
            gender: '男',
            age: ''
          },
          jobIntention: {
            position: '',
            salary: '',
            city: '',
            jobType: '全职'
          },
          education: [],
          workExperience: [],
          skills: [],
          projects: [],
          status: 'draft'
        }
        
        const apiResponse = await fetch('http://localhost:3000/api/resumes', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newResumeData)
        })
        
        if (!apiResponse.ok) {
          throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`)
        }
        
        const response = await apiResponse.json()
        
        console.log('📝 API响应:', response)
        
        if (response.success) {
          // 检查响应数据结构
          if (!response.data) {
            throw new Error('服务器返回数据为空')
          }
          
          // 处理可能的数据结构差异
          let resumeData = response.data
          let resumeId = resumeData.id
          
          // 如果直接没有id，可能数据在dataValues中（Sequelize特性）
          if (!resumeId && resumeData.dataValues) {
            resumeData = resumeData.dataValues
            resumeId = resumeData.id
          }
          
          if (!resumeId) {
            console.error('❌ 响应数据缺少ID:', response.data)
            throw new Error('服务器返回的简历数据格式错误')
          }
          
          // 添加到列表末尾（因为后端已改为按创建时间正序）
          this.resumeList.push(resumeData)
          console.log('✅ 新简历创建成功，ID:', resumeId)
          
          // 简历创建成功，已添加到列表中
        } else {
          throw new Error(response.message || '创建失败')
        }
        
      } catch (error) {
        console.error('❌ 创建新简历失败:', error)
        console.error('❌ 错误详情:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        })
        
        // 检查是否是认证错误
        if (error.message.includes('token') || error.message.includes('认证') || error.message.includes('Failed to fetch')) {
          alert('登录已过期，请重新登录')
          localStorage.removeItem('userToken')
          localStorage.removeItem('userInfo')
          this.$router.push('/login')
        } else {
          alert('创建失败：' + error.message)
        }
      }
    },
    
    // 重命名简历
    async renameResume(resume) {
      const newTitle = prompt('请输入新的简历名称:', resume.title)
      if (!newTitle || newTitle.trim() === '' || newTitle === resume.title) {
        return
      }
      
      try {
        const token = localStorage.getItem('userToken')
        if (!token) {
          throw new Error('没有有效的登录token')
        }
        
        const apiResponse = await fetch(`http://localhost:3000/api/resumes/${resume.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ title: newTitle.trim() })
        })
        
        if (!apiResponse.ok) {
          throw new Error(`HTTP ${apiResponse.status}: ${apiResponse.statusText}`)
        }
        
        const response = await apiResponse.json()
        
        if (response.success) {
          // 更新列表中的标题
          const index = this.resumeList.findIndex(item => item.id === resume.id)
          if (index > -1) {
            this.resumeList[index].title = newTitle.trim()
          }
          console.log('✅ 简历重命名成功')
        } else {
          throw new Error(response.message || '重命名失败')
        }
        
      } catch (error) {
        console.error('❌ 重命名简历失败:', error)
        alert('重命名失败：' + error.message)
      }
    },
    
    // 获取简历显示名称
    getResumeName(resume) {
      return resume.personalInfo?.name || '未填写姓名'
    },
    
    // 获取简历性别年龄
    getResumeGenderAge(resume) {
      const gender = resume.personalInfo?.gender || ''
      const age = resume.personalInfo?.age || ''
      
      if (gender && age) {
        return `${gender} / ${age}岁`
      } else if (gender) {
        return gender
      } else if (age) {
        return `${age}岁`
      }
      return '未填写'
    },
    
    // 获取简历电话
    getResumePhone(resume) {
      return resume.personalInfo?.phone || '未填写'
    },
    
    // 获取简历邮箱
    getResumeEmail(resume) {
      return resume.personalInfo?.email || '未填写'
    },
    
    formatTime(time) {
      if (!time) return '未知时间'
      
      // 确保time是Date对象
      const timeDate = new Date(time)
      
      // 检查是否是有效日期
      if (isNaN(timeDate.getTime())) {
        return '无效时间'
      }
      
      const now = new Date()
      const diff = now - timeDate
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      
      if (days === 0) {
        return '今天'
      } else if (days === 1) {
        return '昨天'
      } else if (days < 7) {
        return `${days}天前`
      } else {
        return timeDate.toLocaleDateString()
      }
    },
    
    getStatusText(status) {
      const statusMap = {
        complete: '已完成',
        draft: '草稿',
        reviewing: '审核中'
      }
      return statusMap[status] || '未知'
    }
  }
}
</script>

<style scoped>
.resume-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding-bottom: 120px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: transparent;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  text-align: center;
}




.content {
  padding: 20px;
}


.resume-list {
  margin-bottom: 40px;
}

.resume-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resume-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.resume-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.resume-icon {
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.resume-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-left: 12px;
}

.delete-btn {
  background: none;
  border: none;
  color: #666;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  color: #ff4757;
  background: #fff5f5;
}

.resume-info {
  space-y: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

.info-row:first-child {
  margin-bottom: 16px;
}

.info-row:first-child .label {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.info-row:first-child .value {
  font-size: 14px;
  color: #666;
  margin-left: auto;
}

.info-row svg {
  margin-right: 8px;
  color: #666;
}

.value {
  color: #333;
}

.add-resume-btn {
  width: 60px;
  height: 60px;
  background: #4A90E2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px auto;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
}

.add-resume-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(74, 144, 226, 0.4);
}


</style>




<template>
  <div class="settings-container">
    <!-- 头部 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">个人设置</h1>
      <button class="save-btn" @click="saveSettings" :disabled="!hasChanges">保存</button>
    </div>
    
    <!-- 内容区域 -->
    <div class="content">
      <!-- 头像设置 -->
      <div class="setting-section">
        <h3 class="section-title">头像设置</h3>
        <div class="avatar-setting">
          <div class="current-avatar">
            <img v-if="userSettings.avatar" :src="userSettings.avatar" alt="头像" />
            <div v-else class="default-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
          <div class="avatar-actions">
            <input 
              type="file" 
              ref="avatarInput" 
              @change="handleAvatarChange" 
              accept="image/*" 
              style="display: none;"
            />
            <button class="upload-btn" @click="selectAvatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              上传头像
            </button>
            <button v-if="userSettings.avatar" class="remove-btn" @click="removeAvatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              移除头像
            </button>
          </div>
        </div>
        <p class="setting-desc">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
      </div>
      
      <!-- 用户名设置 -->
      <div class="setting-section">
        <h3 class="section-title">用户名设置</h3>
        <div class="username-setting">
          <div class="input-group">
            <label for="username">用户名</label>
            <input 
              id="username"
              type="text" 
              v-model="userSettings.name" 
              placeholder="请输入用户名"
              maxlength="20"
              @input="onUsernameChange"
            />
            <span class="char-count">{{ userSettings.name.length }}/20</span>
          </div>
          <p class="setting-desc">用户名长度为 2-20 个字符，支持中文、英文、数字</p>
        </div>
      </div>
      
      <!-- 个人简介设置 -->
      <div class="setting-section">
        <h3 class="section-title">个人简介</h3>
        <div class="bio-setting">
          <div class="input-group">
            <label for="bio">个人简介</label>
            <textarea 
              id="bio"
              v-model="userSettings.bio" 
              placeholder="介绍一下自己吧..."
              maxlength="100"
              rows="4"
              @input="onBioChange"
            ></textarea>
            <span class="char-count">{{ userSettings.bio.length }}/100</span>
          </div>
          <p class="setting-desc">简单介绍一下自己，让别人更了解你</p>
        </div>
      </div>
    </div>
    
    <!-- 保存确认弹窗 -->
    <div v-if="showSaveModal" class="modal-overlay" @click="closeSaveModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>保存设置</h3>
        </div>
        <div class="modal-body">
          <p>确定要保存当前的设置更改吗？</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeSaveModal">取消</button>
          <button class="confirm-btn" @click="confirmSave">确定保存</button>
        </div>
      </div>
    </div>
    
    <!-- 成功提示 -->
    <div v-if="showSuccessToast" class="toast success">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      </svg>
      设置保存成功！
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserSettings',
  data() {
    return {
      userSettings: {
        name: '',
        avatar: '',
        bio: ''
      },
      originalSettings: {},
      showSaveModal: false,
      showSuccessToast: false,
      isUploading: false
    }
  },
  
  computed: {
    hasChanges() {
      return JSON.stringify(this.userSettings) !== JSON.stringify(this.originalSettings)
    }
  },
  
  mounted() {
    this.loadUserSettings()
  },
  
  methods: {
    goBack() {
      if (this.hasChanges) {
        if (confirm('您有未保存的更改，确定要离开吗？')) {
          this.$router.go(-1)
        }
      } else {
        this.$router.go(-1)
      }
    },
    
    loadUserSettings() {
      // 从 localStorage 加载用户信息
      const userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        const parsed = JSON.parse(userInfo)
        this.userSettings = {
          name: parsed.name || '',
          avatar: parsed.avatar || '',
          bio: parsed.bio || ''
        }
      }
      
      // 保存原始设置用于比较
      this.originalSettings = JSON.parse(JSON.stringify(this.userSettings))
    },
    
    selectAvatar() {
      this.$refs.avatarInput.click()
    },
    
    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      
      // 验证文件大小 (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('图片大小不能超过 2MB')
        return
      }
      
      // 读取文件并转换为 base64
      const reader = new FileReader()
      reader.onload = (e) => {
        this.userSettings.avatar = e.target.result
      }
      reader.readAsDataURL(file)
      
      // 清空 input 值，允许重复选择同一文件
      event.target.value = ''
    },
    
    removeAvatar() {
      if (confirm('确定要移除头像吗？')) {
        this.userSettings.avatar = ''
      }
    },
    
    onUsernameChange() {
      // 验证用户名格式
      const username = this.userSettings.name
      if (username.length < 2 && username.length > 0) {
        // 可以添加实时验证提示
      }
    },
    
    onBioChange() {
      // 个人简介变化处理
    },
    
    saveSettings() {
      // 验证用户名
      if (this.userSettings.name.length < 2) {
        alert('用户名长度不能少于 2 个字符')
        return
      }
      
      this.showSaveModal = true
    },
    
    closeSaveModal() {
      this.showSaveModal = false
    },
    
    confirmSave() {
      // 保存到 localStorage
      const currentUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const updatedUserInfo = {
        ...currentUserInfo,
        ...this.userSettings
      }
      
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))
      
      // 更新原始设置
      this.originalSettings = JSON.parse(JSON.stringify(this.userSettings))
      
      // 关闭弹窗并显示成功提示
      this.showSaveModal = false
      this.showSuccessToast = true
      
      // 3秒后隐藏成功提示
      setTimeout(() => {
        this.showSuccessToast = false
      }, 3000)
    }
  }
}
</script>

<style scoped>
.settings-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e9ecef;
  flex-shrink: 0;
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
  background: #f8f9fa;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
  text-align: center;
}

.save-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.setting-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
}

.setting-desc {
  font-size: 12px;
  color: #666;
  margin: 8px 0 0 0;
}

/* 头像设置 */
.avatar-setting {
  display: flex;
  align-items: center;
  gap: 16px;
}

.current-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e9ecef;
  flex-shrink: 0;
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-avatar {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-btn,
.remove-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #f8f9fa;
  border-color: #667eea;
}

.remove-btn {
  color: #dc3545;
  border-color: #dc3545;
}

.remove-btn:hover {
  background: #dc3545;
  color: white;
}

/* 用户名和简介设置 */
.username-setting,
.bio-setting {
  width: 100%;
}

.input-group {
  position: relative;
  margin-bottom: 8px;
}

.input-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.input-group input,
.input-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.input-group input:focus,
.input-group textarea:focus {
  border-color: #667eea;
}

.input-group textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: 12px;
  font-size: 12px;
  color: #999;
  background: white;
  padding: 2px 4px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px 20px 0 20px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-body {
  padding: 16px 20px;
}

.modal-body p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.modal-footer {
  padding: 0 20px 20px 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn {
  background: #f8f9fa;
  border: 1px solid #e1e5e9;
  color: #333;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.confirm-btn {
  background: #667eea;
  border: 1px solid #667eea;
  color: white;
}

.confirm-btn:hover {
  background: #5a6fd8;
}

/* 成功提示 */
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #28a745;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }
  
  .content {
    padding: 16px;
  }
  
  .setting-section {
    padding: 16px;
  }
  
  .avatar-setting {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .current-avatar {
    align-self: center;
  }
  
  .avatar-actions {
    width: 100%;
  }
  
  .upload-btn,
  .remove-btn {
    justify-content: center;
  }
  
  .modal {
    width: 95%;
  }
}
</style>














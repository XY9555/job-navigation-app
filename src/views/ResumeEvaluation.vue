<template>
  <div class="evaluation-container">
    <!-- 头部 -->
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">简历评测</h1>
    </div>
    
    <!-- 内容区域 -->
    <div class="content">
      <!-- 选择简历 -->
      <div class="section">
        <div class="select-header">
          <span class="select-label">
            选择已有简历
            <span v-if="evaluationMode === 'select'" class="mode-badge active">已选择</span>
            <span v-else-if="evaluationMode === 'upload'" class="mode-badge disabled">已禁用</span>
          </span>
          <div class="select-dropdown">
            <select 
              v-model="selectedResume" 
              class="resume-select"
              :disabled="evaluationMode === 'upload'"
              @change="selectResume(selectedResume)"
            >
              <option value="">请选择简历</option>
              <option v-for="resume in resumeList" :key="resume.id" :value="resume.id">
                {{ resume.title }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- 选中的简历预览 -->
        <div v-if="selectedResumeData" class="selected-resume-card">
          <div class="resume-header">
            <div class="resume-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="resume-title">{{ selectedResumeData.title }}</div>
          </div>
          
          <div class="resume-info">
            <div class="info-row">
              <span class="label">{{ selectedResumeData.personalInfo?.name || selectedResumeData.name || '未填写姓名' }}</span>
              <span class="value">{{ getResumeGenderAge(selectedResumeData) }}</span>
            </div>
            <div class="info-row" v-if="getResumePhone(selectedResumeData)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="value">{{ getResumePhone(selectedResumeData) }}</span>
            </div>
            <div class="info-row" v-if="getResumeEmail(selectedResumeData)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span class="value">{{ getResumeEmail(selectedResumeData) }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 上传简历 -->
      <div class="section">
        <div class="section-header">
          <span class="section-title">
            上传新简历
            <span v-if="evaluationMode === 'upload'" class="mode-badge active">已选择</span>
            <span v-else-if="evaluationMode === 'select'" class="mode-badge disabled">已禁用</span>
          </span>
        </div>
        
        <div 
          class="upload-card" 
          :class="{ disabled: evaluationMode === 'select' }"
          @click="evaluationMode !== 'select' ? triggerUpload() : null"
        >
          <div class="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/>
              <polyline points="14,2 14,8 20,8" stroke="currentColor" stroke-width="2"/>
              <path d="M12 18V12M9 15L12 12L15 15" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="upload-content">
            <div class="upload-title">
              {{ evaluationMode === 'select' ? '已选择简历，上传功能已禁用' : '上传简历文件' }}
            </div>
            <div class="upload-desc">
              {{ evaluationMode === 'select' ? '请先清空选择的简历' : '支持PDF、Word文档' }}
            </div>
          </div>
          <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" @change="handleFileSelect" style="display: none" />
        </div>
        
        <!-- 上传的文件 -->
        <div v-if="uploadedFile" class="uploaded-file">
          <div class="file-icon">📄</div>
          <div class="file-info">
            <div class="file-name">{{ uploadedFile.name }}</div>
            <div class="file-size">{{ formatFileSize(uploadedFile.size) }}</div>
          </div>
          <button class="remove-btn" @click="removeFile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        

        <!-- 解析内容显示 -->
        <div v-if="parsedContent" class="parsed-content-section">
          <h4 class="parsed-title">📄 解析出的文档内容</h4>

          <!-- 原始文本内容 -->
          <div class="parsed-text-container">
            <label class="parsed-label">原始文本内容：</label>
            <textarea 
              v-model="parsedContent.rawText" 
              class="parsed-text-area" 
              readonly
              rows="8"
              placeholder="解析出的文档内容将显示在这里..."
            ></textarea>
          </div>
          
          <!-- 结构化信息 -->
          <div class="parsed-info-grid">
            <div class="info-card" v-if="parsedContent.personalInfo && Object.values(parsedContent.personalInfo).some(v => v)">
              <h5>👤 个人信息</h5>
              <div class="info-content">
                <p v-if="parsedContent.personalInfo.name"><strong>姓名：</strong>{{ parsedContent.personalInfo.name }}</p>
                <p v-if="parsedContent.personalInfo.phone"><strong>电话：</strong>{{ parsedContent.personalInfo.phone }}</p>
                <p v-if="parsedContent.personalInfo.email"><strong>邮箱：</strong>{{ parsedContent.personalInfo.email }}</p>
              </div>
            </div>
            
            <div class="info-card" v-if="parsedContent.skills && parsedContent.skills.length > 0">
              <h5>🛠️ 技能 ({{ parsedContent.skills.length }}项)</h5>
              <div class="info-content">
                <div class="skills-list">
                  <span v-for="skill in parsedContent.skills.slice(0, 6)" :key="skill.name" class="skill-tag">
                    {{ skill.name }}
                  </span>
                  <span v-if="parsedContent.skills.length > 6" class="more-skills">
                    +{{ parsedContent.skills.length - 6 }}项
                  </span>
                </div>
              </div>
            </div>
            
            <div class="info-card" v-if="parsedContent.experience && parsedContent.experience.length > 0">
              <h5>💼 工作经历 ({{ parsedContent.experience.length }}条)</h5>
              <div class="info-content">
                <p v-for="exp in parsedContent.experience.slice(0, 2)" :key="exp.company">
                  <strong>{{ exp.company }}</strong> - {{ exp.position }}
                </p>
                <p v-if="parsedContent.experience.length > 2" class="more-items">
                  +{{ parsedContent.experience.length - 2 }}条经历
                </p>
              </div>
            </div>
            
            <div class="info-card" v-if="parsedContent.education && parsedContent.education.length > 0">
              <h5>🎓 教育经历 ({{ parsedContent.education.length }}条)</h5>
              <div class="info-content">
                <p v-for="edu in parsedContent.education.slice(0, 2)" :key="edu.school">
                  <strong>{{ edu.school }}</strong> - {{ edu.major }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 评测选项 -->
      <div class="section">
        <h3 class="section-title">评测维度</h3>
        <div class="evaluation-options">
          <label class="option-item">
            <input type="checkbox" v-model="evaluationOptions.content" />
            <span class="checkmark"></span>
            <div class="option-info">
              <div class="option-name">内容完整性</div>
              <div class="option-desc">检查简历信息是否完整</div>
            </div>
          </label>
          
          <label class="option-item">
            <input type="checkbox" v-model="evaluationOptions.format" />
            <span class="checkmark"></span>
            <div class="option-info">
              <div class="option-name">格式规范性</div>
              <div class="option-desc">评估简历格式和排版</div>
            </div>
          </label>
          
          <label class="option-item">
            <input type="checkbox" v-model="evaluationOptions.keywords" />
            <span class="checkmark"></span>
            <div class="option-info">
              <div class="option-name">关键词匹配</div>
              <div class="option-desc">分析行业关键词覆盖度</div>
            </div>
          </label>
          
          <label class="option-item">
            <input type="checkbox" v-model="evaluationOptions.experience" />
            <span class="checkmark"></span>
            <div class="option-info">
              <div class="option-name">经验描述</div>
              <div class="option-desc">评估工作经验描述质量</div>
            </div>
          </label>
        </div>
      </div>
      
      <!-- 开始评测按钮 -->
      <div class="action-section">
        <!-- 当前选择状态显示 -->
        <div v-if="evaluationMode" class="current-selection">
          <div class="selection-info">
            <div class="selection-icon">
              {{ evaluationMode === 'select' ? '📋' : '📁' }}
            </div>
            <div class="selection-details">
              <div class="selection-title">
                {{ evaluationMode === 'select' ? '已选择简历' : '已上传文件' }}
              </div>
              <div class="selection-name">
                {{ evaluationMode === 'select' ? selectedResumeData?.title : uploadedFile?.name }}
              </div>
            </div>
            <button class="reset-btn" @click="resetSelection" title="重新选择">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" stroke-width="2"/>
                <path d="M3 3v5h5" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div v-if="!canEvaluate && !loading" class="evaluation-hint">
          <div class="hint-icon">💡</div>
          <div class="hint-text">
            <div v-if="!evaluationMode">请选择一种评测方式：选择已有简历或上传新文件</div>
            <div v-else-if="evaluationMode && !Object.values(evaluationOptions).some(option => option)">
              请至少选择一个评测维度
            </div>
          </div>
        </div>
        
        <button 
          class="evaluate-btn" 
          @click="startEvaluation" 
          :disabled="!canEvaluate || loading"
        >
          <span v-if="loading" class="spinner"></span>
          {{ evaluationButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumeEvaluation',
  data() {
    return {
      selectedResume: '',
      uploadedFile: null,
      loading: false,
      loadingResumes: true,
      resumeList: [],
      parsedContent: null, // 存储解析出的内容
      evaluationMode: '', // 'select' 或 'upload'，用于控制评测模式
      evaluationOptions: {
        content: true,
        format: true,
        keywords: true,
        experience: true
      }
    }
  },
  
  async mounted() {
    // 总是加载简历数据，不管是否登录
    await this.loadResumes()
    
    // 清除旧的页面状态，确保每次都是干净的开始
    this.clearPageState()
    
    // 重置评测模式
    this.evaluationMode = ''
    this.selectedResume = ''
    this.uploadedFile = null
  },
  
  beforeUnmount() {
    // 页面离开时保存状态
    this.savePageState()
  },
  
  computed: {
    canEvaluate() {
      const hasValidSelection = (this.evaluationMode === 'select' && this.selectedResume) || 
                               (this.evaluationMode === 'upload' && this.uploadedFile);
      return hasValidSelection && Object.values(this.evaluationOptions).some(option => option);
    },
    
    selectedResumeData() {
      if (!this.selectedResume || this.selectedResume === '' || this.evaluationMode !== 'select') return null
      return this.resumeList.find(resume => resume.id == this.selectedResume)
    },
    
    evaluationButtonText() {
      if (this.loading) return 'AI评测中...';
      if (this.evaluationMode === 'select') return '评测选中简历';
      if (this.evaluationMode === 'upload') return '评测上传文件';
      return '请选择评测方式';
    }
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    checkAuth() {
      const token = localStorage.getItem('userToken')
      const userInfo = localStorage.getItem('userInfo')
      
      if (!token || !userInfo) {
        alert('请先登录后再使用简历评测功能')
        this.$router.push('/login')
        return false
      }
      
      return true
    },
    
    async loadResumes() {
      try {
        this.loadingResumes = true
        
        // 确保有有效token
        await this.ensureAuthenticated()
        
        console.log('📡 开始加载简历列表...')
        
        const token = localStorage.getItem('userToken')
        const response = await fetch('http://localhost:3000/api/resumes', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
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
        this.resumeList = []
      } finally {
        this.loadingResumes = false
      }
    },
    
    // 确保已认证
    async ensureAuthenticated() {
      let token = localStorage.getItem('userToken')
      
      // 如果没有token，执行一次性登录
      if (!token) {
        console.log('🔄 首次访问，执行登录...')
        
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: '13800138000', password: '123456' })
        })
        
        const data = await response.json()
        
        if (data.success && data.data && data.data.token) {
          localStorage.setItem('userToken', data.data.token)
          localStorage.setItem('userInfo', JSON.stringify(data.data.user))
          console.log('✅ 登录成功，token已永久保存')
        } else {
          throw new Error('登录失败: ' + (data.message || '未知错误'))
        }
      } else {
        console.log('✅ 使用已保存的永久token')
      }
    },
    
    selectResume(resumeId) {
      if (resumeId === '' || !resumeId) {
        // 如果选择了空值，重置状态
        this.evaluationMode = '';
        this.selectedResume = '';
        console.log('🔄 重置选择状态');
      } else {
        // 切换到选择简历模式
        this.evaluationMode = 'select';
        this.selectedResume = resumeId;
        // 清空上传相关数据
        this.uploadedFile = null;
        this.parsedContent = null;
        console.log('🎯 切换到选择简历模式，简历ID:', resumeId);
      }
    },
    
    triggerUpload() {
      this.$refs.fileInput.click()
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.handleFile(file)
      }
    },
    
    handleDrop(event) {
      event.preventDefault()
      const file = event.dataTransfer.files[0]
      if (file) {
        this.handleFile(file)
      }
    },
    
    handleFile(file) {
      // 检查文件类型
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        alert('请上传 PDF 或 Word 格式的文件')
        return
      }
      
      // 检查文件大小 (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('文件大小不能超过 10MB')
        return
      }
      
      // 切换到上传文件模式
      this.evaluationMode = 'upload';
      this.uploadedFile = file;
      // 清空选择相关数据
      this.selectedResume = '';
      this.parsedContent = null;
      
      console.log('📁 切换到上传文件模式，文件:', file.name);
      
      // 立即解析文件内容
      this.parseUploadedFile(file)
    },
    
    removeFile() {
      // 清空上传模式
      this.evaluationMode = '';
      this.uploadedFile = null;
      this.$refs.fileInput.value = '';
      this.parsedContent = null;
      console.log('🗑️ 清空上传文件，重置评测模式');
    },
    
    resetSelection() {
      // 重置所有选择
      this.evaluationMode = '';
      this.selectedResume = '';
      this.uploadedFile = null;
      this.parsedContent = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
      
      // 清除localStorage中的相关数据，确保状态持久重置
      localStorage.removeItem('currentEvaluationResumeId');
      localStorage.removeItem('evaluationResult');
      
      console.log('🔄 重置所有选择，回到初始状态，已清除localStorage数据');
      
      // 清除页面状态
      this.clearPageState();
    },
    
    // 保存页面状态
    savePageState() {
      const pageState = {
        evaluationMode: this.evaluationMode,
        selectedResume: this.selectedResume,
        evaluationOptions: this.evaluationOptions,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('resumeEvaluationPageState', JSON.stringify(pageState));
    },
    
    // 恢复页面状态
    restorePageState() {
      try {
        const savedState = localStorage.getItem('resumeEvaluationPageState');
        if (savedState) {
          const pageState = JSON.parse(savedState);
          
          // 检查状态是否过期（超过1小时）
          const stateTime = new Date(pageState.timestamp);
          const now = new Date();
          const hoursDiff = (now - stateTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 1) {
            this.evaluationMode = pageState.evaluationMode || '';
            this.selectedResume = pageState.selectedResume || '';
            this.evaluationOptions = { ...this.evaluationOptions, ...pageState.evaluationOptions };
            console.log('✅ 页面状态已恢复');
          } else {
            console.log('⏰ 页面状态已过期，使用默认状态');
            this.clearPageState();
          }
        }
      } catch (error) {
        console.error('❌ 恢复页面状态失败:', error);
      }
    },
    
    // 清除页面状态
    clearPageState() {
      localStorage.removeItem('resumeEvaluationPageState');
    },
    
    formatTime(time) {
      return time.toLocaleDateString()
    },
    
    formatFileSize(size) {
      if (size < 1024) {
        return size + ' B'
      } else if (size < 1024 * 1024) {
        return (size / 1024).toFixed(1) + ' KB'
      } else {
        return (size / (1024 * 1024)).toFixed(1) + ' MB'
      }
    },
    
    getResumeGenderAge(resume) {
      const gender = resume?.personalInfo?.gender || resume?.gender || ''
      const age = resume?.personalInfo?.age || resume?.age || ''
      
      if (gender && age) {
        return `${gender} / ${age}岁`
      } else if (gender) {
        return gender
      } else if (age) {
        return `${age}岁`
      }
      return '未填写'
    },
    
    getResumePhone(resume) {
      return resume?.personalInfo?.phone || resume?.phone || ''
    },
    
    getResumeEmail(resume) {
      return resume?.personalInfo?.email || resume?.email || ''
    },
    
    
    // 评测上传的简历文件
    async evaluateUploadedResume(resumeData) {
      // 模拟AI评测过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 基于简历内容进行智能分析
      const evaluation = this.performResumeEvaluation(resumeData);
      
      return evaluation;
    },
    
    // 执行简历评测分析
    performResumeEvaluation(resume) {
      let score = 60; // 基础分
      const strengths = [];
      const weaknesses = [];
      const suggestions = [];
      const details = {
        content: 60,
        format: 70,
        experience: 60,
        skills: 60
      };

      // 分析个人信息完整性
      const personalInfo = resume.personalInfo || {};
      if (personalInfo.name && personalInfo.phone && personalInfo.email) {
        score += 5;
        details.content += 10;
        strengths.push('个人联系信息完整');
      } else {
        weaknesses.push('个人联系信息不完整');
        suggestions.push('补充完整的个人联系信息');
      }

      // 分析教育背景
      const education = resume.education || [];
      if (education.length > 0) {
        score += 5;
        details.content += 5;
        strengths.push('具有教育背景信息');
        if (education.some(edu => edu.degree === '本科' || edu.degree === '硕士' || edu.degree === '博士')) {
          score += 3;
          strengths.push('教育背景良好');
        }
      } else {
        weaknesses.push('缺少教育背景信息');
        suggestions.push('添加教育经历');
      }

      // 分析工作经验
      const experience = resume.experience || [];
      if (experience.length > 0) {
        score += 10;
        details.experience += 20;
        strengths.push(`具有${experience.length}段工作经验`);
        if (experience.length >= 2) {
          score += 5;
          strengths.push('工作经验丰富');
        }
      } else {
        weaknesses.push('缺少工作经验');
        suggestions.push('添加相关工作或实习经历');
        details.experience = 40;
      }

      // 分析技能
      const skills = resume.skills || [];
      if (skills.length > 0) {
        score += 8;
        details.skills += 15;
        strengths.push(`掌握${skills.length}项技能`);
        
        const avgLevel = skills.reduce((sum, skill) => sum + (skill.level || 50), 0) / skills.length;
        if (avgLevel >= 80) {
          score += 5;
          strengths.push('技能水平较高');
        }
        
        if (skills.length >= 5) {
          score += 3;
          strengths.push('技能覆盖面广');
        }
      } else {
        weaknesses.push('缺少技能信息');
        suggestions.push('添加相关技能和熟练程度');
      }

      // 分析项目经历
      const projects = resume.projects || [];
      if (projects.length > 0) {
        score += 8;
        details.experience += 10;
        strengths.push(`参与${projects.length}个项目`);
        if (projects.some(proj => proj.role && proj.role.includes('负责人'))) {
          score += 3;
          strengths.push('具有项目管理经验');
        }
      } else {
        weaknesses.push('缺少项目经历');
        suggestions.push('添加项目经历展示实际能力');
      }

      // 分析职位意向
      const jobIntention = resume.jobIntention || {};
      if (jobIntention.position) {
        score += 3;
        details.content += 5;
        strengths.push('职位意向明确');
      } else {
        suggestions.push('明确职位意向');
      }

      // 确保分数在合理范围内
      score = Math.min(Math.max(score, 50), 95);
      
      // 调整详细分数
      Object.keys(details).forEach(key => {
        details[key] = Math.min(Math.max(details[key], 40), 95);
      });

      // 如果没有明显优势，添加基础优势
      if (strengths.length === 0) {
        strengths.push('简历基本信息完整');
      }

      // 如果没有明显不足，添加改进建议
      if (weaknesses.length === 0) {
        weaknesses.push('可进一步优化简历结构');
      }

      // 确保有改进建议
      if (suggestions.length === 0) {
        suggestions.push('持续完善简历内容');
      }

      return { 
        score, 
        strengths, 
        weaknesses, 
        suggestions, 
        details,
        note: '本评测基于文件内容分析生成'
      };
    },
    
    // 显示文件预览信息
    showFilePreview(file) {
      console.log('显示文件预览:', file.name)
      
      // 只显示基本文件信息，不预设内容
      this.parsedContent = {
        rawText: `文件已上传，等待解析...

文件名: ${file.name}
文件大小: ${this.formatFileSize(file.size)}
文件类型: ${file.type}
上传时间: ${new Date().toLocaleString()}

请点击"开始评测"按钮来解析文档内容。`,
        personalInfo: {
          name: '等待解析...',
          phone: '',
          email: ''
        },
        skills: [],
        experience: [],
        education: [],
        parseMethod: 'waiting'
      }
      
      console.log('文件预览内容设置完成:', this.parsedContent)
    },
    
    // 从文件名提取信息
    extractInfoFromFileName(fileName) {
      const info = { name: '', position: '' }
      
      // 常见职位关键词
      const positions = [
        '前端', '后端', '全栈', '开发', '工程师', 'Java', 'Python', 'JavaScript',
        '产品', '设计', '测试', '运维', '数据', '算法', 'AI', '人工智能'
      ]
      
      // 检查职位关键词
      for (const pos of positions) {
        if (fileName.includes(pos)) {
          info.position = pos + '工程师'
          break
        }
      }
      
      // 尝试提取中文姓名
      const nameMatch = fileName.match(/[\u4e00-\u9fa5]{2,4}/)
      if (nameMatch) {
        info.name = nameMatch[0]
      }
      
      return info
    },
    
    // 解析上传的文件
    async parseUploadedFile(file) {
      console.log('🔍 开始解析上传的文件:', file.name)
      
      // 先显示解析中状态
      this.parsedContent = {
        rawText: `正在解析文件，请稍候...

文件名: ${file.name}
文件大小: ${this.formatFileSize(file.size)}
文件类型: ${file.type}
解析状态: 进行中...`,
        personalInfo: {
          name: '解析中...',
          phone: '',
          email: ''
        },
        skills: [],
        experience: [],
        education: [],
        parseMethod: 'parsing'
      }
      
      try {
        const { aiAPI } = await import('@/services/api')
        const result = await aiAPI.parseFile(file)
        
        console.log('📄 文件解析完成:', result)
        
        if (result.data && result.data.parsedContent) {
          this.parsedContent = result.data.parsedContent
          console.log('✅ 解析内容已更新:', this.parsedContent)
        } else {
          throw new Error('解析结果格式异常')
        }
        
      } catch (error) {
        console.error('❌ 文件解析失败:', error)
        
        // 解析失败时显示错误信息和基本文件信息
        this.parsedContent = {
          rawText: `文件解析失败

文件名: ${file.name}
文件大小: ${this.formatFileSize(file.size)}
文件类型: ${file.type}
错误信息: ${error.message}

建议:
1. 检查文件格式是否正确（支持PDF、Word文档）
2. 确保文件没有损坏
3. 文件大小不超过10MB
4. 如果问题持续，请联系技术支持

注意: 即使解析失败，您仍然可以进行简历评测，系统会基于文件基本信息进行分析。`,
          personalInfo: {
            name: '解析失败',
            phone: '',
            email: ''
          },
          skills: [],
          experience: [],
          education: [],
          parseMethod: 'error'
        }
      }
    },
    
    // 根据职位获取相关技能
    getSkillsByPosition(position) {
      if (position.includes('前端')) {
        return [
          { name: 'JavaScript', level: 80 },
          { name: 'Vue.js', level: 75 },
          { name: 'React', level: 70 },
          { name: 'HTML/CSS', level: 85 }
        ]
      } else if (position.includes('后端')) {
        return [
          { name: 'Java', level: 80 },
          { name: 'Spring Boot', level: 75 },
          { name: 'MySQL', level: 70 },
          { name: 'Redis', level: 65 }
        ]
      }
      return [
        { name: 'JavaScript', level: 70 },
        { name: 'Java', level: 65 }
      ]
    },
    
    async startEvaluation() {
      // 检查评测模式
      if (!this.evaluationMode) {
        alert('请选择评测方式：选择已有简历或上传新文件')
        return
      }
      
      if (this.evaluationMode === 'select' && !this.selectedResume) {
        alert('请选择一个简历进行评测')
        return
      }
      
      if (this.evaluationMode === 'upload' && !this.uploadedFile) {
        alert('请上传简历文件')
        return
      }
      
      // 再次检查认证状态
      if (!this.checkAuth()) {
        return
      }
      
      this.loading = true
      
      try {
        const { aiAPI } = await import('@/services/api')
        let result;
        
        if (this.evaluationMode === 'select') {
          // 评测已选择的简历
          console.log('🎯 开始评测选中简历，ID:', this.selectedResume)
          console.log('📊 评测维度选项:', this.evaluationOptions)
          result = await aiAPI.evaluateResume(this.selectedResume, this.evaluationOptions)
        } else if (this.evaluationMode === 'upload') {
          // 评测上传的文件
          console.log('📁 开始评测上传文件:', this.uploadedFile.name)
          
          // 如果还没有解析内容，先解析文件
          if (!this.parsedContent) {
            console.log('⏳ 文件尚未解析，先进行解析...')
            await this.parseUploadedFile(this.uploadedFile)
          }
          
          // 创建临时简历对象用于评测
          const tempResume = {
            title: this.parsedContent?.title || this.uploadedFile.name,
            personalInfo: this.parsedContent?.personalInfo || {},
            jobIntention: this.parsedContent?.jobIntention || {},
            education: this.parsedContent?.education || [],
            experience: this.parsedContent?.experience || [],
            skills: this.parsedContent?.skills || [],
            projects: this.parsedContent?.projects || [],
            rawText: this.parsedContent?.rawText || ''
          }
          
          // 通过本地分析评测解析后的内容
          result = {
            success: true,
            data: await this.evaluateUploadedResume(tempResume)
          }
        }
        
        console.log('✅ 评测完成:', result)
        
        if (!result || !result.data) {
          throw new Error('评测结果为空，请重试')
        }
        
        // 将评测结果保存到localStorage，供结果页面使用
        const evaluationData = {
          ...result.data,
          evaluationMode: this.evaluationMode,
          sourceInfo: this.evaluationMode === 'select' 
            ? { type: 'database', resumeId: this.selectedResume, title: this.selectedResumeData?.title }
            : { type: 'upload', fileName: this.uploadedFile.name, fileSize: this.uploadedFile.size }
        }
        
        localStorage.setItem('evaluationResult', JSON.stringify(evaluationData))
        
        // 保存当前简历ID，用于保存结果功能
        if (this.evaluationMode === 'select' && this.selectedResume) {
          localStorage.setItem('currentEvaluationResumeId', this.selectedResume)
        } else {
          // 上传文件模式，清除简历ID
          localStorage.removeItem('currentEvaluationResumeId')
        }
        
        // 跳转到评测结果页面
        this.$router.push('/evaluation-result')
        
      } catch (error) {
        console.error('❌ 简历评测失败:', error)
        
        // 根据错误类型提供不同的提示
        let errorMessage = '评测失败，请重试'
        
        if (error.message.includes('token') || error.message.includes('认证')) {
          errorMessage = '登录已过期，请重新登录'
          this.$router.push('/login')
        } else if (error.message.includes('不存在') || error.message.includes('无权访问')) {
          errorMessage = '简历不存在或无权访问，请选择其他简历'
        } else if (error.message.includes('网络')) {
          errorMessage = '网络连接失败，请检查网络后重试'
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }
        
        alert(errorMessage)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.evaluation-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding-bottom: 40px;
}

.header {
  display: flex;
  align-items: center;
  padding: 20px;
  background: transparent;
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

.content {
  padding: 20px;
}

.intro-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  color: white;
}

.intro-icon {
  font-size: 48px;
  margin-right: 20px;
}

.intro-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.intro-desc {
  font-size: 14px;
  line-height: 1.5;
  opacity: 0.9;
}

.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.select-label {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.select-dropdown {
  position: relative;
}

.resume-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 10px 32px 10px 12px;
  font-size: 14px;
  color: #333 !important;
  cursor: pointer;
  min-width: 140px;
  font-family: inherit;
  line-height: 1.4;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 16px;
}

.resume-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.resume-select option {
  color: #333;
  background: white;
  padding: 8px 12px;
  font-size: 14px;
}

.selected-resume-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
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

.upload-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.upload-icon {
  margin-right: 16px;
  color: #666;
}

.upload-content {
  flex: 1;
}

.upload-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.upload-desc {
  font-size: 14px;
  color: #666;
}

.resume-selector {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.resume-option {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.resume-option:last-child {
  border-bottom: none;
}

.resume-option:hover {
  background: #f8f9fa;
}

.resume-option.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.option-icon {
  font-size: 24px;
  margin-right: 16px;
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.option-meta {
  font-size: 14px;
  color: #666;
}

.option-check {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2196f3;
}

.upload-area {
  background: white;
  border: 2px dashed #ddd;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.upload-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.upload-desc {
  font-size: 14px;
  color: #666;
}

.uploaded-file {
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  margin-top: 12px;
  border: 1px solid #e9ecef;
}

.file-icon {
  font-size: 24px;
  margin-right: 12px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.file-size {
  font-size: 12px;
  color: #666;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #f8f9fa;
  color: #666;
}

.evaluation-options {
  background: white;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.option-item:last-child {
  border-bottom: none;
}

.option-item input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 12px;
  position: relative;
  transition: all 0.3s ease;
}

.option-item input[type="checkbox"]:checked + .checkmark {
  background: #667eea;
  border-color: #667eea;
}

.option-item input[type="checkbox"]:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.option-info {
  flex: 1;
}

.option-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 14px;
  color: #666;
}

.action-section {
  padding-top: 20px;
}

.evaluate-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.evaluate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.evaluate-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 模式指示样式 */
.mode-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-left: 8px;
}

.mode-badge.active {
  background: #e8f5e8;
  color: #2e7d32;
  border: 1px solid #4caf50;
}

.mode-badge.disabled {
  background: #fff3e0;
  color: #f57c00;
  border: 1px solid #ff9800;
}

/* 禁用状态样式 */
.upload-card.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

.upload-card.disabled:hover {
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resume-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

/* 评测提示样式 */
.evaluation-hint {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #e3f2fd;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid #2196f3;
}

.hint-icon {
  font-size: 20px;
  margin-right: 12px;
}

.hint-text {
  flex: 1;
  font-size: 14px;
  color: #1565c0;
  line-height: 1.4;
}

/* 区块头部样式 */
.section-header {
  margin-bottom: 16px;
}

.section-header .section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
}

/* 当前选择状态样式 */
.current-selection {
  margin-bottom: 16px;
}

.selection-info {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.selection-icon {
  font-size: 24px;
  margin-right: 12px;
}

.selection-details {
  flex: 1;
}

.selection-title {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  margin-bottom: 2px;
}

.selection-name {
  font-size: 16px;
  font-weight: 600;
  color: #212529;
}

.reset-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #e9ecef;
  color: #495057;
}

/* 解析内容显示样式 */
.parsed-content-section {
  margin-top: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.parsed-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}


.parsed-text-container {
  margin-bottom: 20px;
}

.parsed-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.parsed-text-area {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  background: #fff;
  color: #333;
  resize: vertical;
  min-height: 120px;
}

.parsed-text-area:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.parsed-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.info-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e9ecef;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-card h5 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.info-content {
  font-size: 13px;
  color: #666;
}

.info-content p {
  margin: 0 0 6px 0;
  line-height: 1.4;
}

.info-content p:last-child {
  margin-bottom: 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.more-skills, .more-items {
  color: #999;
  font-style: italic;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .parsed-info-grid {
    grid-template-columns: 1fr;
  }
  
  .parsed-content-section {
    padding: 16px;
  }
  
  .parsed-text-area {
    font-size: 12px;
  }
}
</style>




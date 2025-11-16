<template>
  <div class="job-matching-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">职位匹配分析</h1>
    </div>
    
    <div class="content">
      <!-- 职位名称输入 -->
      <div class="section">
        <div class="input-row">
          <label class="input-label">职位名称</label>
          <input 
            type="text" 
            v-model="jobInfo.title" 
            placeholder="请输入职位名称" 
            class="job-input"
          />
        </div>
      </div>
      
      <!-- 职位描述输入 -->
      <div class="section">
        <textarea 
          v-model="jobInfo.description" 
          placeholder="请输入职位描述" 
          class="job-textarea"
        ></textarea>
      </div>
      
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
              <span class="label">{{ getResumeName(selectedResumeData) }}</span>
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
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileUpload" 
            accept=".pdf,.doc,.docx" 
            style="display: none;"
          />
          <div class="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
              rows="6"
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
          </div>
        </div>
      </div>
      
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
      
      <!-- 分析提示 -->
      <div v-if="!canAnalyze && !loading" class="analysis-hint">
        <div class="hint-icon">💡</div>
        <div class="hint-text">
          <div v-if="!jobInfo.title.trim() || !jobInfo.description.trim()">
            请填写完整的职位信息（职位名称和职位描述）
          </div>
          <div v-else-if="!evaluationMode">
            请选择一种分析方式：选择已有简历或上传新文件
          </div>
        </div>
      </div>
      
      <!-- 开始分析按钮 -->
      <button class="analysis-btn" @click="startAnalysis" :disabled="!canAnalyze || loading">
        <span v-if="loading" class="spinner"></span>
        {{ analysisButtonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobMatching',
  data() {
    return {
      loading: false,
      loadingResumes: true,
      selectedResume: '',
      uploadedFile: null,
      parsedContent: null, // 存储解析出的内容
      evaluationMode: '', // 'select' 或 'upload'，用于控制选择模式
      jobInfo: {
        title: '',
        description: ''
      },
      resumeList: []
    }
  },
  
  computed: {
    canAnalyze() {
      const hasJobInfo = this.jobInfo.title.trim() && this.jobInfo.description.trim();
      const hasValidSelection = (this.evaluationMode === 'select' && this.selectedResume) || 
                               (this.evaluationMode === 'upload' && this.uploadedFile);
      return hasJobInfo && hasValidSelection;
    },
    
    selectedResumeData() {
      if (!this.selectedResume || this.selectedResume === '' || this.evaluationMode !== 'select') return null
      return this.resumeList.find(resume => resume.id == this.selectedResume)
    },
    
    analysisButtonText() {
      if (this.loading) return '分析中...';
      if (this.evaluationMode === 'select') return '分析选中简历';
      if (this.evaluationMode === 'upload') return '分析上传文件';
      return '开始职位匹配分析';
    }
  },
  
  async mounted() {
    // 总是加载简历数据，不管是否登录
    await this.loadResumes()
    
    // 重置分析模式
    this.evaluationMode = ''
    this.selectedResume = ''
    this.uploadedFile = null
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
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
      // 切换到选择简历模式
      this.evaluationMode = 'select';
      this.selectedResume = resumeId;
      // 清空上传相关数据
      this.uploadedFile = null;
      this.parsedContent = null;
      console.log('🎯 切换到选择简历模式，简历ID:', resumeId);
    },
    
    triggerUpload() {
      this.$refs.fileInput.click()
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      // 检查文件类型
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        alert('请上传PDF或Word文档')
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
      console.log('🗑️ 清空上传文件，重置分析模式');
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
      localStorage.removeItem('currentMatchingResumeId');
      localStorage.removeItem('matchingAnalysisData');
      
      console.log('🔄 重置所有选择，回到初始状态，已清除localStorage数据');
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
    
    getResumeName(resume) {
      return resume?.personalInfo?.name || resume?.name || '未填写姓名'
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
    
    // 分析上传的简历文件
    async analyzeUploadedResume(resumeData, jobDescription, jobTitle) {
      // 模拟AI分析过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 基于简历内容进行智能分析
      const analysis = this.performJobMatching(resumeData, jobDescription, jobTitle);
      
      return analysis;
    },
    
    // 执行职位匹配分析
    performJobMatching(resume, jobDescription, jobTitle) {
      let matchingScore = 60; // 基础分
      const strengths = [];
      const gaps = [];
      const suggestions = [];
      const keywordMatches = [];
      
      // 分析技能匹配
      const skills = resume.skills || [];
      const jobDescLower = jobDescription.toLowerCase();
      const jobTitleLower = jobTitle.toLowerCase();
      
      // 检查技能关键词匹配
      const techKeywords = ['javascript', 'java', 'python', 'react', 'vue', 'node', 'html', 'css', 'sql', 'git'];
      let skillMatches = 0;
      
      skills.forEach(skill => {
        const skillName = skill.name?.toLowerCase() || '';
        if (jobDescLower.includes(skillName) || jobTitleLower.includes(skillName)) {
          matchingScore += 5;
          skillMatches++;
          keywordMatches.push(skill.name);
        }
        
        // 检查是否是热门技术
        if (techKeywords.includes(skillName)) {
          matchingScore += 2;
        }
      });
      
      if (skillMatches > 0) {
        strengths.push(`技能匹配度高，掌握${skillMatches}项相关技能`);
      } else {
        gaps.push('缺少职位要求的核心技能');
        suggestions.push('建议学习职位描述中提到的技术栈');
      }
      
      // 分析工作经验
      const experience = resume.experience || [];
      if (experience.length > 0) {
        matchingScore += 10;
        strengths.push(`具有${experience.length}段相关工作经验`);
        
        // 检查经验是否与职位相关
        const hasRelevantExp = experience.some(exp => {
          const position = exp.position?.toLowerCase() || '';
          const company = exp.company?.toLowerCase() || '';
          return jobTitleLower.includes(position) || 
                 jobDescLower.includes(position) ||
                 jobDescLower.includes(company);
        });
        
        if (hasRelevantExp) {
          matchingScore += 15;
          strengths.push('工作经验与目标职位高度相关');
        }
      } else {
        gaps.push('缺少相关工作经验');
        suggestions.push('可以通过实习或项目经历来弥补经验不足');
      }
      
      // 分析教育背景
      const education = resume.education || [];
      if (education.length > 0) {
        matchingScore += 5;
        
        const hasRelevantEducation = education.some(edu => {
          const major = edu.major?.toLowerCase() || '';
          return major.includes('计算机') || major.includes('软件') || 
                 major.includes('信息') || major.includes('电子');
        });
        
        if (hasRelevantEducation) {
          matchingScore += 10;
          strengths.push('教育背景与职位要求匹配');
        }
      }
      
      // 分析项目经历
      const projects = resume.projects || [];
      if (projects.length > 0) {
        matchingScore += 8;
        strengths.push(`具有${projects.length}个项目经验`);
        
        // 检查项目技术栈
        const projectTechs = projects.flatMap(proj => proj.technologies || []);
        const relevantTechs = projectTechs.filter(tech => 
          jobDescLower.includes(tech.toLowerCase())
        );
        
        if (relevantTechs.length > 0) {
          matchingScore += 10;
          strengths.push('项目经验使用了相关技术栈');
          keywordMatches.push(...relevantTechs);
        }
      } else {
        suggestions.push('建议添加相关项目经历来展示实际能力');
      }
      
      // 确保分数在合理范围内
      matchingScore = Math.min(Math.max(matchingScore, 40), 95);
      
      // 根据分数给出总体评价
      if (matchingScore >= 85) {
        strengths.unshift('整体匹配度很高，非常适合该职位');
      } else if (matchingScore >= 70) {
        strengths.unshift('整体匹配度良好，基本符合职位要求');
      } else if (matchingScore >= 60) {
        gaps.unshift('整体匹配度一般，需要进一步提升');
      } else {
        gaps.unshift('整体匹配度较低，建议加强相关技能');
      }
      
      // 确保有基本的建议
      if (suggestions.length === 0) {
        suggestions.push('持续学习和提升专业技能');
        suggestions.push('关注行业发展趋势');
      }
      
      // 去重关键词匹配
      const uniqueKeywords = [...new Set(keywordMatches)];
      
      // 生成详细的评分理由
      const reasons = [];
      let reasonId = 1;
      
      // 技能匹配评分理由
      if (skillMatches > 0) {
        reasons.push({
          id: reasonId++,
          type: 'positive',
          title: '技能匹配度高',
          description: `您掌握的${skillMatches}项技能与职位要求高度匹配，包括：${keywordMatches.slice(0, 3).join('、')}等`,
          score: skillMatches * 5
        });
      } else {
        reasons.push({
          id: reasonId++,
          type: 'negative',
          title: '技能匹配度不足',
          description: '简历中的技能与职位要求匹配度较低，建议补充相关技术技能',
          score: -10
        });
      }
      
      // 工作经验评分理由
      if (experience.length > 0) {
        const hasRelevantExp = experience.some(exp => {
          const position = exp.position?.toLowerCase() || '';
          return jobTitleLower.includes(position);
        });
        
        if (hasRelevantExp) {
          reasons.push({
            id: reasonId++,
            type: 'positive',
            title: '工作经验相关性强',
            description: `您的${experience.length}段工作经验与目标职位高度相关，具备实际工作基础`,
            score: 20
          });
        } else {
          reasons.push({
            id: reasonId++,
            type: 'neutral',
            title: '工作经验基本符合',
            description: `您有${experience.length}段工作经验，虽然与目标职位不完全匹配，但具备一定工作基础`,
            score: 10
          });
        }
      } else {
        reasons.push({
          id: reasonId++,
          type: 'negative',
          title: '缺少工作经验',
          description: '简历中缺少相关工作经验，这可能影响职位申请的竞争力',
          score: -15
        });
      }
      
      // 项目经验评分理由
      if (projects.length > 0) {
        reasons.push({
          id: reasonId++,
          type: 'positive',
          title: '项目经验丰富',
          description: `您参与了${projects.length}个项目，展现了实际的项目开发和团队协作能力`,
          score: 15
        });
      } else {
        reasons.push({
          id: reasonId++,
          type: 'neutral',
          title: '项目经验待补充',
          description: '建议在简历中添加项目经历，以更好地展示实际开发能力',
          score: 0
        });
      }
      
      // 生成结构化的改进建议
      const structuredSuggestions = [];
      let suggestionId = 1;
      
      if (skillMatches === 0) {
        structuredSuggestions.push({
          id: suggestionId++,
          priority: 'high',
          title: '学习职位相关技能',
          description: '根据职位描述，重点学习和掌握相关的技术栈和工具，提升技能匹配度'
        });
      }
      
      if (experience.length === 0) {
        structuredSuggestions.push({
          id: suggestionId++,
          priority: 'high',
          title: '积累相关工作经验',
          description: '通过实习、兼职或志愿项目等方式积累相关工作经验，增强简历竞争力'
        });
      }
      
      if (projects.length === 0) {
        structuredSuggestions.push({
          id: suggestionId++,
          priority: 'medium',
          title: '开发个人项目',
          description: '创建和完成一些个人项目，展示实际的开发能力和技术应用水平'
        });
      }
      
      // 如果没有高优先级建议，添加通用建议
      if (structuredSuggestions.length === 0) {
        structuredSuggestions.push({
          id: suggestionId++,
          priority: 'medium',
          title: '持续优化简历',
          description: '定期更新简历内容，突出与目标职位最相关的经验和技能'
        });
      }
      
      // 生成关注方向
      const focusAreas = [];
      if (skillMatches < 3) focusAreas.push('技能提升');
      if (experience.length < 2) focusAreas.push('经验积累');
      if (projects.length < 2) focusAreas.push('项目实践');
      focusAreas.push('行业认知', '职业规划');
      
      return {
        matchingScore,
        reasons,
        strengths,
        gaps,
        suggestions: structuredSuggestions,
        focusAreas,
        keywordMatches: uniqueKeywords,
        analysis: {
          skillsMatch: skillMatches,
          experienceCount: experience.length,
          projectCount: projects.length,
          educationRelevant: education.some(edu => 
            edu.major?.toLowerCase().includes('计算机') || 
            edu.major?.toLowerCase().includes('软件')
          )
        }
      };
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

注意: 即使解析失败，您仍然可以进行职位匹配分析，系统会基于文件基本信息进行分析。`,
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
    
    async startAnalysis() {
      // 检查分析模式
      if (!this.evaluationMode) {
        alert('请选择分析方式：选择已有简历或上传新文件')
        return
      }
      
      if (!this.jobInfo.title.trim() || !this.jobInfo.description.trim()) {
        alert('请填写完整的职位信息')
        return
      }
      
      // 验证职位描述长度
      if (this.jobInfo.description.trim().length < 10) {
        alert('职位描述至少需要10个字符')
        return
      }
      
      if (this.jobInfo.description.trim().length > 5000) {
        alert('职位描述不能超过5000个字符')
        return
      }
      
      // 验证职位标题长度
      if (this.jobInfo.title.trim().length > 100) {
        alert('职位标题不能超过100个字符')
        return
      }
      
      if (this.evaluationMode === 'select' && !this.selectedResume) {
        alert('请选择一个简历进行分析')
        return
      }
      
      if (this.evaluationMode === 'upload' && !this.uploadedFile) {
        alert('请上传简历文件')
        return
      }
      
      // 确保认证状态
      await this.ensureAuthenticated()
      
      this.loading = true
      
      try {
        let result;
        let resumeData;
        
        if (this.evaluationMode === 'select') {
          // 分析已选择的简历
          console.log('🎯 开始分析选中简历，ID:', this.selectedResume)
          
          // 验证选中的简历数据
          if (!this.selectedResumeData) {
            throw new Error('未找到选中的简历数据，请重新选择简历')
          }
          
          // 检查简历数据完整性
          const hasBasicInfo = this.selectedResumeData.personalInfo?.name ||
                              (this.selectedResumeData.skills && this.selectedResumeData.skills.length > 0) ||
                              (this.selectedResumeData.workExperience && this.selectedResumeData.workExperience.length > 0) ||
                              (this.selectedResumeData.experience && this.selectedResumeData.experience.length > 0)
          
          if (!hasBasicInfo) {
            console.warn('⚠️ 选中的简历数据不完整:', this.selectedResumeData)
            throw new Error('选中的简历信息不完整，无法进行有效的AI分析。请完善简历内容后再试。')
          }
          
          console.log('📊 准备分析的简历数据:', {
            id: this.selectedResumeData.id,
            title: this.selectedResumeData.title,
            hasPersonalInfo: !!this.selectedResumeData.personalInfo?.name,
            skillsCount: (this.selectedResumeData.skills || []).length,
            experienceCount: (this.selectedResumeData.workExperience || this.selectedResumeData.experience || []).length,
            educationCount: (this.selectedResumeData.education || []).length
          })
          
          try {
            const { aiAPI } = await import('@/services/api')
            result = await aiAPI.analyzeJobMatching({
              resumeId: parseInt(this.selectedResume),
              jobDescription: this.jobInfo.description,
              jobTitle: this.jobInfo.title
            })
            
            console.log('✅ AI分析完成:', result)
        console.log('📊 AI返回的数据结构:', {
          hasData: !!result.data,
          dataKeys: result.data ? Object.keys(result.data) : [],
          matchingScore: result.data?.matchingScore,
          reasonsCount: result.data?.reasons?.length || 0,
          suggestionsCount: result.data?.suggestions?.length || 0,
          strengthsCount: result.data?.strengths?.length || 0,
          gapsCount: result.data?.gaps?.length || 0,
          focusAreasCount: result.data?.focusAreas?.length || 0
        })
            
          } catch (apiError) {
            console.error('❌ AI分析API调用失败:', apiError)
            
            // 提供更详细的错误信息
            if (apiError.message.includes('timeout') || apiError.message.includes('超时')) {
              throw new Error('AI分析超时，请稍后重试。如果问题持续，请联系技术支持。')
            } else if (apiError.message.includes('503') || apiError.message.includes('不可用')) {
              throw new Error('AI服务暂时不可用，请稍后重试。')
            } else if (apiError.message.includes('404') || apiError.message.includes('不存在')) {
              throw new Error('简历数据不存在，请重新选择简历。')
            } else {
              throw new Error('AI分析失败：' + apiError.message)
            }
          }
          
          resumeData = this.selectedResumeData
        } else if (this.evaluationMode === 'upload') {
          // 分析上传的文件
          console.log('📁 开始分析上传文件:', this.uploadedFile.name)
          
          // 如果还没有解析内容，先解析文件
          if (!this.parsedContent) {
            console.log('⏳ 文件尚未解析，先进行解析...')
            await this.parseUploadedFile(this.uploadedFile)
          }
          
          // 检查解析是否成功
          if (this.parsedContent?.parseMethod === 'error') {
            throw new Error('文件解析失败，无法进行AI分析。请检查文件格式是否正确，或尝试上传其他文件。')
          }
          
          // 检查解析内容是否足够进行分析
          const hasBasicInfo = this.parsedContent?.rawText || 
                              this.parsedContent?.personalInfo?.name ||
                              (this.parsedContent?.skills && this.parsedContent.skills.length > 0) ||
                              (this.parsedContent?.experience && this.parsedContent.experience.length > 0)
          
          if (!hasBasicInfo) {
            throw new Error('文件内容解析不完整，无法进行有效的AI分析。请确保文件包含完整的简历信息。')
          }
          
          // 创建临时简历对象用于分析
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
          
          console.log('📊 准备分析的简历数据:', {
            title: tempResume.title,
            hasPersonalInfo: Object.keys(tempResume.personalInfo).length > 0,
            skillsCount: tempResume.skills.length,
            experienceCount: tempResume.experience.length,
            educationCount: tempResume.education.length,
            hasRawText: !!tempResume.rawText
          })
          
          // 调用专门的上传文件AI分析API
          const { aiAPI } = await import('@/services/api')
          result = await aiAPI.analyzeJobMatchingUpload({
            resumeData: tempResume,
            jobDescription: this.jobInfo.description,
            jobTitle: this.jobInfo.title
          })
          
          resumeData = {
            title: tempResume.title,
            personalInfo: tempResume.personalInfo,
            source: 'upload'
          }
        }
        
        console.log('✅ 职位匹配分析完成:', result)
        
        if (!result || !result.data) {
          throw new Error('分析结果为空，请重试')
        }
        
        // 保存分析数据到localStorage，供结果页面使用
        const analysisData = {
          // 首先展开AI返回的所有数据
          ...result.data,
          // 然后添加页面特定的数据（这些会覆盖同名字段）
          jobInfo: this.jobInfo,
          resumeData: resumeData,
          analysisMode: this.evaluationMode,
          sourceInfo: this.evaluationMode === 'select' 
            ? { type: 'database', resumeId: this.selectedResume }
            : { type: 'upload', fileName: this.uploadedFile.name, fileSize: this.uploadedFile.size },
          timestamp: new Date().toISOString()
        }
        
        console.log('💾 准备保存到localStorage的数据:', {
          hasReasons: !!analysisData.reasons,
          reasonsCount: analysisData.reasons?.length || 0,
          hasSuggestions: !!analysisData.suggestions,
          suggestionsCount: analysisData.suggestions?.length || 0,
          hasStrengths: !!analysisData.strengths,
          strengthsCount: analysisData.strengths?.length || 0,
          hasGaps: !!analysisData.gaps,
          gapsCount: analysisData.gaps?.length || 0,
          hasFocusAreas: !!analysisData.focusAreas,
          focusAreasCount: analysisData.focusAreas?.length || 0,
          dataKeys: Object.keys(analysisData)
        })
        
        // 检查关键数据是否存在
        if (!analysisData.reasons || analysisData.reasons.length === 0) {
          console.warn('⚠️ 警告：reasons数据缺失或为空')
        } else {
          console.log('✅ reasons数据正常:', analysisData.reasons.map(r => r.title))
        }
        
        if (!analysisData.suggestions || analysisData.suggestions.length === 0) {
          console.warn('⚠️ 警告：suggestions数据缺失或为空')
        } else {
          console.log('✅ suggestions数据正常:', analysisData.suggestions.map(s => s.title))
        }
        
        localStorage.setItem('matchingAnalysisData', JSON.stringify(analysisData))
        
        console.log('✅ 数据已保存到localStorage')
        
        // 立即验证保存的数据
        const savedData = localStorage.getItem('matchingAnalysisData')
        if (savedData) {
          try {
            const parsed = JSON.parse(savedData)
            console.log('🔍 验证保存的数据:', {
              reasonsCount: parsed.reasons?.length || 0,
              suggestionsCount: parsed.suggestions?.length || 0,
              strengthsCount: parsed.strengths?.length || 0,
              gapsCount: parsed.gaps?.length || 0
            })
          } catch (e) {
            console.error('❌ 保存的数据格式错误:', e)
          }
        }
        
        // 保存当前简历ID，用于保存结果功能
        if (this.evaluationMode === 'select' && this.selectedResume) {
          localStorage.setItem('currentMatchingResumeId', this.selectedResume)
        } else {
          // 上传文件模式，清除简历ID
          localStorage.removeItem('currentMatchingResumeId')
        }
        
        // 跳转到匹配结果页面
        this.$router.push('/matching-result')
        
      } catch (error) {
        console.error('❌ 职位匹配分析失败:', error)
        
        let errorMessage = '分析失败，请重试'
        
        if (error.message.includes('token') || error.message.includes('认证')) {
          errorMessage = '登录已过期，请重新登录'
          this.$router.push('/login')
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
.job-matching-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  padding-bottom: 120px;
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

.section {
  margin-bottom: 20px;
}


/* 职位名称输入样式 */
.input-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.input-label {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  min-width: 80px;
}

.job-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  font-size: 14px;
  background: white;
  outline: none;
}

.job-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 职位描述输入样式 */
.job-textarea {
  width: 100%;
  min-height: 120px;
  padding: 16px;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  resize: vertical;
  outline: none;
  font-family: inherit;
}

.job-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 选择简历样式 */
.select-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.select-label {
  font-size: 16px;
  font-weight: 500;
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

/* 简历预览卡片样式 */
.selected-resume-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-top: 16px;
  border: 1px solid #e9ecef;
}

.resume-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.resume-icon {
  width: 48px;
  height: 48px;
  background: #f8f9fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  color: #667eea;
}

.resume-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.resume-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.info-row .label {
  font-weight: 500;
  color: #333;
}

.info-row .value {
  color: #666;
}

.info-row svg {
  color: #999;
  flex-shrink: 0;
}

/* 上传简历样式 */
.upload-card {
  background: white;
  border: 2px dashed #e1e5e9;
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-card:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-icon {
  color: #999;
  margin-bottom: 16px;
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

/* 分析按钮样式 */
.analysis-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
}

.analysis-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
}

.analysis-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
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
  box-shadow: none;
  border-color: #e1e5e9;
}

.resume-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

/* 区块头部样式 */
.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
}

/* 上传文件显示样式 */
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e9ecef;
}

.info-card h5 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.info-content p {
  margin: 0 0 8px 0;
  font-size: 13px;
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
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.more-skills, .more-items {
  color: #666;
  font-style: italic;
  font-size: 12px;
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

/* 分析提示样式 */
.analysis-hint {
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

/* 响应式设计 */
@media (max-width: 768px) {
  .input-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .input-label {
    min-width: auto;
  }
  
  .select-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .resume-select {
    width: 100%;
  }
}
</style>




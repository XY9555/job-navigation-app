<template>
  <div class="result-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">评测结果</h1>
    </div>
    
    <div class="content" v-if="evaluationData">
      <!-- 成功消息 -->
      <div v-if="showSuccess" class="message success-message">
        {{ successMessage }}
      </div>
      
      <!-- 错误消息 -->
      <div v-if="showError" class="message error-message">
        {{ errorMessage }}
      </div>
      
      <div class="score-card">
        <div class="score-circle">
          <div class="score-number">{{ evaluationData.score || 0 }}</div>
          <div class="score-text">分</div>
        </div>
        <div class="score-desc">{{ getScoreDescription(evaluationData.score) }}</div>
      </div>
      
      <!-- 优势展示 -->
      <div class="strengths-section" v-if="evaluationData.strengths && evaluationData.strengths.length > 0">
        <h3 class="section-title">✅ 简历优势</h3>
        <div class="strength-item" v-for="(strength, index) in evaluationData.strengths" :key="index">
          <div class="strength-icon">👍</div>
          <div class="strength-text">{{ strength }}</div>
        </div>
      </div>
      
      <!-- 不足之处 -->
      <div class="weaknesses-section" v-if="evaluationData.weaknesses && evaluationData.weaknesses.length > 0">
        <h3 class="section-title">⚠️ 需要改进</h3>
        <div class="weakness-item" v-for="(weakness, index) in evaluationData.weaknesses" :key="index">
          <div class="weakness-icon">⚡</div>
          <div class="weakness-text">{{ weakness }}</div>
        </div>
      </div>
      
      <!-- 详细评分 -->
      <div class="details-section" v-if="evaluationData.details">
        <h3 class="section-title">📊 详细评分</h3>
        <div class="detail-items">
          <div 
            v-for="(score, key) in evaluationData.details" 
            :key="key"
            class="detail-item"
          >
            <div class="detail-info">
              <div class="detail-name">{{ getDetailName(key) }}</div>
              <div class="detail-score" :class="getScoreClass(score)">{{ score }} 分</div>
            </div>
            <div class="detail-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :class="getScoreClass(score)"
                  :style="{ width: score + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 改进建议 -->
      <div class="suggestions-section" v-if="evaluationData.suggestions && evaluationData.suggestions.length > 0">
        <h3 class="section-title">💡 优化建议</h3>
        <div class="suggestion-item" v-for="(suggestion, index) in evaluationData.suggestions" :key="index">
          <div class="suggestion-icon">💡</div>
          <div class="suggestion-text">{{ suggestion }}</div>
        </div>
      </div>
      
      <div class="action-buttons">
        <button class="btn-secondary" @click="reEvaluate">重新评测</button>
        <button class="btn-primary" @click="saveResult" :disabled="saving">
          <span v-if="saving">生成中...</span>
          <span v-else>📄 生成Word报告</span>
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div class="loading-container" v-else>
      <div class="loading-spinner"></div>
      <div class="loading-text">正在加载评测结果...</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EvaluationResult',
  data() {
    return {
      evaluationData: null,
      successMessage: '',
      errorMessage: '',
      showSuccess: false,
      showError: false,
      saving: false
    }
  },
  
  mounted() {
    this.loadEvaluationResult()
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    loadEvaluationResult() {
      console.log('📥 加载评测结果...')
      // 从localStorage获取评测结果
      const result = localStorage.getItem('evaluationResult')
      console.log('📦 localStorage中的评测结果:', result)
      
      if (result) {
        try {
          this.evaluationData = JSON.parse(result)
          console.log('✅ 评测结果解析成功:', this.evaluationData)
        } catch (error) {
          console.error('❌ 解析评测结果失败:', error)
          this.evaluationData = this.getDefaultResult()
        }
      } else {
        // 如果没有评测结果，使用默认数据
        console.log('⚠️ 没有找到评测结果，使用默认数据')
        this.evaluationData = this.getDefaultResult()
      }
    },

    // 重新评测
    reEvaluate() {
      // 返回到简历评测页面
      this.$router.push('/resume-evaluation')
    },

    // 保存结果
    async saveResult() {
      console.log('🔄 开始保存评测结果...')
      
      if (this.saving) {
        console.log('⏳ 正在保存中，请勿重复点击')
        return
      }
      
      this.saving = true
      
      try {
        // 检查是否有评测结果
        if (!this.evaluationData) {
          console.error('❌ 没有评测结果数据')
          alert('没有可保存的评测结果')
          return
        }
        
        console.log('📊 评测结果数据:', this.evaluationData)

        // 获取当前简历ID（从localStorage或路由参数）
        const resumeId = localStorage.getItem('currentEvaluationResumeId')
        console.log('📋 当前简历ID:', resumeId)
        
        // 生成并下载Word文档
        try {
          const { resumeAPI } = await import('@/services/api')
          
          // 准备源信息
          const sourceInfo = {
            type: this.evaluationData.evaluationMode || 'unknown',
            resumeId: resumeId || null,
            fileName: this.evaluationData.sourceInfo?.fileName || null,
            timestamp: new Date().toISOString()
          }
          
          console.log('📄 生成评测结果Word文档...', { sourceInfo })
          
          // 检查用户token
          const token = localStorage.getItem('userToken')
          console.log('🔑 用户token存在:', !!token)
          
          const response = await resumeAPI.downloadEvaluationReport(this.evaluationData, sourceInfo)
          console.log('📡 下载响应:', response)

          if (response.success) {
            this.showSuccessMessage(`✅ 评测报告已生成并下载：${response.filename}`)
            console.log('✅ Word文档下载成功:', response.filename)
          } else {
            throw new Error('下载失败')
          }
        } catch (error) {
          console.error('❌ 生成Word文档失败:', error)
          // 如果生成Word文档失败，降级到本地保存
          console.log('🔄 降级到本地保存...')
          this.saveToLocalStorage()
        }

      } catch (error) {
        console.error('保存评测结果失败:', error)
        this.showErrorMessage('保存失败：' + error.message)
      } finally {
        this.saving = false
      }
    },

    // 保存到本地存储
    saveToLocalStorage() {
      try {
        console.log('💽 开始保存到本地存储...')
        
        // 保存到本地历史记录
        let savedResults = JSON.parse(localStorage.getItem('savedEvaluationResults') || '[]')
        
        const resultData = {
          ...this.evaluationData,
          savedAt: new Date().toISOString(),
          id: Date.now(), // 使用时间戳作为ID
          source: this.evaluationData.evaluationMode || 'unknown',
          title: `评测结果 - ${new Date().toLocaleString()}`
        }
        
        savedResults.unshift(resultData)
        
        // 只保留最近20个结果
        if (savedResults.length > 20) {
          savedResults = savedResults.slice(0, 20)
        }
        
        localStorage.setItem('savedEvaluationResults', JSON.stringify(savedResults))
        console.log('✅ 本地保存成功，共保存', savedResults.length, '个结果')
        this.showSuccessMessage('✅ 评测结果已保存到本地历史记录')
      } catch (error) {
        console.error('❌ 保存到本地失败:', error)
        this.showErrorMessage('保存失败：' + error.message)
      }
    },

    // 生成结果标题
    generateResultTitle() {
      const now = new Date()
      const dateStr = now.toLocaleDateString('zh-CN')
      const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false })
      
      if (this.evaluationData.evaluationMode === 'select') {
        return `简历评测结果 - ${dateStr} ${timeStr}`
      } else if (this.evaluationData.evaluationMode === 'upload') {
        const fileName = this.evaluationData.sourceInfo?.fileName || '上传文件'
        return `文件评测结果 - ${fileName} - ${dateStr} ${timeStr}`
      } else {
        return `评测结果 - ${dateStr} ${timeStr}`
      }
    },

    // 显示成功消息
    showSuccessMessage(message) {
      this.successMessage = message
      this.showSuccess = true
      setTimeout(() => {
        this.showSuccess = false
        this.successMessage = ''
      }, 3000)
    },

    // 显示错误消息
    showErrorMessage(message) {
      this.errorMessage = message
      this.showError = true
      setTimeout(() => {
        this.showError = false
        this.errorMessage = ''
      }, 5000)
    },
    
    getDefaultResult() {
      return {
        score: 75,
        strengths: ['基本信息完整', '格式规范'],
        weaknesses: ['需要更多细节描述'],
        suggestions: ['丰富工作经历描述', '添加量化成果']
      }
    },
    
    getScoreDescription(score) {
      if (score >= 90) return '您的简历质量优秀！'
      if (score >= 80) return '您的简历质量良好，还有提升空间'
      if (score >= 70) return '您的简历基本合格，建议进一步优化'
      if (score >= 60) return '您的简历需要较大改进'
      return '您的简历需要全面优化'
    },

    // 获取详细评分项目名称
    getDetailName(key) {
      const nameMap = {
        content: '内容完整性',
        format: '格式规范性',
        experience: '经验描述',
        skills: '技能展示',
        keywords: '关键词匹配',
        projects: '项目经历'
      }
      return nameMap[key] || key
    },

    // 获取分数对应的样式类
    getScoreClass(score) {
      if (score >= 80) return 'excellent'
      if (score >= 70) return 'good'
      if (score >= 60) return 'average'
      return 'poor'
    }
  }
}
</script>

<style scoped>
.result-container {
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

.message {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

.success-message {
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  color: #0c4a6e;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #ef4444;
  color: #991b1b;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  color: white;
  margin-bottom: 24px;
}

.score-circle {
  display: inline-flex;
  align-items: baseline;
  margin-bottom: 16px;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
}

.score-text {
  font-size: 20px;
  margin-left: 4px;
}

.score-desc {
  font-size: 16px;
  opacity: 0.9;
}

.analysis-section, .suggestions-section, .details-section, .strengths-section, .weaknesses-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

/* 优势部分样式 */
.strengths-section {
  background: white;
}

.strength-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.strength-item:last-child {
  margin-bottom: 0;
}

.strength-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.strength-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

/* 不足部分样式 */
.weaknesses-section {
  background: white;
}

.weakness-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.weakness-item:last-child {
  margin-bottom: 0;
}

.weakness-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.weakness-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.analysis-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.analysis-item:last-child {
  border-bottom: none;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.analysis-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.analysis-score {
  font-size: 14px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
}

.analysis-score.excellent {
  background: #d4edda;
  color: #155724;
}

.analysis-score.good {
  background: #cce5ff;
  color: #004085;
}

.analysis-score.average {
  background: #fff3cd;
  color: #856404;
}

.analysis-desc {
  font-size: 14px;
  color: #666;
}

/* 建议部分样式 */
.suggestions-section {
  background: white;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 12px;
}

.suggestion-item:last-child {
  margin-bottom: 0;
}

.suggestion-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.suggestion-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.btn-primary, .btn-secondary {
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

/* 详细评分样式 */
.details-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.detail-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #e9ecef;
}

.detail-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.detail-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.detail-score {
  font-size: 18px;
  font-weight: 600;
}

.detail-score.excellent {
  color: #28a745;
}

.detail-score.good {
  color: #17a2b8;
}

.detail-score.average {
  color: #ffc107;
}

.detail-score.poor {
  color: #dc3545;
}

.detail-progress {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.progress-fill.excellent {
  background: linear-gradient(90deg, #28a745, #20c997);
}

.progress-fill.good {
  background: linear-gradient(90deg, #17a2b8, #20c997);
}

.progress-fill.average {
  background: linear-gradient(90deg, #ffc107, #fd7e14);
}

.progress-fill.poor {
  background: linear-gradient(90deg, #dc3545, #e74c3c);
}

/* 为详细评分项添加不同的左边框颜色 */
.detail-item:nth-child(1) {
  border-left-color: #28a745;
}

.detail-item:nth-child(2) {
  border-left-color: #17a2b8;
}

.detail-item:nth-child(3) {
  border-left-color: #ffc107;
}

.detail-item:nth-child(4) {
  border-left-color: #dc3545;
}

.detail-item:nth-child(5) {
  border-left-color: #6f42c1;
}

.detail-item:nth-child(6) {
  border-left-color: #e83e8c;
}

.btn-secondary {
  background: white;
  color: #333;
  border: 1px solid #e9ecef;
}
</style>




<template>
  <div class="matching-result-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">职位匹配分析结果</h1>
    </div>
    
    <div class="content">
      <!-- 匹配度总览 -->
      <div class="score-card">
        <div class="score-header">
          <div class="score-title">综合匹配度</div>
          <div class="score-circle">
            <div class="score-number">{{ analysisData.matchingScore }}%</div>
            <div class="score-level">{{ getScoreLevel(analysisData.matchingScore) }}</div>
          </div>
        </div>
        <div class="score-progress">
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: analysisData.matchingScore + '%' }"
              :class="getScoreClass(analysisData.matchingScore)"
            ></div>
          </div>
        </div>
      </div>

      <!-- 职位信息 -->
      <div class="job-info-card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          分析职位
        </div>
        <div class="job-details">
          <div class="job-title">{{ analysisData.jobInfo.title }}</div>
          <div class="job-description">{{ analysisData.jobInfo.description }}</div>
        </div>
      </div>

      <!-- 评分理由 -->
      <div class="analysis-card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 11H3m6 0a3 3 0 106 0m-6 0a3 3 0 016 0M9 7h.01M9 15h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2"/>
          </svg>
          匹配度分析
        </div>
        <div class="reason-list">
          <div v-for="reason in analysisData.reasons" :key="reason.id" class="reason-item">
            <div class="reason-icon" :class="reason.type">
              <svg v-if="reason.type === 'positive'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else-if="reason.type === 'negative'" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="reason-content">
              <div class="reason-title">{{ reason.title }}</div>
              <div class="reason-desc">{{ reason.description }}</div>
            </div>
            <div class="reason-score">{{ reason.score }}分</div>
          </div>
        </div>
      </div>

      <!-- 改进建议 -->
      <div class="suggestions-card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          改进建议
        </div>
        <div class="suggestion-list">
          <div v-for="suggestion in analysisData.suggestions" :key="suggestion.id" class="suggestion-item">
            <div class="suggestion-priority" :class="suggestion.priority">
              {{ getPriorityText(suggestion.priority) }}
            </div>
            <div class="suggestion-content">
              <div class="suggestion-title">{{ suggestion.title }}</div>
              <div class="suggestion-desc">{{ suggestion.description }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 匹配优势 -->
      <div class="strengths-card" v-if="analysisData.strengths && analysisData.strengths.length > 0">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          匹配优势
        </div>
        <div class="strength-list">
          <div v-for="(strength, index) in analysisData.strengths" :key="index" class="strength-item">
            <div class="strength-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="strength-text">{{ strength }}</div>
          </div>
        </div>
      </div>

      <!-- 不足之处 -->
      <div class="gaps-card" v-if="analysisData.gaps && analysisData.gaps.length > 0">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          不足之处
        </div>
        <div class="gap-list">
          <div v-for="(gap, index) in analysisData.gaps" :key="index" class="gap-item">
            <div class="gap-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div class="gap-text">{{ gap }}</div>
          </div>
        </div>
      </div>

      <!-- 关注方向 -->
      <div class="focus-card">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" stroke="currentColor" stroke-width="2"/>
          </svg>
          关注方向
        </div>
        <div class="focus-tags">
          <div v-for="focus in analysisData.focusAreas" :key="focus" class="focus-tag">
            {{ focus }}
          </div>
        </div>
      </div>

      <!-- 关键词匹配 -->
      <div class="keywords-card" v-if="analysisData.keywordMatches && analysisData.keywordMatches.length > 0">
        <div class="card-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          关键词匹配
        </div>
        <div class="keyword-tags">
          <div v-for="keyword in analysisData.keywordMatches" :key="keyword" class="keyword-tag">
            {{ keyword }}
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn secondary" @click="reAnalyze">
          重新分析
        </button>
        <button class="action-btn primary" @click="saveResult" :disabled="saving">
          <span v-if="saving">生成中...</span>
          <span v-else>📄 生成Word报告</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MatchingResult',
  data() {
    return {
      saving: false,
      analysisData: {
        matchingScore: 75,
        jobInfo: {
          title: '职位匹配分析',
          description: '正在加载分析数据...'
        },
        resumeData: {
          name: '加载中...'
        },
        reasons: [],
        suggestions: [],
        focusAreas: [],
        strengths: [],
        gaps: [],
        keywordMatches: []
      }
    }
  },
  
  mounted() {
    // 从localStorage获取分析数据
    const savedData = localStorage.getItem('matchingAnalysisData')
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        console.log('📊 加载匹配分析数据:', data)
        console.log('🔍 原始数据字段检查:', {
          hasReasons: !!data.reasons,
          reasonsType: Array.isArray(data.reasons) ? 'array' : typeof data.reasons,
          reasonsLength: data.reasons?.length || 0,
          hasSuggestions: !!data.suggestions,
          suggestionsType: Array.isArray(data.suggestions) ? 'array' : typeof data.suggestions,
          suggestionsLength: data.suggestions?.length || 0,
          hasStrengths: !!data.strengths,
          strengthsLength: data.strengths?.length || 0,
          hasGaps: !!data.gaps,
          gapsLength: data.gaps?.length || 0
        })
        
        // 使用真实的AI分析结果
        this.analysisData = {
          matchingScore: data.matchingScore || 75,
          jobInfo: data.jobInfo || {
            title: '未知职位',
            description: '暂无职位描述'
          },
          resumeData: data.resumeData || {
            name: '未知候选人'
          },
          analysisMode: data.analysisMode,
          sourceInfo: data.sourceInfo,
          // 优先使用AI返回的详细分析结果，只有在完全缺失时才使用默认数据
          reasons: data.reasons || this.getDefaultReasons(),
          suggestions: data.suggestions || this.getDefaultSuggestions(),
          focusAreas: data.focusAreas || this.getDefaultFocusAreas(),
          strengths: data.strengths || [],
          gaps: data.gaps || [],
          keywordMatches: data.keywordMatches || [],
          timestamp: data.timestamp
        }
        
        // 检查是否使用了默认数据
        const isUsingDefaultReasons = this.isDefaultReasons(this.analysisData.reasons)
        const isUsingDefaultSuggestions = this.isDefaultSuggestions(this.analysisData.suggestions)
        
        console.log('✅ 分析数据加载完成:', {
          score: this.analysisData.matchingScore,
          reasonsCount: this.analysisData.reasons?.length || 0,
          suggestionsCount: this.analysisData.suggestions?.length || 0,
          focusAreasCount: this.analysisData.focusAreas?.length || 0,
          strengthsCount: this.analysisData.strengths?.length || 0,
          gapsCount: this.analysisData.gaps?.length || 0,
          keywordMatchesCount: this.analysisData.keywordMatches?.length || 0,
          reasonsSource: isUsingDefaultReasons ? '❌ 使用默认数据' : '✅ AI生成数据',
          suggestionsSource: isUsingDefaultSuggestions ? '❌ 使用默认数据' : '✅ AI生成数据',
          dataQuality: (!isUsingDefaultReasons && !isUsingDefaultSuggestions) ? '✅ 高质量AI数据' : '⚠️ 包含默认数据'
        })
        
        // 详细检查AI数据的内容
        if (data.reasons && Array.isArray(data.reasons) && data.reasons.length > 0 && !isUsingDefaultReasons) {
          console.log('📋 AI生成的评分理由:', data.reasons.map(r => `[${r.type}] ${r.title} (${r.score}分)`))
        }
        if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0 && !isUsingDefaultSuggestions) {
          console.log('💡 AI生成的改进建议:', data.suggestions.map(s => `[${s.priority}] ${s.title}`))
        }
        if (data.focusAreas && Array.isArray(data.focusAreas) && data.focusAreas.length > 0) {
          console.log('🎯 AI生成的关注方向:', data.focusAreas)
        }
        if (data.strengths && Array.isArray(data.strengths) && data.strengths.length > 0) {
          console.log('💪 AI生成的匹配优势:', data.strengths)
        }
        if (data.gaps && Array.isArray(data.gaps) && data.gaps.length > 0) {
          console.log('⚠️ AI生成的能力差距:', data.gaps)
        }
        
        // 如果检测到默认数据，给出警告和建议
        if (isUsingDefaultReasons || isUsingDefaultSuggestions) {
          console.warn('⚠️ 检测到默认数据，可能的原因：')
          console.warn('1. AI服务调用失败或超时')
          console.warn('2. 数据传递过程中丢失')
          console.warn('3. localStorage中的数据不完整')
          console.warn('建议：重新进行职位匹配分析')
        }
      } catch (error) {
        console.error('❌ 解析分析数据失败:', error)
        this.loadDefaultData()
      }
    } else {
      console.warn('⚠️ 未找到匹配分析数据，加载默认数据')
      this.loadDefaultData()
    }
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    getScoreLevel(score) {
      if (score >= 90) return '优秀匹配'
      if (score >= 80) return '良好匹配'
      if (score >= 70) return '一般匹配'
      return '匹配度较低'
    },
    
    getScoreClass(score) {
      if (score >= 90) return 'excellent'
      if (score >= 80) return 'good'
      if (score >= 70) return 'average'
      return 'low'
    },
    
    getPriorityText(priority) {
      const priorityMap = {
        'high': '高优先级',
        'medium': '中优先级',
        'low': '低优先级'
      }
      return priorityMap[priority] || '一般'
    },
    
    // 检测是否是默认的评分理由
    isDefaultReasons(reasons) {
      if (!reasons || !Array.isArray(reasons) || reasons.length === 0) return true
      if (reasons.length === 1 && reasons[0].title && reasons[0].title.includes('数据不完整')) return true
      return false
    },
    
    // 检测是否是默认的改进建议
    isDefaultSuggestions(suggestions) {
      if (!suggestions || !Array.isArray(suggestions) || suggestions.length === 0) return true
      if (suggestions.length === 1 && suggestions[0].title && suggestions[0].title.includes('重新进行分析')) return true
      return false
    },
    
    // 加载默认数据
    loadDefaultData() {
      this.analysisData = {
        matchingScore: 75,
        jobInfo: {
          title: '职位匹配分析',
          description: '未找到分析数据，请重新进行分析'
        },
        resumeData: {
          name: '候选人'
        },
        reasons: this.getDefaultReasons(),
        suggestions: this.getDefaultSuggestions(),
        focusAreas: this.getDefaultFocusAreas(),
        strengths: ['基础信息完整'],
        gaps: ['缺少详细分析数据'],
        keywordMatches: []
      }
    },

    // 获取默认评分理由
    getDefaultReasons() {
      return [
        {
          id: 1,
          type: 'neutral',
          title: '数据不完整',
          description: '未找到详细的分析数据，建议重新进行职位匹配分析',
          score: 0
        }
      ]
    },

    // 获取默认改进建议
    getDefaultSuggestions() {
      return [
        {
          id: 1,
          priority: 'high',
          title: '重新进行分析',
          description: '请返回职位匹配分析页面，重新进行详细的匹配分析'
        }
      ]
    },

    // 获取默认关注方向
    getDefaultFocusAreas() {
      return ['重新分析', '数据完善']
    },
    
    reAnalyze() {
      this.$router.push('/job-matching')
    },
    
    async saveResult() {
      console.log('🔄 开始保存匹配分析结果...')
      
      if (this.saving) {
        console.log('⏳ 正在保存中，请勿重复点击')
        return
      }
      
      this.saving = true
      
      try {
        // 获取当前简历ID（从localStorage）
        const resumeId = localStorage.getItem('currentMatchingResumeId')
        console.log('📋 当前简历ID:', resumeId)
        console.log('📊 分析结果数据:', this.analysisData)
        
        // 生成并下载Word文档
        try {
          const { resumeAPI } = await import('@/services/api')
          
          // 准备源信息
          const sourceInfo = {
            type: this.analysisData.analysisMode || 'unknown',
            resumeId: resumeId || null,
            fileName: this.analysisData.sourceInfo?.fileName || null,
            timestamp: new Date().toISOString()
          }
          
          console.log('📄 生成匹配分析Word文档...', { sourceInfo })
          
          const response = await resumeAPI.downloadMatchingReport(this.analysisData, sourceInfo)

          if (response.success) {
            this.showSuccessMessage(`✅ 匹配分析报告已生成并下载：${response.filename}`)
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
        console.error('保存匹配分析结果失败:', error)
        alert('保存失败：' + error.message)
      } finally {
        this.saving = false
      }
    },

    // 保存到本地存储
    saveToLocalStorage() {
      try {
        console.log('💽 开始保存到本地存储...')
        
        // 保存分析结果到localStorage
        const resultData = {
          ...this.analysisData,
          savedAt: new Date().toISOString(),
          id: Date.now(), // 使用时间戳作为ID
          title: `匹配分析 - ${this.analysisData.jobInfo?.title || '未知职位'} - ${new Date().toLocaleString()}`
        }
        
        let savedResults = JSON.parse(localStorage.getItem('savedMatchingResults') || '[]')
        savedResults.unshift(resultData)
        
        // 只保留最近20个结果
        if (savedResults.length > 20) {
          savedResults = savedResults.slice(0, 20)
        }
        
        localStorage.setItem('savedMatchingResults', JSON.stringify(savedResults))
        console.log('✅ 本地保存成功，共保存', savedResults.length, '个结果')
        this.showSuccessMessage('✅ 匹配分析结果已保存到本地历史记录')
      } catch (error) {
        console.error('❌ 保存到本地失败:', error)
        alert('保存失败：' + error.message)
      }
    },

    // 生成结果标题
    generateResultTitle() {
      const now = new Date()
      const dateStr = now.toLocaleDateString('zh-CN')
      const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false })
      const jobTitle = this.analysisData.jobInfo?.title || '未知职位'
      
      if (this.analysisData.analysisMode === 'select') {
        return `职位匹配分析 - ${jobTitle} - ${dateStr} ${timeStr}`
      } else if (this.analysisData.analysisMode === 'upload') {
        const fileName = this.analysisData.sourceInfo?.fileName || '上传文件'
        return `文件匹配分析 - ${jobTitle} - ${fileName} - ${dateStr} ${timeStr}`
      } else {
        return `职位匹配分析 - ${jobTitle} - ${dateStr} ${timeStr}`
      }
    },

    // 显示成功消息
    showSuccessMessage(message) {
      // 可以添加一个成功提示组件，这里先用alert
      alert(message)
    }
  }
}
</script>

<style scoped>
.matching-result-container {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120px;
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

/* 匹配度卡片 */
.score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  color: white;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.score-title {
  font-size: 18px;
  font-weight: 600;
}

.score-circle {
  text-align: center;
}

.score-number {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.score-level {
  font-size: 14px;
  opacity: 0.9;
  margin-top: 4px;
}

.score-progress {
  margin-top: 16px;
}

.progress-bar {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease;
}

.progress-fill.excellent {
  background: #28a745;
}

.progress-fill.good {
  background: #17a2b8;
}

.progress-fill.average {
  background: #ffc107;
}

.progress-fill.low {
  background: #dc3545;
}

/* 通用卡片样式 */
.job-info-card,
.analysis-card,
.suggestions-card,
.strengths-card,
.gaps-card,
.focus-card,
.keywords-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.card-title svg {
  color: #667eea;
}

/* 职位信息 */
.job-details {
  padding-left: 28px;
}

.job-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.job-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

/* 评分理由 */
.reason-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reason-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.reason-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reason-icon.positive {
  background: #d4edda;
  color: #155724;
}

.reason-icon.negative {
  background: #f8d7da;
  color: #721c24;
}

.reason-icon.neutral {
  background: #fff3cd;
  color: #856404;
}

.reason-content {
  flex: 1;
}

.reason-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.reason-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.reason-score {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  min-width: 40px;
  text-align: right;
}

/* 改进建议 */
.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
}

.suggestion-priority {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.suggestion-priority.high {
  background: #f8d7da;
  color: #721c24;
}

.suggestion-priority.medium {
  background: #fff3cd;
  color: #856404;
}

.suggestion-priority.low {
  background: #d1ecf1;
  color: #0c5460;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.suggestion-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

/* 匹配优势 */
.strength-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.strength-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f0f9ff;
  border-radius: 8px;
  border-left: 4px solid #10b981;
}

.strength-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.strength-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

/* 不足之处 */
.gap-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gap-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #fef3c7;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.gap-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f59e0b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.gap-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
  line-height: 1.5;
}

/* 关注方向 */
.focus-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 28px;
}

.focus-tag {
  padding: 8px 12px;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

/* 关键词匹配 */
.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding-left: 28px;
}

.keyword-tag {
  padding: 6px 10px;
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.action-btn {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn.secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #e9ecef;
}

.action-btn.secondary:hover {
  background: #e9ecef;
  color: #333;
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.action-btn.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .score-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .reason-item,
  .suggestion-item {
    flex-direction: column;
    gap: 8px;
  }
  
  .reason-score {
    text-align: left;
  }
}
</style>




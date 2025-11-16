<template>
  <div class="interview-container">
    <div class="header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">面试问题生成</h1>
      <div class="resume-selector">
        <select v-model="selectedResume" class="resume-select">
          <option value="">请选择简历</option>
          <option v-for="resume in resumeList" :key="resume.id" :value="resume.id">
            {{ resume.title }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="chat-container">
      <!-- 聊天消息区域 -->
      <div class="messages-area" ref="messagesArea">
        <div v-for="(message, index) in messages" :key="index" class="message-wrapper">
          <div class="message" :class="message.type">
            <div v-if="message.type === 'bot'" class="bot-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
              </svg>
            </div>
            <div v-else class="user-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
              </svg>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.text }}</div>
              <div v-if="message.options" class="message-options">
                <button 
                  v-for="option in message.options" 
                  :key="option.value"
                  class="option-btn"
                  :class="{ 
                    'selected': option.selected, 
                    'confirm': option.isConfirm 
                  }"
                  @click="selectOption(option)"
                >
                  {{ option.text }}
                </button>
              </div>
        </div>
      </div>
        </div>
        
        <!-- 加载动画 -->
        <div v-if="isTyping" class="message bot">
          <div class="bot-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>
            </svg>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
        </div>
        </div>
      </div>
      
      <!-- 输入区域 -->
      <div class="input-area" v-if="showInput">
        <div class="input-container">
          <input 
            type="text" 
            v-model="userInput" 
            :placeholder="inputPlaceholder"
            @keyup.enter="sendMessage"
            class="message-input"
          />
          <button class="send-btn" @click="sendMessage" :disabled="!userInput.trim()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
            </svg>
      </button>
        </div>
      </div>
      
      <!-- 新对话按钮 -->
      <div class="new-chat-area" v-if="conversationComplete">
        <button class="new-chat-btn" @click="startNewConversation">
          + 开启新对话
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InterviewQuestions',
  data() {
    return {
      selectedResume: '',
      messages: [],
      userInput: '',
      isTyping: false,
      showInput: false,
      conversationComplete: false,
      currentStep: 0,
      inputPlaceholder: '请输入您的回答...',
      
      // 用户信息收集
      userInfo: {
        jobTitle: '',
        experience: '',
        skills: '',
        projects: '',
        challenges: ''
      },
      
      // 简历列表
      resumeList: [],
      
      // 对话流程步骤
      currentStep: 'welcome',
      
      // 收集的用户信息
      collectedInfo: {
        resume: '',
        jobPosition: '',
        focusAreas: [],
        questionCount: 0
      },
      
      // 侧重点选项
      focusOptions: [
        { text: '项目经历', value: 'projects', selected: false },
        { text: '技能技术', value: 'skills', selected: false },
        { text: '工作经验', value: 'experience', selected: false },
        { text: '教育背景', value: 'education', selected: false },
        { text: '个人能力', value: 'abilities', selected: false }
      ]
    }
  },
  
  async mounted() {
    await this.loadResumes()
    this.initConversation()
  },
  
  methods: {
    goBack() {
      this.$router.go(-1)
    },

    // 加载简历列表
    async loadResumes() {
      try {
        // 检查用户是否已登录
        const userToken = localStorage.getItem('userToken')
        if (!userToken) {
          console.log('⚠️ 用户未登录，无法加载简历列表')
          this.resumeList = []
          return
        }

        const { resumeAPI } = await import('@/services/api')
        const response = await resumeAPI.getResumes()
        
        if (response.success) {
          // 显示所有简历记录，不再过滤
          const allResumes = response.data || []
          this.resumeList = allResumes
          console.log('📋 面试问题页面加载简历列表:', allResumes.length, '总记录')
        } else {
          console.error('❌ 加载简历列表失败:', response.message)
          this.resumeList = []
        }
      } catch (error) {
        console.error('❌ 加载简历列表出错:', error)
        this.resumeList = []
      }
    },
    
    initConversation() {
      // 开始对话
      this.currentStep = 'welcome'
      this.addBotMessage('你好！我是AI面试助手，我将帮助你生成个性化的面试问题。首先，请在右上角选择你要使用的简历。')
      
      // 监听简历选择
      this.$watch('selectedResume', (newVal) => {
        if (newVal && this.currentStep === 'welcome') {
          this.collectedInfo.resume = newVal
          setTimeout(() => {
            this.askJobPosition()
          }, 1000)
        }
      })
    },
    
    addBotMessage(text, options = null) {
      this.isTyping = true
      
      setTimeout(() => {
        this.isTyping = false
        this.messages.push({
          type: 'bot',
          text: text,
          options: options
        })
        this.scrollToBottom()
      }, 1000)
    },
    
    addUserMessage(text) {
      this.messages.push({
        type: 'user',
        text: text
      })
      this.scrollToBottom()
    },
    
    selectOption(option) {
      // 对于侧重点选择，只有确认按钮才添加消息
      if (this.currentStep === 'focusAreas' && option.value !== 'confirm_focus') {
        // 侧重点多选不添加消息，直接处理
        this.handleUserChoice(option)
      } else {
        // 其他情况添加用户选择的消息
        this.addUserMessage(option.text)
        // 处理选择的选项
        this.handleUserChoice(option)
      }
    },
    
    handleUserChoice(option) {
      if (this.currentStep === 'focusAreas') {
        if (option.value === 'confirm_focus') {
          // 确认侧重点选择
          if (this.collectedInfo.focusAreas.length === 0) {
            alert('请至少选择一个侧重点')
            return
          }
          setTimeout(() => {
            this.askQuestionCount()
          }, 1000)
        } else {
          // 处理侧重点多选
          const focusItem = this.focusOptions.find(item => item.value === option.value)
          if (focusItem) {
            focusItem.selected = !focusItem.selected
            
            // 更新收集的侧重点
            this.collectedInfo.focusAreas = this.focusOptions
              .filter(item => item.selected)
              .map(item => item.value)
            
            // 不添加用户消息，只更新选项状态
            this.updateFocusOptions()
          }
        }
      } else if (this.currentStep === 'questionCount') {
        // 处理问题数量选择
        this.collectedInfo.questionCount = parseInt(option.value)
        setTimeout(() => {
          this.generateFinalQuestions()
        }, 1000)
      }
    },
    
    askJobPosition() {
      this.currentStep = 'jobPosition'
      this.showInput = true
      this.inputPlaceholder = '请输入你要面试的职位名称，例如：前端开发工程师'
      this.addBotMessage('很好！现在请告诉我，你要面试的是什么职位？')
    },
    
    askFocusAreas() {
      this.currentStep = 'focusAreas'
      this.showInput = false
      
      // 获取初始选项并添加完成选择按钮
      const initialOptions = this.getFocusAreaOptions()
      initialOptions.push({
        text: '完成选择 (请至少选择一项)',
        value: 'confirm_focus',
        isConfirm: true
      })
      
      this.addBotMessage('接下来，请选择面试问题的侧重点（可以多选）：', initialOptions)
    },
    
    askQuestionCount() {
      this.currentStep = 'questionCount'
      this.showInput = false
      const countOptions = [
        { text: '3个问题', value: '3' },
        { text: '5个问题', value: '5' },
        { text: '8个问题', value: '8' },
        { text: '10个问题', value: '10' }
      ]
      this.addBotMessage('最后，你希望生成多少个面试问题？', countOptions)
    },
    
    getFocusAreaOptions() {
      return this.focusOptions.map(option => ({
        text: option.selected ? `✓ ${option.text}` : option.text,
        value: option.value,
        selected: option.selected
      }))
    },
    
    updateFocusOptions() {
      // 更新最后一条消息的选项
      const lastMessage = this.messages[this.messages.length - 1]
      if (lastMessage && lastMessage.options) {
        lastMessage.options = this.getFocusAreaOptions()
        
        // 始终显示完成选择按钮
        const selectedCount = this.collectedInfo.focusAreas.length
        const confirmText = selectedCount > 0 
          ? `完成选择 (已选${selectedCount}项)` 
          : '完成选择 (请至少选择一项)'
          
        lastMessage.options.push({
          text: confirmText,
          value: 'confirm_focus',
          isConfirm: true
        })
      }
    },
    
    async generateFinalQuestions() {
      // 显示收集到的信息摘要
      this.addBotMessage(`好的！让我为你生成面试问题：
📋 简历：${this.getResumeTitle()}
💼 职位：${this.collectedInfo.jobPosition}
🎯 侧重点：${this.getSelectedFocusText()}
📝 问题数量：${this.collectedInfo.questionCount}个

正在调用AI为你生成个性化的面试问题...`)
      
      try {
        // 调用真实的AI面试问题生成API
        const { aiAPI } = await import('@/services/api')
        const result = await aiAPI.generateInterviewQuestions({
          resumeId: this.collectedInfo.resume,
          jobPosition: this.collectedInfo.jobPosition,
          focusAreas: this.collectedInfo.focusAreas,
          questionCount: this.collectedInfo.questionCount
        })
        
        const questions = result.data.questions || []
        
        // 显示生成的问题和答案
        if (questions.length > 0) {
          questions.forEach((item, index) => {
            setTimeout(() => {
              this.addBotMessage(`📌 问题 ${index + 1}：${item.question}`)
              setTimeout(() => {
                this.addBotMessage(`💡 参考答案：${item.answer}`)
              }, 1500)
            }, (index + 1) * 2500)
          })
          
          // 对话完成 - 确保在所有问题和答案显示完毕后再显示完成消息
          setTimeout(() => {
            this.conversationComplete = true
            this.addBotMessage('🎉 AI面试问题生成完成！祝你面试顺利！如需重新生成，可以点击下方的"开启新对话"按钮。')
          }, questions.length * 2500 + 1500 + 2000)
        } else {
          this.addBotMessage('抱歉，生成问题时出现了问题，请重新尝试。')
          this.conversationComplete = true
        }
        
      } catch (error) {
        console.error('AI面试问题生成失败:', error)
        this.addBotMessage('抱歉，AI服务暂时不可用，为您提供默认的面试问题：')
        
        // 使用默认问题作为备选
        const defaultQuestions = this.generateQuestionsByFocus()
        defaultQuestions.forEach((item, index) => {
          setTimeout(() => {
            this.addBotMessage(`📌 问题 ${index + 1}：${item.question}`)
            setTimeout(() => {
              this.addBotMessage(`💡 参考答案：${item.answer}`)
            }, 1500)
          }, (index + 1) * 2500)
        })
        
        setTimeout(() => {
          this.conversationComplete = true
          this.addBotMessage('🎉 面试问题生成完成！祝你面试顺利！如需重新生成，可以点击下方的"开启新对话"按钮。')
        }, defaultQuestions.length * 2500 + 1500 + 2000)
      }
    },
    
    generateQuestionsByFocus() {
      const allQuestions = {
        projects: [
          {
            question: `请详细介绍一下您在${this.collectedInfo.jobPosition}相关项目中最有挑战性的经历？`,
            answer: '可以从项目背景、技术难点、解决方案、最终成果等方面来回答。重点突出您在项目中的贡献和学到的经验。'
          },
          {
            question: '在项目开发过程中，您是如何与团队成员协作的？遇到分歧时如何处理？',
            answer: '可以描述具体的协作工具、沟通方式、任务分配等。展现您的团队合作能力和沟通技巧。'
          },
          {
            question: '项目中遇到的最大技术难题是什么？您是如何分析和解决的？',
            answer: '详细描述问题的复杂性、分析过程、解决思路和最终方案。体现您的问题解决能力和技术深度。'
          }
        ],
        skills: [
          {
            question: `请介绍一下您掌握的与${this.collectedInfo.jobPosition}相关的核心技术栈？`,
            answer: '从技术特点、适用场景、个人经验等角度来说明。展现您对技术的理解深度和选择判断力。'
          },
          {
            question: '您是如何保持技术更新和学习新技术的？能举个具体例子吗？',
            answer: '可以提到学习渠道、实践方法、技术社区参与等。体现您的学习能力和技术热情。'
          },
          {
            question: '请举例说明您在某个技术领域的深入研究或创新应用？',
            answer: '具体描述技术研究过程、创新点、实际应用效果。展现您的技术深度和创新能力。'
          }
        ],
        experience: [
          {
            question: `请介绍一下您的工作经历，特别是与${this.collectedInfo.jobPosition}相关的经验？`,
            answer: '按时间顺序介绍，重点突出关键职责、重要项目和取得的成果。用数据和具体事例来支撑。'
          },
          {
            question: '在工作中您承担过哪些领导或指导角色？如何评价自己的管理风格？',
            answer: '描述具体的领导经历、团队规模、管理方式和取得的成果。体现您的领导力和影响力。'
          },
          {
            question: '您认为自己在职业发展中最大的成长是什么？对未来有什么规划？',
            answer: '从技能提升、思维转变、责任增加等方面来回答。展现您的自我认知和成长能力。'
          }
        ],
        education: [
          {
            question: '请介绍一下您的教育背景，以及在学习期间的突出表现？',
            answer: '重点介绍与职位相关的专业知识、学术成果、实践经历等。'
          },
          {
            question: '您在学习过程中遇到过什么挑战？是如何克服的？',
            answer: '描述具体的学习困难、解决方法和收获，体现学习能力和毅力。'
          }
        ],
        abilities: [
          {
            question: '您认为自己最突出的个人能力是什么？能举例说明吗？',
            answer: '结合具体事例说明个人优势，如沟通能力、学习能力、创新思维等。'
          },
          {
            question: '面对压力和挑战时，您通常如何应对？',
            answer: '描述具体的应对策略和成功案例，展现抗压能力和适应性。'
          }
        ]
      }
      
      // 根据选择的侧重点生成问题
      let selectedQuestions = []
      const questionsPerArea = Math.ceil(this.collectedInfo.questionCount / this.collectedInfo.focusAreas.length)
      
      this.collectedInfo.focusAreas.forEach(area => {
        const areaQuestions = allQuestions[area] || []
        selectedQuestions = selectedQuestions.concat(areaQuestions.slice(0, questionsPerArea))
      })
      
      // 如果问题不够，从所有类型中补充
      if (selectedQuestions.length < this.collectedInfo.questionCount) {
        const allQuestionsArray = Object.values(allQuestions).flat()
        const remainingCount = this.collectedInfo.questionCount - selectedQuestions.length
        const additionalQuestions = allQuestionsArray
          .filter(q => !selectedQuestions.includes(q))
          .slice(0, remainingCount)
        selectedQuestions = selectedQuestions.concat(additionalQuestions)
      }
      
      return selectedQuestions.slice(0, this.collectedInfo.questionCount)
    },
    
    getResumeTitle() {
      const resume = this.resumeList.find(r => r.id == this.selectedResume)
      return resume ? resume.title : '未选择'
    },
    
    getSelectedFocusText() {
      const focusTexts = this.focusOptions
        .filter(option => this.collectedInfo.focusAreas.includes(option.value))
        .map(option => option.text)
      return focusTexts.join('、')
    },
    
    sendMessage() {
      if (!this.userInput.trim()) return
      
      const input = this.userInput.trim()
      this.addUserMessage(input)
      this.userInput = ''
      this.showInput = false
      
      // 处理用户输入
      if (this.currentStep === 'jobPosition') {
        this.collectedInfo.jobPosition = input
        setTimeout(() => {
          this.askFocusAreas()
        }, 1000)
      }
    },
    
    startNewConversation() {
      this.messages = []
      this.currentStep = 'welcome'
      this.conversationComplete = false
      this.showInput = false
      this.selectedResume = ''
      
      // 重置收集的信息
      this.collectedInfo = {
        resume: '',
        jobPosition: '',
        focusAreas: [],
        questionCount: 0
      }
      
      // 重置侧重点选项
      this.focusOptions.forEach(option => {
        option.selected = false
      })
      
      this.initConversation()
    },
    
    scrollToBottom() {
      this.$nextTick(() => {
        const messagesArea = this.$refs.messagesArea
        if (messagesArea) {
          messagesArea.scrollTop = messagesArea.scrollHeight
        }
      })
    }
  }
}
</script>

<style scoped>
.interview-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: transparent;
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  color: #333;
  padding: 8px;
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

.resume-selector {
  min-width: 120px;
}

.resume-select {
  padding: 8px 12px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #333;
}

/* 聊天容器 */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 消息区域 */
.messages-area {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: transparent;
}

.message-wrapper {
  margin-bottom: 16px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 80%;
}

.message.bot {
  margin-right: auto;
}

.message.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.bot-avatar,
.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bot-avatar {
  background: #667eea;
  color: white;
}

.user-avatar {
  background: #4facfe;
  color: white;
}

.message-content {
  flex: 1;
}

.message-text {
  background: white;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
}

.message.user .message-text {
  background: #4facfe;
  color: white;
}

/* 选项按钮 */
.message-options {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-btn {
  padding: 10px 16px;
  background: white;
  border: 2px solid #667eea;
  border-radius: 20px;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.option-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
}

.option-btn.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.option-btn.confirm {
  background: #28a745;
  border-color: #28a745;
  color: white;
  font-weight: 600;
}

.option-btn.confirm:hover {
  background: #218838;
  border-color: #218838;
}

/* 输入正在输入指示器 */
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #999;
  border-radius: 50%;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 输入区域 */
.input-area {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e9ecef;
  flex-shrink: 0;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 100%;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e1e5e9;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  background: #f8f9fa;
}

.message-input:focus {
  border-color: #667eea;
  background: white;
}

.send-btn {
  width: 40px;
  height: 40px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background: #5a6fd8;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 新对话区域 */
.new-chat-area {
  padding: 16px 20px;
  background: white;
  border-top: 1px solid #e9ecef;
  text-align: center;
  flex-shrink: 0;
}

.new-chat-btn {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid #667eea;
  border-radius: 20px;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.new-chat-btn:hover {
  background: #667eea;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
  }
  
  .messages-area {
    padding: 16px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .input-area {
    padding: 12px 16px;
  }
  
  .page-title {
  font-size: 16px;
  }
  
  .resume-selector {
    min-width: 100px;
  }
  
  .resume-select {
    font-size: 12px;
    padding: 6px 8px;
  }
}

/* 滚动条样式 */
.messages-area::-webkit-scrollbar {
  width: 4px;
}

.messages-area::-webkit-scrollbar-track {
  background: transparent;
}

.messages-area::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.messages-area::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>




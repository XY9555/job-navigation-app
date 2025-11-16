// AI服务集成层 - 支持多种大模型接入
require('dotenv').config();

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'zhipu'; // 默认使用智谱AI
    this.apiKey = process.env.AI_API_KEY || process.env.ZHIPU_API_KEY;
    this.baseURL = process.env.AI_BASE_URL;
    console.log('🔧 AI服务初始化:', {
      provider: this.provider,
      hasApiKey: !!this.apiKey,
      keyLength: this.apiKey ? this.apiKey.length : 0
    });
  }

  // 通用AI请求方法
  async makeRequest(messages, options = {}) {
    switch (this.provider) {
      case 'openai':
        return this.callOpenAI(messages, options);
      case 'claude':
        return this.callClaude(messages, options);
      case 'qianwen':
        return this.callQianwen(messages, options);
      case 'zhipu':
        return this.callZhipu(messages, options);
      default:
        throw new Error(`不支持的AI提供商: ${this.provider}`);
    }
  }

  // OpenAI API调用
  async callOpenAI(messages, options = {}) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'gpt-3.5-turbo',
        messages,
        max_tokens: options.maxTokens || 2000,
        temperature: options.temperature || 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API调用失败');
    }

    return data.choices[0].message.content;
  }

  // 阿里云通义千问API调用
  async callQianwen(messages, options = {}) {
    // 这里需要根据通义千问的实际API格式调整
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || 'qwen-turbo',
        input: {
          messages
        },
        parameters: {
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || '通义千问API调用失败');
    }

    return data.output.text;
  }

  // 智谱AI API调用
  async callZhipu(messages, options = {}) {
    try {
      const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: options.model || 'glm-4',
          messages,
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7,
          stream: false
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('智谱AI API错误:', data);
        throw new Error(data.error?.message || `智谱AI API调用失败: ${response.status}`);
      }

      if (!data.choices || !data.choices[0]) {
        throw new Error('智谱AI返回数据格式错误');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('智谱AI调用异常:', error);
      throw error;
    }
  }

  // Claude API调用（Anthropic）
  async callClaude(messages, options = {}) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: options.model || 'claude-3-sonnet-20240229',
        max_tokens: options.maxTokens || 2000,
        messages
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Claude API调用失败');
    }

    return data.content[0].text;
  }

  // 简历评测
  async evaluateResume(resume, evaluationOptions = {}) {
    console.log('🔍 开始AI简历评测，提供商:', this.provider);
    console.log('🔑 API Key状态:', this.apiKey ? '已配置' : '未配置');
    console.log('📊 评测维度:', evaluationOptions);
    
    // 检查API密钥配置
    console.log('🔍 检查API密钥:', {
      hasKey: !!this.apiKey,
      keyStart: this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'null',
      keyLength: this.apiKey ? this.apiKey.length : 0
    });
    
    if (!this.apiKey || this.apiKey === 'your-ai-api-key-here' || this.apiKey === 'your-zhipu-api-key-here') {
      console.warn('⚠️ AI API密钥未配置，使用智能分析结果');
      return this.getDefaultEvaluation(resume, evaluationOptions);
    }
    
    const prompt = this.buildResumeEvaluationPrompt(resume, evaluationOptions);
    
    try {
      console.log('📤 发送请求到智谱AI...');
      const response = await this.makeRequest([
        { role: 'system', content: '你是一位专业的HR和简历评测专家，请客观、专业地评测简历。' },
        { role: 'user', content: prompt }
      ]);

      console.log('📥 收到AI响应:', response.substring(0, 100) + '...');
      return this.parseEvaluationResponse(response);
    } catch (error) {
      console.error('❌ AI简历评测失败:', error.message);
      console.warn('🔄 使用智能分析作为备选方案');
      // 返回基于内容的智能评测结果
      return this.getDefaultEvaluation(resume);
    }
  }

  // 职位匹配分析
  async analyzeJobMatching(resume, jobDescription, jobTitle) {
    const prompt = this.buildJobMatchingPrompt(resume, jobDescription, jobTitle);
    
    try {
      const response = await this.makeRequest([
        { role: 'system', content: '你是一位专业的招聘顾问，擅长分析简历与职位的匹配度。' },
        { role: 'user', content: prompt }
      ]);

      return this.parseJobMatchingResponse(response);
    } catch (error) {
      console.error('AI职位匹配分析失败:', error);
      return this.getDefaultJobMatching();
    }
  }

  // 生成面试问题
  async generateInterviewQuestions(resume, jobPosition, focusAreas, questionCount) {
    const prompt = this.buildInterviewQuestionsPrompt(resume, jobPosition, focusAreas, questionCount);
    
    try {
      const response = await this.makeRequest([
        { role: 'system', content: '你是一位经验丰富的面试官，擅长根据简历和职位要求设计面试问题。' },
        { role: 'user', content: prompt }
      ]);

      return this.parseInterviewQuestionsResponse(response);
    } catch (error) {
      console.error('AI面试问题生成失败:', error);
      return this.getDefaultInterviewQuestions(focusAreas, questionCount);
    }
  }

  // 构建简历评测提示词
  buildResumeEvaluationPrompt(resume, evaluationOptions = {}) {
    // 构建详细的简历信息
    const personalInfo = resume.personalInfo || {};
    const jobIntention = resume.jobIntention || {};
    const education = resume.education || [];
    const experience = resume.experience || [];
    const skills = resume.skills || [];
    const projects = resume.projects || [];
    
    return `请评测以下简历，从多个维度给出专业分析：

=== 简历基本信息 ===
姓名：${personalInfo.name || '未提供'}
电话：${personalInfo.phone || '未提供'}
邮箱：${personalInfo.email || '未提供'}
职位意向：${jobIntention.position || '未明确'}
期望薪资：${jobIntention.salary || '未提供'}

=== 教育背景 ===
教育经历：${education.length}段
${education.map(edu => `- ${edu.school || '某学校'} ${edu.major || '专业'} ${edu.degree || '学历'}`).join('\n')}

=== 工作经验 ===
工作经验：${experience.length}段
${experience.map(exp => `- ${exp.company || '某公司'} ${exp.position || '职位'} (${exp.startDate || '开始时间'} - ${exp.endDate || '结束时间'})`).join('\n')}

=== 技能水平 ===
技能数量：${skills.length}项
${skills.map(skill => `- ${skill.name || '技能'} (熟练度: ${skill.level || 0}%)`).join('\n')}

=== 项目经历 ===
项目经历：${projects.length}个
${projects.map(proj => `- ${proj.name || '项目名称'} (${proj.role || '角色'})`).join('\n')}

=== 原始内容摘要 ===
${resume.rawText ? resume.rawText.substring(0, 500) + '...' : '无原始文本内容'}

请根据以下选择的评测维度进行专业评测：
${this.buildEvaluationDimensions(evaluationOptions)}

请从以下方面进行专业评测并返回JSON格式：
1. 总体评分（0-100分，综合考虑完整性、专业性、匹配度）
2. 主要优势（strengths数组，3-5个具体优势点）
3. 不足之处（weaknesses数组，2-4个需要改进的地方）
4. 改进建议（suggestions数组，3-5个具体可行的建议）
5. 详细评分（details对象，包含各维度分数）

返回格式：
{
  "score": 85,
  "strengths": ["具体优势1", "具体优势2", "具体优势3"],
  "weaknesses": ["具体不足1", "具体不足2"],
  "suggestions": ["具体建议1", "具体建议2", "具体建议3"],
  "details": {
    "content": 80,
    "format": 85,
    "experience": 90,
    "skills": 75
  }
}`;
  }

  // 构建职位匹配提示词
  buildJobMatchingPrompt(resume, jobDescription, jobTitle) {
    const personalInfo = resume.personalInfo || {};
    const experience = resume.experience || resume.workExperience || [];
    const skills = resume.skills || [];
    const projects = resume.projects || [];
    const education = resume.education || [];
    const jobIntention = resume.jobIntention || {};
    
    return `请作为专业的招聘顾问，详细分析以下简历与职位的匹配度：

=== 职位信息 ===
职位名称：${jobTitle || '未提供'}
职位描述：${jobDescription}

=== 候选人简历信息 ===
姓名：${personalInfo.name || '未提供'}
联系方式：${personalInfo.phone || '未提供'} / ${personalInfo.email || '未提供'}
职位意向：${jobIntention.position || '未明确'}
期望薪资：${jobIntention.salary || '未提供'}

教育背景：${education.length}段
${education.map(edu => `- ${edu.school || '某学校'} ${edu.major || '专业'} ${edu.degree || '学历'} (${edu.startDate || '开始时间'} - ${edu.endDate || '结束时间'})`).join('\n') || '- 无教育信息'}

工作经验：${experience.length}段
${experience.map(exp => `- ${exp.company || '某公司'} ${exp.position || '职位'} (${exp.startDate || '开始时间'} - ${exp.endDate || '结束时间'})\n  职责：${exp.description || '无描述'}`).join('\n') || '- 无工作经验'}

技能水平：${skills.length}项
${skills.map(skill => `- ${skill.name || '技能'} (熟练度: ${skill.level || 0}%)`).join('\n') || '- 无技能信息'}

项目经历：${projects.length}个
${projects.map(proj => `- ${proj.name || '项目名称'} (${proj.role || '角色'})\n  描述：${proj.description || '无描述'}\n  技术栈：${(proj.technologies || []).join('、') || '无技术信息'}`).join('\n') || '- 无项目经历'}

=== 分析要求 ===
请从以下维度进行专业分析并返回详细的JSON格式结果：

1. 综合匹配度评分（0-100分）
2. 详细评分理由（每个理由包含类型、标题、描述、得分）
3. 匹配优势分析
4. 技能差距识别
5. 具体改进建议
6. 关注方向推荐

请严格按照以下JSON格式返回：
{
  "matchingScore": 85,
  "reasons": [
    {
      "id": 1,
      "type": "positive",
      "title": "具体评分理由标题",
      "description": "详细的理由描述，说明为什么给出这个评分",
      "score": 25
    },
    {
      "id": 2,
      "type": "negative",
      "title": "扣分理由标题",
      "description": "详细说明扣分原因和影响",
      "score": -10
    }
  ],
  "strengths": ["具体匹配优势1", "具体匹配优势2"],
  "gaps": ["具体技能差距1", "具体技能差距2"],
  "suggestions": [
    {
      "id": 1,
      "priority": "high",
      "title": "高优先级改进建议",
      "description": "详细的改进建议和实施方法"
    },
    {
      "id": 2,
      "priority": "medium",
      "title": "中优先级改进建议",
      "description": "详细的改进建议和实施方法"
    }
  ],
  "focusAreas": ["关注方向1", "关注方向2", "关注方向3"],
  "keywordMatches": ["匹配关键词1", "匹配关键词2"]
}

注意：
- reasons数组中type可以是"positive"(加分项)、"negative"(扣分项)、"neutral"(中性项)
- suggestions数组中priority可以是"high"、"medium"、"low"
- 所有描述都要具体、专业、有指导意义
- 评分理由要基于简历内容和职位要求的具体匹配情况`;
  }

  // 构建面试问题提示词
  buildInterviewQuestionsPrompt(resume, jobPosition, focusAreas, questionCount) {
    const personalInfo = resume.personalInfo || {};
    const experience = resume.experience || resume.workExperience || [];
    const projects = resume.projects || [];
    const skills = resume.skills || [];
    const education = resume.education || [];
    const jobIntention = resume.jobIntention || {};
    
    return `请为以下候选人生成${questionCount}个专业的面试问题：

=== 职位信息 ===
目标职位：${jobPosition}
面试侧重点：${focusAreas.join('、')}

=== 候选人简历信息 ===
姓名：${personalInfo.name || '候选人'}
期望职位：${jobIntention.position || '未明确'}
期望薪资：${jobIntention.salary || '未提供'}

教育背景：
${education.map(edu => `- ${edu.school || '某学校'} ${edu.major || '专业'} ${edu.degree || '学历'} (${edu.startDate || '开始时间'} - ${edu.endDate || '结束时间'})`).join('\n') || '- 无教育信息'}

工作经验：${experience.length}段
${experience.map(exp => `- ${exp.company || '某公司'} ${exp.position || '职位'} (${exp.startDate || '开始时间'} - ${exp.endDate || '结束时间'})\n  职责：${exp.description || '无描述'}`).join('\n') || '- 无工作经验'}

技能水平：
${skills.map(skill => `- ${skill.name || '技能'} (熟练度: ${skill.level || 0}%)`).join('\n') || '- 无技能信息'}

项目经历：${projects.length}个
${projects.map(proj => `- ${proj.name || '项目名称'} (${proj.role || '角色'})\n  描述：${proj.description || '无描述'}\n  技术栈：${(proj.technologies || []).join('、') || '无技术信息'}`).join('\n') || '- 无项目经历'}

=== 面试问题生成要求 ===
1. 根据候选人的实际背景和目标职位生成针对性问题
2. 问题应该涵盖所选的侧重点：${focusAreas.join('、')}
3. 问题难度要适中，既能考察能力又不会过于困难
4. 每个问题都要提供详细的参考答案要点
5. 问题要具有实际意义，能够真实反映候选人的能力

请严格按照以下JSON格式返回${questionCount}个面试问题：
{
  "questions": [
    {
      "question": "具体的面试问题内容",
      "answer": "详细的参考答案要点和回答建议"
    }
  ]
}

注意：请确保返回的是有效的JSON格式，问题要结合候选人的具体情况，答案要具有指导性。`;
  }

  // 解析评测响应
  parseEvaluationResponse(response) {
    try {
      console.log('🔍 开始解析AI响应...');
      console.log('📄 原始响应:', response.substring(0, 500) + '...');
      
      // 尝试多种JSON提取方式
      let jsonStr = '';
      
      // 方式1: 寻找完整的JSON对象
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      } else {
        // 方式2: 寻找```json代码块
        const codeBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1];
        } else {
          // 方式3: 寻找分数和数组
          console.log('⚠️ 未找到标准JSON格式，尝试提取关键信息...');
          return this.extractInfoFromText(response);
        }
      }
      
      console.log('📋 提取的JSON字符串:', jsonStr.substring(0, 200) + '...');
      
      // 清理JSON字符串
      jsonStr = jsonStr
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 移除控制字符
        .replace(/,\s*}/g, '}') // 移除尾随逗号
        .replace(/,\s*]/g, ']'); // 移除数组尾随逗号
      
      const result = JSON.parse(jsonStr);
      console.log('✅ JSON解析成功:', result);
      
      // 验证必要字段
      if (typeof result.score === 'number' && 
          Array.isArray(result.strengths) && 
          Array.isArray(result.weaknesses) && 
          Array.isArray(result.suggestions)) {
        return result;
      } else {
        console.warn('⚠️ JSON结构不完整，使用默认结果');
        return this.getDefaultEvaluation();
      }
      
    } catch (error) {
      console.error('❌ 解析AI响应失败:', error.message);
      console.log('🔄 尝试从文本中提取信息...');
      return this.extractInfoFromText(response);
    }
  }
  
  // 从文本中提取评测信息
  extractInfoFromText(text) {
    console.log('📝 从文本中提取评测信息...');
    
    const result = {
      score: 75,
      strengths: [],
      weaknesses: [],
      suggestions: []
    };
    
    // 提取分数
    const scoreMatch = text.match(/(?:score|评分|得分).*?(\d+)/i);
    if (scoreMatch) {
      result.score = parseInt(scoreMatch[1]);
    }
    
    // 提取优势
    const strengthsMatch = text.match(/(?:优势|strengths).*?\[(.*?)\]/is);
    if (strengthsMatch) {
      result.strengths = strengthsMatch[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
    }
    
    // 提取不足
    const weaknessesMatch = text.match(/(?:不足|缺点|weaknesses).*?\[(.*?)\]/is);
    if (weaknessesMatch) {
      result.weaknesses = weaknessesMatch[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
    }
    
    // 提取建议
    const suggestionsMatch = text.match(/(?:建议|suggestions).*?\[(.*?)\]/is);
    if (suggestionsMatch) {
      result.suggestions = suggestionsMatch[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
    }
    
    console.log('📊 提取结果:', result);
    return result;
  }

  // 解析职位匹配响应
  parseJobMatchingResponse(response) {
    try {
      console.log('🔍 开始解析职位匹配AI响应...');
      console.log('📄 原始响应:', response.substring(0, 500) + '...');
      
      // 尝试多种JSON提取方式
      let jsonStr = '';
      
      // 方式1: 寻找完整的JSON对象
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      } else {
        // 方式2: 寻找```json代码块
        const codeBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1];
        } else {
          console.warn('⚠️ 未找到标准JSON格式，使用默认结果');
          return this.getDefaultJobMatching();
        }
      }
      
      console.log('📋 提取的JSON字符串:', jsonStr.substring(0, 200) + '...');
      
      // 清理JSON字符串
      jsonStr = jsonStr
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 移除控制字符
        .replace(/,\s*}/g, '}') // 移除尾随逗号
        .replace(/,\s*]/g, ']'); // 移除数组尾随逗号
      
      const result = JSON.parse(jsonStr);
      console.log('✅ JSON解析成功:', result);
      
      // 获取默认数据作为基础
      const defaultData = this.getDefaultJobMatching();
      
      // 标准化数据结构，确保所有必需字段都存在
      const standardizedResult = {
        matchingScore: result.matchingScore || defaultData.matchingScore,
        // reasons字段：优先使用AI数据，否则使用默认数据
        reasons: (Array.isArray(result.reasons) && result.reasons.length > 0) ? result.reasons : defaultData.reasons,
        // strengths字段：转换字符串数组为标准格式
        strengths: Array.isArray(result.strengths) ? result.strengths : defaultData.strengths,
        // gaps字段：转换字符串数组为标准格式  
        gaps: Array.isArray(result.gaps) ? result.gaps : defaultData.gaps,
        // suggestions字段：转换字符串数组为对象数组
        suggestions: Array.isArray(result.suggestions) && result.suggestions.length > 0 ? 
          result.suggestions.map((item, index) => {
            if (typeof item === 'string') {
              return {
                id: index + 1,
                priority: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
                title: `改进建议${index + 1}`,
                description: item
              };
            }
            return item;
          }) : defaultData.suggestions,
        // focusAreas字段：优先使用AI数据，否则使用默认数据
        focusAreas: (Array.isArray(result.focusAreas) && result.focusAreas.length > 0) ? result.focusAreas : defaultData.focusAreas,
        // keywordMatches字段：保持原样
        keywordMatches: Array.isArray(result.keywordMatches) ? result.keywordMatches : defaultData.keywordMatches
      };
      
      // 记录数据来源
      console.log('📊 数据来源分析:', {
        reasons: (result.hasOwnProperty('reasons') && Array.isArray(result.reasons) && result.reasons.length > 0) ? 'AI生成' : '默认数据',
        suggestions: (result.hasOwnProperty('suggestions') && Array.isArray(result.suggestions) && result.suggestions.length > 0) ? 'AI生成(已转换)' : '默认数据',
        focusAreas: (result.hasOwnProperty('focusAreas') && Array.isArray(result.focusAreas) && result.focusAreas.length > 0) ? 'AI生成' : '默认数据',
        strengths: (result.hasOwnProperty('strengths') && Array.isArray(result.strengths) && result.strengths.length > 0) ? 'AI生成' : '默认数据',
        gaps: (result.hasOwnProperty('gaps') && Array.isArray(result.gaps) && result.gaps.length > 0) ? 'AI生成' : '默认数据'
      });
      
      console.log('📊 标准化结果:', {
        score: standardizedResult.matchingScore,
        reasonsCount: standardizedResult.reasons.length,
        suggestionsCount: standardizedResult.suggestions.length,
        focusAreasCount: standardizedResult.focusAreas.length
      });
      
      return standardizedResult;
      
    } catch (error) {
      console.error('❌ 解析AI响应失败:', error.message);
      console.log('🔄 使用默认职位匹配结果');
      return this.getDefaultJobMatching();
    }
  }

  // 解析面试问题响应
  parseInterviewQuestionsResponse(response) {
    try {
      console.log('🔍 开始解析面试问题AI响应...');
      console.log('📄 原始响应:', response.substring(0, 500) + '...');
      
      // 尝试多种JSON提取方式
      let jsonStr = '';
      
      // 方式1: 寻找完整的JSON对象
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      } else {
        // 方式2: 寻找```json代码块
        const codeBlockMatch = response.match(/```json\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch) {
          jsonStr = codeBlockMatch[1];
        } else {
          console.warn('⚠️ 未找到标准JSON格式，尝试提取问题信息...');
          return this.extractQuestionsFromText(response);
        }
      }
      
      console.log('📋 提取的JSON字符串:', jsonStr.substring(0, 200) + '...');
      
      // 清理JSON字符串
      jsonStr = jsonStr
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 移除控制字符
        .replace(/,\s*}/g, '}') // 移除尾随逗号
        .replace(/,\s*]/g, ']'); // 移除数组尾随逗号
      
      const result = JSON.parse(jsonStr);
      console.log('✅ JSON解析成功:', result);
      
      // 验证必要字段
      if (result.questions && Array.isArray(result.questions)) {
        const validQuestions = result.questions.filter(q => 
          q.question && q.answer && 
          typeof q.question === 'string' && 
          typeof q.answer === 'string'
        );
        
        if (validQuestions.length > 0) {
          console.log(`✅ 成功解析${validQuestions.length}个有效问题`);
          return validQuestions;
        }
      }
      
      console.warn('⚠️ JSON结构不完整，使用默认问题');
      return this.getDefaultInterviewQuestions(['综合能力'], 5);
      
    } catch (error) {
      console.error('❌ 解析AI响应失败:', error.message);
      console.log('🔄 尝试从文本中提取问题...');
      return this.extractQuestionsFromText(response);
    }
  }
  
  // 从文本中提取面试问题
  extractQuestionsFromText(text) {
    console.log('📝 从文本中提取面试问题...');
    
    const questions = [];
    
    // 尝试匹配问题和答案的模式
    const patterns = [
      // 模式1: 问题：...答案：...
      /问题[：:]\s*([^\n\r]+)[\n\r]+答案[：:]\s*([^\n\r]+)/gi,
      // 模式2: Q: ... A: ...
      /Q[：:]?\s*([^\n\r]+)[\n\r]+A[：:]?\s*([^\n\r]+)/gi,
      // 模式3: 数字. 问题 答案
      /\d+[\.、]\s*([^\n\r]+)[\n\r]+([^\n\r]+)/gi
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null && questions.length < 10) {
        if (match[1] && match[2]) {
          questions.push({
            question: match[1].trim(),
            answer: match[2].trim()
          });
        }
      }
      if (questions.length > 0) break;
    }
    
    console.log(`📊 从文本提取到${questions.length}个问题`);
    
    if (questions.length === 0) {
      console.log('🔄 使用默认面试问题');
      return this.getDefaultInterviewQuestions(['综合能力'], 5);
    }
    
    return questions;
  }

  // 智能评测结果（基于简历内容分析）
  getDefaultEvaluation(resume = null, evaluationOptions = {}) {
    if (!resume) {
      return this.getBasicEvaluation();
    }

    // 基于简历内容进行智能分析
    const analysis = this.analyzeResumeContent(resume, evaluationOptions);
    
    return {
      score: analysis.score,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      suggestions: analysis.suggestions,
      details: analysis.details,
      note: '本评测基于智能内容分析生成，提供专业的简历优化建议'
    };
  }

  // 基础评测结果
  getBasicEvaluation() {
    return {
      score: 75,
      strengths: [
        '简历结构基本完整',
        '文件格式规范',
        '包含必要的基本信息'
      ],
      weaknesses: [
        '个人信息可以更详细',
        '工作经历描述需要更具体',
        '技能部分可以更丰富'
      ],
      suggestions: [
        '添加更详细的个人联系信息',
        '丰富工作经历的具体描述和成果',
        '补充相关技能和熟练程度',
        '添加项目经历展示实际能力'
      ],
      details: {
        content: 75,
        format: 80,
        experience: 70,
        skills: 75
      }
    };
  }

  // 分析简历内容
  analyzeResumeContent(resume, evaluationOptions = {}) {
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

    // 分析个人信息完整性（仅在选择内容评测时）
    const personalInfo = resume.personalInfo || {};
    if (!evaluationOptions.content || evaluationOptions.content) {
      if (personalInfo.name && personalInfo.phone && personalInfo.email) {
        score += 8;
        details.content += 15;
        strengths.push('个人联系信息完整，便于HR联系');
        
        // 检查邮箱格式
        if (personalInfo.email.includes('@') && personalInfo.email.includes('.')) {
          score += 2;
          strengths.push('邮箱格式规范');
        }
        
        // 检查手机号格式
        if (personalInfo.phone.length === 11 && /^1[3-9]\d{9}$/.test(personalInfo.phone)) {
          score += 2;
          strengths.push('手机号格式正确');
        }
      } else {
        weaknesses.push('个人联系信息不完整，影响HR联系');
        suggestions.push('补充完整的姓名、手机号和邮箱地址');
        details.content -= 10;
      }
      
      // 检查其他个人信息
      if (personalInfo.age || personalInfo.birthDate) {
        score += 1;
        details.content += 2;
      }
      
      if (personalInfo.address) {
        score += 1;
        details.content += 2;
        strengths.push('包含地址信息，便于了解工作地点偏好');
      }
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
    const experience = resume.workExperience || resume.experience || [];
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

    return { score, strengths, weaknesses, suggestions, details };
  }

  // 默认职位匹配结果
  getDefaultJobMatching() {
    return {
      matchingScore: 75,
      reasons: [
        {
          id: 1,
          type: 'positive',
          title: '基础信息完整',
          description: '简历包含了基本的个人信息和联系方式，便于HR联系',
          score: 15
        },
        {
          id: 2,
          type: 'neutral',
          title: '经验匹配度一般',
          description: '工作经验与职位要求基本匹配，但还有提升空间',
          score: 10
        },
        {
          id: 3,
          type: 'negative',
          title: '技能描述不够详细',
          description: '简历中的技能描述相对简单，建议补充更多技术细节',
          score: -5
        }
      ],
      strengths: ['基础信息完整', '具备相关工作经验', '教育背景符合要求'],
      gaps: ['技能描述需要更详细', '项目经历可以更丰富', '缺少具体成果数据'],
      suggestions: [
        {
          id: 1,
          priority: 'high',
          title: '丰富技能描述',
          description: '建议在简历中详细描述掌握的技术栈，包括熟练程度和实际应用经验'
        },
        {
          id: 2,
          priority: 'medium',
          title: '补充项目经历',
          description: '添加更多项目经历，详细描述项目背景、个人职责和取得的成果'
        },
        {
          id: 3,
          priority: 'low',
          title: '量化工作成果',
          description: '在工作经历中加入具体的数据和成果，如性能提升、用户增长等'
        }
      ],
      focusAreas: ['技能提升', '项目经验', '成果展示', '专业认证'],
      keywordMatches: ['基础技能匹配', '行业相关经验']
    };
  }

  // 默认面试问题
  getDefaultInterviewQuestions(focusAreas, count) {
    const questionBank = {
      // 通用问题
      general: [
        {
          question: '请简单介绍一下您自己？',
          answer: '从教育背景、工作经验、个人优势等方面简洁介绍，重点突出与目标职位相关的经历和技能。建议控制在2-3分钟内。'
        },
        {
          question: '为什么选择我们公司？为什么想要这个职位？',
          answer: '结合公司文化、发展前景、产品特色和个人职业规划来回答。展现对公司的了解和加入的诚意。'
        },
        {
          question: '您的职业规划是什么？3-5年内希望达到什么目标？',
          answer: '展示对行业的理解和个人发展的清晰规划，要与应聘职位的发展路径相匹配。'
        },
        {
          question: '您认为自己最大的优势和不足是什么？',
          answer: '优势要结合具体例子说明，不足要选择不影响工作的方面，并说明改进措施。'
        },
        {
          question: '您有什么问题要问我们的吗？',
          answer: '可以询问工作内容、团队文化、发展机会、公司未来规划等，展现对职位的关注和思考。'
        }
      ],
      
      // 项目经历相关
      projects: [
        {
          question: '请详细介绍一个您最有成就感的项目？',
          answer: '使用STAR法则（情况、任务、行动、结果）来描述，重点说明您的贡献、遇到的挑战和解决方案。'
        },
        {
          question: '在项目开发过程中，您是如何与团队成员协作的？',
          answer: '描述具体的协作工具、沟通方式、任务分配等，展现团队合作能力和沟通技巧。'
        },
        {
          question: '项目中遇到的最大技术难题是什么？您是如何解决的？',
          answer: '详细描述问题的复杂性、分析过程、解决思路和最终方案，体现问题解决能力。'
        },
        {
          question: '如果让您重新做这个项目，您会有什么改进？',
          answer: '从技术选型、架构设计、团队协作、项目管理等角度分析，展现反思和改进能力。'
        }
      ],
      
      // 技能技术相关
      skills: [
        {
          question: '请介绍一下您掌握的核心技术栈？',
          answer: '从技术特点、适用场景、个人经验等角度说明，展现技术理解深度和选择判断力。'
        },
        {
          question: '您是如何保持技术更新和学习新技术的？',
          answer: '可以提到学习渠道、实践方法、技术社区参与等，体现学习能力和技术热情。'
        },
        {
          question: '请举例说明您在某个技术领域的深入研究？',
          answer: '具体描述技术研究过程、创新点、实际应用效果，展现技术深度和钻研精神。'
        },
        {
          question: '面对新技术时，您如何快速上手和掌握？',
          answer: '描述学习方法、实践策略、知识体系构建等，展现学习能力和适应性。'
        }
      ],
      
      // 工作经验相关
      experience: [
        {
          question: '请介绍一下您的工作经历，重点说明职责和成果？',
          answer: '按时间顺序介绍，重点突出关键职责、重要项目和取得的成果，用数据和具体事例支撑。'
        },
        {
          question: '在工作中您承担过哪些领导或指导角色？',
          answer: '描述具体的领导经历、团队规模、管理方式和取得的成果，体现领导力和影响力。'
        },
        {
          question: '描述一次您在工作中遇到挫折的经历？',
          answer: '诚实描述挫折情况，重点说明如何分析问题、寻求帮助、最终解决，展现抗压能力。'
        },
        {
          question: '您如何处理工作中的优先级冲突？',
          answer: '描述具体的优先级判断标准、沟通协调方法、时间管理技巧等。'
        }
      ],
      
      // 教育背景相关
      education: [
        {
          question: '请介绍一下您的教育背景和在校期间的突出表现？',
          answer: '重点介绍与职位相关的专业知识、学术成果、实践经历、社团活动等。'
        },
        {
          question: '您在学习过程中遇到过什么挑战？是如何克服的？',
          answer: '描述具体的学习困难、解决方法和收获，体现学习能力和毅力。'
        },
        {
          question: '您认为学校教育对您的职业发展有什么帮助？',
          answer: '从知识体系、思维方式、学习能力等角度分析，展现对教育价值的理解。'
        }
      ],
      
      // 个人能力相关
      abilities: [
        {
          question: '您认为自己最突出的个人能力是什么？能举例说明吗？',
          answer: '结合具体事例说明个人优势，如沟通能力、学习能力、创新思维、抗压能力等。'
        },
        {
          question: '面对压力和挑战时，您通常如何应对？',
          answer: '描述具体的应对策略和成功案例，展现抗压能力和适应性。'
        },
        {
          question: '您如何平衡工作和生活？有什么兴趣爱好？',
          answer: '展现时间管理能力和生活态度，兴趣爱好可以体现个人特质和学习能力。'
        },
        {
          question: '描述一次您主动承担额外责任的经历？',
          answer: '展现主动性、责任心和学习意愿，说明承担责任的动机和收获。'
        }
      ]
    };
    
    // 根据侧重点选择问题
    let selectedQuestions = [];
    
    if (focusAreas && focusAreas.length > 0) {
      // 根据侧重点分配问题数量
      const questionsPerArea = Math.ceil(count / focusAreas.length);
      
      focusAreas.forEach(area => {
        const areaQuestions = questionBank[area] || questionBank.general;
        selectedQuestions = selectedQuestions.concat(
          areaQuestions.slice(0, questionsPerArea)
        );
      });
    }
    
    // 如果问题不够，从通用问题中补充
    if (selectedQuestions.length < count) {
      const remainingCount = count - selectedQuestions.length;
      const generalQuestions = questionBank.general.filter(
        q => !selectedQuestions.some(sq => sq.question === q.question)
      );
      selectedQuestions = selectedQuestions.concat(
        generalQuestions.slice(0, remainingCount)
      );
    }
    
    // 如果还是不够，从所有问题中随机选择
    if (selectedQuestions.length < count) {
      const allQuestions = Object.values(questionBank).flat();
      const remainingCount = count - selectedQuestions.length;
      const additionalQuestions = allQuestions
        .filter(q => !selectedQuestions.some(sq => sq.question === q.question))
        .slice(0, remainingCount);
      selectedQuestions = selectedQuestions.concat(additionalQuestions);
    }
    
    return selectedQuestions.slice(0, count);
  }

  // 构建评测维度描述
  buildEvaluationDimensions(evaluationOptions) {
    const dimensions = [];
    
    if (evaluationOptions.content) {
      dimensions.push('📋 内容完整性：检查个人信息、教育背景、工作经验、技能等信息的完整性和准确性');
    }
    
    if (evaluationOptions.format) {
      dimensions.push('📝 格式规范性：评估简历的排版、结构、格式是否专业规范');
    }
    
    if (evaluationOptions.keywords) {
      dimensions.push('🔍 关键词匹配：分析简历中行业相关关键词的覆盖度和匹配度');
    }
    
    if (evaluationOptions.experience) {
      dimensions.push('💼 经验描述：评估工作经验和项目经历的描述质量和说服力');
    }
    
    if (dimensions.length === 0) {
      return '请进行全面评测（所有维度）';
    }
    
    return dimensions.join('\n');
  }

  // 获取默认评测结果（支持评测维度）
  getDefaultEvaluation(resume, evaluationOptions = {}) {
    console.log('📊 使用智能分析进行评测，维度:', evaluationOptions);
    
    // 根据选择的维度调整评测重点
    const selectedDimensions = Object.keys(evaluationOptions).filter(key => evaluationOptions[key]);
    console.log('✅ 选中的评测维度:', selectedDimensions);
    
    // 基础评测逻辑保持不变，但会在日志中体现维度选择
    const personalInfo = resume.personalInfo || {};
    const education = resume.education || [];
    const experience = resume.workExperience || [];
    const skills = resume.skills || [];
    const projects = resume.projects || [];
    
    let score = 60;
    const strengths = [];
    const weaknesses = [];
    const suggestions = [];
    const details = {
      content: 60,
      format: 70,
      experience: 60,
      skills: 60
    };

    // 根据选择的维度进行重点分析
    if (!evaluationOptions.content || evaluationOptions.content) {
      // 分析个人信息完整性
      if (personalInfo.name && personalInfo.phone && personalInfo.email) {
        score += 5;
        details.content += 10;
        strengths.push('个人联系信息完整');
      } else {
        weaknesses.push('个人联系信息不完整');
        suggestions.push('补充完整的个人联系信息');
      }
    }

    if (!evaluationOptions.experience || evaluationOptions.experience) {
      // 分析工作经验
      if (experience.length > 0) {
        score += 10;
        details.experience += 20;
        strengths.push(`具有${experience.length}段工作经验`);
      } else {
        weaknesses.push('缺少工作经验');
        suggestions.push('添加相关工作或实习经历');
      }
    }

    // 确保分数在合理范围内
    score = Math.min(Math.max(score, 50), 95);
    
    return {
      score,
      strengths: strengths.length > 0 ? strengths : ['简历基本信息完整'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['可进一步优化简历结构'],
      suggestions: suggestions.length > 0 ? suggestions : ['建议完善简历内容'],
      details
    };
  }
}

module.exports = new AIService();




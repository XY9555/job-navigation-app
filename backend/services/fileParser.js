// 文件解析服务 - 支持PDF和Word文档解析
let pdfParse;
let mammoth;

// 动态加载依赖，避免启动时错误
try {
  pdfParse = require('pdf-parse');
  console.log('✅ PDF解析库加载成功，类型:', typeof pdfParse);
} catch (error) {
  console.warn('❌ PDF解析库加载失败，PDF解析功能将不可用:', error.message);
}

try {
  mammoth = require('mammoth');
  console.log('✅ Word解析库加载成功');
} catch (error) {
  console.warn('❌ Word解析库加载失败，Word解析功能将不可用:', error.message);
}

class FileParser {
  
  /**
   * 解析上传的文件内容
   * @param {Buffer} fileBuffer - 文件缓冲区
   * @param {string} mimeType - 文件MIME类型
   * @param {string} originalName - 原始文件名
   * @returns {Promise<Object>} 解析后的简历数据
   */
  async parseFile(fileBuffer, mimeType, originalName) {
    console.log(`🔍 开始解析文件: ${originalName}`);
    console.log(`📋 文件信息: 类型=${mimeType}, 大小=${fileBuffer.length}字节`);
    
    try {
      let textContent = '';
      let parseMethod = 'unknown';
      
      // 根据文件类型选择解析方法
      if (mimeType === 'application/pdf') {
        console.log('📄 识别为PDF文件');
        if (pdfParse) {
          try {
            textContent = await this.parsePDF(fileBuffer);
            parseMethod = 'pdf-parse';
            console.log('✅ PDF解析成功，提取文本长度:', textContent.length);
          } catch (pdfError) {
            console.warn('⚠️ PDF解析失败，使用备用方案:', pdfError.message);
            textContent = this.createFallbackContent(originalName, 'PDF');
            parseMethod = 'fallback-pdf';
          }
        } else {
          console.warn('⚠️ PDF解析库不可用，使用备用方案');
          textContent = this.createFallbackContent(originalName, 'PDF');
          parseMethod = 'fallback-no-lib';
        }
      } else if (mimeType === 'application/msword' || 
                 mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        console.log('📝 识别为Word文档');
        if (mammoth) {
          try {
            textContent = await this.parseWord(fileBuffer);
            parseMethod = 'mammoth';
            console.log('✅ Word解析成功，提取文本长度:', textContent.length);
          } catch (wordError) {
            console.warn('⚠️ Word解析失败，使用备用方案:', wordError.message);
            textContent = this.createFallbackContent(originalName, 'Word');
            parseMethod = 'fallback-word';
          }
        } else {
          console.warn('⚠️ Word解析库不可用，使用备用方案');
          textContent = this.createFallbackContent(originalName, 'Word');
          parseMethod = 'fallback-no-lib';
        }
      } else if (mimeType === 'text/plain') {
        console.log('📝 识别为文本文件');
        // 尝试不同的编码方式
        try {
          textContent = fileBuffer.toString('utf8');
          // 如果包含乱码，尝试其他编码
          if (textContent.includes('�')) {
            textContent = fileBuffer.toString('gbk');
          }
        } catch (error) {
          textContent = fileBuffer.toString('utf8');
        }
        parseMethod = 'text-plain';
        console.log('✅ 文本文件解析成功，提取文本长度:', textContent.length);
      } else {
        console.warn('❌ 不支持的文件格式:', mimeType);
        throw new Error(`不支持的文件格式: ${mimeType}`);
      }
      
      // 解析文本内容为结构化简历数据
      console.log('🔄 开始结构化解析...');
      const resumeData = this.parseTextToResume(textContent, originalName);
      
      // 添加解析方法信息
      resumeData.fileInfo = {
        originalName: originalName,
        size: fileBuffer.length,
        mimeType: mimeType,
        parseMethod: parseMethod,
        textLength: textContent.length
      };
      
      console.log('✅ 文件解析完成');
      return resumeData;
      
    } catch (error) {
      console.error('❌ 文件解析失败:', error.message);
      // 即使解析失败，也返回基本的简历结构
      return this.createFallbackResume(originalName, error.message);
    }
  }
  
  /**
   * 解析PDF文件
   * @param {Buffer} fileBuffer 
   * @returns {Promise<string>}
   */
  async parsePDF(fileBuffer) {
    try {
      console.log('📄 开始解析PDF文件，大小:', fileBuffer.length, '字节');
      
      if (!pdfParse) {
        throw new Error('PDF解析库未加载');
      }
      
      // pdf-parse 的正确使用方式
      const data = await pdfParse(fileBuffer, {
        // 设置解析选项
        max: 0, // 解析所有页面
        version: 'v1.10.100'
      });
      
      console.log('✅ PDF解析成功，提取文本长度:', data.text.length);
      return data.text || '';
    } catch (error) {
      console.error('❌ PDF解析失败:', error.message);
      throw new Error('PDF文件解析失败: ' + error.message);
    }
  }
  
  /**
   * 解析Word文档
   * @param {Buffer} fileBuffer 
   * @returns {Promise<string>}
   */
  async parseWord(fileBuffer) {
    try {
      console.log('📝 开始解析Word文档，大小:', fileBuffer.length, '字节');
      
      if (!mammoth) {
        throw new Error('Word解析库未加载');
      }
      
      // 尝试解析Word文档
      const result = await mammoth.extractRawText({ 
        buffer: fileBuffer,
        // 添加解析选项
        options: {
          includeDefaultStyleMap: true
        }
      });
      
      console.log('✅ Word解析成功，提取文本长度:', result.value.length);
      
      // 检查是否有警告信息
      if (result.messages && result.messages.length > 0) {
        console.log('⚠️ Word解析警告:', result.messages.map(m => m.message).join(', '));
      }
      
      return result.value || '';
    } catch (error) {
      console.error('❌ Word文档解析失败:', error.message);
      throw new Error('Word文档解析失败: ' + error.message);
    }
  }
  
  /**
   * 将文本内容解析为结构化简历数据
   * @param {string} textContent 
   * @param {string} fileName 
   * @returns {Object}
   */
  parseTextToResume(textContent, fileName) {
    // 基本简历结构
    const resume = {
      title: fileName.replace(/\.[^/.]+$/, ""),
      personalInfo: this.extractPersonalInfo(textContent),
      jobIntention: this.extractJobIntention(textContent),
      education: this.extractEducation(textContent),
      experience: this.extractExperience(textContent),
      skills: this.extractSkills(textContent),
      projects: this.extractProjects(textContent),
      rawText: textContent // 保存原始文本供AI分析
    };
    
    return resume;
  }
  
  /**
   * 提取个人信息
   */
  extractPersonalInfo(text) {
    const personalInfo = {
      name: '',
      phone: '',
      email: '',
      gender: '',
      age: '',
      address: ''
    };
    
    // 提取姓名（通常在简历开头）
    const nameMatch = text.match(/^[\u4e00-\u9fa5]{2,4}|姓名[：:]\s*([^\n\r]+)/);
    if (nameMatch) {
      personalInfo.name = nameMatch[1] || nameMatch[0];
    }
    
    // 提取手机号
    const phoneMatch = text.match(/1[3-9]\d{9}/);
    if (phoneMatch) {
      personalInfo.phone = phoneMatch[0];
    }
    
    // 提取邮箱
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      personalInfo.email = emailMatch[0];
    }
    
    // 提取性别
    const genderMatch = text.match(/性别[：:]\s*([男女])/);
    if (genderMatch) {
      personalInfo.gender = genderMatch[1];
    }
    
    // 提取年龄
    const ageMatch = text.match(/年龄[：:]\s*(\d+)|(\d+)岁/);
    if (ageMatch) {
      personalInfo.age = ageMatch[1] || ageMatch[2];
    }
    
    return personalInfo;
  }
  
  /**
   * 提取求职意向
   */
  extractJobIntention(text) {
    const jobIntention = {
      position: '',
      salary: '',
      city: '',
      jobType: ''
    };
    
    // 提取期望职位
    const positionMatch = text.match(/求职意向[：:]?\s*([^\n\r]+)|期望职位[：:]?\s*([^\n\r]+)/);
    if (positionMatch) {
      jobIntention.position = positionMatch[1] || positionMatch[2];
    }
    
    // 提取期望薪资
    const salaryMatch = text.match(/期望薪资[：:]?\s*([^\n\r]+)|薪资要求[：:]?\s*([^\n\r]+)/);
    if (salaryMatch) {
      jobIntention.salary = salaryMatch[1] || salaryMatch[2];
    }
    
    return jobIntention;
  }
  
  /**
   * 提取教育经历
   */
  extractEducation(text) {
    const education = [];
    
    // 简单的教育经历提取
    const eduMatches = text.match(/\d{4}[年\-\.]\d{1,2}[\-\.年月]*\d{0,2}[月日]*[\s\-~至到]*\d{4}[年\-\.]\d{1,2}[\-\.年月]*\d{0,2}[月日]*[\s]*([^\n\r]+学[院校]|[^\n\r]*大学)/g);
    
    if (eduMatches) {
      eduMatches.forEach(match => {
        education.push({
          school: match,
          major: '',
          degree: '',
          startDate: '',
          endDate: '',
          description: match
        });
      });
    }
    
    return education;
  }
  
  /**
   * 提取工作经历
   */
  extractExperience(text) {
    const experience = [];
    
    // 简单的工作经历提取
    const expMatches = text.match(/\d{4}[年\-\.]\d{1,2}[\-\.年月]*\d{0,2}[月日]*[\s\-~至到]*\d{4}[年\-\.]\d{1,2}[\-\.年月]*\d{0,2}[月日]*[\s]*([^\n\r]+公司|[^\n\r]+有限公司)/g);
    
    if (expMatches) {
      expMatches.forEach(match => {
        experience.push({
          company: match,
          position: '',
          startDate: '',
          endDate: '',
          description: match
        });
      });
    }
    
    return experience;
  }
  
  /**
   * 提取技能
   */
  extractSkills(text) {
    const skills = [];
    
    // 常见技能关键词
    const skillKeywords = [
      'JavaScript', 'Java', 'Python', 'C++', 'C#', 'PHP', 'Go', 'Rust',
      'Vue', 'React', 'Angular', 'Node.js', 'Express', 'Spring', 'Django',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
      'Git', 'Linux', 'AWS', 'Azure', 'HTML', 'CSS', 'TypeScript'
    ];
    
    skillKeywords.forEach(skill => {
      if (text.includes(skill)) {
        skills.push({
          name: skill,
          level: 80 // 默认熟练度
        });
      }
    });
    
    return skills;
  }
  
  /**
   * 提取项目经历
   */
  extractProjects(text) {
    const projects = [];
    
    // 简单的项目提取（查找"项目"关键词）
    const projectMatches = text.match(/项目[名称经历]?[：:]?\s*([^\n\r]+)/g);
    
    if (projectMatches) {
      projectMatches.forEach(match => {
        projects.push({
          name: match,
          role: '',
          startDate: '',
          endDate: '',
          description: match,
          technologies: []
        });
      });
    }
    
    return projects;
  }
  
  /**
   * 创建备用文本内容（当文件解析失败时）
   */
  createFallbackContent(fileName, fileType) {
    return `简历文件: ${fileName}
文件类型: ${fileType}
注意: 由于技术限制，无法解析${fileType}文件的具体内容，但AI仍会基于文件名和基本信息进行评测。
建议: 请确保简历包含完整的个人信息、工作经历、教育背景和技能描述。`;
  }
  
  /**
   * 创建备用简历结构（当完全解析失败时）
   */
  createFallbackResume(fileName, errorMessage) {
    return {
      title: fileName.replace(/\.[^/.]+$/, ""),
      personalInfo: {
        name: '文件用户',
        phone: '',
        email: '',
        gender: '',
        age: '',
        address: ''
      },
      jobIntention: {
        position: '',
        salary: '',
        city: '',
        jobType: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: [],
      rawText: this.createFallbackContent(fileName, '未知格式'),
      parseError: errorMessage,
      note: '文件解析遇到技术问题，AI将基于基本信息进行评测'
    };
  }
}

module.exports = new FileParser();

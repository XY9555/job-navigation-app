// 移动端专用网络请求 - 解决所有网络连接问题
const API_BASE = 'https://job-navigation-api.onrender.com/api';

// 使用XMLHttpRequest的请求方法（更兼容移动端）
function createXHRRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const method = options.method || 'GET';
    
    // 设置超时时间
    xhr.timeout = 120000; // 2分钟
    
    // 打开请求
    xhr.open(method, url, true);
    
    // 设置请求头
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    
    if (options.token) {
      xhr.setRequestHeader('Authorization', `Bearer ${options.token}`);
    }
    
    // 处理响应
    xhr.onload = function() {
      console.log('📡 XHR响应状态:', xhr.status);
      
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve({
            ok: true,
            status: xhr.status,
            data: data
          });
        } catch (e) {
          resolve({
            ok: true,
            status: xhr.status,
            data: { message: xhr.responseText }
          });
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          resolve({
            ok: false,
            status: xhr.status,
            data: errorData
          });
        } catch (e) {
          resolve({
            ok: false,
            status: xhr.status,
            data: { message: xhr.responseText || 'Request failed' }
          });
        }
      }
    };
    
    // 处理网络错误
    xhr.onerror = function() {
      console.error('❌ XHR网络错误');
      reject(new Error('网络连接失败'));
    };
    
    // 处理超时
    xhr.ontimeout = function() {
      console.error('❌ XHR请求超时');
      reject(new Error('请求超时'));
    };
    
    // 发送请求
    if (options.body) {
      xhr.send(JSON.stringify(options.body));
    } else {
      xhr.send();
    }
  });
}

// 使用fetch的请求方法（作为备用）
async function createFetchRequest(url, options = {}) {
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };
  
  if (options.token) {
    config.headers['Authorization'] = `Bearer ${options.token}`;
  }
  
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }
  
  const response = await fetch(url, config);
  const data = await response.json();
  
  return {
    ok: response.ok,
    status: response.status,
    data: data
  };
}

// 智能请求方法 - 自动选择最佳方案
async function smartRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  console.log('🌐 智能请求:', url);
  
  try {
    // 首先尝试XMLHttpRequest（移动端更稳定）
    console.log('🔄 尝试XHR请求...');
    return await createXHRRequest(url, options);
  } catch (xhrError) {
    console.warn('⚠️ XHR失败，尝试fetch:', xhrError.message);
    
    try {
      // 如果XHR失败，尝试fetch
      console.log('🔄 尝试fetch请求...');
      return await createFetchRequest(url, options);
    } catch (fetchError) {
      console.error('❌ 所有请求方法都失败了');
      throw new Error(`网络连接失败: ${fetchError.message}`);
    }
  }
}

// 导出移动端API
export const MobileAPI = {
  // 健康检查
  async healthCheck() {
    return smartRequest('/health');
  },
  
  // 登录
  async login(phone, password) {
    return smartRequest('/auth/login', {
      method: 'POST',
      body: { phone, password }
    });
  },
  
  // 注册
  async register(userData) {
    return smartRequest('/auth/register', {
      method: 'POST',
      body: userData
    });
  },
  
  // 获取用户信息
  async getUserProfile(token) {
    return smartRequest('/users/profile', {
      method: 'GET',
      token: token
    });
  },
  
  // 获取简历列表
  async getResumes(token) {
    return smartRequest('/resumes', {
      method: 'GET',
      token: token
    });
  },
  
  // 创建简历
  async createResume(resumeData, token) {
    return smartRequest('/resumes', {
      method: 'POST',
      body: resumeData,
      token: token
    });
  },
  
  // AI简历评测
  async evaluateResume(resumeId, options, token) {
    return smartRequest(`/ai/evaluate-resume/${resumeId}`, {
      method: 'POST',
      body: { evaluationOptions: options },
      token: token
    });
  },
  
  // 职位匹配分析
  async analyzeJobMatching(data, token) {
    return smartRequest('/ai/job-matching', {
      method: 'POST',
      body: data,
      token: token
    });
  },
  
  // 生成面试问题
  async generateInterviewQuestions(data, token) {
    return smartRequest('/ai/interview-questions', {
      method: 'POST',
      body: data,
      token: token
    });
  }
};

export default MobileAPI;

// 网络诊断工具
export class NetworkDiagnostics {
  static async testConnection(apiUrl) {
    const results = {
      timestamp: new Date().toISOString(),
      apiUrl: apiUrl,
      tests: []
    };

    // 测试1：基本连通性
    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit'
      });
      
      results.tests.push({
        name: '健康检查',
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        message: response.ok ? '连接成功' : `HTTP ${response.status}`
      });
    } catch (error) {
      results.tests.push({
        name: '健康检查',
        status: 'error',
        message: error.message
      });
    }

    // 测试2：CORS预检
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'OPTIONS',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });
      
      results.tests.push({
        name: 'CORS预检',
        status: response.ok ? 'success' : 'failed',
        statusCode: response.status,
        message: response.ok ? 'CORS配置正确' : 'CORS配置问题'
      });
    } catch (error) {
      results.tests.push({
        name: 'CORS预检',
        status: 'error',
        message: error.message
      });
    }

    // 测试3：模拟登录请求
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phone: 'test',
          password: 'test'
        }),
        mode: 'cors',
        credentials: 'omit'
      });
      
      results.tests.push({
        name: '登录请求',
        status: 'success',
        statusCode: response.status,
        message: `请求发送成功 (${response.status})`
      });
    } catch (error) {
      results.tests.push({
        name: '登录请求',
        status: 'error',
        message: error.message
      });
    }

    return results;
  }

  static async displayResults(results) {
    let message = `网络诊断结果 (${results.timestamp})\n`;
    message += `API地址: ${results.apiUrl}\n\n`;
    
    results.tests.forEach(test => {
      const status = test.status === 'success' ? '✅' : 
                    test.status === 'failed' ? '⚠️' : '❌';
      message += `${status} ${test.name}: ${test.message}\n`;
      if (test.statusCode) {
        message += `   状态码: ${test.statusCode}\n`;
      }
    });

    console.log(message);
    
    // 在移动端显示结果
    if (window.Capacitor) {
      alert(message);
    }
    
    return message;
  }
}
// Token帮助工具
export const TokenHelper = {
  // 清理所有认证信息
  clearAuth() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    console.log('✅ 认证信息已清理');
  },
  
  // 检查token是否存在
  hasToken() {
    return !!localStorage.getItem('userToken');
  },
  
  // 获取token
  getToken() {
    return localStorage.getItem('userToken');
  },
  
  // 设置token
  setToken(token) {
    localStorage.setItem('userToken', token);
  },
  
  // 设置用户信息
  setUserInfo(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  },
  
  // 获取用户信息
  getUserInfo() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },
  
  // 自动登录测试用户
  async autoLoginTestUser() {
    try {
      const SmartAPI = (await import('@/services/smart-api.js')).default;
      const result = await SmartAPI.login('13800138000', '123456');
      
      if (result.success) {
        const token = result.data.data?.token || result.data.token;
        const user = result.data.data?.user || result.data.user;
        
        this.setToken(token);
        this.setUserInfo(user);
        
        console.log('✅ 自动登录成功');
        return true;
      } else {
        console.error('❌ 自动登录失败:', result.error);
        return false;
      }
    } catch (error) {
      console.error('❌ 自动登录错误:', error);
      return false;
    }
  }
};
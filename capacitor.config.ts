import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jobnavigation.app',
  appName: '求职导航',
  webDir: 'dist',
  // 生产模式：注释掉server配置，让APP使用打包的静态文件
  // server: {
  //   androidScheme: 'http',
  //   url: 'http://192.168.112.212:8080',
  //   cleartext: true,
  //   allowNavigation: ['*']
  // },
  plugins: {
    StatusBar: {
      style: 'DARK_CONTENT',
      backgroundColor: '#ffffff',
      overlaysWebView: false
    }
  }
};

export default config;




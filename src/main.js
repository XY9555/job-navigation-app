import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Lazyload } from 'vant'
import 'vant/lib/index.css'
import './styles/global.css'
import { OfflineHandler } from './utils/offline-handler.js'
import networkChecker from './utils/network-checker.js'

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的Promise拒绝:', event.reason);
  event.preventDefault(); // 防止应用崩溃
});

const app = createApp(App)

// 全局错误处理器
app.config.errorHandler = (err, vm, info) => {
  console.error('Vue错误:', err, info);
  // 在生产环境中，可以发送错误报告到服务器
};

app.use(router)
app.use(Lazyload)

// 设置离线处理
OfflineHandler.setupOfflineHandling();

// 在Capacitor环境中进行网络诊断
if (window.Capacitor) {
  // 等待应用完全加载后进行网络检查
  setTimeout(async () => {
    console.log('🔍 开始移动端网络诊断...');
    const diagnostics = await networkChecker.diagnoseNetwork();
    
    if (!diagnostics.apiConnectivity.success) {
      console.error('⚠️ 网络连接问题:', networkChecker.getErrorMessage(diagnostics));
      
      // 可以在这里显示用户友好的错误提示
      if (window.showToast) {
        window.showToast(networkChecker.getErrorMessage(diagnostics));
      }
    } else {
      console.log('✅ 网络连接正常，可以正常使用应用');
    }
  }, 3000);
}

app.mount('#app')




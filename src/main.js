import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Lazyload } from 'vant'
import 'vant/lib/index.css'
import './styles/global.css'

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
};

app.use(router)
app.use(Lazyload)

console.log('💻 PC端应用已启动');

app.mount('#app')




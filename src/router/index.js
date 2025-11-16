import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import MyProfile from '@/views/MyProfile.vue'
import MyResume from '@/views/MyResume.vue'
import CreateResume from '@/views/CreateResume.vue'
import FillResume1 from '@/views/FillResume1.vue'
import FillResume2 from '@/views/FillResume2.vue'
import ResumeEvaluation from '@/views/ResumeEvaluation.vue'
import EvaluationResult from '@/views/EvaluationResult.vue'
import JobMatching from '@/views/JobMatching.vue'
import MatchingResult from '@/views/MatchingResult.vue'
import InterviewQuestions from '@/views/InterviewQuestions.vue'
import NewChat from '@/views/NewChat.vue'
import Feedback from '@/views/Feedback.vue'
import AboutUs from '@/views/AboutUs.vue'
import AccountSecurity from '@/views/AccountSecurity.vue'
import UserSettings from '@/views/UserSettings.vue'
import ChangePassword from '@/views/ChangePassword.vue'
import BindEmail from '@/views/BindEmail.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { title: '首页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { title: '注册' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { title: '忘记密码' }
  },
  {
    path: '/my-profile',
    name: 'MyProfile',
    component: MyProfile,
    meta: { title: '我的主页' }
  },
  {
    path: '/my-resume',
    name: 'MyResume',
    component: MyResume,
    meta: { title: '我的简历' }
  },
  {
    path: '/create-resume',
    name: 'CreateResume',
    component: CreateResume,
    meta: { title: '新建简历' }
  },
  {
    path: '/fill-resume-1',
    name: 'FillResume1',
    component: FillResume1,
    meta: { title: '填写简历' }
  },
  {
    path: '/fill-resume-2',
    name: 'FillResume2',
    component: FillResume2,
    meta: { title: '完善简历' }
  },
  {
    path: '/resume-evaluation',
    name: 'ResumeEvaluation',
    component: ResumeEvaluation,
    meta: { title: '简历评测' }
  },
  {
    path: '/evaluation-result',
    name: 'EvaluationResult',
    component: EvaluationResult,
    meta: { title: '评测结果' }
  },
  {
    path: '/job-matching',
    name: 'JobMatching',
    component: JobMatching,
    meta: { title: '职位匹配分析' }
  },
  {
    path: '/matching-result',
    name: 'MatchingResult',
    component: MatchingResult,
    meta: { title: '匹配结果' }
  },
  {
    path: '/interview-questions',
    name: 'InterviewQuestions',
    component: InterviewQuestions,
    meta: { title: '面试问题生成' }
  },
  {
    path: '/new-chat',
    name: 'NewChat',
    component: NewChat,
    meta: { title: '新对话' }
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: Feedback,
    meta: { title: '意见反馈' }
  },
  {
    path: '/about-us',
    name: 'AboutUs',
    component: AboutUs,
    meta: { title: '关于我们' }
  },
  {
    path: '/account-security',
    name: 'AccountSecurity',
    component: AccountSecurity,
    meta: { title: '账户安全' }
  },
  {
    path: '/user-settings',
    name: 'UserSettings',
    component: UserSettings,
    meta: { title: '个人设置' }
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: ChangePassword,
    meta: { title: '修改密码' }
  },
  {
    path: '/bind-email',
    name: 'BindEmail',
    component: BindEmail,
    meta: { title: '邮箱绑定' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 求职导航`
  }
  
  // 检查是否已登录
  const token = localStorage.getItem('userToken')
  
  // 不需要登录验证的页面
  const publicPages = ['/login', '/register', '/forgot-password']
  const isPublicPage = publicPages.includes(to.path)
  
  if (!token && !isPublicPage) {
    // 未登录且访问需要登录的页面，重定向到登录页
    next('/login')
  } else if (token && to.path === '/login') {
    // 已登录但访问登录页，重定向到首页
    next('/home')
  } else {
    // 其他情况正常访问
    next()
  }
})

export default router




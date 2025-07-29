import { createRouter, createWebHistory } from 'vue-router'

// 导入各个模块的路由组件
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页', requiresAuth: true }
  },
  {
    path: '/customer-demand',
    name: 'CustomerDemand',
    component: () => import('../views/CustomerDemand.vue'),
    meta: { title: '客户需求', requiresAuth: true }
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('../views/Purchase.vue'),
    meta: { title: '材料采购', requiresAuth: true }
  },
  {
    path: '/quality-inspection',
    name: 'QualityInspection',
    component: () => import('../views/QualityInspection.vue'),
    meta: { title: '质检管理', requiresAuth: true }
  },
  {
    path: '/production',
    name: 'Production',
    component: () => import('../views/Production.vue'),
    meta: { title: '生产排期', requiresAuth: true }
  },
  {
    path: '/outsourcing',
    name: 'Outsourcing',
    component: () => import('../views/Outsourcing.vue'),
    meta: { title: '委外加工', requiresAuth: true }
  },
  {
    path: '/engineering',
    name: 'Engineering',
    component: () => import('../views/Engineering.vue'),
    meta: { title: '工程调试', requiresAuth: true }
  },
  {
    path: '/material-in',
    name: 'MaterialIn',
    component: () => import('../views/MaterialIn.vue'),
    meta: { title: '原料入库', requiresAuth: true }
  },
  {
    path: '/product-in',
    name: 'ProductIn',
    component: () => import('../views/ProductIn.vue'),
    meta: { title: '成品入库', requiresAuth: true }
  },
  {
    path: '/shipment',
    name: 'Shipment',
    component: () => import('../views/Shipment.vue'),
    meta: { title: '出货管理', requiresAuth: true }
  },
  {
    path: '/permission',
    name: 'Permission',
    component: () => import('../views/Permission.vue'),
    meta: { title: '权限管理', requiresAuth: true }
  },
  {
    path: '/report',
    name: 'Report',
    component: () => import('../views/Report.vue'),
    meta: { title: '生产报告', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫，设置页面标题和登录验证
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title + ' - 典名工厂智能管理系统'
  }
  
  // 检查登录状态
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  
  // 如果访问的是登录页面
  if (to.path === '/login') {
    // 如果已经登录，重定向到首页
    if (isLoggedIn) {
      next('/')
    } else {
      next()
    }
  } else {
    // 如果访问的是需要登录的页面
    if (to.meta.requiresAuth !== false) {
      if (isLoggedIn) {
        next()
      } else {
        // 未登录，重定向到登录页面
        next('/login')
      }
    } else {
      next()
    }
  }
})

export default router
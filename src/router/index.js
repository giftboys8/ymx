import { createRouter, createWebHistory } from 'vue-router'

// 导入各个模块的路由组件
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/customer-demand',
    name: 'CustomerDemand',
    component: () => import('../views/CustomerDemand.vue'),
    meta: { title: '客户需求计划' }
  },
  {
    path: '/purchase',
    name: 'Purchase',
    component: () => import('../views/Purchase.vue'),
    meta: { title: '采购管理' }
  },
  {
    path: '/quality-inspection',
    name: 'QualityInspection',
    component: () => import('../views/QualityInspection.vue'),
    meta: { title: '质检管理' }
  },
  {
    path: '/production',
    name: 'Production',
    component: () => import('../views/Production.vue'),
    meta: { title: '生产排期' }
  },
  {
    path: '/outsourcing',
    name: 'Outsourcing',
    component: () => import('../views/Outsourcing.vue'),
    meta: { title: '委外加工' }
  },
  {
    path: '/engineering',
    name: 'Engineering',
    component: () => import('../views/Engineering.vue'),
    meta: { title: '工程调试' }
  },
  {
    path: '/material-in',
    name: 'MaterialIn',
    component: () => import('../views/MaterialIn.vue'),
    meta: { title: '原料入库' }
  },
  {
    path: '/product-in',
    name: 'ProductIn',
    component: () => import('../views/ProductIn.vue'),
    meta: { title: '成品入库' }
  },
  {
    path: '/shipment',
    name: 'Shipment',
    component: () => import('../views/Shipment.vue'),
    meta: { title: '出货管理' }
  },
  {
    path: '/permission',
    name: 'Permission',
    component: () => import('../views/Permission.vue'),
    meta: { title: '权限管理' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫，设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `生产管理系统 - ${to.meta.title}`
  }
  next()
})

export default router
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const isCollapse = ref(false)
const isMobile = ref(false)
const drawerVisible = ref(false)
const username = ref('')

// 检测是否为移动设备
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) {
    isCollapse.value = true
  }
}

// 处理窗口大小变化
const handleResize = () => {
  checkMobile()
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', handleResize)
  // 获取用户名
  username.value = localStorage.getItem('username') || '管理员'
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleSelect = (key) => {
  router.push(key)
  if (isMobile.value) {
    drawerVisible.value = false
  }
}

const toggleMobileMenu = () => {
  if (isMobile.value) {
    drawerVisible.value = !drawerVisible.value
  } else {
    isCollapse.value = !isCollapse.value
  }
}

// 处理下拉菜单命令
const handleCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage({
        type: 'info',
        message: '个人信息功能开发中...'
      })
      break
    case 'password':
      ElMessage({
        type: 'info',
        message: '修改密码功能开发中...'
      })
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 清除登录状态
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('username')
    
    ElMessage({
      type: 'success',
      message: '已退出登录'
    })
    
    // 跳转到登录页面
    router.push('/login')
  }).catch(() => {
    // 取消退出
  })
}
</script>

<template>
  <el-container class="layout-container">
    <!-- 桌面端侧边栏 -->
    <el-aside v-if="!isMobile" width="auto" class="aside">
      <div class="logo-container">
        <img src="/docs/dm-logo.png" class="logo" alt="典名Logo" />
        <span v-if="!isCollapse" class="title">典名</span><br>
        <span class="subtitle">智能制造管理平台</span>
      </div>
      <el-menu
        :default-active="$route.path"
        class="el-menu-vertical"
        :collapse="isCollapse"
        @select="handleSelect"
        background-color="#001529"
        text-color="#fff"
        active-text-color="#409EFF">
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/customer-demand">
          <el-icon><Document /></el-icon>
          <template #title>客户需求</template>
        </el-menu-item>
        <el-menu-item index="/purchase">
          <el-icon><ShoppingCart /></el-icon>
          <template #title>材料采购</template>
        </el-menu-item>
        <el-menu-item index="/quality-inspection">
          <el-icon><Check /></el-icon>
          <template #title>质检管理</template>
        </el-menu-item>
        <el-menu-item index="/engineering">
          <el-icon><Tools /></el-icon>
          <template #title>工程调试</template>
        </el-menu-item>
        <el-menu-item index="/production">
          <el-icon><SetUp /></el-icon>
          <template #title>生产排期</template>
        </el-menu-item>
        <el-menu-item index="/outsourcing">
          <el-icon><Connection /></el-icon>
          <template #title>委外加工</template>
        </el-menu-item>
        <el-menu-item index="/material-in">
          <el-icon><Goods /></el-icon>
          <template #title>原料入库</template>
        </el-menu-item>
        <el-menu-item index="/product-in">
          <el-icon><Box /></el-icon>
          <template #title>成品入库</template>
        </el-menu-item>
        <el-menu-item index="/shipment">
          <el-icon><Van /></el-icon>
          <template #title>出货管理</template>
        </el-menu-item>
        <el-menu-item index="/permission">
          <el-icon><Lock /></el-icon>
          <template #title>权限管理</template>
        </el-menu-item>
        <el-menu-item index="/report">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>生产报告</template>
        </el-menu-item>
      </el-menu>
      <div class="collapse-btn" @click="toggleMobileMenu">
        <el-icon v-if="isCollapse"><ArrowRight /></el-icon>
        <el-icon v-else><ArrowLeft /></el-icon>
      </div>
    </el-aside>

    <!-- 移动端抽屉菜单 -->
    <el-drawer
      v-if="isMobile"
      v-model="drawerVisible"
      title="菜单"
      direction="ltr"
      size="280px"
      class="mobile-drawer">
      <div class="mobile-logo-container">
        <img src="/docs/dm-logo.png" class="logo" alt="典名Logo" />
        <div class="mobile-title">
          <span class="title">典名</span>
          <span class="subtitle">智能制造管理平台</span>
        </div>
      </div>
      <el-menu
        :default-active="$route.path"
        class="mobile-menu"
        @select="handleSelect"
        background-color="#fff"
        text-color="#333"
        active-text-color="#409EFF">
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/customer-demand">
          <el-icon><Document /></el-icon>
          <template #title>客户需求</template>
        </el-menu-item>
        <el-menu-item index="/purchase">
          <el-icon><ShoppingCart /></el-icon>
          <template #title>材料采购</template>
        </el-menu-item>
        <el-menu-item index="/quality-inspection">
          <el-icon><Check /></el-icon>
          <template #title>质检管理</template>
        </el-menu-item>
        <el-menu-item index="/engineering">
          <el-icon><Tools /></el-icon>
          <template #title>工程调试</template>
        </el-menu-item>
        <el-menu-item index="/production">
          <el-icon><SetUp /></el-icon>
          <template #title>生产排期</template>
        </el-menu-item>
        <el-menu-item index="/outsourcing">
          <el-icon><Connection /></el-icon>
          <template #title>委外加工</template>
        </el-menu-item>
        <el-menu-item index="/material-in">
          <el-icon><Goods /></el-icon>
          <template #title>原料入库</template>
        </el-menu-item>
        <el-menu-item index="/product-in">
          <el-icon><Box /></el-icon>
          <template #title>成品入库</template>
        </el-menu-item>
        <el-menu-item index="/shipment">
          <el-icon><Van /></el-icon>
          <template #title>出货管理</template>
        </el-menu-item>
        <el-menu-item index="/permission">
          <el-icon><Lock /></el-icon>
          <template #title>权限管理</template>
        </el-menu-item>
        <el-menu-item index="/report">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>生产报告</template>
        </el-menu-item>
      </el-menu>
    </el-drawer>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <!-- 移动端汉堡菜单按钮 -->
          <el-button
            v-if="isMobile"
            class="mobile-menu-btn"
            type="text"
            @click="toggleMobileMenu">
            <el-icon size="20"><Menu /></el-icon>
          </el-button>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ username || '管理员' }}
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
/* 全局样式 */
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

#app {
  height: 100vh;
}

/* 布局样式 */
.layout-container {
  height: 100%;
}

.aside {
  background-color: #001529;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.3s;
  height: 100vh;
}

.logo-container {
  height: auto;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  color: white;
  background-color: #002140;
}

.logo {
  height: 40px;
  margin-bottom: 5px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-right: 10px;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.el-menu-vertical {
  border: none;
  height: calc(100vh - 80px);
  overflow-y: auto;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left, .header-right {
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.collapse-btn {
  position: absolute;
  bottom: 20px;
  right: -15px;
  width: 30px;
  height: 30px;
  background-color: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 移动端样式 */
@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }
  
  .header {
    padding: 0 15px;
    height: 50px !important;
  }
  
  .mobile-menu-btn {
    margin-right: 10px;
    padding: 5px;
  }
  
  .header-left {
    flex: 1;
    display: flex;
    align-items: center;
  }
  
  .header-right {
    margin-left: auto;
  }
  
  .el-breadcrumb {
    font-size: 14px;
  }
  
  .el-main {
    padding: 10px;
  }
}

/* 移动端抽屉样式 */
.mobile-drawer .mobile-logo-container {
  display: flex;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 10px;
}

.mobile-drawer .mobile-logo-container .logo {
  height: 40px;
  margin-right: 15px;
}

.mobile-drawer .mobile-title {
  display: flex;
  flex-direction: column;
}

.mobile-drawer .mobile-title .title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 2px;
}

.mobile-drawer .mobile-title .subtitle {
  font-size: 12px;
  color: #666;
}

.mobile-drawer .mobile-menu {
  border: none;
}

.mobile-drawer .mobile-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
}

/* 平板端样式 */
@media (max-width: 1024px) and (min-width: 769px) {
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 180px;
  }
  
  .logo-container {
    padding: 10px 15px;
  }
  
  .title {
    font-size: 16px;
  }
  
  .header {
    padding: 0 15px;
  }
}
</style>

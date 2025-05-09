<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCollapse = ref(false)

const handleSelect = (key) => {
  router.push(key)
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="auto" class="aside">
      <div class="logo-container">
        <img src="./assets/vue.svg" class="logo" alt="Logo" />
        <span v-if="!isCollapse" class="title">运美兴</span>
        <span class="subtitle">生产管理系统</span>
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
          <template #title>客户需求计划</template>
        </el-menu-item>
        <el-menu-item index="/purchase">
          <el-icon><ShoppingCart /></el-icon>
          <template #title>采购管理</template>
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
        <el-menu-item index="/reports">
          <el-icon><Lock /></el-icon>
          <template #title>报表下载</template>
        </el-menu-item>
      </el-menu>
      <div class="collapse-btn" @click="isCollapse = !isCollapse">
        <el-icon v-if="isCollapse"><ArrowRight /></el-icon>
        <el-icon v-else><ArrowLeft /></el-icon>
      </div>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{ $route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="el-dropdown-link">
              管理员
              <el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
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
  overflow: hidden;
  transition: width 0.3s;
}

.logo-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: white;
  background-color: #002140;
}

.logo {
  height: 30px;
  margin-right: 10px;
}

.title {
  font-size: 18px;
  font-weight: bold;
  white-space: nowrap;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
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
  left: 50%;
  transform: translateX(-50%);
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
</style>

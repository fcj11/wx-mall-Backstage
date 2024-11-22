<template>
  <div class="app-container">
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical"
          :router="true"
          :collapse="isCollapse"
          background-color="#304156"
          text-color="#fff"
          active-text-color="#409EFF"
        >
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <template #title>首页</template>
          </el-menu-item>
          <el-menu-item index="/products">
            <el-icon><Goods /></el-icon>
            <template #title>商品管理</template>
          </el-menu-item>
          <el-menu-item index="/orders">
            <el-icon><List /></el-icon>
            <template #title>订单管理</template>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <template #title>系统设置</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-left">
            <el-button 
              class="collapse-btn" 
              link 
              @click="toggleCollapse"
            >
              <el-icon :size="20">
                <component :is="isCollapse ? Expand : Fold" />
              </el-icon>
            </el-button>
            <div class="breadcrumb">
              <el-breadcrumb>
                <el-breadcrumb-item 
                  v-for="item in breadcrumbItems" 
                  :key="item.path"
                  :to="item.path ? { path: item.path } : null"
                >
                  {{ item.name }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="userAvatar" />
                <span class="username">{{ username }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleProfile">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.app-container {
  height: 100vh;
}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.el-menu-vertical {
  height: 100%;
  border-right: none !important;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 200px;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  height: 100%;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 0 8px;
  height: 60px;
}

.username {
  font-size: 14px;
  color: #606266;
}

.breadcrumb {
  margin-left: 8px;
}

.el-main {
  background-color: #f0f2f5;
  padding: 0;
}

/* 修复菜单折叠时的图标对齐问题 */
.el-menu--collapse .el-menu-item [class^="el-icon"] {
  margin: 0;
}

.collapse-btn {
  padding: 0;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  background-color: var(--el-color-primary-light-9);
  border-radius: 4px;
}

/* 添加菜单图标样式 */
:deep(.el-menu-item) {
  .el-icon {
    width: 24px;
    height: 24px;
  }
}

/* 修复折叠时的样式 */
:deep(.el-menu--collapse) {
  width: 64px;
  
  .el-menu-item {
    padding: 0 !important;
    text-align: center;
  }
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu--collapse) {
  border-right: none;
}

:deep(.el-menu-item) {
  border-right: none;
  
  &.is-active {
    background-color: #263445 !important;
    color: var(--el-color-primary) !important;
  }
  
  &:hover {
    background-color: #263445 !important;
    color: var(--el-color-primary) !important;
  }
}

/* 修复折叠菜单的样式 */
:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  border-right: none;
  
  &.is-active {
    background-color: #263445 !important;
    color: var(--el-color-primary) !important;
  }
  
  &:hover {
    background-color: #263445 !important;
    color: var(--el-color-primary) !important;
  }
}

/* 修复折叠时的弹出菜单样式 */
:deep(.el-menu--popup) {
  background-color: #304156 !important;
  
  .el-menu-item {
    background-color: #304156;
    color: #fff;
    
    &:hover {
      background-color: #263445 !important;
      color: var(--el-color-primary) !important;
    }
    
    &.is-active {
      background-color: #263445 !important;
      color: var(--el-color-primary) !important;
    }
  }
}

/* 修复折叠时的弹出菜单样式 */
:deep(.el-menu--vertical) {
  .el-menu--popup {
    min-width: 200px;
  }
  
  .el-menu-item {
    padding: 0 20px !important;
    text-align: left;
  }
}
</style>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  HomeFilled, 
  Goods, 
  List, 
  User, 
  Setting,
  Expand,
  Fold
} from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const username = ref('Admin')
const userAvatar = ref('https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 路由映射表
const routeMap = {
  '/': '首页',
  '/products': '商品管理',
  '/products/new': '添加商品',
  '/orders': '订单管理',
  '/users': '用户管理',
  '/settings': '系统设置'
}

// 计算当前路由的面包屑
const currentRoute = computed(() => {
  // 处理动态路由，如商品详情页
  if (route.path.match(/^\/products\/\d+$/)) {
    return '商品详情'
  }
  return routeMap[route.path] || '未知页面'
})

// 计算面包屑项
const breadcrumbItems = computed(() => {
  const items = [{ path: '/', name: '首页' }]
  
  if (route.path === '/') {
    return items
  }

  // 处理商品相关路由
  if (route.path.startsWith('/products')) {
    items.push({ path: '/products', name: '商品管理' })
    
    if (route.path === '/products/new') {
      items.push({ path: '', name: '添加商品' })
    } else if (route.path.match(/^\/products\/\d+$/)) {
      items.push({ path: '', name: '商品详情' })
    }
    return items
  }

  // 处理其他一级路由
  const routeName = routeMap[route.path]
  if (routeName) {
    items.push({ path: route.path, name: routeName })
  }
  
  return items
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleProfile = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    localStorage.removeItem('token')
    router.push('/login')
  } catch (error) {
    console.error('退出登录取消:', error)
  }
}
</script> 
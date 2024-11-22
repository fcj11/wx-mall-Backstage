import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import { ErrorHandler } from '@/utils/errorHandler'

const app = createApp(App)
const pinia = createPinia()

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  ErrorHandler.handle(err, vm, info)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app') 
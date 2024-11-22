import axios from 'axios'
import { ElMessage } from 'element-plus'

// 直接使用默认值
const service = axios.create({
  baseURL: '/api',
  timeout: 15000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 添加请求重试机制
const retryRequest = async (error) => {
  const { config } = error
  if (!config || !config.retry) return Promise.reject(error)

  config.__retryCount = config.__retryCount || 0
  if (config.__retryCount >= config.retry) {
    return Promise.reject(error)
  }

  config.__retryCount += 1
  await new Promise(resolve => setTimeout(resolve, config.retryDelay || 1000))
  return service(config)
}

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code !== 0) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  async error => {
    // 尝试重新请求
    if (error.config && error.config.retry) {
      return retryRequest(error)
    }
    return Promise.reject(error)
  }
)

export default service 
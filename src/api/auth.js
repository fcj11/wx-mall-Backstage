import request from './config'

// 模拟数据
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    role: 'admin',
    nickname: '管理员',
    avatar: '',
    email: 'admin@example.com',
    phone: '13800138000'
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
    role: 'user',
    nickname: '测试用户',
    avatar: '',
    email: 'user@example.com',
    phone: '13900139000'
  }
]

// 使用 Promise 模拟异步请求
const mockRequest = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, delay)
  })
}

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  }).catch(() => {
    console.warn('使用模拟登录')
    const user = mockUsers.find(
      u => u.username === data.username && u.password === data.password
    )
    if (user) {
      return mockRequest({
        token: 'mock-token-' + user.id,
        user: { ...user, password: undefined }
      })
    }
    throw new Error('用户名或密码错误')
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  }).catch(() => {
    console.warn('使用模拟退出登录')
    return mockRequest({ success: true })
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/userInfo',
    method: 'get'
  }).catch(() => {
    console.warn('使用模拟用户信息')
    // 模拟从 token 获取用户 ID
    const token = localStorage.getItem('token')
    const userId = token ? parseInt(token.split('-')[2]) : null
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      return mockRequest({ ...user, password: undefined })
    }
    throw new Error('获取用户信息失败')
  })
}

export function updatePassword(data) {
  return request({
    url: '/auth/updatePassword',
    method: 'post',
    data
  }).catch(() => {
    console.warn('使用模拟修改密码')
    return mockRequest({ success: true })
  })
} 
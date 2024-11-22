import request from './config'

// 模拟数据
const mockOrders = [
  {
    id: 1,
    orderNo: 'ORD202403150001',
    customer: '张三',
    phone: '13800138000',
    address: '北京市朝阳区xxx街道',
    amount: 299.99,
    status: 'pending',
    createTime: '2024-03-15 10:00:00',
    items: [
      { productName: '示例商品1', price: 99.99, quantity: 2 },
      { productName: '示例商品2', price: 100.01, quantity: 1 }
    ]
  },
  {
    id: 2,
    orderNo: 'ORD202403150002',
    customer: '李四',
    phone: '13900139000',
    address: '上海市浦东新区xxx路',
    amount: 599.99,
    status: 'paid',
    createTime: '2024-03-15 11:00:00',
    items: [
      { productName: '示例商品3', price: 599.99, quantity: 1 }
    ]
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

export function getOrders(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  }).catch(() => {
    console.warn('使用模拟订单列表数据')
    // 模拟分页
    const { page = 1, pageSize = 10 } = params || {}
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return mockRequest({
      data: mockOrders.slice(start, end),
      total: mockOrders.length
    })
  })
}

export function getOrder(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  }).catch(() => {
    console.warn('使用模拟订单详情数据')
    const order = mockOrders.find(item => item.id === parseInt(id))
    if (order) {
      return mockRequest(order)
    }
    throw new Error('订单不存在')
  })
}

export function updateOrderStatus(id, status) {
  return request({
    url: `/orders/${id}/status`,
    method: 'put',
    data: { status }
  }).catch(() => {
    console.warn('使用模拟更新订单状态')
    const order = mockOrders.find(item => item.id === parseInt(id))
    if (order) {
      order.status = status
      return mockRequest(order)
    }
    throw new Error('订单不存在')
  })
}

export function getOrderStatistics() {
  return request({
    url: '/orders/statistics',
    method: 'get'
  })
} 
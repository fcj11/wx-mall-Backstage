// 模拟商品数据
const mockProducts = [
  { 
    id: 1, 
    name: '示例商品1', 
    price: 99.99, 
    stock: 100, 
    status: 1, 
    description: '这是示例商品1的描述' 
  },
  { 
    id: 2, 
    name: '示例商品2', 
    price: 199.99, 
    stock: 50, 
    status: 0, 
    description: '这是示例商品2的描述' 
  },
]

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟 API 响应
const mockResponse = (data) => ({
  code: 0,
  message: 'success',
  data
})

// 添加统计数据的 mock
const mockStatistics = {
  hotProducts: [
    { id: 1, name: '热销商品1', sales: 1000 },
    { id: 2, name: '热销商品2', sales: 800 },
    { id: 3, name: '热销商品3', sales: 600 },
    { id: 4, name: '热销商品4', sales: 400 },
    { id: 5, name: '热销商品5', sales: 200 }
  ],
  salesTrend: [
    { date: '2024-01', amount: 10000 },
    { date: '2024-02', amount: 15000 },
    { date: '2024-03', amount: 12000 },
    { date: '2024-04', amount: 18000 },
    { date: '2024-05', amount: 20000 }
  ],
  overview: {
    totalSales: 75000,
    totalOrders: 1200,
    totalProducts: 150,
    totalCustomers: 800
  },
  categorySales: [
    { name: '电子产品', value: 30000 },
    { name: '服装', value: 20000 },
    { name: '食品', value: 15000 },
    { name: '家居', value: 8000 },
    { name: '其他', value: 2000 }
  ]
}

export const mockApi = {
  async getProducts(params) {
    await delay(500)
    const { page = 1, pageSize = 10, keyword = '' } = params
    
    let filteredProducts = [...mockProducts]
    if (keyword) {
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(keyword.toLowerCase())
      )
    }
    
    const total = filteredProducts.length
    const start = (page - 1) * pageSize
    const end = Math.min(start + pageSize, total)
    
    return mockResponse({
      list: filteredProducts.slice(start, end),
      total
    })
  },

  async getProductById(id) {
    await delay(300)
    const product = mockProducts.find(p => p.id === parseInt(id))
    return mockResponse(product)
  },

  async createProduct(data) {
    await delay(300)
    const newProduct = {
      ...data,
      id: mockProducts.length + 1,
      status: 1
    }
    mockProducts.push(newProduct)
    return mockResponse(newProduct)
  },

  async updateProduct(id, data) {
    await delay(300)
    const index = mockProducts.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...data }
      return mockResponse(mockProducts[index])
    }
    throw new Error('商品不存在')
  },

  async deleteProduct(id) {
    await delay(300)
    const index = mockProducts.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      mockProducts.splice(index, 1)
      return mockResponse({ success: true })
    }
    throw new Error('商品不存在')
  },

  // 添加获取统计数据的方法
  async getHotProducts() {
    await delay(300)
    return mockResponse(mockStatistics.hotProducts)
  },

  async getSalesTrend() {
    await delay(300)
    return mockResponse(mockStatistics.salesTrend)
  },

  async getOverview() {
    await delay(300)
    return mockResponse(mockStatistics.overview)
  },

  // 添加获取分类销售数据的方法
  async getCategorySales() {
    await delay(300)
    return mockResponse(mockStatistics.categorySales)
  }
} 
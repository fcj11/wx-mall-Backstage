import request from '@/utils/request'

// 获取商品列表
export function getProductList(params) {
  return request({
    url: '/products',
    method: 'get',
    params
  })
}

// 保存商品
export function saveProduct(data) {
  return request({
    url: '/products',
    method: 'post',
    data
  })
}

// 获取分类
export function getCategories() {
  return request({
    url: '/categories',
    method: 'get'
  })
}

// 上传图片
export function uploadImage(data) {
  return request({
    url: '/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
} 
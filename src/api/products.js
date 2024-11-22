import request from './request'
import { mockApi } from './mock'

// 是否使用 mock 数据
const useMock = true

export function getProducts(params) {
  return useMock ? mockApi.getProducts(params) : request({
    url: '/products',
    method: 'get',
    params
  })
}

export function getProductById(id) {
  return useMock ? mockApi.getProductById(id) : request({
    url: `/products/${id}`,
    method: 'get'
  })
}

export function createProduct(data) {
  return useMock ? mockApi.createProduct(data) : request({
    url: '/products',
    method: 'post',
    data
  })
}

export function updateProduct(id, data) {
  return useMock ? mockApi.updateProduct(id, data) : request({
    url: `/products/${id}`,
    method: 'put',
    data
  })
}

export function deleteProduct(id) {
  return useMock ? mockApi.deleteProduct(id) : request({
    url: `/products/${id}`,
    method: 'delete'
  })
} 
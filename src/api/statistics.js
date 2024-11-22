import request from './request'
import { mockApi } from './mock'

const useMock = true

export function getHotProducts() {
  return useMock ? mockApi.getHotProducts() : request({
    url: '/statistics/hotProducts',
    method: 'get'
  })
}

export function getSalesTrend() {
  return useMock ? mockApi.getSalesTrend() : request({
    url: '/statistics/salesTrend',
    method: 'get'
  })
}

export function getOverview() {
  return useMock ? mockApi.getOverview() : request({
    url: '/statistics/overview',
    method: 'get'
  })
}

export function getCategorySales() {
  return useMock ? mockApi.getCategorySales() : request({
    url: '/statistics/categorySales',
    method: 'get'
  })
} 
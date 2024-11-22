import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getProducts, updateProduct, deleteProduct, createProduct } from '@/api/products'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const loading = ref(false)
  const total = ref(0)

  async function fetchProducts(params) {
    try {
      loading.value = true
      const res = await getProducts(params)
      products.value = res.data.list
      total.value = res.data.total
    } catch (error) {
      console.error('获取商品列表失败:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  async function addProduct(data) {
    try {
      loading.value = true
      const res = await createProduct(data)
      await fetchProducts()
      return true
    } catch (error) {
      console.error('添加商品失败:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateProductItem(id, data) {
    try {
      loading.value = true
      await updateProduct(id, data)
      await fetchProducts()
      return true
    } catch (error) {
      console.error('更新商品失败:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeProduct(id) {
    try {
      loading.value = true
      await deleteProduct(id)
      await fetchProducts()
      return true
    } catch (error) {
      console.error('删除商品失败:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    loading,
    total,
    fetchProducts,
    addProduct,
    updateProductItem,
    removeProduct
  }
}) 
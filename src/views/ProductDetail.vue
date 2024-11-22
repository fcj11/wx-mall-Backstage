<template>
  <div class="product-detail">
    <el-card v-loading="loading">
      <template #header>
        <div class="header">
          <span>商品详情</span>
          <el-button @click="router.back()">返回</el-button>
        </div>
      </template>

      <el-descriptions v-if="product" :column="2" border>
        <el-descriptions-item label="商品名称">
          {{ product.name }}
        </el-descriptions-item>
        <el-descriptions-item label="商品价格">
          ¥{{ product.price?.toFixed(2) }}
        </el-descriptions-item>
        <el-descriptions-item label="库存">
          {{ product.stock }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="product.status === 1 ? 'success' : 'info'">
            {{ product.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="商品图片" :span="2">
          <el-image 
            v-if="product.image" 
            :src="product.image" 
            fit="contain"
            style="width: 200px; height: 200px"
          />
          <el-empty v-else description="暂无图片" />
        </el-descriptions-item>
        <el-descriptions-item label="商品描述" :span="2">
          {{ product.description || '暂无描述' }}
        </el-descriptions-item>
      </el-descriptions>

      <el-empty v-else description="商品不存在" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getProductById } from '@/api/products'

const route = useRoute()
const router = useRouter()
const productId = route.params.id
const product = ref(null)
const loading = ref(false)

const loadProduct = async () => {
  try {
    loading.value = true
    const res = await getProductById(productId)
    product.value = res.data
  } catch (error) {
    console.error('获取商品详情失败:', error)
    ElMessage.error('获取商品详情失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>

<style scoped>
.product-detail {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style> 
<template>
  <div class="product-container">
    <el-card class="product-card">
      <template #header>
        <div class="card-header">
          <span>商品管理</span>
          <el-button type="primary" @click="showAddDialog">添加商品</el-button>
        </div>
      </template>
      
      <!-- 添加商品列表表格 -->
      <el-table :data="productList" v-loading="loading">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="stock" label="库存" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="80%"
      :before-close="handleClose"
      destroy-on-close
    >
      <product-form
        ref="productFormRef"
        @success="handleSuccess"
        @cancel="dialogVisible = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ProductForm from '@/components/product/ProductForm.vue'
import { getProductList } from '@/api/product'

const dialogVisible = ref(false)
const dialogTitle = ref('添加商品')
const productFormRef = ref(null)
const productList = ref([])
const loading = ref(false)

// 获取商品列表
const fetchProductList = async () => {
  try {
    loading.value = true
    const res = await getProductList()
    productList.value = res.data
  } catch (error) {
    ElMessage.error('获取商品列表失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const showAddDialog = () => {
  dialogVisible.value = true
  dialogTitle.value = '添加商品'
}

const handleSuccess = () => {
  dialogVisible.value = false
  fetchProductList() // 刷新商品列表
  ElMessage.success('添加商品成功')
}

const handleClose = (done) => {
  ElMessageBox.confirm('确认关闭？未保存的数据将会丢失')
    .then(() => {
      done()
    })
    .catch(() => {})
}

onMounted(() => {
  fetchProductList()
})
</script>

<style lang="scss" scoped>
.product-container {
  padding: var(--spacing-md);
  
  .product-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style> 
<template>
  <div class="products">
    <el-card v-loading="productStore.loading">
      <template #header>
        <div class="header">
          <el-button type="primary" @click="handleAdd">添加商品</el-button>
          <el-input
            v-model="searchKeyword"
            placeholder="请输入商品名称搜索"
            style="width: 200px; margin-left: 20px"
            @input="handleSearch"
          />
        </div>
      </template>
      
      <el-table 
        :data="filteredProducts" 
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="scope">
            ¥ {{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '上架' : '下架' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="180">
          <template #default="scope">
            <el-image 
              v-if="scope.row.image" 
              :src="scope.row.image" 
              fit="contain"
              style="width: 100px; height: 100px"
            />
            <el-empty
              v-else
              :image-size="60"
              description="暂无图片"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <div class="operation-buttons">
              <el-tooltip content="编辑" placement="top">
                <el-button
                  type="primary"
                  :icon="Edit"
                  circle
                  size="small"
                  @click="handleEdit(scope.row)"
                />
              </el-tooltip>
              
              <el-tooltip :content="scope.row.status === 1 ? '下架' : '上架'" placement="top">
                <el-button
                  :type="scope.row.status === 1 ? 'warning' : 'success'"
                  :icon="scope.row.status === 1 ? TakeawayBox : Sell"
                  circle
                  size="small"
                  @click="handleToggleStatus(scope.row)"
                />
              </el-tooltip>

              <el-tooltip content="删除" placement="top">
                <el-button
                  type="danger"
                  :icon="Delete"
                  circle
                  size="small"
                  @click="handleDelete(scope.row)"
                />
              </el-tooltip>

              <el-tooltip content="查看详情" placement="top">
                <el-button
                  type="info"
                  :icon="View"
                  circle
                  size="small"
                  @click="handleDetail(scope.row)"
                />
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="productStore.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑商品对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加商品' : '编辑商品'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input-number 
            v-model="formData.price"
            :precision="2"
            :step="0.1"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input-number
            v-model="formData.stock"
            :min="0"
            :precision="0"
          />
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="3"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { Edit, Delete, View, TakeawayBox, Sell } from '@element-plus/icons-vue'
import { useProductStore } from '@/stores/products'

const router = useRouter()
const productStore = useProductStore()

// 搜索和筛选
const searchKeyword = ref('')
const filteredProducts = computed(() => {
  if (!searchKeyword.value) return productStore.products
  return productStore.products.filter(item => 
    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

onMounted(() => {
  loadProducts()
})

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const formData = ref({
  name: '',
  price: 0,
  stock: 0,
  description: ''
})

const rules = {
  name: [
    { required: true, message: '请输入商品名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  stock: [
    { required: true, message: '请输入商品库存', trigger: 'blur' }
  ]
}

// 处理函数
const handleAdd = () => {
  router.push({
    path: '/products/new',
    query: { type: 'add' }
  })
}

const handleEdit = (row) => {
  router.push({
    path: `/products/${row.id}`,
    query: { type: 'edit' }
  })
}

const handleDetail = (row) => {
  router.push(`/products/${row.id}`)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 模拟添加
        const newProduct = {
          ...formData.value,
          id: productStore.products.length + 1,
          status: 1
        }
        productStore.products.push(newProduct)
        ElMessage.success('添加成功')
      } else {
        // 模拟编辑
        const index = productStore.products.findIndex(item => item.id === formData.value.id)
        if (index !== -1) {
          productStore.products[index] = { ...productStore.products[index], ...formData.value }
          ElMessage.success('编辑成功')
        }
      }
      dialogVisible.value = false
    }
  })
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除���商品吗？', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    
    const success = await productStore.removeProduct(row.id)
    if (success) {
      ElMessage.success('删除成功')
    }
  } catch (error) {
    console.error('删除失败:', error)
  }
}

const handleToggleStatus = (row) => {
  const index = productStore.products.findIndex(item => item.id === row.id)
  if (index !== -1) {
    productStore.products[index].status = productStore.products[index].status === 1 ? 0 : 1
    ElMessage.success(`${productStore.products[index].status === 1 ? '上架' : '下架'}成功`)
  }
}

// 添加 loadProducts 函数
const loadProducts = async () => {
  try {
    await productStore.fetchProducts({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value
    })
  } catch (error) {
    console.error('加载商品列表失败:', error)
  }
}

// 添加分页处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
  loadProducts()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadProducts()
}

const handleSearch = () => {
  currentPage.value = 1
  loadProducts()
}
</script>

<style scoped>
.products {
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

:deep(.el-table) {
  --el-table-header-bg-color: var(--el-color-primary-light-9);
}
</style> 
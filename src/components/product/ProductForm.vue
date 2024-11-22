<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    label-width="var(--form-label-width)"
    class="product-form"
  >
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入商品名称" />
    </el-form-item>
    
    <el-form-item label="商品分类" prop="categoryId">
      <el-cascader
        v-model="formData.categoryId"
        :options="categoryOptions"
        :props="{ checkStrictly: true }"
        placeholder="请选择商品分类"
      />
    </el-form-item>
    
    <el-form-item label="商品图片" prop="images">
      <el-upload
        v-model:file-list="fileList"
        :action="uploadAction"
        list-type="picture-card"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
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
        :rows="4"
        placeholder="请输入商品描述"
      />
    </el-form-item>
    
    <el-form-item label="商品状态" prop="status">
      <el-switch
        v-model="formData.status"
        :active-value="1"
        :inactive-value="0"
        active-text="上架"
        inactive-text="下架"
      />
    </el-form-item>
    
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { saveProduct, getCategories } from '@/api/product'

const emit = defineEmits(['success', 'cancel'])
const formRef = ref(null)
const fileList = ref([])
const categoryOptions = ref([])

const formData = reactive({
  name: '',
  categoryId: [],
  images: [],
  price: 0,
  stock: 0,
  description: '',
  status: 1
})

// 获取分类数据
const fetchCategories = async () => {
  try {
    const res = await getCategories()
    categoryOptions.value = res.data
  } catch (error) {
    ElMessage.error('获取分类数据失败：' + error.message)
  }
}

const uploadAction = `${import.meta.env.VITE_API_URL}/upload`

const handleUploadSuccess = (response, file) => {
  if (response.code === 200) {
    formData.images.push(response.data.url)
  } else {
    ElMessage.error('上传失败：' + response.message)
  }
}

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return false
  }
  return true
}

const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    // 处理提交数据
    const submitData = {
      ...formData,
      categoryId: formData.categoryId[formData.categoryId.length - 1], // 获取最后一级分类ID
      price: Number(formData.price) * 100, // 转换为分
    }
    
    await saveProduct(submitData)
    ElMessage.success('保存成功')
    emit('success')
    resetForm()
  } catch (error) {
    if (error.message) {
      ElMessage.error('保存失败：' + error.message)
    }
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  fileList.value = []
  formData.images = []
}

onMounted(() => {
  fetchCategories()
})
</script>

<style lang="scss" scoped>
.product-form {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
  
  :deep(.el-upload--picture-card) {
    width: var(--product-image-size);
    height: var(--product-image-size);
    line-height: var(--product-image-size);
  }
  
  :deep(.el-upload-list--picture-card) {
    .el-upload-list__item {
      width: var(--product-image-size);
      height: var(--product-image-size);
    }
  }
}
</style> 
<template>
  <div class="categories">
    <el-card>
      <template #header>
        <div class="header">
          <el-button type="primary" @click="handleAdd">添加分类</el-button>
        </div>
      </template>
      
      <el-table
        :data="categories"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="code" label="分类编码" width="120" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button size="small" @click="handleAddSub(scope.row)">添加子分类</el-button>
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              :disabled="scope.row.children?.length > 0"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="getDialogTitle"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="上级分类">
          <el-cascader
            v-model="formData.parentId"
            :options="categoryOptions"
            :props="{ checkStrictly: true, value: 'id', label: 'name' }"
            clearable
            :disabled="dialogType === 'edit'"
            placeholder="请选择上级分类"
          />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="formData.code" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="formData.status"
            :active-value="1"
            :inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="图标">
          <el-upload
            class="category-icon-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="beforeIconUpload"
          >
            <img v-if="formData.icon" :src="formData.icon" class="category-icon">
            <el-icon v-else class="category-icon-uploader-icon"><Plus /></el-icon>
          </el-upload>
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
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '服装',
    code: 'clothing',
    sort: 1,
    status: 1,
    icon: '',
    children: [
      {
        id: 4,
        name: '男装',
        code: 'men',
        sort: 1,
        status: 1,
        icon: '',
        parentId: 1
      },
      {
        id: 5,
        name: '女装',
        code: 'women',
        sort: 2,
        status: 1,
        icon: '',
        parentId: 1
      }
    ]
  },
  {
    id: 2,
    name: '电子',
    code: 'electronics',
    sort: 2,
    status: 1,
    icon: ''
  },
  {
    id: 3,
    name: '食品',
    code: 'food',
    sort: 3,
    status: 1,
    icon: ''
  }
])

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref('add') // add, addSub, edit
const formRef = ref(null)
const currentParent = ref(null)

const formData = ref({
  name: '',
  code: '',
  sort: 0,
  status: 1,
  icon: '',
  parentId: null
})

const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入分类编码', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '只能包含小写字母、数字和横线', trigger: 'blur' }
  ]
}

// 计算属性
const getDialogTitle = computed(() => {
  const titles = {
    add: '添加分类',
    addSub: `添加 ${currentParent.value?.name || ''} 的子分类`,
    edit: '编辑分类'
  }
  return titles[dialogType.value]
})

const categoryOptions = computed(() => {
  return categories.value.map(item => ({
    id: item.id,
    name: item.name,
    children: item.children?.map(child => ({
      id: child.id,
      name: child.name
    }))
  }))
})

// 处理函数
const handleAdd = () => {
  dialogType.value = 'add'
  currentParent.value = null
  formData.value = {
    name: '',
    code: '',
    sort: 0,
    status: 1,
    icon: '',
    parentId: null
  }
  dialogVisible.value = true
}

const handleAddSub = (row) => {
  dialogType.value = 'addSub'
  currentParent.value = row
  formData.value = {
    name: '',
    code: '',
    sort: 0,
    status: 1,
    icon: '',
    parentId: [row.id]
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  formData.value = {
    ...row,
    parentId: row.parentId ? [row.parentId] : null
  }
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(
    '确定要删除该分类吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    if (row.parentId) {
      // 删除子分类
      const parent = categories.value.find(item => item.id === row.parentId)
      if (parent) {
        const index = parent.children.findIndex(item => item.id === row.id)
        if (index !== -1) {
          parent.children.splice(index, 1)
        }
      }
    } else {
      // 删除父分类
      const index = categories.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        categories.value.splice(index, 1)
      }
    }
    ElMessage.success('删除成功')
  })
}

const beforeIconUpload = (file) => {
  // 模拟上传
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    formData.value.icon = reader.result
  }
  return false
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    
    if (dialogType.value === 'edit') {
      // 编辑分类
      const target = formData.value.parentId
        ? categories.value
            .find(item => item.id === formData.value.parentId[0])
            ?.children?.find(item => item.id === formData.value.id)
        : categories.value.find(item => item.id === formData.value.id)
      
      if (target) {
        Object.assign(target, {
          name: formData.value.name,
          code: formData.value.code,
          sort: formData.value.sort,
          status: formData.value.status,
          icon: formData.value.icon
        })
      }
    } else {
      // 添加分类
      const newCategory = {
        id: Math.max(...categories.value.map(item => item.id)) + 1,
        name: formData.value.name,
        code: formData.value.code,
        sort: formData.value.sort,
        status: formData.value.status,
        icon: formData.value.icon
      }

      if (formData.value.parentId) {
        // 添加子分类
        const parentId = formData.value.parentId[formData.value.parentId.length - 1]
        const parent = categories.value.find(item => item.id === parentId)
        if (parent) {
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push({
            ...newCategory,
            parentId: parent.id
          })
        }
      } else {
        // 添加父分类
        categories.value.push(newCategory)
      }
    }
    
    ElMessage.success(`${dialogType.value === 'edit' ? '编辑' : '添加'}成功`)
    dialogVisible.value = false
  } catch (error) {
    console.error('表单验证失败：', error)
  }
}
</script>

<style scoped>
.categories {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.category-icon-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
}
.category-icon-uploader:hover {
  border-color: #409EFF;
}
.category-icon-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
}
.category-icon {
  width: 100px;
  height: 100px;
  display: block;
}
</style> 
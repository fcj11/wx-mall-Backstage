<template>
  <div class="users">
    <el-card>
      <template #header>
        <div class="header">
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
          <el-input
            v-model="searchKeyword"
            placeholder="请输入用户名搜索"
            style="width: 200px; margin-left: 20px"
          />
        </div>
      </template>
      
      <el-table :data="filteredUsers" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'admin' ? 'danger' : 'success'">
              {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="dialogType === 'add'">
          <el-input v-model="formData.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
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

// 模拟用户数据
const users = ref([
  {
    id: 1,
    username: 'admin',
    role: 'admin',
    status: 1,
    createTime: new Date('2024-01-01')
  },
  {
    id: 2,
    username: 'user1',
    role: 'user',
    status: 1,
    createTime: new Date('2024-03-15')
  }
])

// 搜索功能
const searchKeyword = ref('')
const filteredUsers = computed(() => {
  if (!searchKeyword.value) return users.value
  return users.value.filter(item => 
    item.username.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 表单相关
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref(null)
const formData = ref({
  username: '',
  password: '',
  role: 'user'
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 工具函数
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// 处理函数
const handleAdd = () => {
  dialogType.value = 'add'
  formData.value = {
    username: '',
    password: '',
    role: 'user'
  }
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogType.value = 'edit'
  formData.value = {
    ...row,
    password: '' // 编辑时不显示密码
  }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (valid) {
      if (dialogType.value === 'add') {
        const newUser = {
          ...formData.value,
          id: users.value.length + 1,
          status: 1,
          createTime: new Date()
        }
        users.value.push(newUser)
        ElMessage.success('添加成功')
      } else {
        const index = users.value.findIndex(item => item.id === formData.value.id)
        if (index !== -1) {
          users.value[index] = { ...users.value[index], ...formData.value }
          ElMessage.success('编辑成功')
        }
      }
      dialogVisible.value = false
    }
  })
}

const handleDelete = (row) => {
  if (row.username === 'admin') {
    ElMessage.error('不能删除管理员账号')
    return
  }
  
  ElMessageBox.confirm(
    '确定要删除该用户吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = users.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      users.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

const handleStatusChange = (row) => {
  if (row.username === 'admin' && row.status === 0) {
    ElMessage.error('不能禁用管理员账号')
    row.status = 1
    return
  }
  
  ElMessage.success(`${row.status === 1 ? '启用' : '禁用'}成功`)
}
</script>

<style scoped>
.users {
  padding: 20px;
}
.header {
  display: flex;
  align-items: center;
}
</style> 
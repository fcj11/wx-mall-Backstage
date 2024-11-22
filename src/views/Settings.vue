<template>
  <div class="settings">
    <el-tabs v-model="activeTab">
      <!-- 系统配置 -->
      <el-tab-pane label="系统配置" name="system">
        <el-form
          ref="systemFormRef"
          :model="systemForm"
          :rules="systemRules"
          label-width="120px"
        >
          <el-form-item label="系统名称" prop="systemName">
            <el-input v-model="systemForm.systemName" />
          </el-form-item>
          <el-form-item label="系统Logo">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeLogoUpload"
            >
              <img v-if="systemForm.logo" :src="systemForm.logo" class="avatar">
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="页面大小选项" prop="pageSizes">
            <el-select
              v-model="systemForm.pageSizes"
              multiple
              placeholder="请选择页面���小选项"
            >
              <el-option label="10条/页" :value="10" />
              <el-option label="20条/页" :value="20" />
              <el-option label="50条/页" :value="50" />
              <el-option label="100条/页" :value="100" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSystemSubmit">保存配置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 个人信息 -->
      <el-tab-pane label="个人信息" name="profile">
        <el-form
          ref="profileFormRef"
          :model="profileForm"
          :rules="profileRules"
          label-width="120px"
        >
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="profileForm.avatar" :src="profileForm.avatar" class="avatar">
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="profileForm.username" disabled />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="profileForm.nickname" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="profileForm.email" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="profileForm.phone" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleProfileSubmit">保存信息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 修改密码 -->
      <el-tab-pane label="修改密码" name="password">
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="120px"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handlePasswordSubmit">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const activeTab = ref('system')

// 系统配置
const systemFormRef = ref(null)
const systemForm = ref({
  systemName: '商城后台管理系统',
  logo: '',
  pageSizes: [10, 20, 50, 100]
})

const systemRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 个人信息
const profileFormRef = ref(null)
const profileForm = ref({
  username: 'admin',
  nickname: '管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  avatar: ''
})

const profileRules = {
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

// 修改密码
const passwordFormRef = ref(null)
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理函数
const beforeLogoUpload = (file) => {
  // 模拟上传
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    systemForm.value.logo = reader.result
  }
  return false
}

const beforeAvatarUpload = (file) => {
  // 模拟上传
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    profileForm.value.avatar = reader.result
  }
  return false
}

const handleSystemSubmit = async () => {
  if (!systemFormRef.value) return
  
  await systemFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟保存
      ElMessage.success('系统配置保存成功')
    }
  })
}

const handleProfileSubmit = async () => {
  if (!profileFormRef.value) return
  
  await profileFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟保存
      ElMessage.success('个人信息保存成功')
    }
  })
}

const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return
  
  await passwordFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟修改密码
      ElMessage.success('密码修改成功')
      passwordForm.value = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  })
}
</script>

<style scoped>
.settings {
  padding: 20px;
}
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 
<template>
  <div class="logs">
    <el-card>
      <template #header>
        <div class="header">
          <div class="filters">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px; margin-right: 20px"
            />
            <el-select v-model="typeFilter" placeholder="操作类型" style="width: 120px">
              <el-option label="全部" value="" />
              <el-option label="登录" value="login" />
              <el-option label="添加" value="add" />
              <el-option label="修改" value="edit" />
              <el-option label="删除" value="delete" />
            </el-select>
          </div>
          <el-button type="primary" @click="handleExport">导出日志</el-button>
        </div>
      </template>
      
      <el-table :data="filteredLogs" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="操作人" width="120" />
        <el-table-column prop="type" label="操作类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeTag(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作内容" />
        <el-table-column prop="ip" label="IP地址" width="140" />
        <el-table-column prop="createTime" label="操作时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 日志数据
const logs = ref([
  {
    id: 1,
    username: 'admin',
    type: 'login',
    content: '用户登录',
    ip: '192.168.1.1',
    createTime: new Date('2024-03-15 10:30:00')
  },
  {
    id: 2,
    username: 'admin',
    type: 'add',
    content: '添加商品：示例商品1',
    ip: '192.168.1.1',
    createTime: new Date('2024-03-15 11:20:00')
  },
  {
    id: 3,
    username: 'admin',
    type: 'edit',
    content: '修改订单状态：ORD202403150001',
    ip: '192.168.1.1',
    createTime: new Date('2024-03-15 14:15:00')
  }
])

// 筛选条件
const dateRange = ref([])
const typeFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(logs.value.length)

// 筛选日志
const filteredLogs = computed(() => {
  let result = logs.value

  if (dateRange.value && dateRange.value.length === 2) {
    const startDate = dateRange.value[0]
    const endDate = dateRange.value[1]
    result = result.filter(log => {
      const logDate = new Date(log.createTime)
      return logDate >= startDate && logDate <= endDate
    })
  }

  if (typeFilter.value) {
    result = result.filter(log => log.type === typeFilter.value)
  }

  return result
})

// 工具函数
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const getTypeTag = (type) => {
  const map = {
    login: '',
    add: 'success',
    edit: 'warning',
    delete: 'danger'
  }
  return map[type] || 'info'
}

const getTypeText = (type) => {
  const map = {
    login: '登录',
    add: '添加',
    edit: '修改',
    delete: '删除'
  }
  return map[type] || '未知'
}

// 处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const handleExport = () => {
  // 模拟导出功能
  const data = filteredLogs.value.map(log => ({
    ID: log.id,
    操作人: log.username,
    操作类型: getTypeText(log.type),
    操作内容: log.content,
    IP地址: log.ip,
    操作时间: formatDate(log.createTime)
  }))

  // 创建CSV内容
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n')

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `操作日志_${new Date().toLocaleDateString()}.csv`
  link.click()
  
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.logs {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.filters {
  display: flex;
  align-items: center;
}
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style> 
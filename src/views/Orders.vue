<template>
  <div class="orders">
    <el-card>
      <template #header>
        <div class="header">
          <el-input
            v-model="searchKeyword"
            placeholder="请输入订单号搜索"
            style="width: 200px"
            @input="handleSearch"
          />
          <el-select 
            v-model="statusFilter" 
            placeholder="订单状态" 
            style="width: 120px; margin-left: 10px"
          >
            <el-option label="全部" value="" />
            <el-option label="待付款" value="pending" />
            <el-option label="待发货" value="paid" />
            <el-option label="已发货" value="shipped" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </div>
      </template>
      
      <el-table :data="filteredOrders" style="width: 100%">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="createTime" label="下单时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="客户名称" width="120" />
        <el-table-column prop="amount" label="订单金额" width="120">
          <template #default="scope">
            ¥ {{ scope.row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="订单状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="scope">
            <el-button 
              size="small" 
              @click="handleDetail(scope.row)"
            >详情</el-button>
            <el-button
              v-if="scope.row.status === 'paid'"
              size="small"
              type="primary"
              @click="handleShip(scope.row)"
            >发货</el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              size="small"
              type="danger"
              @click="handleCancel(scope.row)"
            >取消</el-button>
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

    <!-- 订单详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="订单详情"
      width="700px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ formatDate(currentOrder.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="客户名称">{{ currentOrder.customerName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentOrder.phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址" :span="2">{{ currentOrder.address }}</el-descriptions-item>
      </el-descriptions>

      <el-table :data="currentOrder.items" style="margin-top: 20px">
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="price" label="单价">
          <template #default="scope">
            ¥ {{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="120" />
        <el-table-column label="小计" width="120">
          <template #default="scope">
            ¥ {{ (scope.row.price * scope.row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="order-total">
        总计：¥ {{ currentOrder.amount?.toFixed(2) }}
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 模拟订单数据
const orders = ref([
  {
    orderNo: 'ORD202403150001',
    createTime: new Date('2024-03-15 10:30:00'),
    customerName: '张三',
    phone: '13800138000',
    address: '北京市朝阳区xxx街道xxx号',
    amount: 299.99,
    status: 'pending',
    items: [
      { productName: '示例商品1', price: 99.99, quantity: 2 },
      { productName: '示例商品2', price: 100.01, quantity: 1 }
    ]
  },
  {
    orderNo: 'ORD202403150002',
    createTime: new Date('2024-03-15 11:20:00'),
    customerName: '李四',
    phone: '13900139000',
    address: '上海市浦东新区xxx路xxx号',
    amount: 599.99,
    status: 'paid',
    items: [
      { productName: '示例商品3', price: 599.99, quantity: 1 }
    ]
  }
])

// 搜索和筛选
const searchKeyword = ref('')
const statusFilter = ref('')
const filteredOrders = computed(() => {
  let result = orders.value
  
  if (searchKeyword.value) {
    result = result.filter(item => 
      item.orderNo.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  if (statusFilter.value) {
    result = result.filter(item => item.status === statusFilter.value)
  }
  
  return result
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(orders.value.length)

// 订单详情对话框
const dialogVisible = ref(false)
const currentOrder = ref({})

// 工具函数
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'success',
    completed: 'success',
    cancelled: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待付款',
    paid: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || '未知状态'
}

// 处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const handleDetail = (row) => {
  currentOrder.value = row
  dialogVisible.value = true
}

const handleShip = (row) => {
  ElMessageBox.confirm(
    `确定要发货订单 ${row.orderNo} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(() => {
    const index = orders.value.findIndex(item => item.orderNo === row.orderNo)
    if (index !== -1) {
      orders.value[index].status = 'shipped'
      ElMessage.success('发货成功')
    }
  })
}

const handleCancel = (row) => {
  ElMessageBox.confirm(
    `确定要取消订单 ${row.orderNo} 吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = orders.value.findIndex(item => item.orderNo === row.orderNo)
    if (index !== -1) {
      orders.value[index].status = 'cancelled'
      ElMessage.success('订单已取消')
    }
  })
}
</script>

<style scoped>
.orders {
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
.order-total {
  margin-top: 20px;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
}
</style> 
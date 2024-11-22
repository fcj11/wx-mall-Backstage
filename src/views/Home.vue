<template>
  <div class="home">
    <el-row :gutter="20">
      <!-- 概览卡片 -->
      <el-col :span="6" v-for="item in overviewData" :key="item.title">
        <el-card shadow="hover" class="overview-card">
          <div class="overview-item">
            <div class="overview-icon" :style="{ backgroundColor: item.color }">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="overview-content">
              <div class="overview-title">{{ item.title }}</div>
              <div class="overview-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>热销商品TOP5</span>
            </div>
          </template>
          <div ref="hotProductsChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { 
  ShoppingCart, 
  Goods, 
  User, 
  Money 
} from '@element-plus/icons-vue'
import { getHotProducts, getSalesTrend, getOverview } from '@/api/statistics'
import * as echarts from 'echarts'

const lineChartRef = ref(null)
const hotProductsChartRef = ref(null)
let lineChart = null
let hotProductsChart = null

const hotProducts = ref([])
const salesTrend = ref([])
const overview = ref({
  totalSales: 0,
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0
})

const overviewData = computed(() => [
  {
    title: '总销售额',
    value: `¥${overview.value.totalSales.toLocaleString()}`,
    icon: Money,
    color: '#409EFF'
  },
  {
    title: '订单总数',
    value: overview.value.totalOrders.toLocaleString(),
    icon: ShoppingCart,
    color: '#67C23A'
  },
  {
    title: '商品总数',
    value: overview.value.totalProducts.toLocaleString(),
    icon: Goods,
    color: '#E6A23C'
  },
  {
    title: '客户总数',
    value: overview.value.totalCustomers.toLocaleString(),
    icon: User,
    color: '#F56C6C'
  }
])

const initLineChart = () => {
  if (lineChart) {
    lineChart.dispose()
  }
  
  lineChart = echarts.init(lineChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: salesTrend.value.map(item => item.date),
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => `¥${value}`
      }
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: salesTrend.value.map(item => item.amount),
        smooth: true,
        areaStyle: {
          opacity: 0.3
        },
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }
  lineChart.setOption(option)
}

const initHotProductsChart = (data) => {
  if (hotProductsChart) {
    hotProductsChart.dispose()
  }

  // 计算总销量
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0)

  // 创建总销量标签配置
  const totalLabel = {
    show: true,
    position: 'center',
    formatter: [
      '{a|总销量}',
      '{b|' + totalSales + '}',
      '{c|件}'
    ].join('\n'),
    rich: {
      a: {
        fontSize: 14,
        color: '#999',
        padding: [0, 0, 8, 0]
      },
      b: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        padding: [8, 0]
      },
      c: {
        fontSize: 14,
        color: '#999',
        padding: [8, 0, 0, 0]
      }
    }
  }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}件 ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      top: 0,
      right: 0,
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 10,
      textStyle: {
        fontSize: 12,
        color: '#666',
        width: 60,
        overflow: 'truncate'
      },
      formatter: (name) => {
        return name
      }
    },
    series: [
      {
        name: '热销商品',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: totalLabel,
        emphasis: {
          scale: false,
          scaleSize: 0,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: data.map(item => ({
          name: item.name,
          value: item.sales,
          itemStyle: {
            borderWidth: 2,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          }
        }))
      }
    ],
    color: [
      '#409EFF',
      '#67C23A',
      '#E6A23C',
      '#F56C6C',
      '#909399'
    ]
  }

  hotProductsChart = echarts.init(hotProductsChartRef.value)
  hotProductsChart.setOption(option)

  // 添加事件监听
  let currentLabel = totalLabel
  let isHovering = false

  hotProductsChart.on('mouseover', { seriesIndex: 0 }, (params) => {
    isHovering = true
    currentLabel = {
      show: true,
      position: 'center',
      formatter: [
        `{a|${params.name}}`,
        `{b|${params.value}}`,
        `{c|${params.percent.toFixed(1)}%}`
      ].join('\n'),
      rich: totalLabel.rich
    }
    hotProductsChart.setOption({
      series: [{
        label: currentLabel
      }]
    })
  })

  hotProductsChart.on('mouseout', { seriesIndex: 0 }, () => {
    isHovering = false
    setTimeout(() => {
      if (!isHovering) {
        hotProductsChart.setOption({
          series: [{
            label: totalLabel
          }]
        })
      }
    }, 100)
  })

  // 添加图表区域的鼠标离开事件
  hotProductsChartRef.value.addEventListener('mouseleave', () => {
    isHovering = false
    hotProductsChart.setOption({
      series: [{
        label: totalLabel
      }]
    })
  })
}

const loadData = async () => {
  try {
    const [hotProductsRes, salesTrendRes, overviewRes] = await Promise.all([
      getHotProducts(),
      getSalesTrend(),
      getOverview()
    ])
    
    hotProducts.value = hotProductsRes.data
    salesTrend.value = salesTrendRes.data
    overview.value = overviewRes.data
    
    await nextTick()
    initLineChart()
    initHotProductsChart(hotProductsRes.data)
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}

// 监听窗口大小变化
const handleResize = () => {
  if (lineChart) {
    lineChart.resize()
  }
  if (hotProductsChart) {
    hotProductsChart.resize()
  }
}

onMounted(() => {
  loadData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (lineChart) {
    lineChart.dispose()
  }
  if (hotProductsChart) {
    hotProductsChart.dispose()
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.overview-card {
  margin-bottom: 20px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.overview-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.overview-content {
  flex: 1;
}

.overview-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-container {
  height: 400px;
  width: 100%;
}
</style> 
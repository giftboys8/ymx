<template>
  <div class="report-container">
    <!-- <div class="page-header">
      <h2>生产报告</h2>
      <div class="date-filter">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </div>
    </div> -->
    <!-- <el-row :gutter="20" class="data-overview">
      <el-col :span="6" v-for="(item, index) in overviewData" :key="index">
        <el-card shadow="hover" :body-style="{ padding: '20px' }">
          <div class="overview-item">
            <el-icon :size="36" :color="item.color">
              <component :is="item.icon"></component>
            </el-icon>
            <div class="overview-content">
              <div class="overview-value">{{ item.value }}</div>
              <div class="overview-label">{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="chart-section">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>客户需求趋势</span>
              <el-radio-group v-model="demandChartType" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-container" ref="demandChartRef"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>生产完成率</span>
              <el-select v-model="productionChartProduct" size="small" placeholder="选择产品">
                <el-option v-for="item in productList" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </div>
          </template>
          <div class="chart-container" ref="productionChartRef"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-section">
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>质检合格率</span>
              <el-select v-model="qualityChartType" size="small">
                <el-option label="IQC" value="IQC" />
                <el-option label="IPQC" value="IPQC" />
                <el-option label="OQC" value="OQC" />
              </el-select>
            </div>
          </template>
          <div class="chart-container" ref="qualityChartRef"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>出货完成情况</span>
            </div>
          </template>
          <div class="chart-container" ref="shipmentChartRef"></div>
        </el-card>
      </el-col>
    </el-row> -->

    <!-- 数据表格区域 -->
    <el-tabs v-model="activeTab" class="data-tabs">
      <el-tab-pane label="客户需求数据" name="demand">
        <el-table :data="demandTableData" border style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="demand_no" label="需求单号" width="120" />
          <el-table-column prop="customer_name" label="客户名称" width="150" />
          <el-table-column prop="material_name" label="物料名称" width="150" />
          <el-table-column prop="material_code" label="物料编码" width="150" />
          <el-table-column prop="delivery_date" label="计划日期" width="120" />
          <el-table-column prop="required_qty" label="需求数量" width="100" />
          <el-table-column prop="completed_qty" label="完成数量" width="100" />
          <el-table-column prop="completion_rate" label="完成率" width="100">
            <template #default="{ row }">
              {{ row.completion_rate }}%
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="生产计划数据" name="production">
        <el-table :data="productionTableData" border style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="process_id" label="制程ID" width="120" />
          <el-table-column prop="material_name" label="物料名称" width="150" />
          <el-table-column prop="material_code" label="物料编码" width="150" />
          <el-table-column prop="plan_date" label="计划日期" width="120" />
          <el-table-column prop="planned_qty" label="计划量" width="100" />
          <el-table-column prop="actual_qty" label="实际量" width="100" />
          <el-table-column prop="yield_rate" label="良率" width="100">
            <template #default="{ row }">
              {{ row.yield_rate }}%
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="出货数据" name="shipment">
        <el-table :data="shipmentTableData" border style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="plan_id" label="计划ID" width="120" />
          <el-table-column prop="material_code" label="物料编码" width="150" />
          <el-table-column prop="material_name" label="物料名称" width="150" />
          <el-table-column prop="shipment_date" label="出货日期" width="120" />
          <el-table-column prop="planned_qty" label="计划量" width="100" />
          <el-table-column prop="actual_qty" label="实际量" width="100" />
          <el-table-column prop="customer" label="客户" width="150" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="质检数据" name="quality">
        <el-table :data="qualityTableData" border style="width: 100%" v-loading="tableLoading">
          <el-table-column prop="inspection_id" label="检验ID" width="120" />
          <el-table-column prop="inspection_type" label="检验类型" width="100">
            <template #default="{ row }">
              <el-tag :type="getInspectionType(row.inspection_type)">{{ row.inspection_type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="material_code" label="物料编码" width="150" />
          <el-table-column prop="material_name" label="物料名称" width="150" />
          <el-table-column prop="batch_number" label="批次号" width="120" />
          <el-table-column prop="inspection_date" label="检验日期" width="120" />
          <el-table-column prop="sample_size" label="抽样数" width="100" />
          <el-table-column prop="defect_count" label="不良数" width="100" />
          <el-table-column prop="pass_rate" label="合格率" width="100">
            <template #default="{ row }">
              {{ row.pass_rate }}%
            </template>
          </el-table-column>
          <el-table-column prop="inspector" label="检验员" width="100" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { Document, SetUp, Van, CircleCheck } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// 日期范围选择
const dateRange = ref([new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000), new Date()])

// 图表引用
const demandChartRef = ref(null)
const productionChartRef = ref(null)
const qualityChartRef = ref(null)
const shipmentChartRef = ref(null)

// 图表实例
let demandChart = null
let productionChart = null
let qualityChart = null
let shipmentChart = null

// 图表筛选条件
const demandChartType = ref('week')
const productionChartProduct = ref('')
const qualityChartType = ref('OQC')

// 数据概览
const overviewData = ref([
  { label: '客户需求总数', value: 125, icon: 'Document', color: '#409EFF' },
  { label: '生产计划完成率', value: '87%', icon: 'SetUp', color: '#67C23A' },
  { label: '出货完成数', value: 98, icon: 'Van', color: '#E6A23C' },
  { label: '质检合格率', value: '96.5%', icon: 'CircleCheck', color: '#F56C6C' }
])

// 表格数据
const tableLoading = ref(false)
const activeTab = ref('demand')

// 产品列表
const productList = ref([
  { code: 'DM6-001', name: 'DM6底框' },
  { code: 'DM6-002', name: 'DM6摄像头弹片' },
  { code: 'DM6-003', name: 'DM6三角挂钩' }
])

// 客户需求数据
const demandTableData = ref([
  {
    demand_no: 'D20230501001',
    customer_name: '富士康裕展',
    material_name: 'DM6底框',
    material_code: 'DM6-001',
    delivery_date: '2023-05-10',
    required_qty: 5000,
    completed_qty: 5000,
    completion_rate: 100
  },
  {
    demand_no: 'D20230501002',
    customer_name: '富士康裕展',
    material_name: 'DM6摄像头弹片',
    material_code: 'DM6-002',
    delivery_date: '2023-05-12',
    required_qty: 8000,
    completed_qty: 7200,
    completion_rate: 90
  },
  {
    demand_no: 'D20230501003',
    customer_name: '富士康裕展',
    material_name: 'DM6三角挂钩',
    material_code: 'DM6-003',
    delivery_date: '2023-05-15',
    required_qty: 10000,
    completed_qty: 8500,
    completion_rate: 85
  }
])

// 生产计划数据
const productionTableData = ref([
  {
    process_id: 'P20230505001',
    material_name: 'DM6底框',
    material_code: 'DM6-001',
    plan_date: '2023-05-05',
    planned_qty: 2000,
    actual_qty: 1950,
    yield_rate: 97.5,
    status: '已完成'
  },
  {
    process_id: 'P20230506001',
    material_name: 'DM6底框',
    material_code: 'DM6-001',
    plan_date: '2023-05-06',
    planned_qty: 3000,
    actual_qty: 3000,
    yield_rate: 98.2,
    status: '已完成'
  },
  {
    process_id: 'P20230507001',
    material_name: 'DM6摄像头弹片',
    material_code: 'DM6-002',
    plan_date: '2023-05-07',
    planned_qty: 4000,
    actual_qty: 3800,
    yield_rate: 95.0,
    status: '已完成'
  },
  {
    process_id: 'P20230508001',
    material_name: 'DM6摄像头弹片',
    material_code: 'DM6-002',
    plan_date: '2023-05-08',
    planned_qty: 4000,
    actual_qty: 3400,
    yield_rate: 94.5,
    status: '已完成'
  },
  {
    process_id: 'P20230510001',
    material_name: 'DM6三角挂钩',
    material_code: 'DM6-003',
    plan_date: '2023-05-10',
    planned_qty: 5000,
    actual_qty: 4800,
    yield_rate: 96.0,
    status: '已完成'
  }
])

// 出货数据
const shipmentTableData = ref([
  {
    plan_id: 'S20230510001',
    material_code: 'DM6-001',
    material_name: 'DM6底框',
    shipment_date: '2023-05-10',
    planned_qty: 5000,
    actual_qty: 5000,
    customer: '富士康裕展',
    status: '已完成'
  },
  {
    plan_id: 'S20230512001',
    material_code: 'DM6-002',
    material_name: 'DM6摄像头弹片',
    shipment_date: '2023-05-12',
    planned_qty: 7200,
    actual_qty: 7200,
    customer: '富士康裕展',
    status: '已完成'
  },
  {
    plan_id: 'S20230515001',
    material_code: 'DM6-003',
    material_name: 'DM6三角挂钩',
    shipment_date: '2023-05-15',
    planned_qty: 8500,
    actual_qty: 8500,
    customer: '富士康裕展',
    status: '进行中'
  }
])

// 质检数据
const qualityTableData = ref([
  {
    inspection_id: 'Q20230505001',
    inspection_type: 'IQC',
    material_code: 'RM-001',
    material_name: '铝合金板材',
    batch_number: 'B20230505001',
    inspection_date: '2023-05-05',
    sample_size: 100,
    defect_count: 2,
    pass_rate: 98.0,
    inspector: '张工'
  },
  {
    inspection_id: 'Q20230506001',
    inspection_type: 'IPQC',
    material_code: 'DM6-001',
    material_name: 'DM6底框',
    batch_number: 'B20230506001',
    inspection_date: '2023-05-06',
    sample_size: 50,
    defect_count: 1,
    pass_rate: 98.0,
    inspector: '李工'
  },
  {
    inspection_id: 'Q20230507001',
    inspection_type: 'OQC',
    material_code: 'DM6-001',
    material_name: 'DM6底框',
    batch_number: 'B20230507001',
    inspection_date: '2023-05-07',
    sample_size: 200,
    defect_count: 3,
    pass_rate: 98.5,
    inspector: '王工'
  },
  {
    inspection_id: 'Q20230508001',
    inspection_type: 'IQC',
    material_code: 'RM-002',
    material_name: '弹簧钢丝',
    batch_number: 'B20230508001',
    inspection_date: '2023-05-08',
    sample_size: 100,
    defect_count: 5,
    pass_rate: 95.0,
    inspector: '张工'
  },
  {
    inspection_id: 'Q20230509001',
    inspection_type: 'IPQC',
    material_code: 'DM6-002',
    material_name: 'DM6摄像头弹片',
    batch_number: 'B20230509001',
    inspection_date: '2023-05-09',
    sample_size: 50,
    defect_count: 2,
    pass_rate: 96.0,
    inspector: '李工'
  }
])

// 状态类型映射
const getStatusType = (status) => {
  const statusMap = {
    '未开始': 'info',
    '进行中': 'warning',
    '已完成': 'success',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}

// 检验类型映射
const getInspectionType = (type) => {
  const typeMap = {
    'IQC': 'primary',
    'IPQC': 'warning',
    'OQC': 'success'
  }
  return typeMap[type] || 'info'
}

// 日期变更处理
const handleDateChange = () => {
  // 根据日期范围重新加载数据
  initCharts()
}

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    // 客户需求趋势图
    if (demandChartRef.value) {
      demandChart = echarts.init(demandChartRef.value)
      const demandOption = {
        title: {
          text: '客户需求趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['DM6底框', 'DM6摄像头弹片', 'DM6三角挂钩'],
          bottom: 10
        },
        xAxis: {
          type: 'category',
          data: ['第1周', '第2周', '第3周', '第4周']
        },
        yAxis: {
          type: 'value',
          name: '需求量'
        },
        series: [
          {
            name: 'DM6底框',
            type: 'line',
            data: [5000, 7000, 6000, 8000]
          },
          {
            name: 'DM6摄像头弹片',
            type: 'line',
            data: [8000, 9000, 8500, 10000]
          },
          {
            name: 'DM6三角挂钩',
            type: 'line',
            data: [10000, 12000, 9000, 11000]
          }
        ]
      }
      demandChart.setOption(demandOption)
    }

    // 生产完成率图
    if (productionChartRef.value) {
      productionChart = echarts.init(productionChartRef.value)
      const productionOption = {
        title: {
          text: '生产计划完成率',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['计划量', '实际量'],
          bottom: 10
        },
        xAxis: {
          type: 'category',
          data: ['5月5日', '5月6日', '5月7日', '5月8日', '5月9日']
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '计划量',
            type: 'bar',
            data: [2000, 3000, 4000, 4000, 5000]
          },
          {
            name: '实际量',
            type: 'bar',
            data: [1950, 3000, 3800, 3400, 4800]
          }
        ]
      }
      productionChart.setOption(productionOption)
    }

    // 质检合格率图
    if (qualityChartRef.value) {
      qualityChart = echarts.init(qualityChartRef.value)
      const qualityOption = {
        title: {
          text: '质检合格率',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '质检结果',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 96.5, name: '合格' },
              { value: 3.5, name: '不合格' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      qualityChart.setOption(qualityOption)
    }

    // 出货完成情况图
    if (shipmentChartRef.value) {
      shipmentChart = echarts.init(shipmentChartRef.value)
      const shipmentOption = {
        title: {
          text: '出货完成情况',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['计划出货量', '实际出货量'],
          bottom: 10
        },
        xAxis: {
          type: 'category',
          data: ['DM6底框', 'DM6摄像头弹片', 'DM6三角挂钩']
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '计划出货量',
            type: 'bar',
            data: [5000, 8000, 10000]
          },
          {
            name: '实际出货量',
            type: 'bar',
            data: [5000, 7200, 8500]
          }
        ]
      }
      shipmentChart.setOption(shipmentOption)
    }
  })
}

// 窗口大小变化时重绘图表
window.addEventListener('resize', () => {
  demandChart?.resize()
  productionChart?.resize()
  qualityChart?.resize()
  shipmentChart?.resize()
})

onMounted(() => {
  initCharts()
})
</script>

<style scoped>
.report-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.data-overview {
  margin-bottom: 20px;
}

.overview-item {
  display: flex;
  align-items: center;
}

.overview-content {
  margin-left: 16px;
}

.overview-value {
  font-size: 24px;
  font-weight: bold;
  line-height: 1.2;
}

.overview-label {
  font-size: 14px;
  color: #909399;
}

.chart-section {
  margin-bottom: 20px;
}

.chart-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  height: 300px;
}

.data-tabs {
  margin-top: 20px;
}
</style>
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
        <el-table :data="paginatedDemandData" border style="width: 100%" v-loading="tableLoading">
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
        <el-pagination
          v-model:current-page="demandCurrentPage"
          v-model:page-size="demandPageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="demandTableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 20px; justify-content: center;"
        />
      </el-tab-pane>
      <el-tab-pane label="生产计划数据" name="production">
        <el-table :data="paginatedProductionData" border style="width: 100%" v-loading="tableLoading">
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
        <el-pagination
          v-model:current-page="productionCurrentPage"
          v-model:page-size="productionPageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="productionTableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 20px; justify-content: center;"
        />
      </el-tab-pane>
      <el-tab-pane label="出货数据" name="shipment">
        <el-table :data="paginatedShipmentData" border style="width: 100%" v-loading="tableLoading">
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
        <el-pagination
          v-model:current-page="shipmentCurrentPage"
          v-model:page-size="shipmentPageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="shipmentTableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 20px; justify-content: center;"
        />
      </el-tab-pane>
      <el-tab-pane label="质检数据" name="quality">
        <el-table :data="paginatedQualityData" border style="width: 100%" v-loading="tableLoading">
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
        <el-pagination
          v-model:current-page="qualityCurrentPage"
          v-model:page-size="qualityPageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="qualityTableData.length"
          layout="total, sizes, prev, pager, next, jumper"
          style="margin-top: 20px; justify-content: center;"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, computed } from 'vue'
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

// 分页相关数据
const demandCurrentPage = ref(1)
const demandPageSize = ref(10)
const productionCurrentPage = ref(1)
const productionPageSize = ref(10)
const shipmentCurrentPage = ref(1)
const shipmentPageSize = ref(10)
const qualityCurrentPage = ref(1)
const qualityPageSize = ref(10)

// 表格数据
const tableLoading = ref(false)
const activeTab = ref('demand')

// 分页计算属性
const paginatedDemandData = computed(() => {
  const start = (demandCurrentPage.value - 1) * demandPageSize.value
  const end = start + demandPageSize.value
  return demandTableData.value.slice(start, end)
})

const paginatedProductionData = computed(() => {
  const start = (productionCurrentPage.value - 1) * productionPageSize.value
  const end = start + productionPageSize.value
  return productionTableData.value.slice(start, end)
})

const paginatedShipmentData = computed(() => {
  const start = (shipmentCurrentPage.value - 1) * shipmentPageSize.value
  const end = start + shipmentPageSize.value
  return shipmentTableData.value.slice(start, end)
})

const paginatedQualityData = computed(() => {
  const start = (qualityCurrentPage.value - 1) * qualityPageSize.value
  const end = start + qualityPageSize.value
  return qualityTableData.value.slice(start, end)
})

// 产品列表
const productList = ref([
  { code: 'CELL001', name: '18650锂离子电芯' },
  { code: 'CELL002', name: '21700锂离子电芯' },
  { code: 'MODULE001', name: '12V 100Ah电池模组' },
  { code: 'PACK001', name: '48V 200Ah储能电池包' }
])

// 客户需求数据
const demandTableData = ref([
  {
    demand_no: 'D20230601001',
    customer_name: '宁德时代新能源',
    material_name: '18650锂离子电芯',
    material_code: 'CELL001',
    delivery_date: '2023-06-15',
    required_qty: 50000,
    completed_qty: 49800,
    completion_rate: 99.6
  },
  {
    demand_no: 'D20230602001',
    customer_name: '比亚迪电池',
    material_name: '21700锂离子电芯',
    material_code: 'CELL002',
    delivery_date: '2023-06-18',
    required_qty: 30000,
    completed_qty: 29500,
    completion_rate: 98.3
  },
  {
    demand_no: 'D20230603001',
    customer_name: '中航锂电',
    material_name: '12V 100Ah电池模组',
    material_code: 'MODULE001',
    delivery_date: '2023-06-20',
    required_qty: 2000,
    completed_qty: 1950,
    completion_rate: 97.5
  },
  {
    demand_no: 'D20230604001',
    customer_name: '国轩高科',
    material_name: '48V 200Ah储能电池包',
    material_code: 'PACK001',
    delivery_date: '2023-06-25',
    required_qty: 500,
    completed_qty: 485,
    completion_rate: 97.0
  },
  {
    demand_no: 'D20230605001',
    customer_name: '欣旺达电子',
    material_name: 'BMS电池管理系统',
    material_code: 'BMS001',
    delivery_date: '2023-06-28',
    required_qty: 1000,
    completed_qty: 980,
    completion_rate: 98.0
  }
])

// 生产计划数据
const productionTableData = ref([
  {
    process_id: 'P20230610001',
    material_name: '18650锂离子电芯',
    material_code: 'CELL001',
    plan_date: '2023-06-10',
    planned_qty: 25000,
    actual_qty: 24800,
    yield_rate: 99.2,
    status: '已完成'
  },
  {
    process_id: 'P20230611001',
    material_name: '18650锂离子电芯',
    material_code: 'CELL001',
    plan_date: '2023-06-11',
    planned_qty: 25000,
    actual_qty: 25000,
    yield_rate: 100.0,
    status: '已完成'
  },
  {
    process_id: 'P20230612001',
    material_name: '21700锂离子电芯',
    material_code: 'CELL002',
    plan_date: '2023-06-12',
    planned_qty: 15000,
    actual_qty: 14750,
    yield_rate: 98.3,
    status: '已完成'
  },
  {
    process_id: 'P20230613001',
    material_name: '21700锂离子电芯',
    material_code: 'CELL002',
    plan_date: '2023-06-13',
    planned_qty: 15000,
    actual_qty: 14750,
    yield_rate: 98.3,
    status: '已完成'
  },
  {
    process_id: 'P20230615001',
    material_name: '12V 100Ah电池模组',
    material_code: 'MODULE001',
    plan_date: '2023-06-15',
    planned_qty: 1000,
    actual_qty: 975,
    yield_rate: 97.5,
    status: '已完成'
  },
  {
    process_id: 'P20230616001',
    material_name: '12V 100Ah电池模组',
    material_code: 'MODULE001',
    plan_date: '2023-06-16',
    planned_qty: 1000,
    actual_qty: 975,
    yield_rate: 97.5,
    status: '已完成'
  },
  {
    process_id: 'P20230618001',
    material_name: '48V 200Ah储能电池包',
    material_code: 'PACK001',
    plan_date: '2023-06-18',
    planned_qty: 250,
    actual_qty: 245,
    yield_rate: 98.0,
    status: '已完成'
  },
  {
    process_id: 'P20230619001',
    material_name: '48V 200Ah储能电池包',
    material_code: 'PACK001',
    plan_date: '2023-06-19',
    planned_qty: 250,
    actual_qty: 240,
    yield_rate: 96.0,
    status: '已完成'
  }
])

// 出货数据
const shipmentTableData = ref([
  {
    plan_id: 'S20230615001',
    material_code: 'CELL001',
    material_name: '18650锂离子电芯',
    shipment_date: '2023-06-15',
    planned_qty: 50000,
    actual_qty: 49800,
    customer: '宁德时代新能源',
    status: '已完成'
  },
  {
    plan_id: 'S20230618001',
    material_code: 'CELL002',
    material_name: '21700锂离子电芯',
    shipment_date: '2023-06-18',
    planned_qty: 30000,
    actual_qty: 29500,
    customer: '比亚迪电池',
    status: '已完成'
  },
  {
    plan_id: 'S20230620001',
    material_code: 'MODULE001',
    material_name: '12V 100Ah电池模组',
    shipment_date: '2023-06-20',
    planned_qty: 2000,
    actual_qty: 1950,
    customer: '中航锂电',
    status: '已完成'
  },
  {
    plan_id: 'S20230625001',
    material_code: 'PACK001',
    material_name: '48V 200Ah储能电池包',
    shipment_date: '2023-06-25',
    planned_qty: 500,
    actual_qty: 485,
    customer: '国轩高科',
    status: '进行中'
  },
  {
    plan_id: 'S20230628001',
    material_code: 'BMS001',
    material_name: 'BMS电池管理系统',
    shipment_date: '2023-06-28',
    planned_qty: 1000,
    actual_qty: 980,
    customer: '欣旺达电子',
    status: '进行中'
  }
])

// 质检数据
const qualityTableData = ref([
  {
    inspection_id: 'Q20230610001',
    inspection_type: 'IQC',
    material_code: 'LFP001',
    material_name: '磷酸铁锂正极材料',
    batch_number: 'LFP20230610',
    inspection_date: '2023-06-10',
    sample_size: 200,
    defect_count: 3,
    pass_rate: 98.5,
    inspector: '张工程师'
  },
  {
    inspection_id: 'Q20230611001',
    inspection_type: 'IPQC',
    material_code: 'CELL001',
    material_name: '18650锂离子电芯',
    batch_number: 'CELL20230611',
    inspection_date: '2023-06-11',
    sample_size: 100,
    defect_count: 1,
    pass_rate: 99.0,
    inspector: '李工程师'
  },
  {
    inspection_id: 'Q20230612001',
    inspection_type: 'OQC',
    material_code: 'CELL001',
    material_name: '18650锂离子电芯',
    batch_number: 'CELL20230612',
    inspection_date: '2023-06-12',
    sample_size: 500,
    defect_count: 5,
    pass_rate: 99.0,
    inspector: '王工程师'
  },
  {
    inspection_id: 'Q20230613001',
    inspection_type: 'IQC',
    material_code: 'ELE001',
    material_name: 'LiPF6电解液',
    batch_number: 'ELE20230613',
    inspection_date: '2023-06-13',
    sample_size: 50,
    defect_count: 1,
    pass_rate: 98.0,
    inspector: '张工程师'
  },
  {
    inspection_id: 'Q20230614001',
    inspection_type: 'IPQC',
    material_code: 'CELL002',
    material_name: '21700锂离子电芯',
    batch_number: 'CELL20230614',
    inspection_date: '2023-06-14',
    sample_size: 100,
    defect_count: 2,
    pass_rate: 98.0,
    inspector: '李工程师'
  },
  {
    inspection_id: 'Q20230615001',
    inspection_type: 'OQC',
    material_code: 'MODULE001',
    material_name: '12V 100Ah电池模组',
    batch_number: 'MOD20230615',
    inspection_date: '2023-06-15',
    sample_size: 20,
    defect_count: 0,
    pass_rate: 100.0,
    inspector: '王工程师'
  },
  {
    inspection_id: 'Q20230616001',
    inspection_type: 'IQC',
    material_code: 'SEP001',
    material_name: 'PE隔膜材料',
    batch_number: 'SEP20230616',
    inspection_date: '2023-06-16',
    sample_size: 100,
    defect_count: 3,
    pass_rate: 97.0,
    inspector: '张工程师'
  },
  {
    inspection_id: 'Q20230617001',
    inspection_type: 'OQC',
    material_code: 'PACK001',
    material_name: '48V 200Ah储能电池包',
    batch_number: 'PACK20230617',
    inspection_date: '2023-06-17',
    sample_size: 10,
    defect_count: 0,
    pass_rate: 100.0,
    inspector: '王工程师'
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
          data: ['18650锂离子电芯', '21700锂离子电芯', '电池模组', '储能电池包'],
          bottom: 10
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月']
        },
        yAxis: {
          type: 'value',
          name: '需求量'
        },
        series: [
          {
            name: '18650锂离子电芯',
            type: 'line',
            data: [45000, 48000, 52000, 49000, 51000, 55000]
          },
          {
            name: '21700锂离子电芯',
            type: 'line',
            data: [28000, 30000, 32000, 31000, 29000, 33000]
          },
          {
            name: '电池模组',
            type: 'line',
            data: [1800, 2000, 2200, 2100, 1950, 2300]
          },
          {
            name: '储能电池包',
            type: 'line',
            data: [450, 480, 520, 500, 470, 550]
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
          data: ['6月10日', '6月11日', '6月12日', '6月13日', '6月14日']
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '计划量',
            type: 'bar',
            data: [25000, 25000, 15000, 15000, 1000]
          },
          {
            name: '实际量',
            type: 'bar',
            data: [24800, 25000, 14750, 14750, 975]
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
          text: '质检通过率',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        xAxis: {
          type: 'category',
          data: ['IQC', 'IPQC', 'OQC']
        },
        yAxis: {
          type: 'value',
          max: 100
        },
        series: [
          {
            name: '通过率',
            type: 'bar',
            data: [97.8, 98.3, 99.7],
            itemStyle: {
              color: '#67C23A'
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
          data: ['18650电芯', '21700电芯', '电池模组', '储能电池包', 'BMS系统']
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '计划出货量',
            type: 'bar',
            data: [50000, 30000, 2000, 500, 1000]
          },
          {
            name: '实际出货量',
            type: 'bar',
            data: [49800, 29500, 1950, 485, 980]
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
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Warning, CircleClose, DataLine } from '@element-plus/icons-vue'

const router = useRouter()
const activeIndex = ref('1')

// 核心流程数据
const coreProcesses = ref([
  { id: 1, name: '客户需求', path: '/customer-demand', icon: 'Document', description: '管理客户需求计划和明细' },
  { id: 2, name: '生产计划', path: '/production', icon: 'SetUp', description: '制定生产排期和工艺制程' },
  { id: 3, name: '原料采购', path: '/purchase', icon: 'ShoppingCart', description: '管理采购订单和供应商' },
  { id: 4, name: '物料入库', path: '/material-in', icon: 'Goods', description: '原料入库和IQC检验' },
  { id: 5, name: '生产工序', path: '/engineering', icon: 'Tools', description: '工程调试和IPQC检验' },
  { id: 6, name: '成品入库', path: '/product-in', icon: 'Box', description: '成品入库和OQC检验' },
  { id: 7, name: '出货', path: '/shipment', icon: 'Van', description: '出货管理和物流对接' },
  { id: 8, name: '生产报告', path: '/', icon: 'DataAnalysis', description: '生产数据分析和报表' }
])

// 系统概览数据
const overviewData = ref({
  customerDemands: 12,
  ongoingProduction: 5,
  pendingPurchase: 8,
  completedShipments: 15,
  qualityIssues: 3
})

// 最近活动数据
const recentActivities = ref([
  { id: 1, type: '客户需求', content: '新增富士康裕展需求单D20230001', time: '2023-05-01 10:30' },
  { id: 2, type: '采购订单', content: '创建采购订单PO20230001', time: '2023-05-08 14:15' },
  { id: 3, type: '质检记录', content: 'IQC检验通过，物料入库', time: '2023-05-15 09:45' },
  { id: 4, type: '生产计划', content: '安排生产计划，计划ID: 1', time: '2023-05-18 16:20' },
  { id: 5, type: '出货管理', content: '创建出货计划SP20230001', time: '2023-05-25 11:10' }
])

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="welcome-card">
          <div class="welcome-content">
            <h1>欢迎使用运美兴工厂智能管理系统</h1>
            <p>本系统提供完整的生产管理流程，从客户需求到成品出货的全流程管理</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>制造现场痛点</span>
            </div>
          </template>
          <div class="pain-points">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="pain-point-card">
                  <el-icon class="pain-point-icon"><Warning /></el-icon>
                  <h3>管理不透明</h3>
                  <ul class="pain-point-list">
                    <li>生产进度无法实时监控</li>
                    <li>物料批次难以动态追踪</li>
                    <li>管理层决策缺乏数据支撑</li>
                  </ul>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="pain-point-card">
                  <el-icon class="pain-point-icon"><CircleClose /></el-icon>
                  <h3>质量追溯困难</h3>
                  <ul class="pain-point-list">
                    <li>工艺参数超限未及时告警</li>
                    <li>不良品来源无法快速定位</li>
                    <li>返修流程低效耗时</li>
                  </ul>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="pain-point-card">
                  <el-icon class="pain-point-icon"><DataLine /></el-icon>
                  <h3>数据采集低效</h3>
                  <ul class="pain-point-list">
                    <li>依赖人工记录易出错</li>
                    <li>质检与生产数据未关联</li>
                    <li>信息孤岛现象严重</li>
                  </ul>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>核心业务流程</span>
            </div>
          </template>
          <div class="process-flow">
            <div 
              v-for="process in coreProcesses" 
              :key="process.id"
              class="process-item"
              @click="navigateTo(process.path)"
            >
              <el-icon class="process-icon"><component :is="process.icon" /></el-icon>
              <div class="process-name">{{ process.id }}. {{ process.name }}</div>
              <div class="process-desc">{{ process.description }}</div>
              <el-icon class="arrow-icon" v-if="process.id < coreProcesses.length"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统概览</span>
            </div>
          </template>
          <div class="data-overview">
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="data-item">
                  <el-icon><Document /></el-icon>
                  <div class="data-info">
                    <div class="data-value">{{ overviewData.customerDemands }}</div>
                    <div class="data-label">客户需求</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="data-item">
                  <el-icon><SetUp /></el-icon>
                  <div class="data-info">
                    <div class="data-value">{{ overviewData.ongoingProduction }}</div>
                    <div class="data-label">进行中生产</div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" class="mt-20">
              <el-col :span="12">
                <div class="data-item">
                  <el-icon><ShoppingCart /></el-icon>
                  <div class="data-info">
                    <div class="data-value">{{ overviewData.pendingPurchase }}</div>
                    <div class="data-label">待处理采购</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="data-item">
                  <el-icon><Van /></el-icon>
                  <div class="data-info">
                    <div class="data-value">{{ overviewData.completedShipments }}</div>
                    <div class="data-label">已完成出货</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
            </div>
          </template>
          <div class="recent-activities">
            <el-timeline>
              <el-timeline-item
                v-for="activity in recentActivities"
                :key="activity.id"
                :timestamp="activity.time"
              >
                <div class="activity-content">
                  <span class="activity-type">{{ activity.type }}</span>
                  <span class="activity-text">{{ activity.content }}</span>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
}

.mt-20 {
  margin-top: 20px;
}

.welcome-card {
  background: linear-gradient(to right, #1890ff, #36cfc9);
  color: white;
}

.welcome-content {
  text-align: center;
  padding: 20px 0;
}

.welcome-content h1 {
  font-size: 24px;
  margin-bottom: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.process-flow {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}

.pain-points {
  padding: 20px 0;
}

.pain-point-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  height: 100%;
  transition: all 0.3s;
}

.pain-point-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.pain-point-icon {
  font-size: 40px;
  color: #f56c6c;
  margin-bottom: 15px;
}

.pain-point-card h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 15px;
}

.pain-point-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.pain-point-list li {
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
  margin-bottom: 8px;
  padding-left: 20px;
  position: relative;
}

.pain-point-list li:before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  background-color: #f56c6c;
  border-radius: 50%;
}

.process-item {
  flex: 1;
  min-width: 120px;
  text-align: center;
  position: relative;
  padding: 15px 10px;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
}

.process-item:hover {
  background-color: #f5f7fa;
}

.process-icon {
  font-size: 30px;
  color: #409EFF;
  margin-bottom: 10px;
}

.process-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.process-desc {
  font-size: 12px;
  color: #909399;
}

.arrow-icon {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  color: #909399;
  font-size: 20px;
  z-index: 1;
}

.data-overview {
  padding: 10px 0;
}

.data-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  background-color: #f5f7fa;
}

.data-item .el-icon {
  font-size: 30px;
  color: #409EFF;
  margin-right: 15px;
}

.data-info {
  flex: 1;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.data-label {
  font-size: 14px;
  color: #909399;
}

.recent-activities {
  padding: 10px 0;
}

.activity-content {
  display: flex;
  flex-direction: column;
}

.activity-type {
  font-weight: bold;
  margin-bottom: 5px;
}

.activity-text {
  color: #606266;
}
</style>
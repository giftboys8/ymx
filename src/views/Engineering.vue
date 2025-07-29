<template>
  <div class="engineering-container">
    <h1>工程调试</h1>
    
    <!-- 工序状态概览 -->
    <el-card class="status-card">
      <template #header>
        <div class="card-header">
          <span>工序状态</span>
          <el-button type="primary" @click="startNewProcess">新建工序</el-button>
        </div>
      </template>
      <el-steps :active="currentStep" finish-status="success">
        <el-step title="涂布准备" />
        <el-step title="设备调试" />
        <el-step title="首件检验" />
        <el-step title="批量生产" />
        <el-step title="过程抽检" />
        <el-step title="工序完成" />
      </el-steps>
    </el-card>

    <!-- 工序详情表格 -->
    <el-card class="process-card">
      <template #header>
        <div class="card-header">
          <span>工序记录</span>
        </div>
      </template>
      <el-table :data="paginatedProcessRecords" style="width: 100%" class="mobile-responsive-table">
        <el-table-column prop="process_id" label="工序ID" width="100" />
        <el-table-column prop="process_name" label="工艺名称" width="150" />
        <el-table-column prop="material_code" label="物料编码" width="180" class-name="mobile-hidden" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="planned_quantity" label="计划数量" width="120" class-name="mobile-hidden" />
        <el-table-column prop="actual_quantity" label="实际数量" width="120" class-name="mobile-hidden" />
        <el-table-column prop="yield_rate" label="良率" width="100">
          <template #default="scope">
            {{ scope.row.yield_rate }}%
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="180" class-name="mobile-hidden" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleProcess(scope.row)">处理</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <CommonPagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 工序处理对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
      <el-form :model="currentProcess" label-width="120px">
        <el-form-item label="工序ID">
          <el-input v-model="currentProcess.process_id" :disabled="dialogTitle === '处理工序'" />
        </el-form-item>
        <el-form-item label="工艺名称">
          <el-input v-model="currentProcess.process_name" />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="currentProcess.material_code" />
        </el-form-item>
        <el-form-item label="计划数量">
          <el-input-number v-model="currentProcess.planned_quantity" :min="0" />
        </el-form-item>
        <el-form-item label="实际数量">
          <el-input-number v-model="currentProcess.actual_quantity" :min="0" />
        </el-form-item>
        <el-form-item label="良率(%)">
          <el-input-number v-model="currentProcess.yield_rate" :min="0" :max="100" :precision="2" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="currentProcess.status" style="width: 100%">
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="异常" value="异常" />
          </el-select>
        </el-form-item>
        <el-form-item label="工艺参数">
          <el-input v-model="currentProcess.parameters" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProcess">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CommonPagination from '../components/CommonPagination.vue'

// 响应式数据
const currentStep = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 工序记录数据
const processRecords = ref([
  {
    process_id: 'P001',
    process_name: '涂布工艺',
    material_code: 'CELL001',
    planned_quantity: 5000,
    actual_quantity: 4850,
    yield_rate: 97.0,
    status: '已完成',
    created_at: '2023-06-20 09:00:00',
    parameters: '涂布厚度: 120μm, 涂布速度: 15m/min',
    equipment_status: 'normal',
    inspection_result: 'pass'
  },
  {
    process_id: 'P002',
    process_name: '辊压工艺',
    material_code: 'CELL001',
    planned_quantity: 4850,
    actual_quantity: 4800,
    yield_rate: 98.97,
    status: '已完成',
    created_at: '2023-06-22 10:30:00',
    parameters: '辊压压力: 2.5MPa, 辊压速度: 10m/min',
    equipment_status: 'normal',
    inspection_result: 'pass'
  },
  {
    process_id: 'P003',
    process_name: '分切工艺',
    material_code: 'CELL001',
    planned_quantity: 4800,
    actual_quantity: 4750,
    yield_rate: 98.96,
    status: '进行中',
    created_at: '2023-06-25 14:15:00',
    parameters: '分切宽度: 65mm, 分切精度: ±0.1mm',
    equipment_status: 'normal',
    inspection_result: 'pass'
  },
  {
    process_id: 'P004',
    process_name: '卷绕工艺',
    material_code: 'CELL002',
    planned_quantity: 8000,
    actual_quantity: 7850,
    yield_rate: 98.13,
    status: '已完成',
    created_at: '2023-06-28 11:20:00',
    parameters: '卷绕张力: 15N, 卷绕速度: 8m/min',
    equipment_status: 'normal',
    inspection_result: 'pass'
  },
  {
    process_id: 'P005',
    process_name: '封装工艺',
    material_code: 'CELL002',
    planned_quantity: 7850,
    actual_quantity: 7800,
    yield_rate: 99.36,
    status: '进行中',
    created_at: '2023-06-30 16:45:00',
    parameters: '封装温度: 180°C, 封装时间: 3s',
    equipment_status: 'normal',
    inspection_result: 'pass'
  },
  {
    process_id: 'P006',
    process_name: '注液工艺',
    material_code: 'CELL002',
    planned_quantity: 7800,
    actual_quantity: 0,
    yield_rate: 0,
    status: '未开始',
    created_at: '2023-07-02 08:30:00',
    parameters: '注液量: 3.2ml, 注液压力: 0.1MPa',
    equipment_status: 'pending',
    inspection_result: 'pass'
  },
  {
    process_id: 'P007',
    process_name: '化成工艺',
    material_code: 'CELL003',
    planned_quantity: 6000,
    actual_quantity: 5900,
    yield_rate: 98.33,
    status: '已完成',
    created_at: '2023-07-05 13:10:00',
    parameters: '化成电流: 0.1C, 化成时间: 24h',
    equipment_status: 'normal',
    inspection_result: 'pass'
  },
  {
    process_id: 'P008',
    process_name: '分容工艺',
    material_code: 'CELL003',
    planned_quantity: 5900,
    actual_quantity: 5850,
    yield_rate: 99.15,
    status: '进行中',
    created_at: '2023-07-08 15:25:00',
    parameters: '分容电流: 0.2C, 截止电压: 2.5V',
    equipment_status: 'normal',
    inspection_result: 'pass'
  },
  {
    process_id: 'P009',
    process_name: '模组装配',
    material_code: 'MODULE001',
    planned_quantity: 600,
    actual_quantity: 590,
    yield_rate: 98.33,
    status: '已完成',
    created_at: '2023-07-10 12:40:00',
    parameters: '装配扭矩: 5Nm, 绝缘测试: >100MΩ',
    equipment_status: 'normal',
    inspection_result: 'pass'
  },
  {
    process_id: 'P010',
    process_name: 'PACK装配',
    material_code: 'PACK001',
    planned_quantity: 150,
    actual_quantity: 148,
    yield_rate: 98.67,
    status: '已完成',
    created_at: '2023-07-12 17:55:00',
    parameters: '装配扭矩: 8Nm, 气密性测试: 通过',
    equipment_status: 'normal',
    inspection_result: 'pass'
  }
])

const currentProcess = reactive({
  process_id: '',
  process_name: '',
  material_code: '',
  planned_quantity: 0,
  actual_quantity: 0,
  yield_rate: 0,
  status: '未开始',
  parameters: '',
  equipment_status: 'normal',
  inspection_result: 'pass',
  created_at: ''
})

// 计算属性 - 分页数据
const paginatedProcessRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return processRecords.value.slice(start, end)
})

// 初始化数据
onMounted(() => {
  total.value = processRecords.value.length
})

// 分页处理函数
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 工序处理函数
const startNewProcess = () => {
  dialogTitle.value = '新建工序'
  Object.assign(currentProcess, {
    process_id: Date.now().toString(),
    process_name: '',
    material_code: '',
    planned_quantity: 0,
    actual_quantity: 0,
    yield_rate: 0,
    status: '未开始',
    parameters: '',
    equipment_status: 'normal',
    inspection_result: 'pass',
    created_at: new Date().toLocaleString()
  })
  dialogVisible.value = true
}

const handleProcess = (row) => {
  dialogTitle.value = '处理工序'
  Object.assign(currentProcess, { ...row })
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该工序记录?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = processRecords.value.findIndex(item => item.process_id === row.process_id)
    if (index !== -1) {
      processRecords.value.splice(index, 1)
      total.value = processRecords.value.length
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

const saveProcess = () => {
  if (currentProcess.process_id) {
    const index = processRecords.value.findIndex(
      item => item.process_id === currentProcess.process_id
    )
    if (index !== -1) {
      processRecords.value[index] = { ...currentProcess }
    } else {
      processRecords.value.push({ ...currentProcess })
    }
  } else {
    processRecords.value.push({ ...currentProcess })
  }
  total.value = processRecords.value.length
  dialogVisible.value = false
  ElMessage.success('保存成功')
}

const getStatusType = (status) => {
  const statusMap = {
    '未开始': 'info',
    '进行中': 'warning',
    '已完成': 'success',
    '异常': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.engineering-container {
  padding: 20px;
}

.status-card,
.process-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-steps {
  margin: 20px 0;
}

.dialog-footer {
  text-align: right;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .engineering-container {
    padding: 10px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .el-steps {
    margin: 10px 0;
  }
  
  :deep(.mobile-hidden) {
    display: none !important;
  }
  
  :deep(.mobile-responsive-table) {
    font-size: 12px;
  }
  
  :deep(.mobile-responsive-table .el-table__cell) {
    padding: 8px 4px;
  }
}
</style>
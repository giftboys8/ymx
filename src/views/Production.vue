<template>
  <div class="production-schedule-container">
    <div class="page-header">
      <h2>生产排期管理</h2>
      <el-button type="primary" @click="openDialog('add')">新增排期</el-button>
    </div>

    <!-- 排期记录表格 -->
    <el-table :data="scheduleList" border style="width: 100%" v-loading="loading" class="mobile-responsive-table">
      <el-table-column prop="planId" label="计划ID" width="120" />
      <el-table-column prop="processId" label="制程ID" width="120" class-name="mobile-hidden" />
      <el-table-column prop="materialCode" label="物料编码" width="150" class-name="mobile-hidden" />
      <el-table-column prop="planDate" label="计划日期" width="120" />
      <el-table-column prop="plannedQuantity" label="计划量" width="100" />
      <el-table-column prop="actualQuantity" label="实际量" width="100" class-name="mobile-hidden" />
      <el-table-column prop="yieldRate" label="良率" width="100" class-name="mobile-hidden">
        <template #default="{ row }">
          {{ row.yieldRate }}%
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '已关闭' ? 'info' : row.status === '进行中' ? 'success' : 'warning'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="empId" label="负责人" width="120" class-name="mobile-hidden" />
      <el-table-column prop="createdAt" label="创建时间" width="180" class-name="mobile-hidden" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button link type="primary" @click="openMaterialPlanDialog(row)" class="mobile-hidden">物料计划</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 排期表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增排期' : '编辑排期'"
      width="50%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="制程ID" prop="processId">
          <el-input v-model="form.processId" />
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" />
        </el-form-item>
        <el-form-item label="计划日期" prop="planDate">
          <el-date-picker
            v-model="form.planDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="计划量" prop="plannedQuantity">
          <el-input-number v-model="form.plannedQuantity" :min="1" />
        </el-form-item>
        <el-form-item label="实际量" prop="actualQuantity">
          <el-input-number v-model="form.actualQuantity" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已关闭" value="已关闭" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="empId">
          <el-input v-model="form.empId" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 物料计划对话框 -->
    <el-dialog v-model="materialPlanDialogVisible" title="物料计划" width="60%">
      <el-table :data="materialPlanList" border style="width: 100%">
        <el-table-column prop="materialPlanId" label="计划ID" width="120" />
        <el-table-column prop="materialId" label="物料ID" width="120" />
        <el-table-column prop="plannedQuantity" label="计划量" width="100" />
        <el-table-column prop="actualQuantity" label="实际量" width="100" />
        <el-table-column prop="yieldRate" label="良率" width="100">
          <template #default="{ row }">
            {{ row.yieldRate }}%
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const loading = ref(false)
const scheduleList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add')
const materialPlanDialogVisible = ref(false)

// 表单数据
const formRef = ref(null)
const form = reactive({
  processId: '',
  materialCode: '',
  planDate: '',
  plannedQuantity: 1,
  actualQuantity: 0,
  status: '未开始',
  empId: ''
})

// 物料计划数据
const materialPlanList = ref([])

// 表单验证规则
const rules = {
  processId: [{ required: true, message: '请输入制程ID', trigger: 'blur' }],
  materialCode: [{ required: true, message: '请输入物料编码', trigger: 'blur' }],
  planDate: [{ required: true, message: '请选择计划日期', trigger: 'change' }],
  plannedQuantity: [{ required: true, message: '请输入计划量', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  empId: [{ required: true, message: '请输入负责人', trigger: 'blur' }]
}

// 模拟数据加载
const loadData = () => {
  loading.value = true
  // 这里应该调用后端API获取数据
  setTimeout(() => {
    scheduleList.value = [
      {
        planId: 'P20230001',
        processId: 'PROC001',
        materialCode: 'M001',
        planDate: '2023-05-01',
        plannedQuantity: 100,
        actualQuantity: 95,
        yieldRate: 95,
        status: '已关闭',
        empId: 'EMP001',
        createdAt: '2023-05-01 10:00:00'
      },
      {
        planId: 'P20230002',
        processId: 'PROC004',
        materialCode: 'CELL001',
        planDate: '2023-06-20',
        plannedQuantity: 5000,
        actualQuantity: 4850,
        yieldRate: 97,
        status: '已关闭',
        empId: 'EMP005',
        createdAt: '2023-06-18 09:00:00'
      },
      {
        planId: 'P20230003',
        processId: 'PROC005',
        materialCode: 'CELL001',
        planDate: '2023-06-22',
        plannedQuantity: 4850,
        actualQuantity: 4800,
        yieldRate: 98.97,
        status: '已关闭',
        empId: 'EMP006',
        createdAt: '2023-06-20 10:30:00'
      },
      {
        planId: 'P20230004',
        processId: 'PROC006',
        materialCode: 'CELL001',
        planDate: '2023-06-25',
        plannedQuantity: 4800,
        actualQuantity: 4750,
        yieldRate: 98.96,
        status: '进行中',
        empId: 'EMP005',
        createdAt: '2023-06-23 14:15:00'
      },
      {
        planId: 'P20230005',
        processId: 'PROC007',
        materialCode: 'CELL002',
        planDate: '2023-06-28',
        plannedQuantity: 8000,
        actualQuantity: 7850,
        yieldRate: 98.13,
        status: '已关闭',
        empId: 'EMP007',
        createdAt: '2023-06-25 11:20:00'
      },
      {
        planId: 'P20230006',
        processId: 'PROC008',
        materialCode: 'CELL002',
        planDate: '2023-06-30',
        plannedQuantity: 7850,
        actualQuantity: 7800,
        yieldRate: 99.36,
        status: '进行中',
        empId: 'EMP008',
        createdAt: '2023-06-28 16:45:00'
      },
      {
        planId: 'P20230007',
        processId: 'PROC009',
        materialCode: 'CELL002',
        planDate: '2023-07-02',
        plannedQuantity: 7800,
        actualQuantity: 0,
        yieldRate: 0,
        status: '计划中',
        empId: 'EMP009',
        createdAt: '2023-06-30 08:30:00'
      },
      {
        planId: 'P20230008',
        processId: 'PROC010',
        materialCode: 'CELL003',
        planDate: '2023-07-05',
        plannedQuantity: 6000,
        actualQuantity: 5900,
        yieldRate: 98.33,
        status: '已关闭',
        empId: 'EMP010',
        createdAt: '2023-07-02 13:10:00'
      },
      {
        planId: 'P20230009',
        processId: 'PROC011',
        materialCode: 'CELL003',
        planDate: '2023-07-08',
        plannedQuantity: 5900,
        actualQuantity: 5850,
        yieldRate: 99.15,
        status: '进行中',
        empId: 'EMP011',
        createdAt: '2023-07-05 15:25:00'
      },
      {
        planId: 'P20230010',
        processId: 'PROC012',
        materialCode: 'MODULE001',
        planDate: '2023-07-10',
        plannedQuantity: 600,
        actualQuantity: 590,
        yieldRate: 98.33,
        status: '已关闭',
        empId: 'EMP012',
        createdAt: '2023-07-08 12:40:00'
      },
      {
        planId: 'P20230011',
        processId: 'PROC013',
        materialCode: 'PACK001',
        planDate: '2023-07-12',
        plannedQuantity: 150,
        actualQuantity: 148,
        yieldRate: 98.67,
        status: '已关闭',
        empId: 'EMP013',
        createdAt: '2023-07-10 17:55:00'
      }
    ]
    total.value = 100
    loading.value = false
  }, 1000)
}

// 打开对话框
const openDialog = (type, row) => {
  dialogType.value = type
  dialogVisible.value = true
  if (type === 'edit' && row) {
    Object.assign(form, row)
  } else {
    Object.assign(form, {
      processId: '',
      materialCode: '',
      planDate: '',
      plannedQuantity: 1,
      actualQuantity: 0,
      status: '未开始',
      empId: ''
    })
  }
}

// 打开物料计划对话框
const openMaterialPlanDialog = (row) => {
  materialPlanDialogVisible.value = true
  // 这里应该调用后端API获取物料计划数据
  materialPlanList.value = [
    {
      materialPlanId: 'MP20230001',
      materialId: 'M001',
      plannedQuantity: 100,
      actualQuantity: 95,
      yieldRate: 95
    },
    // 更多测试数据...
  ]
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      // 这里应该调用后端API保存数据
      ElMessage.success('保存成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

// 删除记录
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该排期记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里应该调用后端API删除数据
    ElMessage.success('删除成功')
    loadData()
  })
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  loadData()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  loadData()
}

// 初始化加载数据
loadData()
</script>

<style scoped>
.production-schedule-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
<template>
  <div class="shipment-container">
    <div class="page-header">
      <h2>出货管理</h2>
      <el-button type="primary" @click="openDialog('add')">新增出货</el-button>
    </div>

    <!-- 出货记录表格 -->
    <el-table :data="shipmentList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="planId" label="计划ID" width="120" />
      <el-table-column prop="materialCode" label="物料编码" width="150" />
      <el-table-column prop="materialName" label="物料名称" width="150" />
      <el-table-column prop="shipmentDate" label="出货日期" width="120" />
      <el-table-column prop="plannedQuantity" label="计划量" width="100" />
      <el-table-column prop="actualQuantity" label="实际量" width="100" />
      <el-table-column prop="customer" label="客户" width="150" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : row.status === '已取消' ? 'info' : 'warning'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="logisticsNo" label="物流单号" width="150" />
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button link type="primary" @click="openPackingDialog(row)">拣货包装</el-button>
          <el-button link type="primary" @click="openLogisticsDialog(row)">物流信息</el-button>
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

    <!-- 出货表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增出货' : '编辑出货'"
      width="50%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" />
        </el-form-item>
        <el-form-item label="出货日期" prop="shipmentDate">
          <el-date-picker
            v-model="form.shipmentDate"
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
        <el-form-item label="客户" prop="customer">
          <el-input v-model="form.customer" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="待出货" value="待出货" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNo">
          <el-input v-model="form.logisticsNo" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 拣货包装对话框 -->
    <el-dialog v-model="packingDialogVisible" title="拣货包装信息" width="60%">
      <el-form :model="packingForm" label-width="100px">
        <el-form-item label="包装方式">
          <el-select v-model="packingForm.packingType">
            <el-option label="纸箱" value="纸箱" />
            <el-option label="木箱" value="木箱" />
            <el-option label="托盘" value="托盘" />
          </el-select>
        </el-form-item>
        <el-form-item label="包装数量">
          <el-input-number v-model="packingForm.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="包装备注">
          <el-input type="textarea" v-model="packingForm.notes" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="packingDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="handlePackingSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog v-model="logisticsDialogVisible" title="物流信息" width="60%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in logisticsActivities"
          :key="index"
          :timestamp="activity.timestamp"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const loading = ref(false)
const shipmentList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add')
const packingDialogVisible = ref(false)
const logisticsDialogVisible = ref(false)

// 表单数据
const formRef = ref(null)
const form = reactive({
  materialCode: '',
  materialName: '',
  shipmentDate: '',
  plannedQuantity: 1,
  actualQuantity: 0,
  customer: '',
  status: '待出货',
  logisticsNo: ''
})

// 拣货包装表单
const packingForm = reactive({
  packingType: '纸箱',
  quantity: 1,
  notes: ''
})

// 物流信息
const logisticsActivities = ref([
  {
    content: '包裹已签收',
    timestamp: '2023-05-10 10:00:00'
  },
  {
    content: '包裹已到达目的地',
    timestamp: '2023-05-09 16:00:00'
  },
  {
    content: '包裹运输中',
    timestamp: '2023-05-08 14:00:00'
  },
  {
    content: '包裹已发出',
    timestamp: '2023-05-07 09:00:00'
  }
])

// 表单验证规则
const rules = {
  materialCode: [{ required: true, message: '请输入物料编码', trigger: 'blur' }],
  materialName: [{ required: true, message: '请输入物料名称', trigger: 'blur' }],
  shipmentDate: [{ required: true, message: '请选择出货日期', trigger: 'change' }],
  plannedQuantity: [{ required: true, message: '请输入计划量', trigger: 'blur' }],
  customer: [{ required: true, message: '请输入客户', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// 模拟数据加载
const loadData = () => {
  loading.value = true
  setTimeout(() => {
    shipmentList.value = [
      {
        planId: 'SP20230001',
        materialCode: 'M001',
        materialName: '产品A',
        shipmentDate: '2023-05-10',
        plannedQuantity: 100,
        actualQuantity: 98,
        customer: '客户A',
        status: '已完成',
        logisticsNo: 'SF1234567890',
        createdAt: '2023-05-07 09:00:00'
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
      materialCode: '',
      materialName: '',
      shipmentDate: '',
      plannedQuantity: 1,
      actualQuantity: 0,
      customer: '',
      status: '待出货',
      logisticsNo: ''
    })
  }
}

// 打开拣货包装对话框
const openPackingDialog = (row) => {
  packingDialogVisible.value = true
}

// 打开物流信息对话框
const openLogisticsDialog = (row) => {
  logisticsDialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success('保存成功')
      dialogVisible.value = false
      loadData()
    }
  })
}

// 提交拣货包装信息
const handlePackingSubmit = () => {
  ElMessage.success('包装信息已更新')
  packingDialogVisible.value = false
}

// 删除记录
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该出货记录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
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
.shipment-container {
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
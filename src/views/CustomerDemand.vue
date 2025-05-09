<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCustomerDemandStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取客户需求状态管理
const customerDemandStore = useCustomerDemandStore()

// 表格数据
const demandTableData = ref([])
const detailTableData = ref([])
const customerOptions = ref([])
const productOptions = ref([])

// 加载数据
onMounted(() => {
  demandTableData.value = customerDemandStore.demands
  customerOptions.value = customerDemandStore.customers
  productOptions.value = customerDemandStore.products
})

// 表格加载状态
const tableLoading = ref(false)

// 对话框可见性
const demandDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 当前选中的需求单
const currentDemand = ref(null)

// 新需求表单
const demandForm = reactive({
  demand_no: '',
  customer_id: '',
  requester_dept: '',
  requester_name: '',
  requester_phone: '',
  create_date: '',
  workflow_status: '未生效',
  approved_by: '',
  reviewed_by: '',
  processed_by: ''
})

// 新需求明细表单
const detailForm = reactive({
  detail_id: 0,
  demand_no: '',
  material_code: '',
  delivery_date: '',
  required_qty: 0,
  sub_material: ''
})

// 表单规则
const demandRules = {
  customer_id: [{ required: true, message: '请选择客户', trigger: 'change' }],
  requester_dept: [{ required: true, message: '请输入发起方部门', trigger: 'blur' }],
  requester_name: [{ required: true, message: '请输入发起方联系人', trigger: 'blur' }],
  create_date: [{ required: true, message: '请选择创建日期', trigger: 'change' }]
}

const detailRules = {
  material_code: [{ required: true, message: '请选择物料', trigger: 'change' }],
  delivery_date: [{ required: true, message: '请选择计划日期', trigger: 'change' }],
  required_qty: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}

// 打开新增需求对话框
const openAddDemandDialog = () => {
  // 生成新的需求单号
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  demandForm.demand_no = `D${year}${month}${day}${random}`
  demandForm.create_date = `${year}-${month}-${day}`
  
  // 重置其他字段
  demandForm.customer_id = ''
  demandForm.requester_dept = ''
  demandForm.requester_name = ''
  demandForm.requester_phone = ''
  demandForm.workflow_status = '未生效'
  demandForm.approved_by = ''
  demandForm.reviewed_by = ''
  demandForm.processed_by = ''
  
  demandDialogVisible.value = true
}

// 提交需求表单
const submitDemandForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 添加到状态管理
      customerDemandStore.addDemand({
        ...demandForm,
        create_date: demandForm.create_date
      })
      
      // 更新表格数据
      demandTableData.value = customerDemandStore.demands
      
      // 关闭对话框
      demandDialogVisible.value = false
      
      // 提示成功
      ElMessage({
        type: 'success',
        message: '需求单创建成功'
      })
    }
  })
}

// 查看需求明细
const viewDemandDetails = (row) => {
  currentDemand.value = row
  // 加载明细数据
  detailTableData.value = customerDemandStore.demandDetails.filter(
    detail => detail.demand_no === row.demand_no
  )
}

// 打开新增明细对话框
const openAddDetailDialog = () => {
  if (!currentDemand.value) {
    ElMessage({
      type: 'warning',
      message: '请先选择需求单'
    })
    return
  }
  
  // 重置表单
  detailForm.detail_id = customerDemandStore.demandDetails.length + 1
  detailForm.demand_no = currentDemand.value.demand_no
  detailForm.material_code = ''
  detailForm.delivery_date = ''
  detailForm.required_qty = 0
  detailForm.sub_material = ''
  
  detailDialogVisible.value = true
}

// 提交明细表单
const submitDetailForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 添加到状态管理
      customerDemandStore.addDemandDetail({
        ...detailForm,
        delivery_date: detailForm.delivery_date
      })
      
      // 更新表格数据
      detailTableData.value = customerDemandStore.demandDetails.filter(
        detail => detail.demand_no === currentDemand.value.demand_no
      )
      
      // 关闭对话框
      detailDialogVisible.value = false
      
      // 提示成功
      ElMessage({
        type: 'success',
        message: '需求明细添加成功'
      })
    }
  })
}

// 删除需求单
const deleteDemand = (row) => {
  ElMessageBox.confirm(
    '确定要删除该需求单吗？相关的需求明细也将被删除',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟删除操作
    const index = demandTableData.value.findIndex(item => item.demand_no === row.demand_no)
    if (index !== -1) {
      demandTableData.value.splice(index, 1)
      
      // 如果当前选中的是被删除的需求单，清空明细
      if (currentDemand.value && currentDemand.value.demand_no === row.demand_no) {
        currentDemand.value = null
        detailTableData.value = []
      }
      
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    }
  }).catch(() => {
    // 取消删除
  })
}

// 删除需求明细
const deleteDetail = (row) => {
  ElMessageBox.confirm(
    '确定要删除该需求明细吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟删除操作
    const index = detailTableData.value.findIndex(item => item.detail_id === row.detail_id)
    if (index !== -1) {
      detailTableData.value.splice(index, 1)
      
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    }
  }).catch(() => {
    // 取消删除
  })
}

// 获取客户名称
const getCustomerName = (customerId) => {
  const customer = customerOptions.value.find(c => c.customer_id === customerId)
  return customer ? customer.customer_name : ''
}

// 获取物料名称
const getProductName = (materialCode) => {
  const product = productOptions.value.find(p => p.material_code === materialCode)
  return product ? product.material_name : ''
}
</script>

<template>
  <div class="customer-demand-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户需求计划</span>
          <el-button type="primary" @click="openAddDemandDialog">
            <el-icon><Plus /></el-icon> 新增需求单
          </el-button>
        </div>
      </template>
      
      <!-- 需求单表格 -->
      <el-table
        :data="demandTableData"
        style="width: 100%"
        v-loading="tableLoading"
        @row-click="viewDemandDetails"
        row-key="demand_no"
        border
      >
        <el-table-column prop="demand_no" label="需求单号" width="150" />
        <el-table-column label="客户名称" width="180">
          <template #default="{ row }">
            {{ getCustomerName(row.customer_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="requester_dept" label="发起方部门" width="120" />
        <el-table-column prop="requester_name" label="发起方联系人" width="120" />
        <el-table-column prop="create_date" label="创建日期" width="120" />
        <el-table-column prop="workflow_status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.workflow_status === '生效' ? 'success' : 'warning'">
              {{ row.workflow_status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button size="small" @click.stop="viewDemandDetails(row)">
              查看明细
            </el-button>
            <el-button size="small" type="danger" @click.stop="deleteDemand(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 需求明细 -->
    <el-card v-if="currentDemand" class="mt-20">
      <template #header>
        <div class="card-header">
          <span>需求明细 - {{ currentDemand.demand_no }}</span>
          <el-button type="primary" @click="openAddDetailDialog">
            <el-icon><Plus /></el-icon> 新增明细
          </el-button>
        </div>
      </template>
      
      <!-- 明细表格 -->
      <el-table
        :data="detailTableData"
        style="width: 100%"
        v-loading="tableLoading"
        row-key="detail_id"
        border
      >
        <el-table-column prop="detail_id" label="ID" width="80" />
        <el-table-column label="物料名称" width="180">
          <template #default="{ row }">
            {{ getProductName(row.material_code) }}
          </template>
        </el-table-column>
        <el-table-column prop="material_code" label="物料编码" width="180" />
        <el-table-column prop="delivery_date" label="计划日期" width="120" />
        <el-table-column prop="required_qty" label="数量" width="100" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="deleteDetail(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 新增需求对话框 -->
    <el-dialog
      v-model="demandDialogVisible"
      title="新增客户需求单"
      width="50%"
    >
      <el-form
        ref="demandFormRef"
        :model="demandForm"
        :rules="demandRules"
        label-width="120px"
      >
        <el-form-item label="需求单号" prop="demand_no">
          <el-input v-model="demandForm.demand_no" disabled />
        </el-form-item>
        <el-form-item label="客户" prop="customer_id">
          <el-select v-model="demandForm.customer_id" placeholder="请选择客户" style="width: 100%">
            <el-option
              v-for="item in customerOptions"
              :key="item.customer_id"
              :label="item.customer_name"
              :value="item.customer_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发起方部门" prop="requester_dept">
          <el-input v-model="demandForm.requester_dept" />
        </el-form-item>
        <el-form-item label="发起方联系人" prop="requester_name">
          <el-input v-model="demandForm.requester_name" />
        </el-form-item>
        <el-form-item label="发起方电话" prop="requester_phone">
          <el-input v-model="demandForm.requester_phone" />
        </el-form-item>
        <el-form-item label="创建日期" prop="create_date">
          <el-date-picker
            v-model="demandForm.create_date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="状态" prop="workflow_status">
          <el-select v-model="demandForm.workflow_status" placeholder="请选择状态" style="width: 100%">
            <el-option label="未生效" value="未生效" />
            <el-option label="生效" value="生效" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="demandDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDemandForm(demandFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新增明细对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="新增需求明细"
      width="50%"
    >
      <el-form
        ref="detailFormRef"
        :model="detailForm"
        :rules="detailRules"
        label-width="120px"
      >
        <el-form-item label="需求单号" prop="demand_no">
          <el-input v-model="detailForm.demand_no" disabled />
        </el-form-item>
        <el-form-item label="物料" prop="material_code">
          <el-select v-model="detailForm.material_code" placeholder="请选择物料" style="width: 100%">
            <el-option
              v-for="item in productOptions"
              :key="item.material_code"
              :label="`${item.material_name} (${item.material_code})`"
              :value="item.material_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="计划日期" prop="delivery_date">
          <el-date-picker
            v-model="detailForm.delivery_date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="数量" prop="required_qty">
          <el-input-number v-model="detailForm.required_qty" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="子物料消耗" prop="sub_material">
          <el-input v-model="detailForm.sub_material" placeholder="格式：{material_id:xxxx,sub_materrial_qyt:2222}" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDetailForm(detailFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.customer-demand-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mt-20 {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
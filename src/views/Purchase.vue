<script setup>
import { ref, reactive, onMounted } from 'vue'
import { usePurchaseStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取采购管理状态
const purchaseStore = usePurchaseStore()

// 表格数据
const purchaseOrdersData = ref([])
const orderItemsData = ref([])
const supplierOptions = ref([])
const materialOptions = ref([])

// 加载数据
onMounted(() => {
  purchaseOrdersData.value = purchaseStore.purchaseOrders
  supplierOptions.value = purchaseStore.suppliers
  // 从客户需求状态获取物料信息
  materialOptions.value = purchaseStore.orderItems.map(item => ({
    material_id: item.material_id,
    material_name: `物料${item.material_id}`,
    material_code: item.material_id
  }))
})

// 表格加载状态
const tableLoading = ref(false)

// 对话框可见性
const orderDialogVisible = ref(false)
const itemDialogVisible = ref(false)

// 当前选中的采购单
const currentOrder = ref(null)

// 新采购单表单
const orderForm = reactive({
  id: '',
  order_date: '',
  supplier_id: '',
  total_amount: 0,
  payment_terms: '',
  delivery_period: '',
  quality_requirements: '',
  delivery_requirements: '',
  transport_conditions: '',
  approver: '',
  reviewer: '',
  created_at: '',
  status: '待下单',
  emp_id: 1
})

// 新采购明细表单
const itemForm = reactive({
  id: 0,
  order_id: '',
  material_id: '',
  quantity: 0,
  unit_price: 0,
  amount: 0,
  remarks: ''
})

// 表单规则
const orderRules = {
  supplier_id: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  order_date: [{ required: true, message: '请选择订单日期', trigger: 'change' }],
  payment_terms: [{ required: true, message: '请选择付款方式', trigger: 'change' }],
  delivery_period: [{ required: true, message: '请输入交货周期', trigger: 'blur' }]
}

const itemRules = {
  material_id: [{ required: true, message: '请选择物料', trigger: 'change' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  unit_price: [{ required: true, message: '请输入单价', trigger: 'blur' }]
}

// 打开新增采购单对话框
const openAddOrderDialog = () => {
  // 生成新的采购单号
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  orderForm.id = `PO${year}${month}${day}${random}`
  orderForm.order_date = `${year}-${month}-${day}`
  orderForm.created_at = `${year}-${month}-${day}`
  
  // 重置其他字段
  orderForm.supplier_id = ''
  orderForm.total_amount = 0
  orderForm.payment_terms = ''
  orderForm.delivery_period = ''
  orderForm.quality_requirements = ''
  orderForm.delivery_requirements = ''
  orderForm.transport_conditions = ''
  orderForm.approver = ''
  orderForm.reviewer = ''
  orderForm.status = '待下单'
  orderForm.emp_id = 1
  
  orderDialogVisible.value = true
}

// 提交采购单表单
const submitOrderForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 添加到状态管理
      purchaseStore.addPurchaseOrder({
        ...orderForm,
        order_date: orderForm.order_date,
        created_at: orderForm.created_at
      })
      
      // 更新表格数据
      purchaseOrdersData.value = purchaseStore.purchaseOrders
      
      // 关闭对话框
      orderDialogVisible.value = false
      
      // 提示成功
      ElMessage({
        type: 'success',
        message: '采购单创建成功'
      })
    }
  })
}

// 查看采购明细
const viewOrderItems = (row) => {
  currentOrder.value = row
  // 加载明细数据
  orderItemsData.value = purchaseStore.orderItems.filter(
    item => item.order_id === row.id
  )
}

// 打开新增明细对话框
const openAddItemDialog = () => {
  if (!currentOrder.value) {
    ElMessage({
      type: 'warning',
      message: '请先选择采购单'
    })
    return
  }
  
  // 重置表单
  itemForm.id = purchaseStore.orderItems.length + 1
  itemForm.order_id = currentOrder.value.id
  itemForm.material_id = ''
  itemForm.quantity = 0
  itemForm.unit_price = 0
  itemForm.amount = 0
  itemForm.remarks = ''
  
  itemDialogVisible.value = true
}

// 计算金额
const calculateAmount = () => {
  itemForm.amount = itemForm.quantity * itemForm.unit_price
}

// 提交明细表单
const submitItemForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 计算金额
      calculateAmount()
      
      // 添加到状态管理
      purchaseStore.addOrderItem({
        ...itemForm
      })
      
      // 更新表格数据
      orderItemsData.value = purchaseStore.orderItems.filter(
        item => item.order_id === currentOrder.value.id
      )
      
      // 更新采购单总金额
      const totalAmount = orderItemsData.value.reduce((sum, item) => sum + item.amount, 0)
      const orderIndex = purchaseOrdersData.value.findIndex(order => order.id === currentOrder.value.id)
      if (orderIndex !== -1) {
        purchaseOrdersData.value[orderIndex].total_amount = totalAmount
        currentOrder.value.total_amount = totalAmount
      }
      
      // 关闭对话框
      itemDialogVisible.value = false
      
      // 提示成功
      ElMessage({
        type: 'success',
        message: '采购明细添加成功'
      })
    }
  })
}

// 删除采购单
const deleteOrder = (row) => {
  ElMessageBox.confirm(
    '确定要删除该采购单吗？相关的采购明细也将被删除',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟删除操作
    const index = purchaseOrdersData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      purchaseOrdersData.value.splice(index, 1)
      
      // 如果当前选中的是被删除的采购单，清空明细
      if (currentOrder.value && currentOrder.value.id === row.id) {
        currentOrder.value = null
        orderItemsData.value = []
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

// 删除采购明细
const deleteItem = (row) => {
  ElMessageBox.confirm(
    '确定要删除该采购明细吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟删除操作
    const index = orderItemsData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      orderItemsData.value.splice(index, 1)
      
      // 更新采购单总金额
      const totalAmount = orderItemsData.value.reduce((sum, item) => sum + item.amount, 0)
      const orderIndex = purchaseOrdersData.value.findIndex(order => order.id === currentOrder.value.id)
      if (orderIndex !== -1) {
        purchaseOrdersData.value[orderIndex].total_amount = totalAmount
        currentOrder.value.total_amount = totalAmount
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

// 获取供应商名称
const getSupplierName = (supplierId) => {
  const supplier = supplierOptions.value.find(s => s.id === supplierId)
  return supplier ? supplier.company_name : ''
}

// 获取物料名称
const getMaterialName = (materialId) => {
  const material = materialOptions.value.find(m => m.material_id === materialId)
  return material ? material.material_name : ''
}

// 更改采购单状态
const changeOrderStatus = (row, status) => {
  row.status = status
  ElMessage({
    type: 'success',
    message: `采购单状态已更新为：${status}`
  })
}
</script>

<template>
  <div class="purchase-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>采购管理</span>
          <el-button type="primary" @click="openAddOrderDialog">
            <el-icon><Plus /></el-icon> 新增采购单
          </el-button>
        </div>
      </template>
      
      <!-- 采购单表格 -->
      <el-table
        :data="purchaseOrdersData"
        style="width: 100%"
        v-loading="tableLoading"
        @row-click="viewOrderItems"
        row-key="id"
        border
      >
        <el-table-column prop="id" label="采购单号" width="150" />
        <el-table-column label="供应商" width="180">
          <template #default="{ row }">
            {{ getSupplierName(row.supplier_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="order_date" label="订单日期" width="120" />
        <el-table-column prop="total_amount" label="总金额" width="120">
          <template #default="{ row }">
            {{ row.total_amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="payment_terms" label="付款方式" width="120" />
        <el-table-column prop="delivery_period" label="交货周期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '已下单' ? 'success' : (row.status === '已结算' ? 'info' : 'warning')">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" @click.stop="viewOrderItems(row)">
              查看明细
            </el-button>
            <el-button 
              size="small" 
              type="success" 
              @click.stop="changeOrderStatus(row, '已下单')"
              v-if="row.status === '待下单'"
            >
              下单
            </el-button>
            <el-button 
              size="small" 
              type="info" 
              @click.stop="changeOrderStatus(row, '已结算')"
              v-if="row.status === '已下单'"
            >
              结算
            </el-button>
            <el-button size="small" type="danger" @click.stop="deleteOrder(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 采购明细 -->
    <el-card v-if="currentOrder" class="mt-20">
      <template #header>
        <div class="card-header">
          <span>采购明细 - {{ currentOrder.id }}</span>
          <el-button type="primary" @click="openAddItemDialog">
            <el-icon><Plus /></el-icon> 新增明细
          </el-button>
        </div>
      </template>
      
      <!-- 明细表格 -->
      <el-table
        :data="orderItemsData"
        style="width: 100%"
        v-loading="tableLoading"
        row-key="id"
        border
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="物料名称" width="180">
          <template #default="{ row }">
            {{ getMaterialName(row.material_id) }}
          </template>
        </el-table-column>
        <el-table-column prop="material_id" label="物料编码" width="150" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="unit_price" label="单价" width="100">
          <template #default="{ row }">
            {{ row.unit_price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" width="120">
          <template #default="{ row }">
            {{ row.amount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="remarks" label="备注" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="deleteItem(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 新增采购单对话框 -->
    <el-dialog
      v-model="orderDialogVisible"
      title="新增采购单"
      width="50%"
    >
      <el-form
        ref="orderFormRef"
        :model="orderForm"
        :rules="orderRules"
        label-width="120px"
      >
        <el-form-item label="采购单号" prop="id">
          <el-input v-model="orderForm.id" disabled />
        </el-form-item>
        <el-form-item label="供应商" prop="supplier_id">
          <el-select v-model="orderForm.supplier_id" placeholder="请选择供应商" style="width: 100%">
            <el-option
              v-for="item in supplierOptions"
              :key="item.id"
              :label="item.company_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单日期" prop="order_date">
          <el-date-picker
            v-model="orderForm.order_date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="付款方式" prop="payment_terms">
          <el-select v-model="orderForm.payment_terms" placeholder="请选择付款方式" style="width: 100%">
            <el-option label="13%增值税" value="13%增值税" />
            <el-option label="3%增值税" value="3%增值税" />
            <el-option label="不含税" value="不含税" />
            <el-option label="款到发货" value="款到发货" />
            <el-option label="货到付款" value="货到付款" />
            <el-option label="当月结" value="当月结" />
            <el-option label="月结30天" value="月结30天" />
            <el-option label="月结60天" value="月结60天" />
            <el-option label="月结90天" value="月结90天" />
          </el-select>
        </el-form-item>
        <el-form-item label="交货周期" prop="delivery_period">
          <el-input v-model="orderForm.delivery_period" placeholder="例如：15天" />
        </el-form-item>
        <el-form-item label="质量要求" prop="quality_requirements">
          <el-input v-model="orderForm.quality_requirements" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item label="交货要求" prop="delivery_requirements">
          <el-input v-model="orderForm.delivery_requirements" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item label="运输条件" prop="transport_conditions">
          <el-input v-model="orderForm.transport_conditions" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="orderForm.status" placeholder="请选择状态" style="width: 100%">
            <el-option label="待下单" value="待下单" />
            <el-option label="已下单" value="已下单" />
            <el-option label="已结算" value="已结算" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="orderDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitOrderForm(orderFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新增明细对话框 -->
    <el-dialog
      v-model="itemDialogVisible"
      title="新增采购明细"
      width="50%"
    >
      <el-form
        ref="itemFormRef"
        :model="itemForm"
        :rules="itemRules"
        label-width="120px"
      >
        <el-form-item label="采购单号" prop="order_id">
          <el-input v-model="itemForm.order_id" disabled />
        </el-form-item>
        <el-form-item label="物料" prop="material_id">
          <el-select v-model="itemForm.material_id" placeholder="请选择物料" style="width: 100%">
            <el-option
              v-for="item in materialOptions"
              :key="item.material_id"
              :label="`${item.material_name} (${item.material_code})`"
              :value="item.material_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="itemForm.quantity" :min="1" style="width: 100%" @change="calculateAmount" />
        </el-form-item>
        <el-form-item label="单价" prop="unit_price">
          <el-input-number v-model="itemForm.unit_price" :min="0" :precision="2" style="width: 100%" @change="calculateAmount" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input-number v-model="itemForm.amount" :min="0" :precision="2" style="width: 100%" disabled />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="itemForm.remarks" type="textarea" rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="itemDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitItemForm(itemFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.purchase-container {
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
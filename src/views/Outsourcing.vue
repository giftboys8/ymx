<template>
  <div class="outsourcing-container">
    <h1 class="page-title">委外加工管理</h1>
    
    <div class="control-panel">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索订单号/加工商"
            prefix-icon="el-icon-search"
            clearable
            @clear="handleSearch"
            @input="handleSearch"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="statusFilter" placeholder="订单状态" @change="handleSearch">
            <el-option label="全部" value=""></el-option>
            <el-option label="待发出" value="pending"></el-option>
            <el-option label="加工中" value="processing"></el-option>
            <el-option label="已完成" value="completed"></el-option>
            <el-option label="已验收" value="accepted"></el-option>
            <el-option label="返工中" value="rework"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleSearch"
          ></el-date-picker>
        </el-col>
        <el-col :span="6" class="text-right">
          <el-button type="primary" @click="handleAddOrder">新增委外订单</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 委外订单表格 -->
    <el-table
      :data="filteredOrders"
      border
      style="width: 100%; margin-top: 20px"
      v-loading="loading"
    >
      <el-table-column prop="orderId" label="订单编号" width="150"></el-table-column>
      <el-table-column prop="processorName" label="加工商" width="180"></el-table-column>
      <el-table-column prop="materialCode" label="物料编码" width="180"></el-table-column>
      <el-table-column prop="materialName" label="物料名称" width="180"></el-table-column>
      <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
      <el-table-column prop="orderDate" label="订单日期" width="120"></el-table-column>
      <el-table-column prop="expectedReturnDate" label="预计返回日期" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusText(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="handleView(scope.row)">查看</el-button>
          <el-button 
            size="small" 
            type="primary" 
            @click="handleAcceptance(scope.row)"
            :disabled="scope.row.status !== 'completed'"
          >验收</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="handleRework(scope.row)"
            :disabled="scope.row.status !== 'accepted'"
          >返工</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalOrders"
      ></el-pagination>
    </div>

    <!-- 新增/编辑委外订单对话框 -->
    <el-dialog
      :title="dialogType === 'add' ? '新增委外订单' : '编辑委外订单'"
      v-model="dialogVisible"
      width="50%"
    >
      <el-form :model="orderForm" :rules="orderRules" ref="orderFormRef" label-width="120px">
        <el-form-item label="加工商" prop="processorId">
          <el-select v-model="orderForm.processorId" placeholder="请选择加工商">
            <el-option
              v-for="processor in processors"
              :key="processor.id"
              :label="processor.name"
              :value="processor.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编码" prop="materialCode">
          <el-select v-model="orderForm.materialCode" placeholder="请选择物料" @change="handleMaterialChange">
            <el-option
              v-for="material in materials"
              :key="material.code"
              :label="material.code"
              :value="material.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称">
          <el-input v-model="orderForm.materialName" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="orderForm.quantity" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="订单日期" prop="orderDate">
          <el-date-picker
            v-model="orderForm.orderDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="预计返回日期" prop="expectedReturnDate">
          <el-date-picker
            v-model="orderForm.expectedReturnDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="加工要求" prop="requirements">
          <el-input
            type="textarea"
            v-model="orderForm.requirements"
            rows="3"
            placeholder="请输入加工要求"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitOrderForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 验收对话框 -->
    <el-dialog
      title="委外加工验收"
      v-model="acceptanceDialogVisible"
      width="50%"
    >
      <el-form :model="acceptanceForm" :rules="acceptanceRules" ref="acceptanceFormRef" label-width="120px">
        <el-form-item label="订单编号">
          <el-input v-model="acceptanceForm.orderId" disabled></el-input>
        </el-form-item>
        <el-form-item label="加工商">
          <el-input v-model="acceptanceForm.processorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="acceptanceForm.materialCode" disabled></el-input>
        </el-form-item>
        <el-form-item label="实际返回数量" prop="actualQuantity">
          <el-input-number v-model="acceptanceForm.actualQuantity" :min="1"></el-input-number>
        </el-form-item>
        <el-form-item label="验收结果" prop="result">
          <el-radio-group v-model="acceptanceForm.result">
            <el-radio label="pass">通过</el-radio>
            <el-radio label="fail">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="验收备注" prop="remarks">
          <el-input
            type="textarea"
            v-model="acceptanceForm.remarks"
            rows="3"
            placeholder="请输入验收备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="acceptanceDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAcceptanceForm">确认验收</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'

export default {
  name: 'Outsourcing',
  setup() {
    // 页面状态
    const loading = ref(false)
    const searchKeyword = ref('')
    const statusFilter = ref('')
    const dateRange = ref([])
    const currentPage = ref(1)
    const pageSize = ref(10)
    const dialogVisible = ref(false)
    const dialogType = ref('add')
    const acceptanceDialogVisible = ref(false)
    
    // 表单引用
    const orderFormRef = ref(null)
    const acceptanceFormRef = ref(null)

    // 订单表单
    const orderForm = reactive({
      id: '',
      processorId: '',
      materialCode: '',
      materialName: '',
      quantity: 1,
      orderDate: new Date(),
      expectedReturnDate: '',
      requirements: ''
    })

    // 验收表单
    const acceptanceForm = reactive({
      orderId: '',
      processorName: '',
      materialCode: '',
      actualQuantity: 0,
      result: 'pass',
      remarks: ''
    })

    // 表单验证规则
    const orderRules = {
      processorId: [{ required: true, message: '请选择加工商', trigger: 'change' }],
      materialCode: [{ required: true, message: '请选择物料', trigger: 'change' }],
      quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
      orderDate: [{ required: true, message: '请选择订单日期', trigger: 'change' }],
      expectedReturnDate: [{ required: true, message: '请选择预计返回日期', trigger: 'change' }]
    }

    const acceptanceRules = {
      actualQuantity: [{ required: true, message: '请输入实际返回数量', trigger: 'blur' }],
      result: [{ required: true, message: '请选择验收结果', trigger: 'change' }]
    }

    // 模拟数据
    const orders = ref([
      {
        id: 'OO-2023-001',
        orderId: 'OO-2023-001',
        processorId: 'P001',
        processorName: '富士康精密加工厂',
        materialCode: '1B3894W00-600-G',
        materialName: '底框',
        quantity: 5000,
        orderDate: '2023-05-10',
        expectedReturnDate: '2023-05-20',
        status: 'completed',
        requirements: '按照图纸要求加工，确保尺寸精度'
      },
      {
        id: 'OO-2023-002',
        orderId: 'OO-2023-002',
        processorId: 'P002',
        processorName: '裕展精密科技',
        materialCode: '1B48QBT02-600-G',
        materialName: '253摄像头弹片',
        quantity: 10000,
        orderDate: '2023-05-12',
        expectedReturnDate: '2023-05-25',
        status: 'processing',
        requirements: '确保表面光洁度，无毛刺'
      },
      {
        id: 'OO-2023-003',
        orderId: 'OO-2023-003',
        processorId: 'P003',
        processorName: '鸿海精密工业',
        materialCode: '1B3894W00-600-G',
        materialName: '底框',
        quantity: 3000,
        orderDate: '2023-05-15',
        expectedReturnDate: '2023-05-30',
        status: 'pending',
        requirements: '按照图纸要求加工，确保尺寸精度'
      },
      {
        id: 'OO-2023-004',
        orderId: 'OO-2023-004',
        processorId: 'P001',
        processorName: '富士康精密加工厂',
        materialCode: '1B48QBT02-600-G',
        materialName: '253摄像头弹片',
        quantity: 8000,
        orderDate: '2023-05-18',
        expectedReturnDate: '2023-06-02',
        status: 'accepted',
        requirements: '确保表面光洁度，无毛刺'
      },
      {
        id: 'OO-2023-005',
        orderId: 'OO-2023-005',
        processorId: 'P002',
        processorName: '裕展精密科技',
        materialCode: '1B3894W00-600-G',
        materialName: '底框',
        quantity: 6000,
        orderDate: '2023-05-20',
        expectedReturnDate: '2023-06-05',
        status: 'rework',
        requirements: '按照图纸要求加工，确保尺寸精度'
      }
    ])

    // 加工商列表
    const processors = [
      { id: 'P001', name: '富士康精密加工厂' },
      { id: 'P002', name: '裕展精密科技' },
      { id: 'P003', name: '鸿海精密工业' },
      { id: 'P004', name: '立讯精密工业' },
      { id: 'P005', name: '和硕联合科技' }
    ]

    // 物料列表
    const materials = [
      { code: '1B3894W00-600-G', name: '底框', type: 'DM6' },
      { code: '1B48QBT02-600-G', name: '253摄像头弹片', type: 'DM6' },
      { code: '1C38Q4W00-600-G', name: '三角挂钩', type: 'DM6' }
    ]

    // 计算总订单数
    const totalOrders = computed(() => filteredOrders.value.length)

    // 过滤后的订单列表
    const filteredOrders = computed(() => {
      let result = orders.value

      // 关键字搜索
      if (searchKeyword.value) {
        const keyword = searchKeyword.value.toLowerCase()
        result = result.filter(order => 
          order.orderId.toLowerCase().includes(keyword) || 
          order.processorName.toLowerCase().includes(keyword)
        )
      }

      // 状态过滤
      if (statusFilter.value) {
        result = result.filter(order => order.status === statusFilter.value)
      }

      // 日期范围过滤
      if (dateRange.value && dateRange.value.length === 2) {
        const startDate = new Date(dateRange.value[0])
        const endDate = new Date(dateRange.value[1])
        result = result.filter(order => {
          const orderDate = new Date(order.orderDate)
          return orderDate >= startDate && orderDate <= endDate
        })
      }

      return result
    })

    // 获取状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'pending': '待发出',
        'processing': '加工中',
        'completed': '已完成',
        'accepted': '已验收',
        'rework': '返工中'
      }
      return statusMap[status] || status
    }

    // 获取状态类型（用于标签颜色）
    const getStatusType = (status) => {
      const typeMap = {
        'pending': 'info',
        'processing': 'warning',
        'completed': 'success',
        'accepted': 'success',
        'rework': 'danger'
      }
      return typeMap[status] || ''
    }

    // 处理搜索
    const handleSearch = () => {
      currentPage.value = 1
    }

    // 处理页码变化
    const handleCurrentChange = (val) => {
      currentPage.value = val
    }

    // 处理每页显示数量变化
    const handleSizeChange = (val) => {
      pageSize.value = val
      currentPage.value = 1
    }

    // 处理添加订单
    const handleAddOrder = () => {
      dialogType.value = 'add'
      resetOrderForm()
      dialogVisible.value = true
    }

    // 处理查看订单
    const handleView = (row) => {
      dialogType.value = 'edit'
      Object.assign(orderForm, row)
      dialogVisible.value = true
    }

    // 处理验收
    const handleAcceptance = (row) => {
      acceptanceForm.orderId = row.orderId
      acceptanceForm.processorName = row.processorName
      acceptanceForm.materialCode = row.materialCode
      acceptanceForm.actualQuantity = row.quantity
      acceptanceDialogVisible.value = true
    }

    // 处理返工
    const handleRework = (row) => {
      // 模拟返工操作
      const index = orders.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        orders.value[index].status = 'rework'
      }
    }

    // 处理物料变更
    const handleMaterialChange = () => {
      const material = materials.find(item => item.code === orderForm.materialCode)
      if (material) {
        orderForm.materialName = material.name
      }
    }

    // 重置订单表单
    const resetOrderForm = () => {
      orderForm.id = ''
      orderForm.processorId = ''
      orderForm.materialCode = ''
      orderForm.materialName = ''
      orderForm.quantity = 1
      orderForm.orderDate = new Date()
      orderForm.expectedReturnDate = ''
      orderForm.requirements = ''
    }

    // 提交订单表单
    const submitOrderForm = () => {
      orderFormRef.value.validate((valid) => {
        if (valid) {
          if (dialogType.value === 'add') {
            // 模拟添加订单
            const newOrder = {
              id: `OO-2023-${orders.value.length + 1}`.padStart(10, '0'),
              orderId: `OO-2023-${orders.value.length + 1}`.padStart(10, '0'),
              processorId: orderForm.processorId,
              processorName: processors.find(p => p.id === orderForm.processorId)?.name,
              materialCode: orderForm.materialCode,
              materialName: orderForm.materialName,
              quantity: orderForm.quantity,
              orderDate: orderForm.orderDate.toISOString().split('T')[0],
              expectedReturnDate: orderForm.expectedReturnDate.toISOString().split('T')[0],
              status: 'pending',
              requirements: orderForm.requirements
            }
            orders.value.push(newOrder)
          } else {
            // 模拟编辑订单
            const index = orders.value.findIndex(item => item.id === orderForm.id)
            if (index !== -1) {
              orders.value[index] = {
                ...orders.value[index],
                processorId: orderForm.processorId,
                processorName: processors.find(p => p.id === orderForm.processorId)?.name,
                materialCode: orderForm.materialCode,
                materialName: orderForm.materialName,
                quantity: orderForm.quantity,
                orderDate: typeof orderForm.orderDate === 'string' ? orderForm.orderDate : orderForm.orderDate.toISOString().split('T')[0],
                expectedReturnDate: typeof orderForm.expectedReturnDate === 'string' ? orderForm.expectedReturnDate : orderForm.expectedReturnDate.toISOString().split('T')[0],
                requirements: orderForm.requirements
              }
            }
          }
          dialogVisible.value = false
        }
      })
    }

    // 提交验收表单
    const submitAcceptanceForm = () => {
      acceptanceFormRef.value.validate((valid) => {
        if (valid) {
          // 模拟验收操作
          const index = orders.value.findIndex(item => item.orderId === acceptanceForm.orderId)
          if (index !== -1) {
            orders.value[index].status = acceptanceForm.result === 'pass' ? 'accepted' : 'rework'
          }
          acceptanceDialogVisible.value = false
        }
      })
    }

    // 生命周期钩子
    onMounted(() => {
      // 模拟加载数据
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 500)
    })

    return {
      loading,
      searchKeyword,
      statusFilter,
      dateRange,
      currentPage,
      pageSize,
      dialogVisible,
      dialogType,
      acceptanceDialogVisible,
      orderFormRef,
      acceptanceFormRef,
      orderForm,
      acceptanceForm,
      orderRules,
      acceptanceRules,
      orders,
      processors,
      materials,
      filteredOrders,
      totalOrders,
      getStatusText,
      getStatusType,
      handleSearch,
      handleCurrentChange,
      handleSizeChange,
      handleAddOrder,
      handleView,
      handleAcceptance,
      handleRework,
      handleMaterialChange,
      submitOrderForm,
      submitAcceptanceForm
    }
  }
}
</script>

<style scoped>
.outsourcing-container {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  font-size: 24px;
  color: #303133;
}

.control-panel {
  margin-bottom: 20px;
  background-color: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
}

.text-right {
  text-align: right;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
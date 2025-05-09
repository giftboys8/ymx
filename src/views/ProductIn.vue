<template>
  <div class="product-in-container">
    <div class="page-header">
      <h2>成品入库管理</h2>
      <el-button type="primary" @click="openDialog('add')">新增入库</el-button>
    </div>

    <!-- 入库记录表格 -->
    <el-table :data="productInList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="入库单号" width="120" />
      <el-table-column prop="productCode" label="产品编码" width="120" />
      <el-table-column prop="productName" label="产品名称" width="150" />
      <el-table-column prop="quantity" label="入库数量" width="100" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="workOrderNo" label="工单编号" width="120" />
      <el-table-column prop="batchNo" label="批次号" width="120" />
      <el-table-column prop="oqcStatus" label="OQC状态">
        <template #default="{ row }">
          <el-tag :type="row.oqcStatus === 'passed' ? 'success' : row.oqcStatus === 'failed' ? 'danger' : 'warning'">
            {{ row.oqcStatus === 'passed' ? '通过' : row.oqcStatus === 'failed' ? '不通过' : '待检验' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="storageLocation" label="库位" width="100" />
      <el-table-column prop="createTime" label="入库时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button link type="primary" @click="openOqcDialog(row)">OQC关联</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 入库表单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增入库记录' : '编辑入库记录'"
      width="50%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="产品编码" prop="productCode">
          <el-input v-model="form.productCode" />
        </el-form-item>
        <el-form-item label="产品名称" prop="productName">
          <el-input v-model="form.productName" />
        </el-form-item>
        <el-form-item label="入库数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit">
            <el-option label="个" value="个" />
            <el-option label="件" value="件" />
            <el-option label="套" value="套" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单编号" prop="workOrderNo">
          <el-input v-model="form.workOrderNo" />
        </el-form-item>
        <el-form-item label="批次号" prop="batchNo">
          <el-input v-model="form.batchNo" />
        </el-form-item>
        <el-form-item label="库位" prop="storageLocation">
          <el-input v-model="form.storageLocation" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- OQC关联对话框 -->
    <el-dialog v-model="oqcDialogVisible" title="OQC检验关联" width="40%">
      <el-form :model="oqcForm" label-width="100px">
        <el-form-item label="检验结果" prop="oqcStatus">
          <el-select v-model="oqcForm.oqcStatus">
            <el-option label="通过" value="passed" />
            <el-option label="不通过" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="检验备注" prop="oqcRemark">
          <el-input type="textarea" v-model="oqcForm.oqcRemark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="oqcDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleOqcSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const loading = ref(false)
const productInList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add')
const oqcDialogVisible = ref(false)

// 表单数据
const formRef = ref(null)
const form = reactive({
  productCode: '',
  productName: '',
  quantity: 1,
  unit: '个',
  workOrderNo: '',
  batchNo: '',
  storageLocation: ''
})

// OQC表单数据
const oqcForm = reactive({
  id: '',
  oqcStatus: 'passed',
  oqcRemark: ''
})

// 表单验证规则
const rules = {
  productCode: [{ required: true, message: '请输入产品编码', trigger: 'blur' }],
  productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入入库数量', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  workOrderNo: [{ required: true, message: '请输入工单编号', trigger: 'blur' }],
  batchNo: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
  storageLocation: [{ required: true, message: '请输入库位', trigger: 'blur' }]
}

// 模拟数据加载
const loadData = () => {
  loading.value = true
  // 这里应该调用后端API获取数据
  setTimeout(() => {
    productInList.value = [
      {
        id: 'PI20230001',
        productCode: 'P001',
        productName: '智能控制器',
        quantity: 50,
        unit: '个',
        workOrderNo: 'WO20230501',
        batchNo: 'B20230501',
        oqcStatus: 'passed',
        storageLocation: 'B-01-01',
        createTime: '2023-05-01 10:00:00'
      },
      // 更多测试数据...
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
      productCode: '',
      productName: '',
      quantity: 1,
      unit: '个',
      workOrderNo: '',
      batchNo: '',
      storageLocation: ''
    })
  }
}

// 打开OQC关联对话框
const openOqcDialog = (row) => {
  oqcForm.id = row.id
  oqcForm.oqcStatus = row.oqcStatus
  oqcForm.oqcRemark = ''
  oqcDialogVisible.value = true
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

// 提交OQC关联
const handleOqcSubmit = () => {
  // 这里应该调用后端API保存OQC关联数据
  ElMessage.success('OQC关联成功')
  oqcDialogVisible.value = false
  loadData()
}

// 删除记录
const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除该入库记录吗？', '提示', {
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
.product-in-container {
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
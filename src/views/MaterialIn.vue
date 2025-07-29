<template>
  <div class="material-in-container">
    <div class="page-header">
      <h2>原料入库管理</h2>
      <el-button type="primary" @click="openDialog('add')">新增入库</el-button>
    </div>

    <!-- 入库记录表格 -->
    <el-table :data="materialInList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="入库单号" width="120" />
      <el-table-column prop="materialCode" label="物料编码" width="120" />
      <el-table-column prop="materialName" label="物料名称" width="150" />
      <el-table-column prop="quantity" label="入库数量" width="100" />
      <el-table-column prop="unit" label="单位" width="80" />
      <el-table-column prop="supplier" label="供应商" width="150" />
      <el-table-column prop="batchNo" label="批次号" width="120" />
      <el-table-column prop="iqcStatus" label="IQC状态">
        <template #default="{ row }">
          <el-tag :type="row.iqcStatus === 'passed' ? 'success' : row.iqcStatus === 'failed' ? 'danger' : 'warning'">
            {{ row.iqcStatus === 'passed' ? '通过' : row.iqcStatus === 'failed' ? '不通过' : '待检验' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="storageLocation" label="库位" width="100" />
      <el-table-column prop="createTime" label="入库时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDialog('edit', row)">编辑</el-button>
          <el-button link type="primary" @click="openIqcDialog(row)">IQC关联</el-button>
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
        <el-form-item label="物料编码" prop="materialCode">
          <el-input v-model="form.materialCode" />
        </el-form-item>
        <el-form-item label="物料名称" prop="materialName">
          <el-input v-model="form.materialName" />
        </el-form-item>
        <el-form-item label="入库数量" prop="quantity">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-select v-model="form.unit">
            <el-option label="个" value="个" />
            <el-option label="件" value="件" />
            <el-option label="kg" value="kg" />
            <el-option label="m" value="m" />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-input v-model="form.supplier" />
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

    <!-- IQC关联对话框 -->
    <el-dialog v-model="iqcDialogVisible" title="IQC检验关联" width="40%">
      <el-form :model="iqcForm" label-width="100px">
        <el-form-item label="检验结果" prop="iqcStatus">
          <el-select v-model="iqcForm.iqcStatus">
            <el-option label="通过" value="passed" />
            <el-option label="不通过" value="failed" />
          </el-select>
        </el-form-item>
        <el-form-item label="检验备注" prop="iqcRemark">
          <el-input type="textarea" v-model="iqcForm.iqcRemark" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="iqcDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleIqcSubmit">确定</el-button>
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
const materialInList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框控制
const dialogVisible = ref(false)
const dialogType = ref('add')
const iqcDialogVisible = ref(false)

// 表单数据
const formRef = ref(null)
const form = reactive({
  materialCode: '',
  materialName: '',
  quantity: 1,
  unit: '个',
  supplier: '',
  batchNo: '',
  storageLocation: ''
})

// IQC表单数据
const iqcForm = reactive({
  id: '',
  iqcStatus: 'passed',
  iqcRemark: ''
})

// 表单验证规则
const rules = {
  materialCode: [{ required: true, message: '请输入物料编码', trigger: 'blur' }],
  materialName: [{ required: true, message: '请输入物料名称', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入入库数量', trigger: 'blur' }],
  unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
  supplier: [{ required: true, message: '请输入供应商', trigger: 'blur' }],
  batchNo: [{ required: true, message: '请输入批次号', trigger: 'blur' }],
  storageLocation: [{ required: true, message: '请输入库位', trigger: 'blur' }]
}

// 模拟数据加载
const loadData = () => {
  loading.value = true
  // 这里应该调用后端API获取数据
  setTimeout(() => {
    materialInList.value = [
      {
        id: 'MI20230001',
        materialCode: 'LFP001',
        materialName: '磷酸铁锂正极材料',
        quantity: 500,
        unit: 'kg',
        supplier: '当升科技正极材料',
        batchNo: 'LFP20230601',
        iqcStatus: 'passed',
        storageLocation: '正极材料区-A01',
        createTime: '2023-06-01 09:00:00'
      },
      {
        id: 'MI20230002',
        materialCode: 'GRA001',
        materialName: '人造石墨负极材料',
        quantity: 300,
        unit: 'kg',
        supplier: '杉杉股份材料',
        batchNo: 'GRA20230602',
        iqcStatus: 'passed',
        storageLocation: '负极材料区-B01',
        createTime: '2023-06-02 10:30:00'
      },
      {
        id: 'MI20230003',
        materialCode: 'SEP001',
        materialName: 'PE隔膜材料',
        quantity: 10000,
        unit: 'm²',
        supplier: '恩捷股份隔膜',
        batchNo: 'SEP20230603',
        iqcStatus: 'pending',
        storageLocation: '隔膜材料区-C01',
        createTime: '2023-06-03 14:15:00'
      },
      {
        id: 'MI20230004',
        materialCode: 'ELE001',
        materialName: 'LiPF6电解液',
        quantity: 200,
        unit: 'L',
        supplier: '天赐材料电解液',
        batchNo: 'ELE20230604',
        iqcStatus: 'passed',
        storageLocation: '电解液存储区-D01',
        createTime: '2023-06-04 11:20:00'
      },
      {
        id: 'MI20230005',
        materialCode: 'ALU001',
        materialName: '铝箔集流体',
        quantity: 5000,
        unit: 'm²',
        supplier: '华北铝业集团',
        batchNo: 'ALU20230605',
        iqcStatus: 'passed',
        storageLocation: '集流体区-E01',
        createTime: '2023-06-05 16:45:00'
      },
      {
        id: 'MI20230006',
        materialCode: 'COP001',
        materialName: '铜箔集流体',
        quantity: 3000,
        unit: 'm²',
        supplier: '诺德股份铜箔',
        batchNo: 'COP20230606',
        iqcStatus: 'failed',
        storageLocation: '集流体区-E02',
        createTime: '2023-06-06 08:30:00'
      },
      {
        id: 'MI20230007',
        materialCode: 'TAB001',
        materialName: '极耳材料',
        quantity: 1000,
        unit: 'pcs',
        supplier: '科达利精密工业',
        batchNo: 'TAB20230607',
        iqcStatus: 'passed',
        storageLocation: '极耳材料区-F01',
        createTime: '2023-06-07 13:10:00'
      },
      {
        id: 'MI20230008',
        materialCode: 'POL001',
        materialName: '聚合物外壳材料',
        quantity: 800,
        unit: 'pcs',
        supplier: '璞泰来新材料',
        batchNo: 'POL20230608',
        iqcStatus: 'passed',
        storageLocation: '外壳材料区-G01',
        createTime: '2023-06-08 15:25:00'
      },
      {
        id: 'MI20230009',
        materialCode: 'BMS001',
        materialName: 'BMS控制板',
        quantity: 200,
        unit: 'pcs',
        supplier: '欣旺达电子',
        batchNo: 'BMS20230609',
        iqcStatus: 'pending',
        storageLocation: 'BMS存储区-H01',
        createTime: '2023-06-09 12:40:00'
      },
      {
        id: 'MI20230010',
        materialCode: 'CON001',
        materialName: '连接器组件',
        quantity: 500,
        unit: 'pcs',
        supplier: '立讯精密工业',
        batchNo: 'CON20230610',
        iqcStatus: 'passed',
        storageLocation: '连接器区-I01',
        createTime: '2023-06-10 17:55:00'
      },
      {
        id: 'MI20230011',
        materialCode: 'THM001',
        materialName: '导热硅胶片',
        quantity: 100,
        unit: 'kg',
        supplier: '中科院安泰科技',
        batchNo: 'THM20230611',
        iqcStatus: 'passed',
        storageLocation: '辅料区-J01',
        createTime: '2023-06-11 09:15:00'
      },
      {
        id: 'MI20230012',
        materialCode: 'ADH001',
        materialName: '结构胶',
        quantity: 50,
        unit: 'kg',
        supplier: '回天新材料',
        batchNo: 'ADH20230612',
        iqcStatus: 'passed',
        storageLocation: '辅料区-J02',
        createTime: '2023-06-12 14:30:00'
      }
    ]
    total.value = materialInList.value.length
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
      quantity: 1,
      unit: '个',
      supplier: '',
      batchNo: '',
      storageLocation: ''
    })
  }
}

// 打开IQC关联对话框
const openIqcDialog = (row) => {
  iqcForm.id = row.id
  iqcForm.iqcStatus = row.iqcStatus
  iqcForm.iqcRemark = ''
  iqcDialogVisible.value = true
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

// 提交IQC关联
const handleIqcSubmit = () => {
  // 这里应该调用后端API保存IQC关联数据
  ElMessage.success('IQC关联成功')
  iqcDialogVisible.value = false
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
.material-in-container {
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
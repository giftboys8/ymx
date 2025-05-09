<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQualityStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取质检管理状态
const qualityStore = useQualityStore()

// 表格数据
const inspectionRecordsData = ref([])
const defectsData = ref([])
const productOptions = ref([])

// 加载数据
onMounted(() => {
  inspectionRecordsData.value = qualityStore.inspectionRecords
  // 从质检标准中获取产品信息
  productOptions.value = qualityStore.inspectionStandards.map(item => ({
    product_code: item.product_code,
    product_name: `产品${item.product_code}`,
  }))
})

// 表格加载状态
const tableLoading = ref(false)

// 对话框可见性
const recordDialogVisible = ref(false)
const defectDialogVisible = ref(false)

// 当前选中的质检记录
const currentRecord = ref(null)

// 新质检记录表单
const recordForm = reactive({
  record_id: '',
  product_code: '',
  inspection_date: '',
  inspection_type: 'IQC', // IQC, IPQC, OQC
  inspector: '',
  batch_number: '',
  sample_size: 0,
  accepted_qty: 0,
  rejected_qty: 0,
  result: 'Pass',
  remarks: ''
})

// 新缺陷记录表单
const defectForm = reactive({
  defect_id: 0,
  record_id: '',
  defect_type: '',
  defect_description: '',
  defect_level: '轻微',
  quantity: 0,
  location: '',
  image_url: '',
  corrective_action: ''
})

// 表单规则
const recordRules = {
  product_code: [{ required: true, message: '请选择产品', trigger: 'change' }],
  inspection_date: [{ required: true, message: '请选择检验日期', trigger: 'change' }],
  inspection_type: [{ required: true, message: '请选择检验类型', trigger: 'change' }],
  inspector: [{ required: true, message: '请输入检验员', trigger: 'blur' }],
  sample_size: [{ required: true, message: '请输入抽样数量', trigger: 'blur' }]
}

const defectRules = {
  defect_type: [{ required: true, message: '请选择缺陷类型', trigger: 'change' }],
  defect_description: [{ required: true, message: '请输入缺陷描述', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}

// 打开新增质检记录对话框
const openAddRecordDialog = () => {
  // 生成新的质检记录编号
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  recordForm.record_id = `QI${year}${month}${day}${random}`
  recordForm.inspection_date = `${year}-${month}-${day}`
  
  // 重置其他字段
  recordForm.product_code = ''
  recordForm.inspection_type = 'IQC'
  recordForm.inspector = ''
  recordForm.batch_number = ''
  recordForm.sample_size = 0
  recordForm.accepted_qty = 0
  recordForm.rejected_qty = 0
  recordForm.result = 'Pass'
  recordForm.remarks = ''
  
  recordDialogVisible.value = true
}

// 提交质检记录表单
const submitRecordForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 添加到状态管理
      qualityStore.addInspectionRecord({
        ...recordForm,
        inspection_date: recordForm.inspection_date
      })
      
      // 更新表格数据
      inspectionRecordsData.value = qualityStore.inspectionRecords
      
      // 关闭对话框
      recordDialogVisible.value = false
      
      // 提示成功
      ElMessage({
        type: 'success',
        message: '质检记录创建成功'
      })
    }
  })
}

// 查看缺陷记录
const viewDefects = (row) => {
  currentRecord.value = row
  // 加载缺陷数据
  defectsData.value = qualityStore.defects.filter(
    item => item.record_id === row.record_id
  )
}

// 打开新增缺陷对话框
const openAddDefectDialog = () => {
  if (!currentRecord.value) {
    ElMessage({
      type: 'warning',
      message: '请先选择质检记录'
    })
    return
  }
  
  // 重置表单
  defectForm.defect_id = qualityStore.defects.length + 1
  defectForm.record_id = currentRecord.value.record_id
  defectForm.defect_type = ''
  defectForm.defect_description = ''
  defectForm.defect_level = '轻微'
  defectForm.quantity = 0
  defectForm.location = ''
  defectForm.image_url = ''
  defectForm.corrective_action = ''
  
  defectDialogVisible.value = true
}

// 提交缺陷表单
const submitDefectForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      // 添加到状态管理
      qualityStore.addDefect({
        ...defectForm
      })
      
      // 更新表格数据
      defectsData.value = qualityStore.defects.filter(
        item => item.record_id === currentRecord.value.record_id
      )
      
      // 更新质检记录的不良数量
      const totalDefects = defectsData.value.reduce((sum, item) => sum + item.quantity, 0)
      const recordIndex = inspectionRecordsData.value.findIndex(record => record.record_id === currentRecord.value.record_id)
      if (recordIndex !== -1) {
        inspectionRecordsData.value[recordIndex].rejected_qty = totalDefects
        currentRecord.value.rejected_qty = totalDefects
        
        // 更新结果状态
        if (totalDefects > 0) {
          inspectionRecordsData.value[recordIndex].result = 'Fail'
          currentRecord.value.result = 'Fail'
        }
      }
      
      // 关闭对话框
      defectDialogVisible.value = false
      
      // 提示成功
      ElMessage({
        type: 'success',
        message: '缺陷记录添加成功'
      })
    }
  })
}

// 删除质检记录
const deleteRecord = (row) => {
  ElMessageBox.confirm(
    '确定要删除该质检记录吗？相关的缺陷记录也将被删除',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟删除操作
    const index = inspectionRecordsData.value.findIndex(item => item.record_id === row.record_id)
    if (index !== -1) {
      inspectionRecordsData.value.splice(index, 1)
      
      // 如果当前选中的是被删除的质检记录，清空缺陷记录
      if (currentRecord.value && currentRecord.value.record_id === row.record_id) {
        currentRecord.value = null
        defectsData.value = []
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

// 删除缺陷记录
const deleteDefect = (row) => {
  ElMessageBox.confirm(
    '确定要删除该缺陷记录吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    // 模拟删除操作
    const index = defectsData.value.findIndex(item => item.defect_id === row.defect_id)
    if (index !== -1) {
      defectsData.value.splice(index, 1)
      
      // 更新质检记录的不良数量
      const totalDefects = defectsData.value.reduce((sum, item) => sum + item.quantity, 0)
      const recordIndex = inspectionRecordsData.value.findIndex(record => record.record_id === currentRecord.value.record_id)
      if (recordIndex !== -1) {
        inspectionRecordsData.value[recordIndex].rejected_qty = totalDefects
        currentRecord.value.rejected_qty = totalDefects
        
        // 更新结果状态
        if (totalDefects === 0) {
          inspectionRecordsData.value[recordIndex].result = 'Pass'
          currentRecord.value.result = 'Pass'
        }
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

// 获取产品名称
const getProductName = (productCode) => {
  const product = productOptions.value.find(p => p.product_code === productCode)
  return product ? product.product_name : ''
}

// 更改质检记录结果
const changeRecordResult = (row, result) => {
  row.result = result
  ElMessage({
    type: 'success',
    message: `质检记录结果已更新为：${result}`
  })
}
</script>

<template>
  <div class="quality-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>质检管理</span>
          <el-button type="primary" @click="openAddRecordDialog">
            <el-icon><Plus /></el-icon> 新增质检记录
          </el-button>
        </div>
      </template>
      
      <!-- 质检记录表格 -->
      <el-table
        :data="inspectionRecordsData"
        style="width: 100%"
        v-loading="tableLoading"
        @row-click="viewDefects"
        row-key="record_id"
        border
      >
        <el-table-column prop="record_id" label="质检单号" width="150" />
        <el-table-column label="产品名称" width="180">
          <template #default="{ row }">
            {{ getProductName(row.product_code) }}
          </template>
        </el-table-column>
        <el-table-column prop="product_code" label="产品编码" width="120" />
        <el-table-column prop="inspection_date" label="检验日期" width="120" />
        <el-table-column prop="inspection_type" label="检验类型" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="row.inspection_type === 'IQC' ? 'primary' : (row.inspection_type === 'IPQC' ? 'warning' : 'success')"
            >
              {{ row.inspection_type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sample_size" label="抽样数量" width="100" />
        <el-table-column prop="rejected_qty" label="不良数量" width="100" />
        <el-table-column prop="result" label="结果" width="100">
          <template #default="{ row }">
            <el-tag :type="row.result === 'Pass' ? 'success' : 'danger'">
              {{ row.result === 'Pass' ? '合格' : '不合格' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="inspector" label="检验员" width="100" />
        <el-table-column label="操作" width="250">
          <template #default="{ row }">
            <el-button size="small" @click.stop="viewDefects(row)">
              查看缺陷
            </el-button>
            <el-button 
              size="small" 
              type="success" 
              @click.stop="changeRecordResult(row, 'Pass')"
              v-if="row.result === 'Fail'"
            >
              标记合格
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click.stop="changeRecordResult(row, 'Fail')"
              v-if="row.result === 'Pass'"
            >
              标记不合格
            </el-button>
            <el-button size="small" type="danger" @click.stop="deleteRecord(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 缺陷记录 -->
    <el-card v-if="currentRecord" class="mt-20">
      <template #header>
        <div class="card-header">
          <span>缺陷记录 - {{ currentRecord.record_id }}</span>
          <el-button type="primary" @click="openAddDefectDialog">
            <el-icon><Plus /></el-icon> 新增缺陷
          </el-button>
        </div>
      </template>
      
      <!-- 缺陷表格 -->
      <el-table
        :data="defectsData"
        style="width: 100%"
        v-loading="tableLoading"
        row-key="defect_id"
        border
      >
        <el-table-column prop="defect_id" label="ID" width="80" />
        <el-table-column prop="defect_type" label="缺陷类型" width="120" />
        <el-table-column prop="defect_description" label="缺陷描述" />
        <el-table-column prop="defect_level" label="缺陷等级" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="row.defect_level === '轻微' ? 'info' : (row.defect_level === '一般' ? 'warning' : 'danger')"
            >
              {{ row.defect_level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="location" label="位置" width="120" />
        <el-table-column prop="corrective_action" label="纠正措施" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button size="small" type="danger" @click="deleteDefect(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 新增质检记录对话框 -->
    <el-dialog
      v-model="recordDialogVisible"
      title="新增质检记录"
      width="50%"
    >
      <el-form
        ref="recordFormRef"
        :model="recordForm"
        :rules="recordRules"
        label-width="120px"
      >
        <el-form-item label="质检单号" prop="record_id">
          <el-input v-model="recordForm.record_id" disabled />
        </el-form-item>
        <el-form-item label="产品" prop="product_code">
          <el-select v-model="recordForm.product_code" placeholder="请选择产品" style="width: 100%">
            <el-option
              v-for="item in productOptions"
              :key="item.product_code"
              :label="item.product_name"
              :value="item.product_code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="检验日期" prop="inspection_date">
          <el-date-picker
            v-model="recordForm.inspection_date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="检验类型" prop="inspection_type">
          <el-select v-model="recordForm.inspection_type" placeholder="请选择检验类型" style="width: 100%">
            <el-option label="来料检验(IQC)" value="IQC" />
            <el-option label="制程检验(IPQC)" value="IPQC" />
            <el-option label="成品检验(OQC)" value="OQC" />
          </el-select>
        </el-form-item>
        <el-form-item label="检验员" prop="inspector">
          <el-input v-model="recordForm.inspector" />
        </el-form-item>
        <el-form-item label="批次号" prop="batch_number">
          <el-input v-model="recordForm.batch_number" />
        </el-form-item>
        <el-form-item label="抽样数量" prop="sample_size">
          <el-input-number v-model="recordForm.sample_size" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="接收数量" prop="accepted_qty">
          <el-input-number v-model="recordForm.accepted_qty" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="不良数量" prop="rejected_qty">
          <el-input-number v-model="recordForm.rejected_qty" :min="0" style="width: 100%" disabled />
        </el-form-item>
        <el-form-item label="结果" prop="result">
          <el-select v-model="recordForm.result" placeholder="请选择结果" style="width: 100%">
            <el-option label="合格" value="Pass" />
            <el-option label="不合格" value="Fail" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="recordForm.remarks" type="textarea" rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="recordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRecordForm(recordFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 新增缺陷对话框 -->
    <el-dialog
      v-model="defectDialogVisible"
      title="新增缺陷记录"
      width="50%"
    >
      <el-form
        ref="defectFormRef"
        :model="defectForm"
        :rules="defectRules"
        label-width="120px"
      >
        <el-form-item label="质检单号" prop="record_id">
          <el-input v-model="defectForm.record_id" disabled />
        </el-form-item>
        <el-form-item label="缺陷类型" prop="defect_type">
          <el-select v-model="defectForm.defect_type" placeholder="请选择缺陷类型" style="width: 100%">
            <el-option label="外观缺陷" value="外观缺陷" />
            <el-option label="尺寸缺陷" value="尺寸缺陷" />
            <el-option label="功能缺陷" value="功能缺陷" />
            <el-option label="材质缺陷" value="材质缺陷" />
            <el-option label="其他缺陷" value="其他缺陷" />
          </el-select>
        </el-form-item>
        <el-form-item label="缺陷描述" prop="defect_description">
          <el-input v-model="defectForm.defect_description" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item label="缺陷等级" prop="defect_level">
          <el-select v-model="defectForm.defect_level" placeholder="请选择缺陷等级" style="width: 100%">
            <el-option label="轻微" value="轻微" />
            <el-option label="一般" value="一般" />
            <el-option label="严重" value="严重" />
            <el-option label="致命" value="致命" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="defectForm.quantity" :min="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="defectForm.location" />
        </el-form-item>
        <el-form-item label="纠正措施" prop="corrective_action">
          <el-input v-model="defectForm.corrective_action" type="textarea" rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="defectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitDefectForm(defectFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.quality-container {
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
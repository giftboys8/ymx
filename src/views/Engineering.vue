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
        <el-step title="工序准备" />
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
      <el-table :data="processRecords" style="width: 100%">
        <el-table-column prop="process_id" label="工序ID" width="100" />
        <el-table-column prop="process_name" label="工艺名称" width="150" />
        <el-table-column prop="material_code" label="物料编码" width="180" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="planned_quantity" label="计划数量" width="120" />
        <el-table-column prop="actual_quantity" label="实际数量" width="120" />
        <el-table-column prop="yield_rate" label="良率" width="100">
          <template #default="scope">
            {{ scope.row.yield_rate }}%
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleProcess(scope.row)">处理</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 工序处理对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="50%">
      <el-form :model="currentProcess" label-width="120px">
        <el-form-item label="工艺名称">
          <el-input v-model="currentProcess.process_name" />
        </el-form-item>
        <el-form-item label="物料编码">
          <el-input v-model="currentProcess.material_code" />
        </el-form-item>
        <el-form-item label="计划数量">
          <el-input-number v-model="currentProcess.planned_quantity" :min="0" />
        </el-form-item>
        <el-form-item label="工艺参数" v-if="currentStep === 0">
          <el-input type="textarea" v-model="currentProcess.parameters" rows="3" />
        </el-form-item>
        <el-form-item label="设备状态" v-if="currentStep === 1">
          <el-select v-model="currentProcess.equipment_status">
            <el-option label="正常" value="normal" />
            <el-option label="待调试" value="pending" />
            <el-option label="故障" value="fault" />
          </el-select>
        </el-form-item>
        <el-form-item label="检验结果" v-if="currentStep === 2 || currentStep === 4">
          <el-radio-group v-model="currentProcess.inspection_result">
            <el-radio label="pass">合格</el-radio>
            <el-radio label="fail">不合格</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="实际数量" v-if="currentStep === 3">
          <el-input-number v-model="currentProcess.actual_quantity" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProcess">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Engineering',
  data() {
    return {
      currentStep: 0,
      dialogVisible: false,
      dialogTitle: '',
      processRecords: [],
      currentProcess: {
        process_id: '',
        process_name: '',
        material_code: '',
        planned_quantity: 0,
        actual_quantity: 0,
        yield_rate: 0,
        status: '未开始',
        parameters: '',
        equipment_status: 'normal',
        inspection_result: 'pass'
      }
    }
  },
  methods: {
    startNewProcess() {
      this.dialogTitle = '新建工序'
      this.currentProcess = {
        process_id: Date.now().toString(),
        process_name: '',
        material_code: '',
        planned_quantity: 0,
        actual_quantity: 0,
        yield_rate: 0,
        status: '未开始',
        parameters: '',
        equipment_status: 'normal',
        inspection_result: 'pass'
      }
      this.dialogVisible = true
    },
    handleProcess(row) {
      this.dialogTitle = '处理工序'
      this.currentProcess = { ...row }
      this.dialogVisible = true
    },
    handleDelete(row) {
      this.$confirm('确认删除该工序记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = this.processRecords.findIndex(item => item.process_id === row.process_id)
        if (index !== -1) {
          this.processRecords.splice(index, 1)
          this.$message.success('删除成功')
        }
      }).catch(() => {})
    },
    saveProcess() {
      if (this.currentProcess.process_id) {
        const index = this.processRecords.findIndex(
          item => item.process_id === this.currentProcess.process_id
        )
        if (index !== -1) {
          this.processRecords[index] = { ...this.currentProcess }
        } else {
          this.processRecords.push({ ...this.currentProcess })
        }
      } else {
        this.processRecords.push({ ...this.currentProcess })
      }
      this.dialogVisible = false
      this.$message.success('保存成功')
    },
    getStatusType(status) {
      const statusMap = {
        '未开始': 'info',
        '进行中': 'warning',
        '已完成': 'success',
        '异常': 'danger'
      }
      return statusMap[status] || 'info'
    }
  }
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
</style>
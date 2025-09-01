<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import CommonPagination from '../components/CommonPagination.vue'

// 供应商数据
const suppliersData = ref([
  {
    supplier_id: 'SUP001',
    supplier_name: '宁德时代新能源科技股份有限公司',
    contact_person: '张经理',
    contact_phone: '13800138001',
    contact_email: 'zhang@catl.com',
    address: '福建省宁德市蕉城区漳湾镇新港路2号',
    business_type: '电芯制造',
    main_products: '磷酸铁锂电芯,三元锂电芯',
    cooperation_years: 5,
    credit_rating: 'AAA',
    payment_terms: '月结30天',
    delivery_cycle: '15天',
    quality_level: '优秀',
    status: '合作中',
    create_date: '2019-03-15',
    last_order_date: '2023-05-20',
    total_orders: 156,
    total_amount: 25680000
  },
  {
    supplier_id: 'SUP002',
    supplier_name: '比亚迪股份有限公司',
    contact_person: '李总监',
    contact_phone: '13900139002',
    contact_email: 'li@byd.com',
    address: '广东省深圳市坪山区比亚迪路3009号',
    business_type: '电池材料',
    main_products: '正极材料,负极材料,电解液',
    cooperation_years: 3,
    credit_rating: 'AA+',
    payment_terms: '月结45天',
    delivery_cycle: '20天',
    quality_level: '良好',
    status: '合作中',
    create_date: '2021-06-10',
    last_order_date: '2023-05-18',
    total_orders: 89,
    total_amount: 18950000
  },
  {
    supplier_id: 'SUP003',
    supplier_name: '中航锂电科技有限公司',
    contact_person: '王主管',
    contact_phone: '13700137003',
    contact_email: 'wang@calb.com',
    address: '江苏省常州市金坛区华城路8号',
    business_type: 'BMS系统',
    main_products: 'BMS主板,传感器,连接器',
    cooperation_years: 2,
    credit_rating: 'AA',
    payment_terms: '现款现货',
    delivery_cycle: '10天',
    quality_level: '优秀',
    status: '合作中',
    create_date: '2022-01-20',
    last_order_date: '2023-05-15',
    total_orders: 45,
    total_amount: 8750000
  },
  {
    supplier_id: 'SUP004',
    supplier_name: '星源材质科技股份有限公司',
    contact_person: '赵工程师',
    contact_phone: '13600136004',
    contact_email: 'zhao@senior.com',
    address: '广东省深圳市龙岗区坂田街道雪岗路2018号',
    business_type: '隔膜材料',
    main_products: 'PE隔膜,PP隔膜,复合隔膜',
    cooperation_years: 4,
    credit_rating: 'AA+',
    payment_terms: '月结60天',
    delivery_cycle: '25天',
    quality_level: '良好',
    status: '合作中',
    create_date: '2020-08-12',
    last_order_date: '2023-05-12',
    total_orders: 78,
    total_amount: 12340000
  },
  {
    supplier_id: 'SUP005',
    supplier_name: '天津力神电池股份有限公司',
    contact_person: '陈副总',
    contact_phone: '13500135005',
    contact_email: 'chen@lishen.com',
    address: '天津市滨海新区华苑产业区海泰发展六道6号',
    business_type: '电池包装',
    main_products: '铝壳,软包装,连接片',
    cooperation_years: 6,
    credit_rating: 'AAA',
    payment_terms: '月结30天',
    delivery_cycle: '12天',
    quality_level: '优秀',
    status: '合作中',
    create_date: '2018-11-05',
    last_order_date: '2023-05-22',
    total_orders: 203,
    total_amount: 31250000
  },
  {
    supplier_id: 'SUP006',
    supplier_name: '江苏海四达电源股份有限公司',
    contact_person: '孙经理',
    contact_phone: '13400134006',
    contact_email: 'sun@hisida.com',
    address: '江苏省如皋市海阳南路288号',
    business_type: '热管理',
    main_products: '散热片,导热垫,冷却液',
    cooperation_years: 1,
    credit_rating: 'A+',
    payment_terms: '预付50%',
    delivery_cycle: '18天',
    quality_level: '一般',
    status: '试用期',
    create_date: '2023-02-15',
    last_order_date: '2023-05-08',
    total_orders: 12,
    total_amount: 2180000
  }
])

// 表格加载状态
const tableLoading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框可见性
const supplierDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 当前编辑的供应商
const currentSupplier = ref(null)
const viewingSupplier = ref(null)

// 新供应商表单
const supplierForm = reactive({
  supplier_id: '',
  supplier_name: '',
  contact_person: '',
  contact_phone: '',
  contact_email: '',
  address: '',
  business_type: '',
  main_products: '',
  cooperation_years: 0,
  credit_rating: 'A',
  payment_terms: '',
  delivery_cycle: '',
  quality_level: '良好',
  status: '合作中'
})

// 加载数据
onMounted(() => {
  total.value = suppliersData.value.length
})

// 分页处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 打开新增供应商对话框
const openAddSupplierDialog = () => {
  currentSupplier.value = null
  Object.assign(supplierForm, {
    supplier_id: '',
    supplier_name: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    business_type: '',
    main_products: '',
    cooperation_years: 0,
    credit_rating: 'A',
    payment_terms: '',
    delivery_cycle: '',
    quality_level: '良好',
    status: '合作中'
  })
  supplierDialogVisible.value = true
}

// 编辑供应商
const editSupplier = (row) => {
  currentSupplier.value = row
  Object.assign(supplierForm, { ...row })
  supplierDialogVisible.value = true
}

// 查看供应商详情
const viewSupplierDetail = (row) => {
  viewingSupplier.value = { ...row }
  detailDialogVisible.value = true
}

// 保存供应商
const saveSupplier = () => {
  if (currentSupplier.value) {
    // 编辑模式
    const index = suppliersData.value.findIndex(item => item.supplier_id === currentSupplier.value.supplier_id)
    if (index !== -1) {
      suppliersData.value[index] = { ...supplierForm }
    }
    ElMessage({
      type: 'success',
      message: '供应商信息更新成功'
    })
  } else {
    // 新增模式
    const newSupplier = {
      ...supplierForm,
      supplier_id: `SUP${String(suppliersData.value.length + 1).padStart(3, '0')}`,
      create_date: new Date().toISOString().split('T')[0],
      last_order_date: '',
      total_orders: 0,
      total_amount: 0
    }
    suppliersData.value.push(newSupplier)
    total.value = suppliersData.value.length
    ElMessage({
      type: 'success',
      message: '供应商添加成功'
    })
  }
  supplierDialogVisible.value = false
}

// 删除供应商
const deleteSupplier = (row) => {
  ElMessageBox.confirm(
    `确定要删除供应商 "${row.supplier_name}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = suppliersData.value.findIndex(item => item.supplier_id === row.supplier_id)
    if (index !== -1) {
      suppliersData.value.splice(index, 1)
      total.value = suppliersData.value.length
    }
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  }).catch(() => {
    // 取消删除
  })
}

// 获取状态标签类型
const getStatusType = (status) => {
  switch (status) {
    case '合作中': return 'success'
    case '试用期': return 'warning'
    case '暂停合作': return 'danger'
    default: return 'info'
  }
}

// 获取信用等级标签类型
const getCreditType = (rating) => {
  if (rating.includes('AAA')) return 'success'
  if (rating.includes('AA')) return 'primary'
  if (rating.includes('A')) return 'warning'
  return 'info'
}

// 获取质量等级标签类型
const getQualityType = (level) => {
  switch (level) {
    case '优秀': return 'success'
    case '良好': return 'primary'
    case '一般': return 'warning'
    case '较差': return 'danger'
    default: return 'info'
  }
}
</script>

<template>
  <div class="supplier-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>供应商管理</span>
          <el-button type="primary" @click="openAddSupplierDialog">
            <el-icon><Plus /></el-icon> 新增供应商
          </el-button>
        </div>
      </template>
      
      <!-- 供应商表格 -->
      <el-table
        :data="suppliersData"
        style="width: 100%"
        v-loading="tableLoading"
        row-key="supplier_id"
        border
      >
        <el-table-column prop="supplier_id" label="供应商编号" width="120" />
        <el-table-column prop="supplier_name" label="供应商名称" width="200" show-overflow-tooltip />
        <el-table-column prop="contact_person" label="联系人" width="100" />
        <el-table-column prop="contact_phone" label="联系电话" width="130" />
        <el-table-column prop="business_type" label="业务类型" width="120" />
        <el-table-column prop="main_products" label="主要产品" width="150" show-overflow-tooltip />
        <el-table-column prop="cooperation_years" label="合作年限" width="100">
          <template #default="{ row }">
            {{ row.cooperation_years }}年
          </template>
        </el-table-column>
        <el-table-column prop="credit_rating" label="信用等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getCreditType(row.credit_rating)">
              {{ row.credit_rating }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quality_level" label="质量等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getQualityType(row.quality_level)">
              {{ row.quality_level }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="合作状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewSupplierDetail(row)">
              查看详情
            </el-button>
            <el-button size="small" type="primary" @click="editSupplier(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" type="danger" @click="deleteSupplier(row)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <CommonPagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 新增/编辑供应商对话框 -->
    <el-dialog
      v-model="supplierDialogVisible"
      :title="currentSupplier ? '编辑供应商' : '新增供应商'"
      width="600px"
      @close="supplierDialogVisible = false"
    >
      <el-form :model="supplierForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供应商名称" required>
              <el-input v-model="supplierForm.supplier_name" placeholder="请输入供应商名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" required>
              <el-input v-model="supplierForm.contact_person" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" required>
              <el-input v-model="supplierForm.contact_phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="supplierForm.contact_email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址">
          <el-input v-model="supplierForm.address" placeholder="请输入地址" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="业务类型">
              <el-select v-model="supplierForm.business_type" placeholder="请选择业务类型">
                <el-option label="电芯制造" value="电芯制造" />
                <el-option label="电池材料" value="电池材料" />
                <el-option label="BMS系统" value="BMS系统" />
                <el-option label="隔膜材料" value="隔膜材料" />
                <el-option label="电池包装" value="电池包装" />
                <el-option label="热管理" value="热管理" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作年限">
              <el-input-number v-model="supplierForm.cooperation_years" :min="0" :max="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="主要产品">
          <el-input v-model="supplierForm.main_products" placeholder="请输入主要产品，多个产品用逗号分隔" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="信用等级">
              <el-select v-model="supplierForm.credit_rating" placeholder="请选择信用等级">
                <el-option label="AAA" value="AAA" />
                <el-option label="AA+" value="AA+" />
                <el-option label="AA" value="AA" />
                <el-option label="A+" value="A+" />
                <el-option label="A" value="A" />
                <el-option label="B" value="B" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="质量等级">
              <el-select v-model="supplierForm.quality_level" placeholder="请选择质量等级">
                <el-option label="优秀" value="优秀" />
                <el-option label="良好" value="良好" />
                <el-option label="一般" value="一般" />
                <el-option label="较差" value="较差" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合作状态">
              <el-select v-model="supplierForm.status" placeholder="请选择合作状态">
                <el-option label="合作中" value="合作中" />
                <el-option label="试用期" value="试用期" />
                <el-option label="暂停合作" value="暂停合作" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="付款条件">
              <el-input v-model="supplierForm.payment_terms" placeholder="如：月结30天" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交货周期">
              <el-input v-model="supplierForm.delivery_cycle" placeholder="如：15天" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="supplierDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveSupplier">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 供应商详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="供应商详细信息"
      width="80%"
      @close="detailDialogVisible = false"
    >
      <div v-if="viewingSupplier" class="supplier-detail">
        <!-- 基本信息 -->
        <el-card class="mb-20">
          <template #header>
            <span>基本信息</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <label>供应商编号：</label>
                <span>{{ viewingSupplier.supplier_id }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>供应商名称：</label>
                <span>{{ viewingSupplier.supplier_name }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>业务类型：</label>
                <span>{{ viewingSupplier.business_type }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt-10">
            <el-col :span="8">
              <div class="info-item">
                <label>联系人：</label>
                <span>{{ viewingSupplier.contact_person }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>联系电话：</label>
                <span>{{ viewingSupplier.contact_phone }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>邮箱：</label>
                <span>{{ viewingSupplier.contact_email }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="24">
              <div class="info-item">
                <label>地址：</label>
                <span>{{ viewingSupplier.address }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 合作信息 -->
        <el-card class="mb-20">
          <template #header>
            <span>合作信息</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="info-item">
                <label>合作年限：</label>
                <span>{{ viewingSupplier.cooperation_years }}年</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>信用等级：</label>
                <el-tag :type="getCreditType(viewingSupplier.credit_rating)">
                  {{ viewingSupplier.credit_rating }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>质量等级：</label>
                <el-tag :type="getQualityType(viewingSupplier.quality_level)">
                  {{ viewingSupplier.quality_level }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>合作状态：</label>
                <el-tag :type="getStatusType(viewingSupplier.status)">
                  {{ viewingSupplier.status }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt-10">
            <el-col :span="8">
              <div class="info-item">
                <label>付款条件：</label>
                <span>{{ viewingSupplier.payment_terms }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>交货周期：</label>
                <span>{{ viewingSupplier.delivery_cycle }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>建档日期：</label>
                <span>{{ viewingSupplier.create_date }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="24">
              <div class="info-item">
                <label>主要产品：</label>
                <span>{{ viewingSupplier.main_products }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 交易统计 -->
        <el-card>
          <template #header>
            <span>交易统计</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="info-item">
                <label>总订单数：</label>
                <span class="highlight">{{ viewingSupplier.total_orders }}单</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>总交易金额：</label>
                <span class="highlight">¥{{ (viewingSupplier.total_amount || 0).toLocaleString() }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>最近订单日期：</label>
                <span>{{ viewingSupplier.last_order_date || '暂无' }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>平均订单金额：</label>
                <span class="highlight">
                  ¥{{ viewingSupplier.total_orders > 0 ? Math.round(viewingSupplier.total_amount / viewingSupplier.total_orders).toLocaleString() : 0 }}
                </span>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.supplier-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.supplier-detail .info-item {
  margin-bottom: 10px;
}

.supplier-detail .info-item label {
  font-weight: bold;
  color: #606266;
  margin-right: 8px;
}

.supplier-detail .highlight {
  color: #409EFF;
  font-weight: bold;
}

.mb-20 {
  margin-bottom: 20px;
}

.mt-10 {
  margin-top: 10px;
}
</style>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import CommonPagination from '../components/CommonPagination.vue'

// 客户数据
const customersData = ref([
  {
    customer_id: 'CUS001',
    customer_name: '特斯拉(上海)有限公司',
    customer_type: '整车厂',
    contact_person: '王总监',
    contact_phone: '13800138001',
    contact_email: 'wang@tesla.com',
    address: '上海市浦东新区南汇新城镇同汇路168号',
    business_scale: '大型企业',
    main_business: '电动汽车制造',
    cooperation_years: 4,
    credit_rating: 'AAA',
    payment_terms: '月结45天',
    delivery_requirements: '准时交付率≥99%',
    quality_requirements: '零缺陷',
    customer_level: 'VIP',
    status: '合作中',
    create_date: '2020-03-15',
    last_order_date: '2023-05-22',
    total_orders: 245,
    total_amount: 156800000,
    annual_demand: '50万套电池包'
  },
  {
    customer_id: 'CUS002',
    customer_name: '比亚迪汽车工业有限公司',
    customer_type: '整车厂',
    contact_person: '李经理',
    contact_phone: '13900139002',
    contact_email: 'li@byd.com',
    address: '广东省深圳市坪山区比亚迪路3009号',
    business_scale: '大型企业',
    main_business: '新能源汽车及电池',
    cooperation_years: 5,
    credit_rating: 'AAA',
    payment_terms: '月结30天',
    delivery_requirements: '准时交付率≥98%',
    quality_requirements: 'PPM<100',
    customer_level: 'VIP',
    status: '合作中',
    create_date: '2019-08-20',
    last_order_date: '2023-05-20',
    total_orders: 312,
    total_amount: 198500000,
    annual_demand: '80万套电池包'
  },
  {
    customer_id: 'CUS003',
    customer_name: '蔚来汽车科技有限公司',
    customer_type: '新势力车企',
    contact_person: '张副总',
    contact_phone: '13700137003',
    contact_email: 'zhang@nio.com',
    address: '上海市嘉定区安亭镇新源路1356号',
    business_scale: '中型企业',
    main_business: '智能电动汽车',
    cooperation_years: 3,
    credit_rating: 'AA+',
    payment_terms: '月结60天',
    delivery_requirements: '准时交付率≥95%',
    quality_requirements: 'PPM<200',
    customer_level: '重要客户',
    status: '合作中',
    create_date: '2021-01-10',
    last_order_date: '2023-05-18',
    total_orders: 156,
    total_amount: 89600000,
    annual_demand: '25万套电池包'
  },
  {
    customer_id: 'CUS004',
    customer_name: '小鹏汽车科技有限公司',
    customer_type: '新势力车企',
    contact_person: '赵主管',
    contact_phone: '13600136004',
    contact_email: 'zhao@xiaopeng.com',
    address: '广东省肇庆市高新区文德三街2号',
    business_scale: '中型企业',
    main_business: '智能汽车制造',
    cooperation_years: 2,
    credit_rating: 'AA',
    payment_terms: '现款现货',
    delivery_requirements: '准时交付率≥90%',
    quality_requirements: 'PPM<300',
    customer_level: '重要客户',
    status: '合作中',
    create_date: '2022-06-15',
    last_order_date: '2023-05-15',
    total_orders: 89,
    total_amount: 45200000,
    annual_demand: '15万套电池包'
  },
  {
    customer_id: 'CUS005',
    customer_name: '理想汽车有限公司',
    customer_type: '新势力车企',
    contact_person: '陈工程师',
    contact_phone: '13500135005',
    contact_email: 'chen@lixiang.com',
    address: '江苏省常州市武进区遥观镇东方东路88号',
    business_scale: '中型企业',
    main_business: '增程式电动车',
    cooperation_years: 2,
    credit_rating: 'AA',
    payment_terms: '月结45天',
    delivery_requirements: '准时交付率≥92%',
    quality_requirements: 'PPM<250',
    customer_level: '重要客户',
    status: '合作中',
    create_date: '2022-03-08',
    last_order_date: '2023-05-12',
    total_orders: 78,
    total_amount: 38900000,
    annual_demand: '12万套电池包'
  },
  {
    customer_id: 'CUS006',
    customer_name: '宁德时代新能源科技股份有限公司',
    customer_type: '电池厂商',
    contact_person: '孙经理',
    contact_phone: '13400134006',
    contact_email: 'sun@catl.com',
    address: '福建省宁德市蕉城区漳湾镇新港路2号',
    business_scale: '大型企业',
    main_business: '动力电池系统',
    cooperation_years: 3,
    credit_rating: 'AAA',
    payment_terms: '月结30天',
    delivery_requirements: '准时交付率≥99%',
    quality_requirements: '零缺陷',
    customer_level: 'VIP',
    status: '合作中',
    create_date: '2021-09-12',
    last_order_date: '2023-05-19',
    total_orders: 189,
    total_amount: 125600000,
    annual_demand: '100万套电芯'
  },
  {
    customer_id: 'CUS007',
    customer_name: '国轩高科股份有限公司',
    customer_type: '电池厂商',
    contact_person: '周总',
    contact_phone: '13300133007',
    contact_email: 'zhou@gotion.com',
    address: '安徽省合肥市经济技术开发区习友路2666号',
    business_scale: '大型企业',
    main_business: '锂离子电池',
    cooperation_years: 1,
    credit_rating: 'AA+',
    payment_terms: '预付30%',
    delivery_requirements: '准时交付率≥95%',
    quality_requirements: 'PPM<150',
    customer_level: '普通客户',
    status: '试用期',
    create_date: '2023-01-20',
    last_order_date: '2023-05-08',
    total_orders: 25,
    total_amount: 12800000,
    annual_demand: '20万套电芯'
  },
  {
    customer_id: 'CUS008',
    customer_name: '哪吒汽车有限公司',
    customer_type: '新势力车企',
    contact_person: '吴主任',
    contact_phone: '13200132008',
    contact_email: 'wu@neta.com',
    address: '浙江省桐乡市经济开发区梧桐大道2266号',
    business_scale: '中型企业',
    main_business: '智能电动汽车',
    cooperation_years: 1,
    credit_rating: 'A+',
    payment_terms: '月结90天',
    delivery_requirements: '准时交付率≥88%',
    quality_requirements: 'PPM<400',
    customer_level: '普通客户',
    status: '合作中',
    create_date: '2023-02-28',
    last_order_date: '2023-05-10',
    total_orders: 32,
    total_amount: 15600000,
    annual_demand: '8万套电池包'
  }
])

// 表格加载状态
const tableLoading = ref(false)

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框可见性
const customerDialogVisible = ref(false)
const detailDialogVisible = ref(false)

// 当前编辑的客户
const currentCustomer = ref(null)
const viewingCustomer = ref(null)

// 新客户表单
const customerForm = reactive({
  customer_id: '',
  customer_name: '',
  customer_type: '',
  contact_person: '',
  contact_phone: '',
  contact_email: '',
  address: '',
  business_scale: '',
  main_business: '',
  cooperation_years: 0,
  credit_rating: 'A',
  payment_terms: '',
  delivery_requirements: '',
  quality_requirements: '',
  customer_level: '普通客户',
  status: '合作中',
  annual_demand: ''
})

// 加载数据
onMounted(() => {
  total.value = customersData.value.length
})

// 分页处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 打开新增客户对话框
const openAddCustomerDialog = () => {
  currentCustomer.value = null
  Object.assign(customerForm, {
    customer_id: '',
    customer_name: '',
    customer_type: '',
    contact_person: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    business_scale: '',
    main_business: '',
    cooperation_years: 0,
    credit_rating: 'A',
    payment_terms: '',
    delivery_requirements: '',
    quality_requirements: '',
    customer_level: '普通客户',
    status: '合作中',
    annual_demand: ''
  })
  customerDialogVisible.value = true
}

// 编辑客户
const editCustomer = (row) => {
  currentCustomer.value = row
  Object.assign(customerForm, { ...row })
  customerDialogVisible.value = true
}

// 查看客户详情
const viewCustomerDetail = (row) => {
  viewingCustomer.value = { ...row }
  detailDialogVisible.value = true
}

// 保存客户
const saveCustomer = () => {
  if (currentCustomer.value) {
    // 编辑模式
    const index = customersData.value.findIndex(item => item.customer_id === currentCustomer.value.customer_id)
    if (index !== -1) {
      customersData.value[index] = { ...customerForm }
    }
    ElMessage({
      type: 'success',
      message: '客户信息更新成功'
    })
  } else {
    // 新增模式
    const newCustomer = {
      ...customerForm,
      customer_id: `CUS${String(customersData.value.length + 1).padStart(3, '0')}`,
      create_date: new Date().toISOString().split('T')[0],
      last_order_date: '',
      total_orders: 0,
      total_amount: 0
    }
    customersData.value.push(newCustomer)
    total.value = customersData.value.length
    ElMessage({
      type: 'success',
      message: '客户添加成功'
    })
  }
  customerDialogVisible.value = false
}

// 删除客户
const deleteCustomer = (row) => {
  ElMessageBox.confirm(
    `确定要删除客户 "${row.customer_name}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = customersData.value.findIndex(item => item.customer_id === row.customer_id)
    if (index !== -1) {
      customersData.value.splice(index, 1)
      total.value = customersData.value.length
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

// 获取客户等级标签类型
const getLevelType = (level) => {
  switch (level) {
    case 'VIP': return 'danger'
    case '重要客户': return 'warning'
    case '普通客户': return 'primary'
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

// 获取客户类型标签类型
const getCustomerTypeType = (type) => {
  switch (type) {
    case '整车厂': return 'success'
    case '新势力车企': return 'primary'
    case '电池厂商': return 'warning'
    default: return 'info'
  }
}
</script>

<template>
  <div class="customer-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>客户管理</span>
          <el-button type="primary" @click="openAddCustomerDialog">
            <el-icon><Plus /></el-icon> 新增客户
          </el-button>
        </div>
      </template>
      
      <!-- 客户表格 -->
      <el-table
        :data="customersData"
        style="width: 100%"
        v-loading="tableLoading"
        row-key="customer_id"
        border
      >
        <el-table-column prop="customer_id" label="客户编号" width="120" />
        <el-table-column prop="customer_name" label="客户名称" width="200" show-overflow-tooltip />
        <el-table-column prop="customer_type" label="客户类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getCustomerTypeType(row.customer_type)">
              {{ row.customer_type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="contact_person" label="联系人" width="100" />
        <el-table-column prop="contact_phone" label="联系电话" width="130" />
        <el-table-column prop="main_business" label="主营业务" width="150" show-overflow-tooltip />
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
        <el-table-column prop="customer_level" label="客户等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.customer_level)">
              {{ row.customer_level }}
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
            <el-button size="small" @click="viewCustomerDetail(row)">
              查看详情
            </el-button>
            <el-button size="small" type="primary" @click="editCustomer(row)">
              <el-icon><Edit /></el-icon>
            </el-button>
            <el-button size="small" type="danger" @click="deleteCustomer(row)">
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

    <!-- 新增/编辑客户对话框 -->
    <el-dialog
      v-model="customerDialogVisible"
      :title="currentCustomer ? '编辑客户' : '新增客户'"
      width="600px"
      @close="customerDialogVisible = false"
    >
      <el-form :model="customerForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" required>
              <el-input v-model="customerForm.customer_name" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户类型" required>
              <el-select v-model="customerForm.customer_type" placeholder="请选择客户类型">
                <el-option label="整车厂" value="整车厂" />
                <el-option label="新势力车企" value="新势力车企" />
                <el-option label="电池厂商" value="电池厂商" />
                <el-option label="储能企业" value="储能企业" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人" required>
              <el-input v-model="customerForm.contact_person" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" required>
              <el-input v-model="customerForm.contact_phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="customerForm.contact_email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="企业规模">
              <el-select v-model="customerForm.business_scale" placeholder="请选择企业规模">
                <el-option label="大型企业" value="大型企业" />
                <el-option label="中型企业" value="中型企业" />
                <el-option label="小型企业" value="小型企业" />
                <el-option label="微型企业" value="微型企业" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="地址">
          <el-input v-model="customerForm.address" placeholder="请输入地址" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主营业务">
              <el-input v-model="customerForm.main_business" placeholder="请输入主营业务" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作年限">
              <el-input-number v-model="customerForm.cooperation_years" :min="0" :max="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="信用等级">
              <el-select v-model="customerForm.credit_rating" placeholder="请选择信用等级">
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
            <el-form-item label="客户等级">
              <el-select v-model="customerForm.customer_level" placeholder="请选择客户等级">
                <el-option label="VIP" value="VIP" />
                <el-option label="重要客户" value="重要客户" />
                <el-option label="普通客户" value="普通客户" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合作状态">
              <el-select v-model="customerForm.status" placeholder="请选择合作状态">
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
              <el-input v-model="customerForm.payment_terms" placeholder="如：月结30天" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年度需求">
              <el-input v-model="customerForm.annual_demand" placeholder="如：10万套电池包" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交付要求">
              <el-input v-model="customerForm.delivery_requirements" placeholder="如：准时交付率≥95%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="质量要求">
              <el-input v-model="customerForm.quality_requirements" placeholder="如：PPM<100" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="customerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveCustomer">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 客户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="客户详细信息"
      width="80%"
      @close="detailDialogVisible = false"
    >
      <div v-if="viewingCustomer" class="customer-detail">
        <!-- 基本信息 -->
        <el-card class="mb-20">
          <template #header>
            <span>基本信息</span>
          </template>
          <el-row :gutter="20">
            <el-col :span="8">
              <div class="info-item">
                <label>客户编号：</label>
                <span>{{ viewingCustomer.customer_id }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>客户名称：</label>
                <span>{{ viewingCustomer.customer_name }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>客户类型：</label>
                <el-tag :type="getCustomerTypeType(viewingCustomer.customer_type)">
                  {{ viewingCustomer.customer_type }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt-10">
            <el-col :span="8">
              <div class="info-item">
                <label>联系人：</label>
                <span>{{ viewingCustomer.contact_person }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>联系电话：</label>
                <span>{{ viewingCustomer.contact_phone }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>邮箱：</label>
                <span>{{ viewingCustomer.contact_email }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt-10">
            <el-col :span="12">
              <div class="info-item">
                <label>企业规模：</label>
                <span>{{ viewingCustomer.business_scale }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>主营业务：</label>
                <span>{{ viewingCustomer.main_business }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="mt-10">
            <el-col :span="24">
              <div class="info-item">
                <label>地址：</label>
                <span>{{ viewingCustomer.address }}</span>
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
                <span>{{ viewingCustomer.cooperation_years }}年</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>信用等级：</label>
                <el-tag :type="getCreditType(viewingCustomer.credit_rating)">
                  {{ viewingCustomer.credit_rating }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>客户等级：</label>
                <el-tag :type="getLevelType(viewingCustomer.customer_level)">
                  {{ viewingCustomer.customer_level }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>合作状态：</label>
                <el-tag :type="getStatusType(viewingCustomer.status)">
                  {{ viewingCustomer.status }}
                </el-tag>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt-10">
            <el-col :span="8">
              <div class="info-item">
                <label>付款条件：</label>
                <span>{{ viewingCustomer.payment_terms }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>建档日期：</label>
                <span>{{ viewingCustomer.create_date }}</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="info-item">
                <label>年度需求：</label>
                <span>{{ viewingCustomer.annual_demand }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="mt-10">
            <el-col :span="12">
              <div class="info-item">
                <label>交付要求：</label>
                <span>{{ viewingCustomer.delivery_requirements }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="info-item">
                <label>质量要求：</label>
                <span>{{ viewingCustomer.quality_requirements }}</span>
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
                <span class="highlight">{{ viewingCustomer.total_orders }}单</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>总交易金额：</label>
                <span class="highlight">¥{{ (viewingCustomer.total_amount || 0).toLocaleString() }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>最近订单日期：</label>
                <span>{{ viewingCustomer.last_order_date || '暂无' }}</span>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="info-item">
                <label>平均订单金额：</label>
                <span class="highlight">
                  ¥{{ viewingCustomer.total_orders > 0 ? Math.round(viewingCustomer.total_amount / viewingCustomer.total_orders).toLocaleString() : 0 }}
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
.customer-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.customer-detail .info-item {
  margin-bottom: 10px;
}

.customer-detail .info-item label {
  font-weight: bold;
  color: #606266;
  margin-right: 8px;
}

.customer-detail .highlight {
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
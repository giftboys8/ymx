import { defineStore } from 'pinia'

// 客户需求计划状态管理
export const useCustomerDemandStore = defineStore('customerDemand', {
  state: () => ({
    customers: [
      { customer_id: 'C001', customer_name: '富士康裕展', contact_person: '张三', contact_info: '13800138000' },
      { customer_id: 'C002', customer_name: '华为科技', contact_person: '李四', contact_info: '13900139000' }
    ],
    demands: [
      { 
        demand_no: 'D20230001', 
        customer_id: 'C001', 
        requester_dept: '生产部', 
        requester_name: '王五', 
        requester_phone: '13700137000',
        create_date: '2023-05-01',
        workflow_status: '生效',
        approved_by: '张经理',
        reviewed_by: '李经理',
        processed_by: '赵工程师'
      }
    ],
    demandDetails: [
      {
        detail_id: 1,
        demand_no: 'D20230001',
        material_code: 'M001',
        delivery_date: '2023-06-01',
        required_qty: 1000,
        sub_material: '{"material_id":"SM001","sub_materrial_qyt":200}'
      }
    ],
    products: [
      {
        material_code: 'M001',
        material_name: '底框',
        type: 'DM6'
      },
      {
        material_code: 'SM001',
        material_name: '螺丝',
        type: '标准件'
      }
    ]
  }),
  actions: {
    addDemand(demand) {
      this.demands.push(demand)
    },
    addDemandDetail(detail) {
      this.demandDetails.push(detail)
    }
  }
})

// 采购管理状态管理
export const usePurchaseStore = defineStore('purchase', {
  state: () => ({
    suppliers: [
      { id: 'S001', company_name: '优质供应商A', address: '广东省深圳市', contact_person: '陈经理', phone: '13600136000', tax_id: '91440300MA5EYKUT9R', bank_account: '622848123456789', bank_name: '中国银行' },
      { id: 'S002', company_name: '优质供应商B', address: '江苏省苏州市', contact_person: '林经理', phone: '13500135000', tax_id: '91320500MA5EYKUT8R', bank_account: '622848987654321', bank_name: '工商银行' }
    ],
    purchaseOrders: [
      {
        id: 'PO20230001',
        order_date: '2023-05-10',
        supplier_id: 'S001',
        total_amount: 50000,
        payment_terms: '月结30天',
        delivery_period: '15天',
        quality_requirements: '符合国家标准',
        delivery_requirements: '送货上门',
        transport_conditions: '常温',
        approver: '张总',
        reviewer: '王经理',
        created_at: '2023-05-08',
        status: '已下单',
        emp_id: 1
      }
    ],
    orderItems: [
      {
        id: 1,
        order_id: 'PO20230001',
        material_id: 'M001',
        quantity: 1000,
        unit_price: 50,
        amount: 50000,
        remarks: '紧急'
      }
    ]
  }),
  actions: {
    addPurchaseOrder(order) {
      this.purchaseOrders.push(order)
    },
    addOrderItem(item) {
      this.orderItems.push(item)
    }
  }
})

// 质检管理状态管理
export const useQualityStore = defineStore('quality', {
  state: () => ({
    inspectionStandards: [
      {
        standard_id: 'STD001',
        product_code: 'M001',
        standard_content: '外观无划痕，尺寸符合规格',
        inspection_type: 'IQC',
        sample_size: '105E',
        frequency: '5W PCS/LOT',
        aql_level: '0.65'
      }
    ],
    testItems: [
      {
        item_id: 'TI001',
        standard_id: 'STD001',
        test_category: '外观',
        zone: '非镀金区域',
        sub_zone: '平面区域'
      }
    ],
    inspectionRecords: [
      {
        record_id: 'IR20230001',
        product_code: 'M001',
        inspection_date: '2023-05-15',
        inspector: 'IQC',
        result: 'Pass'
      }
    ],
    defects: []
  }),
  actions: {
    addInspectionRecord(record) {
      this.inspectionRecords.push(record)
    },
    addDefect(defect) {
      this.defects.push(defect)
    }
  }
})

// 生产排期状态管理
export const useProductionStore = defineStore('production', {
  state: () => ({
    processes: [
      { process_id: 1, process_name: '冲压', description: '金属冲压成型' },
      { process_id: 2, process_name: '组装', description: '零部件组装' },
      { process_id: 3, process_name: '测试', description: '功能测试' }
    ],
    productionPlans: [
      {
        plan_id: 1,
        process_id: 1,
        material_code: 'M001',
        plan_date: '2023-05-20',
        planned_quantity: 1000,
        actual_quantity: 980,
        status: '已关闭',
        created_at: '2023-05-18',
        updated_at: '2023-05-21',
        yield_rate: 98,
        emp_id: 2
      }
    ],
    materialPlans: [
      {
        material_plan_id: 'MP001',
        plan_id: 1,
        process_id: 1,
        material_id: 'M001',
        planned_quantity: 1000,
        actual_quantity: 980,
        yield_rate: 98,
        approval_status: '已批准',
        approved_by: '张总',
        reviewed_by: '王经理',
        created_by: '李工程师'
      }
    ]
  }),
  actions: {
    addProductionPlan(plan) {
      this.productionPlans.push(plan)
    },
    addMaterialPlan(plan) {
      this.materialPlans.push(plan)
    }
  }
})

// 物料管理状态
export const useMaterialStore = defineStore('material', {
  state: () => ({
    materials: [
      {
        material_id: 'M001',
        code: '1B3894W00-600-G',
        name: '底框',
        category: '成品',
        base_unit: '个',
        spec: '标准规格',
        safety_stock: 500,
        status: '良品',
        stock: 1000
      },
      {
        material_id: 'SM001',
        code: 'SC001',
        name: '螺丝',
        category: '原料',
        base_unit: '个',
        spec: 'M2*5',
        safety_stock: 5000,
        status: '良品',
        stock: 10000
      }
    ],
    finishedProductInventory: [
      {
        inventory_id: 'FPI001',
        material_code: 'M001',
        quantity: 1000,
        location: 'A区-01-01',
        batch_number: 'B20230520',
        production_date: '2023-05-20',
        expiry_date: '2025-05-20',
        status: '良品',
        last_check_time: '2023-05-21 10:00:00',
        inspector: 'OQC'
      }
    ]
  }),
  actions: {
    updateMaterialStock(materialId, quantity) {
      const material = this.materials.find(m => m.material_id === materialId)
      if (material) {
        material.stock += quantity
      }
    }
  }
})

// 出货管理状态
export const useShipmentStore = defineStore('shipment', {
  state: () => ({
    shipmentPlans: [
      {
        plan_id: 'SP20230001',
        start_date: '2023-06-01',
        end_date: '2023-06-07',
        customer_id: 'C001',
        status: '已审核',
        approver: '张总',
        reviewer: '王经理',
        creator: '李工程师'
      }
    ],
    shipmentDetails: [
      {
        detail_id: 'SD20230001',
        plan_id: 'SP20230001',
        material_id: 'M001',
        shipment_date: '2023-06-05',
        quantity: 500,
        week_number: '23',
        day_of_week: '星期一',
        notes: '优先发货'
      }
    ]
  }),
  actions: {
    addShipmentPlan(plan) {
      this.shipmentPlans.push(plan)
    },
    addShipmentDetail(detail) {
      this.shipmentDetails.push(detail)
    }
  }
})

// 员工与权限状态管理
export const useEmployeeStore = defineStore('employee', {
  state: () => ({
    departments: [
      { dept_id: 'D001', dept_name: '生产部' },
      { dept_id: 'D002', dept_name: '质检部' },
      { dept_id: 'D003', dept_name: '采购部' }
    ],
    employees: [
      { emp_id: 1, emp_name: '张三', position: '采购员', hire_date: '2020-01-01', dept_id: 'D003' },
      { emp_id: 2, emp_name: '李四', position: '生产主管', hire_date: '2019-05-01', dept_id: 'D001' },
      { emp_id: 3, emp_name: '王五', position: '质检员', hire_date: '2021-03-01', dept_id: 'D002' }
    ],
    users: [
      { user_id: 1, username: 'zhangsan', password_hash: 'hashed_password', email: 'zhangsan@example.com', last_login: '2023-05-25 08:30:00', emp_id: 1, is_active: true },
      { user_id: 2, username: 'lisi', password_hash: 'hashed_password', email: 'lisi@example.com', last_login: '2023-05-25 09:15:00', emp_id: 2, is_active: true },
      { user_id: 3, username: 'wangwu', password_hash: 'hashed_password', email: 'wangwu@example.com', last_login: '2023-05-25 10:00:00', emp_id: 3, is_active: true }
    ],
    roles: [
      { role_id: 1, role_name: '管理员', description: '系统管理员' },
      { role_id: 2, role_name: '采购人员', description: '负责采购管理' },
      { role_id: 3, role_name: '生产人员', description: '负责生产管理' },
      { role_id: 4, role_name: '质检人员', description: '负责质量检验' }
    ],
    permissions: [
      { perm_id: 1, perm_name: '客户需求管理', perm_code: 'customer_demand', description: '客户需求管理权限' },
      { perm_id: 2, perm_name: '采购管理', perm_code: 'purchase', description: '采购管理权限' },
      { perm_id: 3, perm_name: '质检管理', perm_code: 'quality', description: '质检管理权限' },
      { perm_id: 4, perm_name: '生产管理', perm_code: 'production', description: '生产管理权限' },
      { perm_id: 5, perm_name: '出货管理', perm_code: 'shipment', description: '出货管理权限' }
    ],
    userRolePermissions: [
      { role_id: 1, perm_id: 1, granted_at: '2023-01-01 00:00:00' },
      { role_id: 1, perm_id: 2, granted_at: '2023-01-01 00:00:00' },
      { role_id: 1, perm_id: 3, granted_at: '2023-01-01 00:00:00' },
      { role_id: 1, perm_id: 4, granted_at: '2023-01-01 00:00:00' },
      { role_id: 1, perm_id: 5, granted_at: '2023-01-01 00:00:00' },
      { role_id: 2, perm_id: 2, granted_at: '2023-01-01 00:00:00' },
      { role_id: 3, perm_id: 4, granted_at: '2023-01-01 00:00:00' },
      { role_id: 4, perm_id: 3, granted_at: '2023-01-01 00:00:00' }
    ]
  }),
  actions: {
    login(username, password) {
      // 模拟登录，实际应用中应该进行密码验证
      const user = this.users.find(u => u.username === username)
      if (user) {
        user.last_login = new Date().toISOString()
        return user
      }
      return null
    },
    getUserPermissions(userId) {
      const user = this.users.find(u => u.user_id === userId)
      if (!user) return []
      
      // 获取用户角色
      const userRoles = this.userRolePermissions.filter(urp => 
        this.roles.some(r => r.role_id === urp.role_id)
      )
      
      // 获取角色对应的权限
      const permissionIds = userRoles.map(ur => ur.perm_id)
      return this.permissions.filter(p => permissionIds.includes(p.perm_id))
    }
  }
})
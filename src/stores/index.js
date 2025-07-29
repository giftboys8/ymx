import { defineStore } from 'pinia'

// 客户需求计划状态管理
export const useCustomerDemandStore = defineStore('customerDemand', {
  state: () => ({
    customers: [
      { customer_id: 'C001', customer_name: '宁德时代新能源', contact_person: '张三', contact_info: '13800138000' },
      { customer_id: 'C002', customer_name: '比亚迪电池', contact_person: '李四', contact_info: '13900139000' },
      { customer_id: 'C003', customer_name: '中航锂电', contact_person: '王五', contact_info: '13700139000' },
      { customer_id: 'C004', customer_name: '国轩高科', contact_person: '赵六', contact_info: '13600136000' },
      { customer_id: 'C005', customer_name: '欣旺达电子', contact_person: '钱七', contact_info: '13500135000' },
      { customer_id: 'C006', customer_name: '孚能科技', contact_person: '孙八', contact_info: '13400134000' },
      { customer_id: 'C007', customer_name: '蜂巢能源', contact_person: '周九', contact_info: '13300133000' },
      { customer_id: 'C008', customer_name: '亿纬锂能', contact_person: '吴十', contact_info: '13200132000' }
    ],
    demands: [
      { 
        demand_no: 'D20230001', 
        customer_id: 'C001', 
        requester_dept: '电芯生产部', 
        requester_name: '王五', 
        requester_phone: '13700137000',
        create_date: '2023-05-01',
        workflow_status: '生效',
        approved_by: '张经理',
        reviewed_by: '李经理',
        processed_by: '赵工程师'
      },
      { 
        demand_no: 'D20230002', 
        customer_id: 'C002', 
        requester_dept: '电池材料采购部', 
        requester_name: '李明', 
        requester_phone: '13800138001',
        create_date: '2023-05-02',
        workflow_status: '待审核',
        approved_by: '',
        reviewed_by: '',
        processed_by: ''
      },
      { 
        demand_no: 'D20230003', 
        customer_id: 'C003', 
        requester_dept: '电池技术研发部', 
        requester_name: '张华', 
        requester_phone: '13900139001',
        create_date: '2023-05-03',
        workflow_status: '生效',
        approved_by: '王总',
        reviewed_by: '刘经理',
        processed_by: '陈工程师'
      },
      { 
        demand_no: 'D20230004', 
        customer_id: 'C004', 
        requester_dept: '电池质量检测部', 
        requester_name: '刘强', 
        requester_phone: '13700137001',
        create_date: '2023-05-04',
        workflow_status: '审核中',
        approved_by: '',
        reviewed_by: '赵经理',
        processed_by: ''
      },
      { 
        demand_no: 'D20230005', 
        customer_id: 'C005', 
        requester_dept: '电池销售部', 
        requester_name: '陈丽', 
        requester_phone: '13600136001',
        create_date: '2023-05-05',
        workflow_status: '生效',
        approved_by: '李总',
        reviewed_by: '周经理',
        processed_by: '孙工程师'
      },
      { 
        demand_no: 'D20230006', 
        customer_id: 'C006', 
        requester_dept: 'BMS研发部', 
        requester_name: '黄伟', 
        requester_phone: '13500135001',
        create_date: '2023-05-06',
        workflow_status: '待审核',
        approved_by: '',
        reviewed_by: '',
        processed_by: ''
      },
      { 
        demand_no: 'D20230007', 
        customer_id: 'C007', 
        requester_dept: '电池包工程部', 
        requester_name: '郑涛', 
        requester_phone: '13400134001',
        create_date: '2023-05-07',
        workflow_status: '生效',
        approved_by: '张总',
        reviewed_by: '王经理',
        processed_by: '李工程师'
      },
      { 
        demand_no: 'D20230008', 
        customer_id: 'C008', 
        requester_dept: '电池制造部', 
        requester_name: '吴磊', 
        requester_phone: '13300133001',
        create_date: '2023-05-08',
        workflow_status: '审核中',
        approved_by: '',
        reviewed_by: '陈经理',
        processed_by: ''
      },
      { 
        demand_no: 'D20230009', 
        customer_id: 'C001', 
        requester_dept: '电池物流部', 
        requester_name: '马超', 
        requester_phone: '13200132001',
        create_date: '2023-05-09',
        workflow_status: '生效',
        approved_by: '刘总',
        reviewed_by: '黄经理',
        processed_by: '郑工程师'
      },
      { 
        demand_no: 'D20230010', 
        customer_id: 'C002', 
        requester_dept: '电池生产计划部', 
        requester_name: '赵敏', 
        requester_phone: '13100131001',
        create_date: '2023-05-10',
        workflow_status: '待审核',
        approved_by: '',
        reviewed_by: '',
        processed_by: ''
      },
      { 
        demand_no: 'D20230011', 
        customer_id: 'C003', 
        requester_dept: '电池设备部', 
        requester_name: '孙杰', 
        requester_phone: '13000130001',
        create_date: '2023-05-11',
        workflow_status: '生效',
        approved_by: '吴总',
        reviewed_by: '马经理',
        processed_by: '赵工程师'
      },
      { 
        demand_no: 'D20230012', 
        customer_id: 'C004', 
        requester_dept: '电池安全部', 
        requester_name: '周静', 
        requester_phone: '12900129001',
        create_date: '2023-05-12',
        workflow_status: '审核中',
        approved_by: '',
        reviewed_by: '孙经理',
        processed_by: ''
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
      },
      {
        detail_id: 2,
        demand_no: 'D20230001',
        material_code: 'M002',
        delivery_date: '2023-06-05',
        required_qty: 800,
        sub_material: '{"material_id":"SM002","sub_materrial_qyt":150}'
      },
      {
        detail_id: 3,
        demand_no: 'D20230002',
        material_code: 'M003',
        delivery_date: '2023-06-10',
        required_qty: 1200,
        sub_material: '{"material_id":"SM003","sub_materrial_qyt":300}'
      },
      {
        detail_id: 4,
        demand_no: 'D20230003',
        material_code: 'M004',
        delivery_date: '2023-06-15',
        required_qty: 600,
        sub_material: '{"material_id":"SM004","sub_materrial_qyt":120}'
      },
      {
        detail_id: 5,
        demand_no: 'D20230003',
        material_code: 'M005',
        delivery_date: '2023-06-20',
        required_qty: 900,
        sub_material: '{"material_id":"SM005","sub_materrial_qyt":180}'
      },
      {
        detail_id: 6,
        demand_no: 'D20230004',
        material_code: 'M006',
        delivery_date: '2023-06-25',
        required_qty: 1500,
        sub_material: '{"material_id":"SM006","sub_materrial_qyt":400}'
      },
      {
        detail_id: 7,
        demand_no: 'D20230005',
        material_code: 'M007',
        delivery_date: '2023-06-30',
        required_qty: 750,
        sub_material: '{"material_id":"SM007","sub_materrial_qyt":160}'
      },
      {
        detail_id: 8,
        demand_no: 'D20230005',
        material_code: 'M008',
        delivery_date: '2023-07-05',
        required_qty: 1100,
        sub_material: '{"material_id":"SM008","sub_materrial_qyt":250}'
      },
      {
        detail_id: 9,
        demand_no: 'D20230006',
        material_code: 'M009',
        delivery_date: '2023-07-10',
        required_qty: 850,
        sub_material: '{"material_id":"SM009","sub_materrial_qyt":170}'
      },
      {
        detail_id: 10,
        demand_no: 'D20230007',
        material_code: 'M010',
        delivery_date: '2023-07-15',
        required_qty: 1300,
        sub_material: '{"material_id":"SM010","sub_materrial_qyt":350}'
      },
      {
        detail_id: 11,
        demand_no: 'D20230008',
        material_code: 'M011',
        delivery_date: '2023-07-20',
        required_qty: 950,
        sub_material: '{"material_id":"SM011","sub_materrial_qyt":200}'
      },
      {
        detail_id: 12,
        demand_no: 'D20230009',
        material_code: 'M012',
        delivery_date: '2023-07-25',
        required_qty: 700,
        sub_material: '{"material_id":"SM012","sub_materrial_qyt":140}'
      }
    ],
    products: [
      {
        material_code: 'M001',
        material_name: '底框',
        type: 'DM6'
      },
      {
        material_code: 'M002',
        material_name: '上盖',
        type: 'DM6'
      },
      {
        material_code: 'M003',
        material_name: '侧板',
        type: 'DM6'
      },
      {
        material_code: 'M004',
        material_name: '前面板',
        type: 'DM7'
      },
      {
        material_code: 'M005',
        material_name: '后面板',
        type: 'DM7'
      },
      {
        material_code: 'M006',
        material_name: '主板支架',
        type: 'DM8'
      },
      {
        material_code: 'M007',
        material_name: '散热器',
        type: 'DM8'
      },
      {
        material_code: 'M008',
        material_name: '电源模块',
        type: 'DM9'
      },
      {
        material_code: 'M009',
        material_name: '接口板',
        type: 'DM9'
      },
      {
        material_code: 'M010',
        material_name: '显示屏',
        type: 'DM10'
      },
      {
        material_code: 'M011',
        material_name: '按键组件',
        type: 'DM10'
      },
      {
        material_code: 'M012',
        material_name: '天线组件',
        type: 'DM11'
      },
      {
        material_code: 'SM001',
        material_name: '螺丝',
        type: '标准件'
      },
      {
        material_code: 'SM002',
        material_name: '垫片',
        type: '标准件'
      },
      {
        material_code: 'SM003',
        material_name: '弹簧',
        type: '标准件'
      },
      {
        material_code: 'SM004',
        material_name: '密封圈',
        type: '标准件'
      },
      {
        material_code: 'SM005',
        material_name: '导热片',
        type: '标准件'
      },
      {
        material_code: 'SM006',
        material_name: '绝缘片',
        type: '标准件'
      },
      {
        material_code: 'SM007',
        material_name: '连接器',
        type: '标准件'
      },
      {
        material_code: 'SM008',
        material_name: '电缆',
        type: '标准件'
      },
      {
        material_code: 'SM009',
        material_name: '保护套',
        type: '标准件'
      },
      {
        material_code: 'SM010',
        material_name: '固定夹',
        type: '标准件'
      },
      {
        material_code: 'SM011',
        material_name: '标签贴',
        type: '标准件'
      },
      {
        material_code: 'SM012',
        material_name: '包装盒',
        type: '标准件'
      },
      {
        material_code: 'KK001',
        material_name: '卡扣',
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
      { id: 'S001', company_name: '杉杉股份材料', address: '湖南省长沙市', contact_person: '陈经理', phone: '13600136000', tax_id: '91440300MA5EYKUT9R', bank_account: '622848123456789', bank_name: '中国银行' },
      { id: 'S002', company_name: '当升科技正极材料', address: '北京市海淀区', contact_person: '林经理', phone: '13500135000', tax_id: '91320500MA5EYKUT8R', bank_account: '622848987654321', bank_name: '工商银行' },
      { id: 'S003', company_name: '恩捷股份隔膜', address: '云南省曲靖市', contact_person: '赵经理', phone: '13400134000', tax_id: '9133010UT7R', bank_account: '622848888888888', bank_name: '农业银行' },
      { id: 'S004', company_name: '天赐材料电解液', address: '广东省广州市', contact_person: '周经理', phone: '13300133000', tax_id: '91110108MA5EYKUT7R', bank_account: '622848777777777', bank_name: '建设银行' }
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
      },
      {
        id: 'PO20230002',
        order_date: '2023-05-12',
        supplier_id: 'S002',
        total_amount: 75000,
        payment_terms: '月结45天',
        delivery_period: '20天',
        quality_requirements: '符合行业标准',
        delivery_requirements: '工厂自提',
        transport_conditions: '防潮',
        approver: '李总',
        reviewer: '陈经理',
        created_at: '2023-05-10',
        status: '待下单',
        emp_id: 2
      },
      {
        id: 'PO20230003',
        order_date: '2023-05-15',
        supplier_id: 'S003',
        total_amount: 120000,
        payment_terms: '预付50%',
        delivery_period: '10天',
        quality_requirements: '符合企业标准',
        delivery_requirements: '送货上门',
        transport_conditions: '常温',
        approver: '王总',
        reviewer: '刘经理',
        created_at: '2023-05-13',
        status: '已结算',
        emp_id: 3
      },
      {
        id: 'PO20230004',
        order_date: '2023-05-18',
        supplier_id: 'S004',
        total_amount: 85000,
        payment_terms: '月结60天',
        delivery_period: '25天',
        quality_requirements: '符合国际标准',
        delivery_requirements: '指定地点',
        transport_conditions: '防震',
        approver: '赵总',
        reviewer: '黄经理',
        created_at: '2023-05-16',
        status: '已下单',
        emp_id: 4
      },
      {
        id: 'PO20230005',
        order_date: '2023-05-20',
        supplier_id: 'S001',
        total_amount: 95000,
        payment_terms: '月结30天',
        delivery_period: '18天',
        quality_requirements: '符合国家标准',
        delivery_requirements: '送货上门',
        transport_conditions: '常温',
        approver: '张总',
        reviewer: '马经理',
        created_at: '2023-05-18',
        status: '待下单',
        emp_id: 1
      },
      {
        id: 'PO20230006',
        order_date: '2023-05-22',
        supplier_id: 'S002',
        total_amount: 110000,
        payment_terms: '月结45天',
        delivery_period: '22天',
        quality_requirements: '符合行业标准',
        delivery_requirements: '工厂自提',
        transport_conditions: '防潮',
        approver: '李总',
        reviewer: '孙经理',
        created_at: '2023-05-20',
        status: '已下单',
        emp_id: 2
      },
      {
        id: 'PO20230007',
        order_date: '2023-05-25',
        supplier_id: 'S003',
        total_amount: 65000,
        payment_terms: '预付30%',
        delivery_period: '12天',
        quality_requirements: '符合企业标准',
        delivery_requirements: '送货上门',
        transport_conditions: '常温',
        approver: '王总',
        reviewer: '周经理',
        created_at: '2023-05-23',
        status: '已结算',
        emp_id: 3
      },
      {
        id: 'PO20230008',
        order_date: '2023-05-28',
        supplier_id: 'S004',
        total_amount: 78000,
        payment_terms: '月结60天',
        delivery_period: '28天',
        quality_requirements: '符合国际标准',
        delivery_requirements: '指定地点',
        transport_conditions: '防震',
        approver: '赵总',
        reviewer: '吴经理',
        created_at: '2023-05-26',
        status: '待下单',
        emp_id: 4
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
      },
      {
        id: 2,
        order_id: 'PO20230002',
        material_id: 'M002',
        quantity: 800,
        unit_price: 65,
        amount: 52000,
        remarks: '常规'
      },
      {
        id: 3,
        order_id: 'PO20230002',
        material_id: 'SM001',
        quantity: 5000,
        unit_price: 4.6,
        amount: 23000,
        remarks: '标准件'
      },
      {
        id: 4,
        order_id: 'PO20230003',
        material_id: 'M003',
        quantity: 1200,
        unit_price: 100,
        amount: 120000,
        remarks: '高精度'
      },
      {
        id: 5,
        order_id: 'PO20230004',
        material_id: 'M004',
        quantity: 600,
        unit_price: 85,
        amount: 51000,
        remarks: '定制'
      },
      {
        id: 6,
        order_id: 'PO20230004',
        material_id: 'SM002',
        quantity: 3000,
        unit_price: 11.33,
        amount: 34000,
        remarks: '防腐蚀'
      },
      {
        id: 7,
        order_id: 'PO20230005',
        material_id: 'M005',
        quantity: 900,
        unit_price: 75,
        amount: 67500,
        remarks: '加急'
      },
      {
        id: 8,
        order_id: 'PO20230005',
        material_id: 'SM003',
        quantity: 2500,
        unit_price: 11,
        amount: 27500,
        remarks: '弹性好'
      },
      {
        id: 9,
        order_id: 'PO20230006',
        material_id: 'M006',
        quantity: 1100,
        unit_price: 100,
        amount: 110000,
        remarks: '承重强'
      },
      {
        id: 10,
        order_id: 'PO20230007',
        material_id: 'M007',
        quantity: 650,
        unit_price: 100,
        amount: 65000,
        remarks: '散热好'
      },
      {
        id: 11,
        order_id: 'PO20230008',
        material_id: 'M008',
        quantity: 520,
        unit_price: 150,
        amount: 78000,
        remarks: '高效率'
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
        product_code: 'CELL001',
        standard_content: '电芯容量≥100Ah，内阻≤0.5mΩ，外观无变形',
        inspection_type: 'IQC',
        sample_size: '105E',
        frequency: '100 PCS/LOT',
        aql_level: '0.65'
      },
      {
        standard_id: 'STD002',
        product_code: 'CELL002',
        standard_content: '电芯电压3.7V±0.05V，循环寿命≥2000次',
        inspection_type: 'OQC',
        sample_size: '80E',
        frequency: '50 PCS/LOT',
        aql_level: '1.0'
      },
      {
        standard_id: 'STD003',
        product_code: 'MODULE001',
        standard_content: '模组绝缘电阻≥100MΩ，连接可靠性测试通过',
        inspection_type: 'IPQC',
        sample_size: '32E',
        frequency: '10 PCS/LOT',
        aql_level: '1.5'
      }
    ],
    testItems: [
      {
        item_id: 'TI001',
        standard_id: 'STD001',
        test_category: '电性能',
        zone: '电芯本体',
        sub_zone: '正负极'
      },
      {
        item_id: 'TI002',
        standard_id: 'STD001',
        test_category: '外观',
        zone: '电芯外壳',
        sub_zone: '表面质量'
      },
      {
        item_id: 'TI003',
        standard_id: 'STD002',
        test_category: '安全性能',
        zone: '电芯内部',
        sub_zone: '热失控测试'
      },
      {
        item_id: 'TI004',
        standard_id: 'STD003',
        test_category: '绝缘性能',
        zone: '模组连接',
        sub_zone: '绝缘材料'
      }
    ],
    inspectionRecords: [
      {
        record_id: 'IR20230001',
        product_code: 'M001',
        inspection_date: '2023-05-15',
        inspector: 'IQC',
        result: 'Pass'
      },
      {
        record_id: 'IR20230002',
        product_code: 'M002',
        inspection_date: '2023-05-16',
        inspector: 'IQC',
        result: 'Pass'
      },
      {
        record_id: 'IR20230003',
        product_code: 'M003',
        inspection_date: '2023-05-17',
        inspector: 'IPQC',
        result: 'Fail'
      },
      {
        record_id: 'IR20230004',
        product_code: 'M004',
        inspection_date: '2023-05-18',
        inspector: 'OQC',
        result: 'Pass'
      },
      {
        record_id: 'IR20230005',
        product_code: 'M005',
        inspection_date: '2023-05-19',
        inspector: 'IQC',
        result: 'Pass'
      },
      {
        record_id: 'IR20230006',
        product_code: 'M006',
        inspection_date: '2023-05-20',
        inspector: 'IPQC',
        result: 'Pass'
      },
      {
        record_id: 'IR20230007',
        product_code: 'M007',
        inspection_date: '2023-05-21',
        inspector: 'OQC',
        result: 'Fail'
      },
      {
        record_id: 'IR20230008',
        product_code: 'M008',
        inspection_date: '2023-05-22',
        inspector: 'IQC',
        result: 'Pass'
      },
      {
        record_id: 'IR20230009',
        product_code: 'M009',
        inspection_date: '2023-05-23',
        inspector: 'IPQC',
        result: 'Pass'
      },
      {
        record_id: 'IR20230010',
        product_code: 'M010',
        inspection_date: '2023-05-24',
        inspector: 'OQC',
        result: 'Pass'
      },
      {
        record_id: 'IR20230011',
        product_code: 'M011',
        inspection_date: '2023-05-25',
        inspector: 'IQC',
        result: 'Fail'
      },
      {
        record_id: 'IR20230012',
        product_code: 'M012',
        inspection_date: '2023-05-26',
        inspector: 'IPQC',
        result: 'Pass'
      }
    ],
    defects: [
      {
        defect_id: 'DF20230001',
        record_id: 'IR20230003',
        defect_type: '外观缺陷',
        defect_description: '表面有划痕',
        defect_level: '轻微',
        quantity: 5,
        location: 'A区域',
        corrective_action: '重新抛光处理'
      },
      {
        defect_id: 'DF20230002',
        record_id: 'IR20230003',
        defect_description: '尺寸超差',
        defect_type: '尺寸缺陷',
        defect_level: '严重',
        quantity: 2,
        location: 'B区域',
        corrective_action: '返工重做'
      },
      {
        defect_id: 'DF20230003',
        record_id: 'IR20230007',
        defect_type: '功能缺陷',
        defect_description: '散热效果不佳',
        defect_level: '一般',
        quantity: 3,
        location: 'C区域',
        corrective_action: '更换散热材料'
      },
      {
        defect_id: 'DF20230004',
        record_id: 'IR20230011',
        defect_type: '装配缺陷',
        defect_description: '按键松动',
        defect_level: '一般',
        quantity: 8,
        location: 'D区域',
        corrective_action: '重新装配'
      },
      {
        defect_id: 'DF20230005',
        record_id: 'IR20230011',
        defect_type: '外观缺陷',
        defect_description: '颜色不均匀',
        defect_level: '轻微',
        quantity: 12,
        location: 'E区域',
        corrective_action: '重新喷涂'
      }
    ]
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
      { process_id: 3, process_name: '测试', description: '功能测试' },
      { process_id: 4, process_name: '涂布', description: '电极材料涂布工艺' },
      { process_id: 5, process_name: '辊压', description: '电极片辊压成型' },
      { process_id: 6, process_name: '分切', description: '电极片分切工艺' },
      { process_id: 7, process_name: '卷绕', description: '电芯卷绕工艺' },
      { process_id: 8, process_name: '封装', description: '电芯封装工艺' },
      { process_id: 9, process_name: '注液', description: '电解液注入工艺' },
      { process_id: 10, process_name: '化成', description: '电芯化成工艺' },
      { process_id: 11, process_name: '分容', description: '电芯分容测试' },
      { process_id: 12, process_name: '模组装配', description: '电池模组装配' },
      { process_id: 13, process_name: 'PACK装配', description: '电池包装配' }
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
      },
      {
        plan_id: 2,
        process_id: 2,
        material_code: 'M002',
        plan_date: '2023-05-22',
        planned_quantity: 800,
        actual_quantity: 790,
        status: '已关闭',
        created_at: '2023-05-20',
        updated_at: '2023-05-23',
        yield_rate: 98.75,
        emp_id: 3
      },
      {
        plan_id: 3,
        process_id: 3,
        material_code: 'M003',
        plan_date: '2023-05-25',
        planned_quantity: 1200,
        actual_quantity: 1150,
        status: '进行中',
        created_at: '2023-05-23',
        updated_at: '2023-05-25',
        yield_rate: 95.83,
        emp_id: 4
      },
      {
        plan_id: 4,
        process_id: 1,
        material_code: 'M004',
        plan_date: '2023-05-28',
        planned_quantity: 600,
        actual_quantity: 0,
        status: '计划中',
        created_at: '2023-05-26',
        updated_at: '2023-05-26',
        yield_rate: 0,
        emp_id: 2
      },
      {
        plan_id: 5,
        process_id: 2,
        material_code: 'M005',
        plan_date: '2023-05-30',
        planned_quantity: 900,
        actual_quantity: 850,
        status: '进行中',
        created_at: '2023-05-28',
        updated_at: '2023-05-30',
        yield_rate: 94.44,
        emp_id: 3
      },
      {
        plan_id: 6,
        process_id: 3,
        material_code: 'M006',
        plan_date: '2023-06-02',
        planned_quantity: 1500,
        actual_quantity: 0,
        status: '计划中',
        created_at: '2023-05-30',
        updated_at: '2023-05-30',
        yield_rate: 0,
        emp_id: 4
      },
      {
        plan_id: 7,
        process_id: 1,
        material_code: 'M007',
        plan_date: '2023-06-05',
        planned_quantity: 750,
        actual_quantity: 720,
        status: '已关闭',
        created_at: '2023-06-02',
        updated_at: '2023-06-06',
        yield_rate: 96,
        emp_id: 2
      },
      {
        plan_id: 8,
        process_id: 2,
        material_code: 'M008',
        plan_date: '2023-06-08',
        planned_quantity: 1100,
        actual_quantity: 1080,
        status: '进行中',
        created_at: '2023-06-05',
        updated_at: '2023-06-08',
        yield_rate: 98.18,
        emp_id: 3
      },
      {
        plan_id: 9,
        process_id: 3,
        material_code: 'M009',
        plan_date: '2023-06-10',
        planned_quantity: 850,
        actual_quantity: 0,
        status: '计划中',
        created_at: '2023-06-08',
        updated_at: '2023-06-08',
        yield_rate: 0,
        emp_id: 4
      },
      {
        plan_id: 10,
        process_id: 1,
        material_code: 'M010',
        plan_date: '2023-06-12',
        planned_quantity: 1300,
        actual_quantity: 1250,
        status: '已关闭',
        created_at: '2023-06-10',
        updated_at: '2023-06-13',
        yield_rate: 96.15,
        emp_id: 2
      },
      {
        plan_id: 11,
        process_id: 2,
        material_code: 'M011',
        plan_date: '2023-06-15',
        planned_quantity: 950,
        actual_quantity: 920,
        status: '进行中',
        created_at: '2023-06-12',
        updated_at: '2023-06-15',
        yield_rate: 96.84,
        emp_id: 3
      },
      {
        plan_id: 12,
        process_id: 3,
        material_code: 'M012',
        plan_date: '2023-06-18',
        planned_quantity: 700,
        actual_quantity: 0,
        status: '计划中',
        created_at: '2023-06-15',
        updated_at: '2023-06-15',
        yield_rate: 0,
        emp_id: 4
      },
      {
        plan_id: 13,
        process_id: 4,
        material_code: 'CELL001',
        plan_date: '2023-06-20',
        planned_quantity: 5000,
        actual_quantity: 4850,
        status: '已关闭',
        created_at: '2023-06-18',
        updated_at: '2023-06-21',
        yield_rate: 97,
        emp_id: 5
      },
      {
        plan_id: 14,
        process_id: 5,
        material_code: 'CELL001',
        plan_date: '2023-06-22',
        planned_quantity: 4850,
        actual_quantity: 4800,
        status: '已关闭',
        created_at: '2023-06-20',
        updated_at: '2023-06-23',
        yield_rate: 98.97,
        emp_id: 6
      },
      {
        plan_id: 15,
        process_id: 6,
        material_code: 'CELL001',
        plan_date: '2023-06-25',
        planned_quantity: 4800,
        actual_quantity: 4750,
        status: '进行中',
        created_at: '2023-06-23',
        updated_at: '2023-06-25',
        yield_rate: 98.96,
        emp_id: 5
      },
      {
        plan_id: 16,
        process_id: 7,
        material_code: 'CELL002',
        plan_date: '2023-06-28',
        planned_quantity: 8000,
        actual_quantity: 7850,
        status: '已关闭',
        created_at: '2023-06-25',
        updated_at: '2023-06-29',
        yield_rate: 98.13,
        emp_id: 7
      },
      {
        plan_id: 17,
        process_id: 8,
        material_code: 'CELL002',
        plan_date: '2023-06-30',
        planned_quantity: 7850,
        actual_quantity: 7800,
        status: '进行中',
        created_at: '2023-06-28',
        updated_at: '2023-06-30',
        yield_rate: 99.36,
        emp_id: 8
      },
      {
        plan_id: 18,
        process_id: 9,
        material_code: 'CELL002',
        plan_date: '2023-07-02',
        planned_quantity: 7800,
        actual_quantity: 0,
        status: '计划中',
        created_at: '2023-06-30',
        updated_at: '2023-06-30',
        yield_rate: 0,
        emp_id: 9
      },
      {
        plan_id: 19,
        process_id: 10,
        material_code: 'CELL003',
        plan_date: '2023-07-05',
        planned_quantity: 6000,
        actual_quantity: 5900,
        status: '已关闭',
        created_at: '2023-07-02',
        updated_at: '2023-07-06',
        yield_rate: 98.33,
        emp_id: 10
      },
      {
        plan_id: 20,
        process_id: 11,
        material_code: 'CELL003',
        plan_date: '2023-07-08',
        planned_quantity: 5900,
        actual_quantity: 5850,
        status: '进行中',
        created_at: '2023-07-05',
        updated_at: '2023-07-08',
        yield_rate: 99.15,
        emp_id: 11
      },
      {
        plan_id: 21,
        process_id: 12,
        material_code: 'MODULE001',
        plan_date: '2023-07-10',
        planned_quantity: 600,
        actual_quantity: 590,
        status: '已关闭',
        created_at: '2023-07-08',
        updated_at: '2023-07-11',
        yield_rate: 98.33,
        emp_id: 12
      },
      {
        plan_id: 22,
        process_id: 13,
        material_code: 'PACK001',
        plan_date: '2023-07-12',
        planned_quantity: 150,
        actual_quantity: 148,
        status: '已关闭',
        created_at: '2023-07-10',
        updated_at: '2023-07-13',
        yield_rate: 98.67,
        emp_id: 13
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
      },
      {
        material_id: 'CELL001',
        code: 'CELL-LFP-001',
        name: '磷酸铁锂电芯',
        category: '成品',
        base_unit: '个',
        spec: '3.2V 100Ah',
        safety_stock: 1000,
        status: '良品',
        stock: 5000
      },
      {
        material_id: 'CELL002',
        code: 'CELL-NCM-002',
        name: '三元锂电芯',
        category: '成品',
        base_unit: '个',
        spec: '3.7V 80Ah',
        safety_stock: 800,
        status: '良品',
        stock: 4000
      },
      {
        material_id: 'CELL003',
        code: 'CELL-LTO-003',
        name: '钛酸锂电芯',
        category: '成品',
        base_unit: '个',
        spec: '2.4V 50Ah',
        safety_stock: 600,
        status: '良品',
        stock: 3000
      },
      {
        material_id: 'MODULE001',
        code: 'MOD-001',
        name: '电池模组',
        category: '成品',
        base_unit: '个',
        spec: '48V 200Ah',
        safety_stock: 100,
        status: '良品',
        stock: 500
      },
      {
        material_id: 'PACK001',
        code: 'PACK-001',
        name: '电池包',
        category: '成品',
        base_unit: '个',
        spec: '400V 100kWh',
        safety_stock: 50,
        status: '良品',
        stock: 200
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
      },
      {
        inventory_id: 'FPI002',
        material_code: 'CELL001',
        quantity: 5000,
        location: 'B区-01-01',
        batch_number: 'B20230620',
        production_date: '2023-06-20',
        expiry_date: '2033-06-20',
        status: '良品',
        last_check_time: '2023-06-21 14:30:00',
        inspector: 'OQC'
      },
      {
        inventory_id: 'FPI003',
        material_code: 'CELL002',
        quantity: 4000,
        location: 'B区-02-01',
        batch_number: 'B20230628',
        production_date: '2023-06-28',
        expiry_date: '2033-06-28',
        status: '良品',
        last_check_time: '2023-06-29 09:15:00',
        inspector: 'OQC'
      },
      {
        inventory_id: 'FPI004',
        material_code: 'MODULE001',
        quantity: 500,
        location: 'C区-01-01',
        batch_number: 'B20230710',
        production_date: '2023-07-10',
        expiry_date: '2033-07-10',
        status: '良品',
        last_check_time: '2023-07-11 16:45:00',
        inspector: 'OQC'
      },
      {
        inventory_id: 'FPI005',
        material_code: 'PACK001',
        quantity: 200,
        location: 'D区-01-01',
        batch_number: 'B20230712',
        production_date: '2023-07-12',
        expiry_date: '2033-07-12',
        status: '良品',
        last_check_time: '2023-07-13 11:20:00',
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
      },
      {
        plan_id: 'SP20230002',
        start_date: '2023-06-08',
        end_date: '2023-06-14',
        customer_id: 'C002',
        status: '已审核',
        approver: '李总',
        reviewer: '陈经理',
        creator: '王工程师'
      },
      {
        plan_id: 'SP20230003',
        start_date: '2023-06-15',
        end_date: '2023-06-21',
        customer_id: 'C003',
        status: '进行中',
        approver: '王总',
        reviewer: '刘经理',
        creator: '赵工程师'
      },
      {
        plan_id: 'SP20230004',
        start_date: '2023-06-22',
        end_date: '2023-06-28',
        customer_id: 'C004',
        status: '计划中',
        approver: '',
        reviewer: '',
        creator: '孙工程师'
      },
      {
        plan_id: 'SP20230005',
        start_date: '2023-06-29',
        end_date: '2023-07-05',
        customer_id: 'C005',
        status: '已审核',
        approver: '赵总',
        reviewer: '黄经理',
        creator: '周工程师'
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
      },
      {
        detail_id: 'SD20230002',
        plan_id: 'SP20230001',
        material_id: 'M002',
        shipment_date: '2023-06-07',
        quantity: 300,
        week_number: '23',
        day_of_week: '星期三',
        notes: '常规发货'
      },
      {
        detail_id: 'SD20230003',
        plan_id: 'SP20230002',
        material_id: 'CELL001',
        shipment_date: '2023-06-10',
        quantity: 2000,
        week_number: '24',
        day_of_week: '星期六',
        notes: '电芯产品'
      },
      {
        detail_id: 'SD20230004',
        plan_id: 'SP20230002',
        material_id: 'CELL002',
        shipment_date: '2023-06-12',
        quantity: 3000,
        week_number: '24',
        day_of_week: '星期一',
        notes: '电芯产品'
      },
      {
        detail_id: 'SD20230005',
        plan_id: 'SP20230003',
        material_id: 'MODULE001',
        shipment_date: '2023-06-18',
        quantity: 200,
        week_number: '25',
        day_of_week: '星期日',
        notes: '电池模组'
      },
      {
        detail_id: 'SD20230006',
        plan_id: 'SP20230003',
        material_id: 'PACK001',
        shipment_date: '2023-06-20',
        quantity: 50,
        week_number: '25',
        day_of_week: '星期二',
        notes: '电池包产品'
      },
      {
        detail_id: 'SD20230007',
        plan_id: 'SP20230004',
        material_id: 'CELL003',
        shipment_date: '2023-06-25',
        quantity: 2500,
        week_number: '26',
        day_of_week: '星期日',
        notes: '电芯产品'
      },
      {
        detail_id: 'SD20230008',
        plan_id: 'SP20230005',
        material_id: 'M007',
        shipment_date: '2023-07-02',
        quantity: 400,
        week_number: '27',
        day_of_week: '星期日',
        notes: '散热器产品'
      },
      {
        detail_id: 'SD20230009',
        plan_id: 'SP20230005',
        material_id: 'M008',
        shipment_date: '2023-07-04',
        quantity: 600,
        week_number: '27',
        day_of_week: '星期二',
        notes: '电源模块'
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
      { dept_id: 'D001', dept_name: '电芯生产部' },
      { dept_id: 'D002', dept_name: '电池质检部' },
      { dept_id: 'D003', dept_name: '电池材料采购部' },
      { dept_id: 'D004', dept_name: 'BMS技术部' },
      { dept_id: 'D005', dept_name: '电池包装配部' }
    ],
    employees: [
      { emp_id: 1, emp_name: '张三', position: '电池材料采购员', hire_date: '2020-01-01', dept_id: 'D003' },
      { emp_id: 2, emp_name: '李四', position: '电芯生产主管', hire_date: '2019-05-01', dept_id: 'D001' },
      { emp_id: 3, emp_name: '王五', position: '电池质检员', hire_date: '2021-03-01', dept_id: 'D002' },
      { emp_id: 4, emp_name: '赵六', position: 'BMS工程师', hire_date: '2020-08-01', dept_id: 'D004' },
      { emp_id: 5, emp_name: '钱七', position: '电池包装配工', hire_date: '2021-06-01', dept_id: 'D005' }
    ],
    users: [
      { user_id: 1, username: 'zhangsan', password_hash: 'hashed_password', email: 'zhangsan@example.com', last_login: '2023-05-25 08:30:00', emp_id: 1, is_active: true },
      { user_id: 2, username: 'lisi', password_hash: 'hashed_password', email: 'lisi@example.com', last_login: '2023-05-25 09:15:00', emp_id: 2, is_active: true },
      { user_id: 3, username: 'wangwu', password_hash: 'hashed_password', email: 'wangwu@example.com', last_login: '2023-05-25 10:00:00', emp_id: 3, is_active: true }
    ],
    roles: [
      { role_id: 1, role_name: '系统管理员', description: '电池制造系统管理员' },
      { role_id: 2, role_name: '电池材料采购员', description: '负责电池原材料采购管理' },
      { role_id: 3, role_name: '电池生产人员', description: '负责电池生产制造管理' },
      { role_id: 4, role_name: '电池质检人员', description: '负责电池质量检验' },
      { role_id: 5, role_name: 'BMS工程师', description: '负责电池管理系统开发' }
    ],
    permissions: [
      { perm_id: 1, perm_name: '电池客户需求管理', perm_code: 'customer_demand', description: '电池客户需求管理权限' },
      { perm_id: 2, perm_name: '电池材料采购管理', perm_code: 'purchase', description: '电池原材料采购管理权限' },
      { perm_id: 3, perm_name: '电池质检管理', perm_code: 'quality', description: '电池质量检验管理权限' },
      { perm_id: 4, perm_name: '电池生产管理', perm_code: 'production', description: '电池生产制造管理权限' },
      { perm_id: 5, perm_name: '电池出货管理', perm_code: 'shipment', description: '电池产品出货管理权限' },
      { perm_id: 6, perm_name: 'BMS系统管理', perm_code: 'bms', description: '电池管理系统权限' }
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
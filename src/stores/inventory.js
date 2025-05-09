import { defineStore } from 'pinia'

// 入库管理状态存储
export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    // 原料入库相关数据
    materialReceipts: [
      {
        receipt_id: 'MR20230001',
        receipt_date: '2023-05-15',
        supplier_id: 'S001',
        order_id: 'PO20230001',
        status: '已完成',
        notes: '正常到货',
        created_by: 1,
        created_at: '2023-05-15 10:00:00'
      }
    ],
    materialReceiptItems: [
      {
        item_id: 1,
        receipt_id: 'MR20230001',
        material_id: 'SM001',
        quantity: 5000,
        unit: '个',
        batch_number: 'B20230515',
        production_date: '2023-05-10',
        expiry_date: '2025-05-10',
        status: '待检'
      }
    ],
    // IQC检验记录
    iqcRecords: [
      {
        record_id: 'IQC20230001',
        receipt_item_id: 1,
        material_id: 'SM001',
        inspection_date: '2023-05-15',
        inspector: 3,
        sample_size: 100,
        passed_qty: 98,
        rejected_qty: 2,
        result: 'Pass',
        notes: '符合标准'
      }
    ],
    // 批次管理
    materialBatches: [
      {
        batch_id: 'MB20230001',
        material_id: 'SM001',
        batch_number: 'B20230515',
        quantity: 5000,
        location: 'A区-02-01',
        status: '良品',
        receipt_date: '2023-05-15',
        expiry_date: '2025-05-10',
        created_by: 1,
        created_at: '2023-05-15 14:00:00'
      }
    ],
    // 库存更新记录
    stockUpdateLogs: [
      {
        log_id: 'SUL20230001',
        material_id: 'SM001',
        update_type: '入库',
        quantity: 5000,
        before_qty: 5000,
        after_qty: 10000,
        update_date: '2023-05-15',
        operator: 1,
        notes: '原料入库'
      }
    ],
    
    // 成品入库相关数据
    productionCompletions: [
      {
        completion_id: 'PC20230001',
        production_plan_id: 1,
        material_code: 'M001',
        completion_date: '2023-05-21',
        quantity: 980,
        yield_rate: 98,
        status: '已完成',
        created_by: 2,
        created_at: '2023-05-21 16:00:00'
      }
    ],
    // OQC检验记录
    oqcRecords: [
      {
        record_id: 'OQC20230001',
        completion_id: 'PC20230001',
        material_code: 'M001',
        inspection_date: '2023-05-21',
        inspector: 3,
        sample_size: 50,
        passed_qty: 49,
        rejected_qty: 1,
        result: 'Pass',
        notes: '符合标准'
      }
    ],
    // 成品批次管理
    productBatches: [
      {
        batch_id: 'PB20230001',
        material_code: 'M001',
        batch_number: 'B20230521',
        quantity: 980,
        location: 'B区-01-01',
        status: '良品',
        production_date: '2023-05-21',
        expiry_date: '2025-05-21',
        created_by: 2,
        created_at: '2023-05-21 17:00:00'
      }
    ],
    // 库位管理
    storageLocations: [
      { location_id: 'A区-01-01', location_name: 'A区-01-01', location_type: '原料区', status: '已占用' },
      { location_id: 'A区-02-01', location_name: 'A区-02-01', location_type: '原料区', status: '已占用' },
      { location_id: 'B区-01-01', location_name: 'B区-01-01', location_type: '成品区', status: '已占用' },
      { location_id: 'B区-01-02', location_name: 'B区-01-02', location_type: '成品区', status: '空闲' }
    ]
  }),
  
  actions: {
    // 原料入库相关操作
    addMaterialReceipt(receipt) {
      this.materialReceipts.push(receipt)
      return receipt.receipt_id
    },
    
    addMaterialReceiptItem(item) {
      this.materialReceiptItems.push(item)
      return item.item_id
    },
    
    addIqcRecord(record) {
      this.iqcRecords.push(record)
      
      // 更新对应物料接收项的状态
      const receiptItem = this.materialReceiptItems.find(item => item.item_id === record.receipt_item_id)
      if (receiptItem) {
        receiptItem.status = record.result === 'Pass' ? '良品' : '不良品'
      }
      
      return record.record_id
    },
    
    addMaterialBatch(batch) {
      this.materialBatches.push(batch)
      return batch.batch_id
    },
    
    updateMaterialStock(materialId, quantity, updateType, operator, notes) {
      // 查找物料
      const material = useMaterialStore().materials.find(m => m.material_id === materialId)
      if (!material) return null
      
      const beforeQty = material.stock
      const afterQty = updateType === '入库' ? beforeQty + quantity : beforeQty - quantity
      
      // 更新物料库存
      useMaterialStore().updateMaterialStock(materialId, updateType === '入库' ? quantity : -quantity)
      
      // 记录库存更新日志
      const logId = `SUL${new Date().getTime()}`
      const log = {
        log_id: logId,
        material_id: materialId,
        update_type: updateType,
        quantity,
        before_qty: beforeQty,
        after_qty,
        update_date: new Date().toISOString().split('T')[0],
        operator,
        notes
      }
      
      this.stockUpdateLogs.push(log)
      return logId
    },
    
    // 成品入库相关操作
    addProductionCompletion(completion) {
      this.productionCompletions.push(completion)
      return completion.completion_id
    },
    
    addOqcRecord(record) {
      this.oqcRecords.push(record)
      return record.record_id
    },
    
    addProductBatch(batch) {
      this.productBatches.push(batch)
      return batch.batch_id
    },
    
    assignStorageLocation(locationId, status) {
      const location = this.storageLocations.find(loc => loc.location_id === locationId)
      if (location) {
        location.status = status
        return true
      }
      return false
    },
    
    getAvailableLocations(locationType) {
      return this.storageLocations.filter(
        loc => loc.location_type === locationType && loc.status === '空闲'
      )
    }
  }
})

// 导入其他需要的store
import { useMaterialStore } from './index'
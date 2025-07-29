<template>
  <div class="pagination-container">
    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      :layout="layout"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定义props
const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    default: 0
  },
  showSizes: {
    type: Boolean,
    default: true
  },
  showTotal: {
    type: Boolean,
    default: true
  },
  showJumper: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['size-change', 'current-change'])

// 计算布局
const layout = computed(() => {
  let layoutItems = ['prev', 'pager', 'next']
  
  if (props.showTotal) {
    layoutItems.unshift('total')
  }
  
  if (props.showSizes) {
    layoutItems.splice(-2, 0, 'sizes')
  }
  
  if (props.showJumper) {
    layoutItems.push('jumper')
  }
  
  return layoutItems.join(', ')
})

// 处理页面大小变化
const handleSizeChange = (size) => {
  emit('size-change', size)
}

// 处理当前页变化
const handleCurrentChange = (page) => {
  emit('current-change', page)
}
</script>

<style scoped>
.pagination-container {
  text-align: center;
  padding: 20px 0;
  margin-top: 20px;
}

.el-pagination {
  justify-content: center;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .pagination-container {
    padding: 15px 0;
  }
  
  .el-pagination :deep(.el-pagination__sizes) {
    display: none;
  }
  
  .el-pagination :deep(.el-pagination__total) {
    display: none;
  }
  
  .el-pagination :deep(.el-pager .number) {
    min-width: 32px;
    height: 32px;
    line-height: 32px;
  }
  
  .el-pagination :deep(.btn-prev),
  .el-pagination :deep(.btn-next) {
    min-width: 32px;
    height: 32px;
    line-height: 32px;
  }
}
</style>
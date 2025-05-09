<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 表格数据
const usersData = ref([
  {
    user_id: 1,
    username: 'admin',
    email: 'admin@example.com',
    last_login: '2023-05-01 10:00:00',
    emp_id: 1,
    is_active: true
  },
  {
    user_id: 2,
    username: 'operator',
    email: 'operator@example.com',
    last_login: '2023-05-01 09:00:00',
    emp_id: 2,
    is_active: true
  }
])

const rolesData = ref([
  {
    role_id: 1,
    role_name: '系统管理员',
    description: '拥有所有系统权限',
    permissions: [1, 2, 3, 4, 5]
  },
  {
    role_id: 2,
    role_name: '生产主管',
    description: '管理生产相关功能',
    permissions: [2, 3]
  },
  {
    role_id: 3,
    role_name: '质检员',
    description: '负责质量检验相关功能',
    permissions: [4]
  }
])

const permissionsData = ref([
  { perm_id: 1, perm_name: '用户管理', perm_code: 'user:manage', description: '用户的增删改查' },
  { perm_id: 2, perm_name: '生产管理', perm_code: 'production:manage', description: '生产计划和执行' },
  { perm_id: 3, perm_name: '采购管理', perm_code: 'purchase:manage', description: '采购订单管理' },
  { perm_id: 4, perm_name: '质检管理', perm_code: 'quality:manage', description: '质量检验管理' },
  { perm_id: 5, perm_name: '系统配置', perm_code: 'system:config', description: '系统参数配置' }
])

// 表格加载状态
const tableLoading = ref(false)

// 对话框可见性
const userDialogVisible = ref(false)
const roleDialogVisible = ref(false)

// 表单数据
const userForm = reactive({
  user_id: 0,
  username: '',
  email: '',
  password: '',
  emp_id: '',
  is_active: true
})

const roleForm = reactive({
  role_id: 0,
  role_name: '',
  description: '',
  permissions: []
})

// 表单规则
const userRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const roleRules = {
  role_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  permissions: [{ required: true, message: '请选择权限', trigger: 'change' }]
}

// 打开新增用户对话框
const openAddUserDialog = () => {
  userForm.user_id = 0
  userForm.username = ''
  userForm.email = ''
  userForm.password = ''
  userForm.emp_id = ''
  userForm.is_active = true
  userDialogVisible.value = true
}

// 打开新增角色对话框
const openAddRoleDialog = () => {
  roleForm.role_id = 0
  roleForm.role_name = ''
  roleForm.description = ''
  roleForm.permissions = []
  roleDialogVisible.value = true
}

// 提交用户表单
const submitUserForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (userForm.user_id === 0) {
        // 新增用户
        const newUser = {
          user_id: usersData.value.length + 1,
          ...userForm,
          last_login: ''
        }
        usersData.value.push(newUser)
      } else {
        // 编辑用户
        const index = usersData.value.findIndex(u => u.user_id === userForm.user_id)
        if (index !== -1) {
          usersData.value[index] = { ...usersData.value[index], ...userForm }
        }
      }
      userDialogVisible.value = false
      ElMessage({
        type: 'success',
        message: userForm.user_id === 0 ? '用户创建成功' : '用户更新成功'
      })
    }
  })
}

// 提交角色表单
const submitRoleForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (roleForm.role_id === 0) {
        // 新增角色
        const newRole = {
          role_id: rolesData.value.length + 1,
          ...roleForm
        }
        rolesData.value.push(newRole)
      } else {
        // 编辑角色
        const index = rolesData.value.findIndex(r => r.role_id === roleForm.role_id)
        if (index !== -1) {
          rolesData.value[index] = { ...rolesData.value[index], ...roleForm }
        }
      }
      roleDialogVisible.value = false
      ElMessage({
        type: 'success',
        message: roleForm.role_id === 0 ? '角色创建成功' : '角色更新成功'
      })
    }
  })
}

// 编辑用户
const editUser = (row) => {
  Object.assign(userForm, row)
  userDialogVisible.value = true
}

// 编辑角色
const editRole = (row) => {
  Object.assign(roleForm, row)
  roleDialogVisible.value = true
}

// 删除用户
const deleteUser = (row) => {
  ElMessageBox.confirm(
    '确定要删除该用户吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = usersData.value.findIndex(u => u.user_id === row.user_id)
    if (index !== -1) {
      usersData.value.splice(index, 1)
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    }
  })
}

// 删除角色
const deleteRole = (row) => {
  ElMessageBox.confirm(
    '确定要删除该角色吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = rolesData.value.findIndex(r => r.role_id === row.role_id)
    if (index !== -1) {
      rolesData.value.splice(index, 1)
      ElMessage({
        type: 'success',
        message: '删除成功'
      })
    }
  })
}

// 获取权限名称
const getPermissionNames = (permIds) => {
  return permIds
    .map(id => permissionsData.value.find(p => p.perm_id === id)?.perm_name)
    .filter(name => name)
    .join(', ')
}
</script>

<template>
  <div class="permission-container">
    <!-- 用户管理 -->
    <el-card class="mb-20">
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="openAddUserDialog">
            <el-icon><Plus /></el-icon> 新增用户
          </el-button>
        </div>
      </template>
      
      <el-table
        :data="usersData"
        style="width: 100%"
        v-loading="tableLoading"
        border
      >
        <el-table-column prop="user_id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="last_login" label="最后登录时间" width="180" />
        <el-table-column prop="emp_id" label="员工ID" width="100" />
        <el-table-column prop="is_active" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'">
              {{ row.is_active ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 角色管理 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>角色管理</span>
          <el-button type="primary" @click="openAddRoleDialog">
            <el-icon><Plus /></el-icon> 新增角色
          </el-button>
        </div>
      </template>
      
      <el-table
        :data="rolesData"
        style="width: 100%"
        v-loading="tableLoading"
        border
      >
        <el-table-column prop="role_id" label="ID" width="80" />
        <el-table-column prop="role_name" label="角色名称" width="150" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="权限" min-width="200">
          <template #default="{ row }">
            {{ getPermissionNames(row.permissions) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button size="small" @click="editRole(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteRole(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog
      v-model="userDialogVisible"
      :title="userForm.user_id === 0 ? '新增用户' : '编辑用户'"
      width="50%"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" />
        </el-form-item>
        <el-form-item label="员工ID" prop="emp_id">
          <el-input v-model="userForm.emp_id" />
        </el-form-item>
        <el-form-item label="状态" prop="is_active">
          <el-switch v-model="userForm.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="userDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserForm(userFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="roleForm.role_id === 0 ? '新增角色' : '编辑角色'"
      width="50%"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="roleForm.role_name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="权限" prop="permissions">
          <el-checkbox-group v-model="roleForm.permissions">
            <el-checkbox
              v-for="perm in permissionsData"
              :key="perm.perm_id"
              :label="perm.perm_id"
            >
              {{ perm.perm_name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitRoleForm(roleFormRef)">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.permission-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mb-20 {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>
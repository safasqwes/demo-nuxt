<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
        <h1 class="text-2xl font-bold mb-6 text-center">管理后台登录</h1>
        
        <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" class="w-full" :loading="loading" @click="onSubmit">
              登录
            </el-button>
          </el-form-item>
        </el-form>
        
        <p class="text-xs text-gray-500 text-center mt-4">测试账号: admin / admin123</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAdminStore } from '~/modules/admin/stores/admin'

definePageMeta({
  layout: 'default',
})

const adminStore = useAdminStore()

const formRef = ref()
const loading = ref(false)
const form = ref({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      const ok = await adminStore.login(form.value.username, form.value.password)
      if (ok) {
        ElMessage.success('登录成功')
        navigateTo('/admin')
      } else {
        ElMessage.error('用户名或密码错误')
      }
    } finally {
      loading.value = false
    }
  })
}
</script>


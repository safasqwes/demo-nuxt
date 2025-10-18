<template>
  <div class="payment-form">
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4">支付信息</h3>
      
      <!-- 支付方式选择 -->
      <div class="space-y-3 mb-6">
        <div 
          v-for="method in paymentMethods" 
          :key="method.id"
          class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
          :class="{ 'border-blue-500 bg-blue-50': selectedMethod === method.id }"
          @click="selectedMethod = method.id"
        >
          <el-radio v-model="selectedMethod" :label="method.id" class="mr-3">
            <el-icon class="text-xl mr-2">
              <component :is="method.icon" />
            </el-icon>
            {{ method.name }}
          </el-radio>
        </div>
      </div>
    </div>

    <!-- Stripe支付表单 -->
    <div v-if="selectedMethod === 'stripe'" class="stripe-container">
      <div id="stripe-payment-element" class="mb-4">
        <!-- Stripe Elements will be mounted here -->
      </div>
      <div class="text-sm text-gray-500 mb-4">
        支持 Visa, MasterCard, American Express 等主流信用卡
      </div>
    </div>

    <!-- PayPal支付按钮 -->
    <div v-else-if="selectedMethod === 'paypal'" class="paypal-container">
      <div id="paypal-button-container" class="mb-4">
        <!-- PayPal button will be mounted here -->
      </div>
    </div>

    <!-- 其他支付方式 -->
    <div v-else class="text-center py-8 text-gray-500">
      <el-icon class="text-4xl mb-2"><CreditCard /></el-icon>
      <p>该支付方式暂未开放</p>
    </div>

    <!-- 支付按钮 -->
    <div class="space-y-4">
      <el-button 
        type="primary" 
        size="large" 
        class="w-full"
        :loading="processing"
        @click="processPayment"
      >
        {{ processing ? '处理中...' : `支付 $${amount.toFixed(2)}` }}
      </el-button>
      
      <el-button 
        size="large" 
        class="w-full"
        @click="$emit('cancel')"
      >
        取消支付
      </el-button>
    </div>

    <!-- 安全提示 -->
    <div class="mt-6 text-center text-sm text-gray-500">
      <el-icon class="mr-1"><Lock /></el-icon>
      您的支付信息将被安全加密处理
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { CreditCard, Lock } from '@element-plus/icons-vue'

interface PaymentMethod {
  id: string
  name: string
  icon: string
  available: boolean
}

interface Props {
  amount: number
  currency?: string
  processing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'usd',
  processing: false
})

const emit = defineEmits<{
  payment: [method: string, data: any]
  cancel: []
}>()

const selectedMethod = ref('stripe')

const paymentMethods: PaymentMethod[] = [
  { id: 'stripe', name: '信用卡/借记卡', icon: 'CreditCard', available: true },
  { id: 'paypal', name: 'PayPal', icon: 'Wallet', available: true },
  { id: 'alipay', name: '支付宝', icon: 'Money', available: false },
  { id: 'wechat', name: '微信支付', icon: 'ChatDotRound', available: false }
]

const processPayment = () => {
  if (selectedMethod.value === 'stripe') {
    processStripePayment()
  } else if (selectedMethod.value === 'paypal') {
    processPayPalPayment()
  }
}

const processStripePayment = () => {
  // TODO: 实现Stripe支付处理
  console.log('Processing Stripe payment...')
  emit('payment', 'stripe', { amount: props.amount, currency: props.currency })
}

const processPayPalPayment = () => {
  // TODO: 实现PayPal支付处理
  console.log('Processing PayPal payment...')
  emit('payment', 'paypal', { amount: props.amount, currency: props.currency })
}

const initializePaymentMethods = () => {
  // TODO: 初始化支付方式
  console.log('Initializing payment methods...')
}

onMounted(() => {
  nextTick(() => {
    initializePaymentMethods()
  })
})
</script>

<style scoped>
.payment-form {
  max-width: 500px;
  margin: 0 auto;
}

.stripe-container,
.paypal-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>


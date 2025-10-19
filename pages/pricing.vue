<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">
          选择适合您的
          <span class="text-yellow-300">创作计划</span>
        </h1>
        <p class="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          从个人创作者到专业工作室，我们为每个创作者提供完美的解决方案
        </p>
        
        <!-- Billing Toggle -->
        <div class="flex items-center justify-center space-x-4 mb-12">
          <span :class="billingCycle === 'monthly' ? 'text-white' : 'text-blue-200'">月付</span>
          <button
            @click="toggleBilling"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
            :class="billingCycle === 'yearly' ? 'bg-yellow-400' : 'bg-gray-600'"
          >
            <span
              class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
          <span :class="billingCycle === 'yearly' ? 'text-white' : 'text-blue-200'">年付</span>
          <span v-if="billingCycle === 'yearly'" class="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
            节省 20%
          </span>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Social Plan -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">社交版</h3>
              <p class="text-gray-600 mb-6">适合个人创作者和 YouTuber</p>
              <div class="mb-6">
                <span class="text-5xl font-bold text-gray-900">
                  ${{ billingCycle === 'yearly' ? '9.99' : '14.99' }}
                </span>
                <span class="text-gray-600">/月</span>
                <div v-if="billingCycle === 'yearly'" class="text-sm text-green-600 font-semibold mt-1">
                  年付节省 $60
                </div>
              </div>
              <button class="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                开始免费试用
              </button>
            </div>
            
            <div class="mt-8 space-y-4">
              <h4 class="font-semibold text-gray-900">包含内容：</h4>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">无限下载音乐和音效</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">社交媒体授权</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">YouTube、TikTok、Instagram</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">7天免费试用</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Pro Plan -->
          <div class="bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8 relative transform scale-105">
            <div class="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span class="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                最受欢迎
              </span>
            </div>
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">专业版</h3>
              <p class="text-gray-600 mb-6">适合专业制作人和工作室</p>
              <div class="mb-6">
                <span class="text-5xl font-bold text-gray-900">
                  ${{ billingCycle === 'yearly' ? '16.58' : '24.99' }}
                </span>
                <span class="text-gray-600">/月</span>
                <div v-if="billingCycle === 'yearly'" class="text-sm text-green-600 font-semibold mt-1">
                  年付节省 $100
                </div>
              </div>
              <button class="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
                开始免费试用
              </button>
            </div>
            
            <div class="mt-8 space-y-4">
              <h4 class="font-semibold text-gray-900">包含内容：</h4>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">包含社交版所有内容</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">商业用途授权</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">音乐分轨下载</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">客户项目授权</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">7天免费试用</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Max Plan -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 relative">
            <div class="text-center">
              <h3 class="text-2xl font-bold text-gray-900 mb-2">全包版</h3>
              <p class="text-gray-600 mb-6">适合需要全面资源的创作者</p>
              <div class="mb-6">
                <span class="text-5xl font-bold text-gray-900">
                  ${{ billingCycle === 'yearly' ? '39.99' : '49.99' }}
                </span>
                <span class="text-gray-600">/月</span>
                <div v-if="billingCycle === 'yearly'" class="text-sm text-green-600 font-semibold mt-1">
                  年付节省 $120
                </div>
              </div>
              <button class="w-full bg-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 transition-colors">
                开始免费试用
              </button>
            </div>
            
            <div class="mt-8 space-y-4">
              <h4 class="font-semibold text-gray-900">包含内容：</h4>
              <ul class="space-y-3">
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">包含所有专业版内容</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">视频素材和模板</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">AI 配音和图像生成</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">8K 视频素材</span>
                </li>
                <li class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  <span class="text-gray-700">7天免费试用</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Comparison -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">功能对比</h2>
          <p class="text-xl text-gray-600">详细了解每个计划包含的功能</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b-2 border-gray-200">
                <th class="text-left py-4 px-6 font-semibold text-gray-900">功能</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">社交版</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">专业版</th>
                <th class="text-center py-4 px-6 font-semibold text-gray-900">全包版</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="feature in features" :key="feature.name" class="hover:bg-gray-50">
                <td class="py-4 px-6 font-medium text-gray-900">{{ feature.name }}</td>
                <td class="py-4 px-6 text-center">
                  <span v-if="feature.social" class="text-green-500 font-semibold">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span v-if="feature.pro" class="text-green-500 font-semibold">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
                <td class="py-4 px-6 text-center">
                  <span v-if="feature.max" class="text-green-500 font-semibold">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-20 bg-gray-50">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">常见问题</h2>
          <p class="text-xl text-gray-600">解答您可能关心的问题</p>
        </div>

        <div class="space-y-6">
          <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              @click="toggleFaq(index)"
              class="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div class="flex justify-between items-center">
                <h3 class="text-lg font-semibold text-gray-900">{{ faq.question }}</h3>
                <svg
                  class="w-5 h-5 text-gray-500 transform transition-transform"
                  :class="{ 'rotate-180': openFaqs.includes(index) }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </div>
            </button>
            <div v-if="openFaqs.includes(index)" class="px-6 pb-6">
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-4xl font-bold mb-6">准备开始您的创作之旅？</h2>
        <p class="text-xl text-blue-100 mb-8">
          加入超过 100 万创作者，开始使用我们的专业工具
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            开始免费试用
          </button>
          <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
            联系我们
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 页面元数据
useHead({
  title: '定价计划 - NovelHub',
  meta: [
    { name: 'description', content: '选择适合您的创作计划，从个人创作者到专业工作室，我们为每个创作者提供完美的解决方案。' }
  ]
})

// 响应式数据
const billingCycle = ref<'monthly' | 'yearly'>('yearly')
const openFaqs = ref<number[]>([])

// 功能对比数据
const features = ref([
  { name: '无限下载音乐和音效', social: true, pro: true, max: true },
  { name: '社交媒体授权', social: true, pro: true, max: true },
  { name: '商业用途授权', social: false, pro: true, max: true },
  { name: '音乐分轨下载', social: false, pro: true, max: true },
  { name: '客户项目授权', social: false, pro: true, max: true },
  { name: '视频素材和模板', social: false, pro: false, max: true },
  { name: '8K 视频素材', social: false, pro: false, max: true },
  { name: 'AI 配音和图像生成', social: false, pro: false, max: true },
  { name: 'RAW/LOG 素材', social: false, pro: false, max: true },
  { name: '优先客户支持', social: false, pro: true, max: true }
])

// FAQ 数据
const faqs = ref([
  {
    question: '免费试用期有多长？',
    answer: '所有计划都提供 7 天免费试用，无需信用卡即可开始。试用期间您可以访问所有功能，体验完整的服务。'
  },
  {
    question: '可以随时取消订阅吗？',
    answer: '是的，您可以随时取消订阅。取消后，您仍然可以使用服务直到当前计费周期结束。'
  },
  {
    question: '年付和月付有什么区别？',
    answer: '年付计划比月付计划便宜约 20%，并且提供更好的价值。年付用户还可以享受优先客户支持。'
  },
  {
    question: '商业用途授权包括什么？',
    answer: '商业用途授权允许您将内容用于付费项目、客户工作、广告和全球分发。这包括所有形式的商业使用。'
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持所有主要信用卡（Visa、MasterCard、American Express）、PayPal 和银行转账。'
  },
  {
    question: '可以升级或降级计划吗？',
    answer: '是的，您可以随时升级或降级您的计划。升级立即生效，降级将在当前计费周期结束后生效。'
  }
])

// 方法
const toggleBilling = () => {
  billingCycle.value = billingCycle.value === 'monthly' ? 'yearly' : 'monthly'
}

const toggleFaq = (index: number) => {
  const faqIndex = openFaqs.value.indexOf(index)
  if (faqIndex > -1) {
    openFaqs.value.splice(faqIndex, 1)
  } else {
    openFaqs.value.push(index)
  }
}
</script>

<style scoped>
/* 自定义样式 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>
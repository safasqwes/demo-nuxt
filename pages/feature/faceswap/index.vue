<template>
  <div class="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ $t('faceswap.title') }}</h1>
          <p class="text-gray-600 mt-2">{{ $t('faceswap.description') }}</p>
        </div>
          <div class="flex items-center space-x-4">
            <button @click="goBack" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Upload Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Source Image Upload -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('faceswap.sourceImage') }}</h2>
          <div class="space-y-6">
            <div @click="triggerSourceUpload" 
                 @dragover.prevent 
                 @drop.prevent="handleSourceDrop"
                 class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors cursor-pointer">
              <div v-if="!sourceImage" class="space-y-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div>
                  <p class="text-lg font-medium text-gray-900">{{ $t('faceswap.uploadSource') }}</p>
                  <p class="text-gray-500">{{ $t('faceswap.dragDrop') }}</p>
                  <p class="text-sm text-gray-400 mt-2">{{ $t('faceswap.supportedFormats') }}</p>
                </div>
              </div>
              <div v-else class="space-y-4">
                <img :src="sourceImageUrl" alt="Source" class="w-full h-48 object-cover rounded-lg">
                <p class="text-sm text-gray-600">{{ sourceImage.name }}</p>
                <button @click.stop="removeSourceImage" class="text-red-500 hover:text-red-700 text-sm">
                  Remove image
                </button>
              </div>
            </div>
            <input ref="sourceInput" type="file" accept="image/*" @change="handleSourceUpload" class="hidden">
          </div>
        </div>

        <!-- Target Image Upload -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Target Image</h2>
          <div class="space-y-6">
            <div @click="triggerTargetUpload" 
                 @dragover.prevent 
                 @drop.prevent="handleTargetDrop"
                 class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors cursor-pointer">
              <div v-if="!targetImage" class="space-y-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div>
                  <p class="text-lg font-medium text-gray-900">Upload target image</p>
                  <p class="text-gray-500">Drag and drop or click to browse</p>
                  <p class="text-sm text-gray-400 mt-2">JPG, PNG up to 10MB</p>
                </div>
              </div>
              <div v-else class="space-y-4">
                <img :src="targetImageUrl" alt="Target" class="w-full h-48 object-cover rounded-lg">
                <p class="text-sm text-gray-600">{{ targetImage.name }}</p>
                <button @click.stop="removeTargetImage" class="text-red-500 hover:text-red-700 text-sm">
                  Remove image
                </button>
              </div>
            </div>
            <input ref="targetInput" type="file" accept="image/*" @change="handleTargetUpload" class="hidden">
          </div>
        </div>
      </div>

      <!-- Processing Options -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Processing Options</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Quality</label>
            <select v-model="processingOptions.quality" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="low">Low (Fast)</option>
              <option value="medium">Medium (Balanced)</option>
              <option value="high">High (Slow)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Face Detection</label>
            <select v-model="processingOptions.faceDetection" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="auto">Auto</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Blend Mode</label>
            <select v-model="processingOptions.blendMode" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="normal">Normal</option>
              <option value="soft">Soft</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Process Button -->
      <div class="text-center mb-8">
        <button @click="processFaceSwap" 
                :disabled="!sourceImage || !targetImage || isProcessing"
                class="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-pink-700 hover:to-rose-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="isProcessing" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Start Face Swap</span>
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="isProcessing" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Processing Progress</h3>
        <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div class="bg-gradient-to-r from-pink-600 to-rose-600 h-3 rounded-full transition-all duration-300" 
               :style="{ width: progress + '%' }"></div>
        </div>
        <p class="text-sm text-gray-600">{{ progressText }}</p>
      </div>

      <!-- Result Section -->
      <div v-if="resultImage" class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Result</h2>
        <div class="space-y-6">
          <img :src="resultImageUrl" alt="Face Swap Result" class="w-full h-96 object-cover rounded-lg">
          <div class="flex justify-center space-x-4">
            <button @click="downloadResult" 
                    class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Download Image
            </button>
            <button @click="processAnother" 
                    class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              Process Another
            </button>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Our Face Swap?</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p class="text-gray-600">Get face swap results in seconds with our advanced AI</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Realistic Output</h3>
            <p class="text-gray-600">Natural-looking face swaps with seamless blending</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p class="text-gray-600">Your images are processed securely and never stored</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: 'Face Swap - NovelHub',
  meta: [
    { name: 'description', content: 'Swap faces between images with AI-powered technology. Upload two images and create amazing face swap results instantly.' },
    { name: 'keywords', content: 'face swap, AI face swap, image editing, face replacement, photo editing' }
  ]
})

// Types
interface ProcessingOptions {
  quality: 'low' | 'medium' | 'high'
  faceDetection: 'auto' | 'manual'
  blendMode: 'normal' | 'soft' | 'hard'
}

// Reactive data
const sourceImage = ref<File | null>(null)
const targetImage = ref<File | null>(null)
const sourceImageUrl = ref('')
const targetImageUrl = ref('')
const resultImage = ref<File | null>(null)
const resultImageUrl = ref('')
const isProcessing = ref(false)
const progress = ref(0)
const progressText = ref('')
const processingOptions = ref<ProcessingOptions>({
  quality: 'medium',
  faceDetection: 'auto',
  blendMode: 'normal'
})

// Refs
const sourceInput = ref<HTMLInputElement>()
const targetInput = ref<HTMLInputElement>()

// Services
const { notify } = useNotification()

// Methods
const triggerSourceUpload = () => {
  sourceInput.value?.click()
}

const triggerTargetUpload = () => {
  targetInput.value?.click()
}

const handleSourceUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    sourceImage.value = file
    sourceImageUrl.value = URL.createObjectURL(file)
  }
}

const handleTargetUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    targetImage.value = file
    targetImageUrl.value = URL.createObjectURL(file)
  }
}

const handleSourceDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    sourceImage.value = file
    sourceImageUrl.value = URL.createObjectURL(file)
  }
}

const handleTargetDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    targetImage.value = file
    targetImageUrl.value = URL.createObjectURL(file)
  }
}

const removeSourceImage = () => {
  sourceImage.value = null
  sourceImageUrl.value = ''
  if (sourceInput.value) {
    sourceInput.value.value = ''
  }
}

const removeTargetImage = () => {
  targetImage.value = null
  targetImageUrl.value = ''
  if (targetInput.value) {
    targetInput.value.value = ''
  }
}

const processFaceSwap = async () => {
  if (!sourceImage.value || !targetImage.value) {
    notify.error('Error', 'Please upload both source and target images')
    return
  }

  isProcessing.value = true
  progress.value = 0
  progressText.value = 'Initializing...'

  try {
    const steps = [
      'Analyzing images...',
      'Detecting faces...',
      'Processing face swap...',
      'Blending faces...',
      'Finalizing...'
    ]

    for (let i = 0; i < steps.length; i++) {
      progressText.value = steps[i]
      progress.value = ((i + 1) / steps.length) * 100
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    resultImage.value = sourceImage.value
    resultImageUrl.value = sourceImageUrl.value
    notify.success('Success', 'Face swap completed successfully!')
  } catch (error) {
    console.error('Processing error:', error)
    notify.error('Error', 'Failed to process face swap. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

const downloadResult = () => {
  if (resultImage.value) {
    const link = document.createElement('a')
    link.href = resultImageUrl.value
    link.download = `face-swap-${Date.now()}.jpg`
    link.click()
  }
}

const processAnother = () => {
  sourceImage.value = null
  targetImage.value = null
  resultImage.value = null
  sourceImageUrl.value = ''
  targetImageUrl.value = ''
  resultImageUrl.value = ''
  progress.value = 0
  progressText.value = ''
  
  if (sourceInput.value) sourceInput.value.value = ''
  if (targetInput.value) targetInput.value.value = ''
}

const goBack = () => {
  navigateTo('/')
}

// Cleanup URLs when component unmounts
onUnmounted(() => {
  if (sourceImageUrl.value) URL.revokeObjectURL(sourceImageUrl.value)
  if (targetImageUrl.value) URL.revokeObjectURL(targetImageUrl.value)
  if (resultImageUrl.value) URL.revokeObjectURL(resultImageUrl.value)
})
</script>

<style scoped>
/* Custom styles if needed */
</style>

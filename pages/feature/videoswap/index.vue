<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ $t('videoswap.title') }}</h1>
            <p class="text-gray-600 mt-2">{{ $t('videoswap.description') }}</p>
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
        <!-- Video Upload -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('videoswap.sourceVideo') }}</h2>
          <div class="space-y-6">
            <!-- Video Upload Area -->
            <div @click="triggerVideoUpload" 
                 @dragover.prevent 
                 @drop.prevent="handleVideoDrop"
                 class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
              <div v-if="!sourceVideo" class="space-y-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div>
                  <p class="text-lg font-medium text-gray-900">{{ $t('videoswap.uploadVideo') }}</p>
                  <p class="text-gray-500">{{ $t('videoswap.dragDropOrClick') }}</p>
                  <p class="text-sm text-gray-400 mt-2">{{ $t('videoswap.supportedVideoFormats') }}</p>
                </div>
              </div>
              <div v-else class="space-y-4">
                <video :src="sourceVideoUrl" controls class="w-full h-48 object-cover rounded-lg"></video>
                <p class="text-sm text-gray-600">{{ sourceVideo.name }}</p>
                <button @click.stop="removeSourceVideo" class="text-red-500 hover:text-red-700 text-sm">
                  {{ $t('videoswap.removeVideo') }}
                </button>
              </div>
            </div>
            <input ref="videoInput" type="file" accept="video/*" @change="handleVideoUpload" class="hidden">
          </div>
        </div>

        <!-- Face Image Upload -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('videoswap.targetFace') }}</h2>
          <div class="space-y-6">
            <!-- Face Image Upload Area -->
            <div @click="triggerFaceUpload" 
                 @dragover.prevent 
                 @drop.prevent="handleFaceDrop"
                 class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
              <div v-if="!targetFace" class="space-y-4">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div>
                  <p class="text-lg font-medium text-gray-900">{{ $t('videoswap.uploadFace') }}</p>
                  <p class="text-gray-500">{{ $t('videoswap.dragDropOrClick') }}</p>
                  <p class="text-sm text-gray-400 mt-2">{{ $t('videoswap.supportedImageFormats') }}</p>
                </div>
              </div>
              <div v-else class="space-y-4">
                <img :src="targetFaceUrl" alt="Target face" class="w-32 h-32 object-cover rounded-lg mx-auto">
                <p class="text-sm text-gray-600">{{ targetFace.name }}</p>
                <button @click.stop="removeTargetFace" class="text-red-500 hover:text-red-700 text-sm">
                  {{ $t('videoswap.removeImage') }}
                </button>
              </div>
            </div>
            <input ref="faceInput" type="file" accept="image/*" @change="handleFaceUpload" class="hidden">
          </div>
        </div>
      </div>

      <!-- Processing Options -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('videoswap.processingOptions') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('videoswap.quality') }}</label>
            <select v-model="processingOptions.quality" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="low">{{ $t('videoswap.qualityLow') }}</option>
              <option value="medium">{{ $t('videoswap.qualityMedium') }}</option>
              <option value="high">{{ $t('videoswap.qualityHigh') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('videoswap.faceDetection') }}</label>
            <select v-model="processingOptions.faceDetection" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="auto">{{ $t('videoswap.faceDetectionAuto') }}</option>
              <option value="manual">{{ $t('videoswap.faceDetectionManual') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ $t('videoswap.outputFormat') }}</label>
            <select v-model="processingOptions.outputFormat" class="w-full border border-gray-300 rounded-lg px-3 py-2">
              <option value="mp4">{{ $t('videoswap.outputFormatMp4') }}</option>
              <option value="mov">{{ $t('videoswap.outputFormatMov') }}</option>
              <option value="avi">{{ $t('videoswap.outputFormatAvi') }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Process Button -->
      <div class="text-center mb-8">
        <button @click="processVideo" 
                :disabled="!sourceVideo || !targetFace || isProcessing"
                class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="isProcessing" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('videoswap.processing') }}
          </span>
          <span v-else>{{ $t('videoswap.startFaceSwap') }}</span>
        </button>
      </div>

      <!-- Progress Bar -->
      <div v-if="isProcessing" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ $t('videoswap.processingProgress') }}</h3>
        <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div class="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-300" 
               :style="{ width: progress + '%' }"></div>
        </div>
        <p class="text-sm text-gray-600">{{ progressText }}</p>
      </div>

      <!-- Result Section -->
      <div v-if="resultVideo" class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('videoswap.result') }}</h2>
        <div class="space-y-6">
          <video :src="resultVideoUrl" controls class="w-full h-96 object-cover rounded-lg"></video>
          <div class="flex justify-center space-x-4">
            <button @click="downloadResult" 
                    class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              {{ $t('videoswap.downloadVideo') }}
            </button>
            <button @click="processAnother" 
                    class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
              {{ $t('videoswap.processAnother') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">{{ $t('videoswap.whyChoose') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('videoswap.lightningFast') }}</h3>
            <p class="text-gray-600">{{ $t('videoswap.lightningFastDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('videoswap.highQuality') }}</h3>
            <p class="text-gray-600">{{ $t('videoswap.highQualityDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ $t('videoswap.securePrivate') }}</h3>
            <p class="text-gray-600">{{ $t('videoswap.securePrivateDesc') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: () => $t('videoswap.seo.title'),
  meta: [
    {
      name: 'description',
      content: () => $t('videoswap.seo.description'),
    },
    {
      name: 'keywords',
      content: () => $t('videoswap.seo.keywords'),
    },
  ]
})

// Types
interface ProcessingOptions {
  quality: 'low' | 'medium' | 'high'
  faceDetection: 'auto' | 'manual'
  outputFormat: 'mp4' | 'mov' | 'avi'
}

// Reactive data
const sourceVideo = ref<File | null>(null)
const targetFace = ref<File | null>(null)
const sourceVideoUrl = ref('')
const targetFaceUrl = ref('')
const resultVideo = ref<File | null>(null)
const resultVideoUrl = ref('')
const isProcessing = ref(false)
const progress = ref(0)
const progressText = ref('')
const processingOptions = ref<ProcessingOptions>({
  quality: 'medium',
  faceDetection: 'auto',
  outputFormat: 'mp4'
})

// Refs
const videoInput = ref<HTMLInputElement>()
const faceInput = ref<HTMLInputElement>()

// Services
const { notify } = useNotification()

// Methods
const triggerVideoUpload = () => {
  videoInput.value?.click()
}

const triggerFaceUpload = () => {
  faceInput.value?.click()
}

const handleVideoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    sourceVideo.value = file
    sourceVideoUrl.value = URL.createObjectURL(file)
  }
}

const handleFaceUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    targetFace.value = file
    targetFaceUrl.value = URL.createObjectURL(file)
  }
}

const handleVideoDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('video/')) {
    sourceVideo.value = file
    sourceVideoUrl.value = URL.createObjectURL(file)
  }
}

const handleFaceDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    targetFace.value = file
    targetFaceUrl.value = URL.createObjectURL(file)
  }
}

const removeSourceVideo = () => {
  sourceVideo.value = null
  sourceVideoUrl.value = ''
  if (videoInput.value) {
    videoInput.value.value = ''
  }
}

const removeTargetFace = () => {
  targetFace.value = null
  targetFaceUrl.value = ''
  if (faceInput.value) {
    faceInput.value.value = ''
  }
}

const processVideo = async () => {
  if (!sourceVideo.value || !targetFace.value) {
    notify.error('Error', $t('videoswap.messages.uploadBothFiles'))
    return
  }

  isProcessing.value = true
  progress.value = 0
  progressText.value = $t('videoswap.processingSteps.initializing')

  try {
    // Simulate processing steps
    const steps = [
      $t('videoswap.processingSteps.analyzing'),
      $t('videoswap.processingSteps.detecting'),
      $t('videoswap.processingSteps.processing'),
      $t('videoswap.processingSteps.rendering'),
      $t('videoswap.processingSteps.finalizing')
    ]

    for (let i = 0; i < steps.length; i++) {
      progressText.value = steps[i]
      progress.value = ((i + 1) / steps.length) * 100
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Simulate successful processing
    resultVideo.value = sourceVideo.value // In real implementation, this would be the processed video
    resultVideoUrl.value = sourceVideoUrl.value
    notify.success('Success', $t('videoswap.messages.processingSuccess'))
  } catch (error) {
    console.error('Processing error:', error)
    notify.error('Error', $t('videoswap.messages.processingError'))
  } finally {
    isProcessing.value = false
  }
}

const downloadResult = () => {
  if (resultVideo.value) {
    const link = document.createElement('a')
    link.href = resultVideoUrl.value
    link.download = `face-swapped-${Date.now()}.${processingOptions.value.outputFormat}`
    link.click()
  }
}

const processAnother = () => {
  sourceVideo.value = null
  targetFace.value = null
  resultVideo.value = null
  sourceVideoUrl.value = ''
  targetFaceUrl.value = ''
  resultVideoUrl.value = ''
  progress.value = 0
  progressText.value = ''
  
  if (videoInput.value) videoInput.value.value = ''
  if (faceInput.value) faceInput.value.value = ''
}

const goBack = () => {
  navigateTo('/')
}

// Cleanup URLs when component unmounts
onUnmounted(() => {
  if (sourceVideoUrl.value) URL.revokeObjectURL(sourceVideoUrl.value)
  if (targetFaceUrl.value) URL.revokeObjectURL(targetFaceUrl.value)
  if (resultVideoUrl.value) URL.revokeObjectURL(resultVideoUrl.value)
})
</script>

<style scoped>
/* Custom styles if needed */
</style>

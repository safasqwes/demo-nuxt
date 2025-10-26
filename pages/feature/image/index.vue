<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">AI Image Processing</h1>
            <p class="text-gray-600 mt-2">Transform your images with powerful AI-powered tools</p>
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
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Upload Image</h2>
        <div @click="triggerImageUpload" 
             @dragover.prevent 
             @drop.prevent="handleImageDrop"
             class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer">
          <div v-if="!uploadedImage" class="space-y-4">
            <svg class="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div>
              <p class="text-xl font-medium text-gray-900">Upload your image</p>
              <p class="text-gray-500">Drag and drop or click to browse</p>
              <p class="text-sm text-gray-400 mt-2">JPG, PNG, WEBP up to 20MB</p>
            </div>
          </div>
          <div v-else class="space-y-4">
            <img :src="uploadedImageUrl" alt="Uploaded" class="w-full max-w-md h-64 object-cover rounded-lg mx-auto">
            <p class="text-sm text-gray-600">{{ uploadedImage.name }}</p>
            <button @click.stop="removeImage" class="text-red-500 hover:text-red-700 text-sm">
              Remove image
            </button>
          </div>
        </div>
        <input ref="imageInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden">
      </div>

      <!-- Processing Tools -->
      <div v-if="uploadedImage" class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Image Preview -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-4">Image Preview</h3>
            <div class="relative">
              <img :src="processedImageUrl || uploadedImageUrl" alt="Preview" class="w-full h-96 object-contain rounded-lg">
              <div v-if="isProcessing" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div class="text-white text-center">
                  <svg class="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>{{ processingText }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Processing Options -->
        <div class="space-y-6">
          <!-- Enhancement Tools -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Enhancement</h3>
            <div class="space-y-4">
              <button @click="enhanceImage" 
                      :disabled="isProcessing"
                      class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                Auto Enhance
              </button>
              <button @click="upscaleImage" 
                      :disabled="isProcessing"
                      class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                Upscale 2x
              </button>
              <button @click="removeBackground" 
                      :disabled="isProcessing"
                      class="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                Remove Background
              </button>
            </div>
          </div>

          <!-- Style Transfer -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Style Transfer</h3>
            <div class="space-y-4">
              <button @click="applyStyle('anime')" 
                      :disabled="isProcessing"
                      class="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50">
                Anime Style
              </button>
              <button @click="applyStyle('oil_painting')" 
                      :disabled="isProcessing"
                      class="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50">
                Oil Painting
              </button>
              <button @click="applyStyle('sketch')" 
                      :disabled="isProcessing"
                      class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
                Sketch Style
              </button>
            </div>
          </div>

          <!-- Filters -->
          <div class="bg-white rounded-2xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
            <div class="space-y-4">
              <button @click="applyFilter('vintage')" 
                      :disabled="isProcessing"
                      class="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50">
                Vintage
              </button>
              <button @click="applyFilter('black_white')" 
                      :disabled="isProcessing"
                      class="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
                Black & White
              </button>
              <button @click="applyFilter('sepia')" 
                      :disabled="isProcessing"
                      class="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50">
                Sepia
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Actions -->
      <div v-if="processedImage" class="bg-white rounded-2xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Processed Image</h2>
        <div class="flex justify-center space-x-4">
          <button @click="downloadProcessed" 
                  class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Download Result
          </button>
          <button @click="resetImage" 
                  class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
            Reset to Original
          </button>
          <button @click="processNew" 
                  class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Process New Image
          </button>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Powerful AI Image Tools</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Auto Enhance</h3>
            <p class="text-gray-600 text-sm">Automatically improve brightness, contrast, and colors</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Upscaling</h3>
            <p class="text-gray-600 text-sm">Increase image resolution with AI upscaling</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Style Transfer</h3>
            <p class="text-gray-600 text-sm">Apply artistic styles to your images</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Smart Filters</h3>
            <p class="text-gray-600 text-sm">Apply professional-grade filters and effects</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: 'AI Image Processing - NovelHub',
  meta: [
    { name: 'description', content: 'Transform your images with powerful AI-powered tools. Enhance, upscale, style transfer, and apply filters to your photos.' },
    { name: 'keywords', content: 'AI image processing, image enhancement, upscaling, style transfer, photo editing, filters' }
  ]
})

// Reactive data
const uploadedImage = ref<File | null>(null)
const uploadedImageUrl = ref('')
const processedImage = ref<File | null>(null)
const processedImageUrl = ref('')
const isProcessing = ref(false)
const processingText = ref('')

// Refs
const imageInput = ref<HTMLInputElement>()

// Services
const { notify } = useNotification()

// Methods
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadedImage.value = file
    uploadedImageUrl.value = URL.createObjectURL(file)
    processedImage.value = null
    processedImageUrl.value = ''
  }
}

const handleImageDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    uploadedImage.value = file
    uploadedImageUrl.value = URL.createObjectURL(file)
    processedImage.value = null
    processedImageUrl.value = ''
  }
}

const removeImage = () => {
  uploadedImage.value = null
  processedImage.value = null
  uploadedImageUrl.value = ''
  processedImageUrl.value = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const simulateProcessing = async (text: string, duration: number = 2000) => {
  isProcessing.value = true
  processingText.value = text
  await new Promise(resolve => setTimeout(resolve, duration))
  isProcessing.value = false
}

const enhanceImage = async () => {
  await simulateProcessing('Enhancing image...', 3000)
  processedImage.value = uploadedImage.value
  processedImageUrl.value = uploadedImageUrl.value
  notify.success('Success', 'Image enhanced successfully!')
}

const upscaleImage = async () => {
  await simulateProcessing('Upscaling image...', 4000)
  processedImage.value = uploadedImage.value
  processedImageUrl.value = uploadedImageUrl.value
  notify.success('Success', 'Image upscaled successfully!')
}

const removeBackground = async () => {
  await simulateProcessing('Removing background...', 3500)
  processedImage.value = uploadedImage.value
  processedImageUrl.value = uploadedImageUrl.value
  notify.success('Success', 'Background removed successfully!')
}

const applyStyle = async (style: string) => {
  await simulateProcessing(`Applying ${style} style...`, 3000)
  processedImage.value = uploadedImage.value
  processedImageUrl.value = uploadedImageUrl.value
  notify.success('Success', `${style} style applied successfully!`)
}

const applyFilter = async (filter: string) => {
  await simulateProcessing(`Applying ${filter} filter...`, 2000)
  processedImage.value = uploadedImage.value
  processedImageUrl.value = uploadedImageUrl.value
  notify.success('Success', `${filter} filter applied successfully!`)
}

const downloadProcessed = () => {
  if (processedImage.value) {
    const link = document.createElement('a')
    link.href = processedImageUrl.value
    link.download = `processed-${Date.now()}.jpg`
    link.click()
  }
}

const resetImage = () => {
  processedImage.value = null
  processedImageUrl.value = ''
}

const processNew = () => {
  uploadedImage.value = null
  processedImage.value = null
  uploadedImageUrl.value = ''
  processedImageUrl.value = ''
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const goBack = () => {
  navigateTo('/')
}

// Cleanup URLs when component unmounts
onUnmounted(() => {
  if (uploadedImageUrl.value) URL.revokeObjectURL(uploadedImageUrl.value)
  if (processedImageUrl.value) URL.revokeObjectURL(processedImageUrl.value)
})
</script>

<style scoped>
/* Custom styles if needed */
</style>

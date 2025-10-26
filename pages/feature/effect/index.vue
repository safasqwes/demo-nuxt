<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">AI Effects Studio</h1>
            <p class="text-gray-600 mt-2">Create stunning visual effects with AI-powered tools</p>
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
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Upload Media</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Image Upload -->
          <div @click="triggerImageUpload" 
               @dragover.prevent 
               @drop.prevent="handleImageDrop"
               class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
            <div v-if="!uploadedImage" class="space-y-4">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div>
                <p class="text-lg font-medium text-gray-900">Upload Image</p>
                <p class="text-gray-500">JPG, PNG up to 10MB</p>
              </div>
            </div>
            <div v-else class="space-y-4">
              <img :src="uploadedImageUrl" alt="Uploaded" class="w-full h-32 object-cover rounded-lg">
              <p class="text-sm text-gray-600">{{ uploadedImage.name }}</p>
            </div>
          </div>

          <!-- Video Upload -->
          <div @click="triggerVideoUpload" 
               @dragover.prevent 
               @drop.prevent="handleVideoDrop"
               class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
            <div v-if="!uploadedVideo" class="space-y-4">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M15 10l4 4m0 0l4-4m-4 4v12m-4-4h8m-8 0V6a2 2 0 012-2h4a2 2 0 012 2v4m-8 0h8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div>
                <p class="text-lg font-medium text-gray-900">Upload Video</p>
                <p class="text-gray-500">MP4, MOV up to 100MB</p>
              </div>
            </div>
            <div v-else class="space-y-4">
              <video :src="uploadedVideoUrl" controls class="w-full h-32 object-cover rounded-lg"></video>
              <p class="text-sm text-gray-600">{{ uploadedVideo.name }}</p>
            </div>
          </div>
        </div>
        <input ref="imageInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden">
        <input ref="videoInput" type="file" accept="video/*" @change="handleVideoUpload" class="hidden">
      </div>

      <!-- Effects Categories -->
      <div v-if="uploadedImage || uploadedVideo" class="space-y-8">
        <!-- Visual Effects -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Visual Effects</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button @click="applyEffect('fire')" 
                    :disabled="isProcessing"
                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-red-400 transition-colors disabled:opacity-50">
              <div class="text-center">
                <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
                <p class="text-sm font-medium">Fire</p>
              </div>
            </button>
            <button @click="applyEffect('smoke')" 
                    :disabled="isProcessing"
                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50">
              <div class="text-center">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
                <p class="text-sm font-medium">Smoke</p>
              </div>
            </button>
            <button @click="applyEffect('lightning')" 
                    :disabled="isProcessing"
                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-400 transition-colors disabled:opacity-50">
              <div class="text-center">
                <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
                <p class="text-sm font-medium">Lightning</p>
              </div>
            </button>
            <button @click="applyEffect('rain')" 
                    :disabled="isProcessing"
                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition-colors disabled:opacity-50">
              <div class="text-center">
                <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
                <p class="text-sm font-medium">Rain</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Artistic Effects -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Artistic Effects</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button @click="applyEffect('neon')" 
                    :disabled="isProcessing"
                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-cyan-400 transition-colors disabled:opacity-50">
              <div class="text-center">
                <div class="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
                <p class="text-sm font-medium">Neon Glow</p>
              </div>
            </button>
            <button @click="applyEffect('hologram')" 
                    :disabled="isProcessing"
                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-400 transition-colors disabled:opacity-50">
              <div class="text-center">
                <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
                <p class="text-sm font-medium">Hologram</p>
              </div>
            </button>
            <button @click="applyEffect('glitch')" 
                    :disabled="isProcessing"
                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-pink-400 transition-colors disabled:opacity-50">
              <div class="text-center">
                <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
                <p class="text-sm font-medium">Glitch</p>
              </div>
            </button>
            <button @click="applyEffect('vaporwave')" 
                    :disabled="isProcessing"
                    class="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-400 transition-colors disabled:opacity-50">
              <div class="text-center">
                <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg class="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
                  </svg>
                </div>
                <p class="text-sm font-medium">Vaporwave</p>
              </div>
            </button>
          </div>
        </div>

        <!-- Preview and Controls -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Preview</h2>
          <div class="space-y-6">
            <div class="relative">
              <img v-if="uploadedImage" 
                   :src="processedImageUrl || uploadedImageUrl" 
                   alt="Preview" 
                   class="w-full h-96 object-contain rounded-lg">
              <video v-if="uploadedVideo" 
                     :src="processedVideoUrl || uploadedVideoUrl" 
                     controls 
                     class="w-full h-96 object-contain rounded-lg">
              </video>
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

            <!-- Effect Controls -->
            <div v-if="currentEffect" class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Effect Controls</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Intensity</label>
                  <input v-model="effectSettings.intensity" 
                         type="range" 
                         min="0" 
                         max="100" 
                         class="w-full">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                  <input v-model="effectSettings.speed" 
                         type="range" 
                         min="0" 
                         max="100" 
                         class="w-full">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <input v-model="effectSettings.color" 
                         type="color" 
                         class="w-full h-10 rounded">
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center space-x-4">
              <button @click="downloadResult" 
                      :disabled="!processedImage && !processedVideo"
                      class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50">
                Download Result
              </button>
              <button @click="resetEffect" 
                      class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors">
                Reset Effect
              </button>
              <button @click="processNew" 
                      class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Upload New Media
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Professional Effects Studio</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Real-time Processing</h3>
            <p class="text-gray-600">See effects applied instantly with real-time preview</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Professional Quality</h3>
            <p class="text-gray-600">Cinema-grade effects for your creative projects</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
            <p class="text-gray-600">Intuitive interface for creators of all skill levels</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: 'AI Effects Studio - NovelHub',
  meta: [
    { name: 'description', content: 'Create stunning visual effects with AI-powered tools. Apply fire, smoke, lightning, neon glow, and more to your images and videos.' },
    { name: 'keywords', content: 'AI effects, visual effects, video effects, image effects, special effects, VFX' }
  ]
})

// Types
interface EffectSettings {
  intensity: number
  speed: number
  color: string
}

// Reactive data
const uploadedImage = ref<File | null>(null)
const uploadedVideo = ref<File | null>(null)
const uploadedImageUrl = ref('')
const uploadedVideoUrl = ref('')
const processedImage = ref<File | null>(null)
const processedVideo = ref<File | null>(null)
const processedImageUrl = ref('')
const processedVideoUrl = ref('')
const isProcessing = ref(false)
const processingText = ref('')
const currentEffect = ref<string | null>(null)
const effectSettings = ref<EffectSettings>({
  intensity: 50,
  speed: 50,
  color: '#ff0000'
})

// Refs
const imageInput = ref<HTMLInputElement>()
const videoInput = ref<HTMLInputElement>()

// Services
const { notify } = useNotification()

// Methods
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const triggerVideoUpload = () => {
  videoInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadedImage.value = file
    uploadedVideo.value = null
    uploadedImageUrl.value = URL.createObjectURL(file)
    uploadedVideoUrl.value = ''
    resetEffect()
  }
}

const handleVideoUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadedVideo.value = file
    uploadedImage.value = null
    uploadedVideoUrl.value = URL.createObjectURL(file)
    uploadedImageUrl.value = ''
    resetEffect()
  }
}

const handleImageDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    uploadedImage.value = file
    uploadedVideo.value = null
    uploadedImageUrl.value = URL.createObjectURL(file)
    uploadedVideoUrl.value = ''
    resetEffect()
  }
}

const handleVideoDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('video/')) {
    uploadedVideo.value = file
    uploadedImage.value = null
    uploadedVideoUrl.value = URL.createObjectURL(file)
    uploadedImageUrl.value = ''
    resetEffect()
  }
}

const applyEffect = async (effect: string) => {
  if (!uploadedImage.value && !uploadedVideo.value) {
    notify.error('Error', 'Please upload an image or video first')
    return
  }

  currentEffect.value = effect
  isProcessing.value = true
  processingText.value = `Applying ${effect} effect...`

  try {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 3000))

    if (uploadedImage.value) {
      processedImage.value = uploadedImage.value
      processedImageUrl.value = uploadedImageUrl.value
    }
    if (uploadedVideo.value) {
      processedVideo.value = uploadedVideo.value
      processedVideoUrl.value = uploadedVideoUrl.value
    }

    notify.success('Success', `${effect} effect applied successfully!`)
  } catch (error) {
    console.error('Effect processing error:', error)
    notify.error('Error', 'Failed to apply effect. Please try again.')
  } finally {
    isProcessing.value = false
  }
}

const downloadResult = () => {
  if (processedImage.value) {
    const link = document.createElement('a')
    link.href = processedImageUrl.value
    link.download = `effect-${currentEffect.value}-${Date.now()}.jpg`
    link.click()
  } else if (processedVideo.value) {
    const link = document.createElement('a')
    link.href = processedVideoUrl.value
    link.download = `effect-${currentEffect.value}-${Date.now()}.mp4`
    link.click()
  }
}

const resetEffect = () => {
  currentEffect.value = null
  processedImage.value = null
  processedVideo.value = null
  processedImageUrl.value = ''
  processedVideoUrl.value = ''
  effectSettings.value = {
    intensity: 50,
    speed: 50,
    color: '#ff0000'
  }
}

const processNew = () => {
  uploadedImage.value = null
  uploadedVideo.value = null
  uploadedImageUrl.value = ''
  uploadedVideoUrl.value = ''
  processedImage.value = null
  processedVideo.value = null
  processedImageUrl.value = ''
  processedVideoUrl.value = ''
  resetEffect()
  
  if (imageInput.value) imageInput.value.value = ''
  if (videoInput.value) videoInput.value.value = ''
}

const goBack = () => {
  navigateTo('/')
}

// Cleanup URLs when component unmounts
onUnmounted(() => {
  if (uploadedImageUrl.value) URL.revokeObjectURL(uploadedImageUrl.value)
  if (uploadedVideoUrl.value) URL.revokeObjectURL(uploadedVideoUrl.value)
  if (processedImageUrl.value) URL.revokeObjectURL(processedImageUrl.value)
  if (processedVideoUrl.value) URL.revokeObjectURL(processedVideoUrl.value)
})
</script>

<style scoped>
/* Custom styles if needed */
</style>

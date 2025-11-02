<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Nano Banana - AI Image Generation & Editing</h1>
            <p class="text-gray-600 mt-2">Generate and edit images using Google's Nano Banana model</p>
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
      <!-- Input Section -->
      <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Generate or Edit Image</h2>
        
        <!-- Prompt Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Prompt <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="prompt"
            rows="4"
            placeholder="Describe the image you want to generate or the edits you want to make..."
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          <p class="mt-2 text-sm text-gray-500">
            Be specific and detailed for better results. Example: "A beautiful sunset over a mountain landscape with vibrant colors"
          </p>
        </div>

        <!-- Image Upload (Optional - up to 3 images) -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Input Images (Optional - for editing/fusion, up to 3 images)
          </label>
          <div @click="triggerImageUpload" 
               @dragover.prevent 
               @drop.prevent="handleImageDrop"
               class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
            <div v-if="inputImages.length === 0" class="space-y-4">
              <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900">Upload images</p>
                <p class="text-sm text-gray-500">Drag and drop or click to browse</p>
                <p class="text-xs text-gray-400 mt-1">JPG, PNG, WEBP up to 10MB each (max 3 images)</p>
              </div>
            </div>
            <div v-else class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div v-for="(image, index) in inputImages" :key="index" class="relative">
                  <img :src="imageUrls[index]" alt="Input" class="w-full h-48 object-contain rounded-lg border border-gray-200">
                  <button 
                    @click.stop="removeImage(index)" 
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    ×
                  </button>
                  <p class="text-xs text-gray-600 mt-1 truncate">{{ image.name }}</p>
                </div>
              </div>
              <div v-if="inputImages.length < 3" class="text-center">
                <button @click.stop="triggerImageUpload" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  + Add another image ({{ 3 - inputImages.length }} remaining)
                </button>
              </div>
              <div v-else class="text-center text-sm text-gray-500">
                Maximum 3 images reached
              </div>
            </div>
          </div>
          <input ref="imageInput" type="file" accept="image/*" multiple @change="handleImageUpload" class="hidden">
        </div>

        <!-- Aspect Ratio -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Aspect Ratio (Optional)
          </label>
          <select v-model="aspectRatio" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">Default (1:1)</option>
            <option value="16:9">16:9 (Landscape)</option>
            <option value="9:16">9:16 (Portrait)</option>
            <option value="4:3">4:3 (Standard)</option>
            <option value="3:4">3:4 (Portrait Standard)</option>
          </select>
        </div>

        <!-- Generate Button -->
        <button
          @click="generateImage"
          :disabled="isGenerating || !prompt.trim()"
          class="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <svg v-if="isGenerating" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isGenerating ? 'Generating...' : 'Generate Image' }}</span>
        </button>
      </div>

      <!-- Result Section -->
      <div v-if="generatedImageUrl || errorMessage" class="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">
          {{ generatedImageUrl ? 'Generated Image' : 'Error' }}
        </h2>
        
        <div v-if="generatedImageUrl" class="space-y-6">
          <div class="relative">
            <img :src="generatedImageUrl" alt="Generated" class="w-full max-w-4xl mx-auto rounded-lg shadow-lg">
            <div v-if="isGenerating" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div class="text-white text-center">
                <svg class="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Processing image...</p>
              </div>
            </div>
          </div>
          
          <div class="flex justify-center space-x-4">
            <button
              @click="downloadImage"
              class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Download Image
            </button>
            <button
              @click="useAsInput"
              :disabled="!inputImage"
              class="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Use as Input Image
            </button>
            <button
              @click="clearResult"
              class="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Clear Result
            </button>
          </div>
        </div>
        
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-800">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Nano Banana Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Image Generation</h3>
            <p class="text-gray-600 text-sm">Generate high-quality images from text descriptions</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Image Editing</h3>
            <p class="text-gray-600 text-sm">Edit existing images using natural language prompts</p>
          </div>
          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Consistent Characters</h3>
            <p class="text-gray-600 text-sm">Maintain character consistency across multiple images</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useHead({
  title: 'Nano Banana - AI Image Generation & Editing - NovelHub',
  meta: [
    { name: 'description', content: 'Generate and edit images using Google\'s Nano Banana model. Create high-quality images from text descriptions or edit existing images with natural language prompts.' },
    { name: 'keywords', content: 'nano banana, AI image generation, image editing, Google Gemini, AI images, image creation' }
  ]
})

// Import HTTP client
import { http } from '~/utils/http'
import { useNotification } from '~/utils/useNotification'

// Reactive data
const prompt = ref('')
const inputImages = ref<File[]>([])
const imageUrls = ref<string[]>([])
const generatedImageUrl = ref('')
const errorMessage = ref('')
const isGenerating = ref(false)
const aspectRatio = ref('')
const predictionId = ref('')

// Refs
const imageInput = ref<HTMLInputElement>()

// Services
const { notify } = useNotification()

// Methods
const triggerImageUpload = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (files && files.length > 0) {
    addImages(Array.from(files))
  }
}

const handleImageDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    addImages(Array.from(files))
  }
}

const addImages = (files: File[]) => {
  const remainingSlots = 3 - inputImages.value.length
  if (remainingSlots <= 0) {
    notify.warning('Warning', 'Maximum 3 images allowed')
    return
  }

  const imageFiles = files.filter(file => file.type.startsWith('image/'))
  const filesToAdd = imageFiles.slice(0, remainingSlots)

  if (filesToAdd.length < imageFiles.length) {
    notify.warning('Warning', `Only ${remainingSlots} image slot${remainingSlots > 1 ? 's' : ''} remaining. Added ${filesToAdd.length} image(s).`)
  }

  filesToAdd.forEach(file => {
    inputImages.value.push(file)
    imageUrls.value.push(URL.createObjectURL(file))
  })

  // Reset input to allow selecting the same file again
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

const removeImage = (index: number) => {
  // Revoke object URL to free memory
  if (imageUrls.value[index]) {
    URL.revokeObjectURL(imageUrls.value[index])
  }
  inputImages.value.splice(index, 1)
  imageUrls.value.splice(index, 1)
}

const uploadImageToServer = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await http.post<any>('/api/business/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    if (response.code === 200 && response.data && response.data.url) {
      return response.data.url as string
    } else {
      console.error('Image upload failed:', response.message)
      notify.error('Error', response.message || 'Failed to upload image')
      return null
    }
  } catch (error: any) {
    console.error('Error uploading image:', error)
    notify.error('Error', error.message || 'Failed to upload image')
    return null
  }
}

const generateImage = async () => {
  if (!prompt.value.trim()) {
    notify.error('Error', 'Please enter a prompt')
    return
  }

  isGenerating.value = true
  errorMessage.value = ''
  generatedImageUrl.value = ''

  try {
    // Prepare request data
    const requestData: any = {
      prompt: prompt.value.trim()
    }

    // Add image URLs if provided
    if (inputImages.value.length > 0) {
      // Upload images to image hosting service (ImgBB)
      notify.info('Info', 'Uploading images to image hosting service...')
      const imageUrlArray: string[] = []
      
      for (const file of inputImages.value) {
        const imageUrl = await uploadImageToServer(file)
        if (imageUrl) {
          imageUrlArray.push(imageUrl)
        } else {
          // If upload fails, skip this image
          notify.warning('Warning', `Failed to upload image: ${file.name}. Skipping...`)
        }
      }
      
      if (imageUrlArray.length > 0) {
        // Use image_input parameter (array format) for all cases
        requestData.imageUrls = imageUrlArray
      } else {
        errorMessage.value = 'Failed to upload any images'
        notify.error('Error', 'Failed to upload images. Please try again.')
        return
      }
    }

    // Add aspect ratio if provided
    if (aspectRatio.value) {
      requestData.aspectRatio = aspectRatio.value
    }

    // Call API
    const response = await http.post<any>('/api/business/nano-banana', requestData)

    if (response.code === 200 && response.data) {
      if (response.data.imageUrl) {
        generatedImageUrl.value = response.data.imageUrl
        predictionId.value = response.data.predictionId || ''
        notify.success('Success', 'Image generated successfully!')
      } else {
        // If no image URL but we have a prediction ID, poll for result
        if (response.data.predictionId) {
          predictionId.value = response.data.predictionId
          await pollPredictionStatus()
        } else {
          errorMessage.value = 'Image generation failed: No image URL or prediction ID returned'
        }
      }
    } else {
      errorMessage.value = response.message || 'Image generation failed'
      notify.error('Error', errorMessage.value)
    }
  } catch (error: any) {
    console.error('Error generating image:', error)
    errorMessage.value = error.message || 'Failed to generate image'
    notify.error('Error', errorMessage.value)
  } finally {
    isGenerating.value = false
  }
}

const pollPredictionStatus = async () => {
  if (!predictionId.value) return

  const maxAttempts = 150 // 5 minutes max (150 * 2 seconds)
  let attempts = 0

  while (attempts < maxAttempts && isGenerating.value) {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Wait 2 seconds

      const response = await http.get<any>(`/api/business/nano-banana/status/${predictionId.value}`)

      if (response.code === 200 && response.data) {
        const status = response.data.status

        if (status === 'succeeded' && response.data.imageUrl) {
          generatedImageUrl.value = response.data.imageUrl
          isGenerating.value = false
          notify.success('Success', 'Image generated successfully!')
          return
        } else if (status === 'failed' || status === 'canceled') {
          errorMessage.value = response.data.error || `Prediction ${status}`
          isGenerating.value = false
          notify.error('Error', errorMessage.value)
          return
        }
        // Continue polling if status is 'starting' or 'processing'
      }

      attempts++
    } catch (error: any) {
      console.error('Error polling prediction status:', error)
      if (attempts >= maxAttempts) {
        errorMessage.value = 'Timeout waiting for image generation'
        isGenerating.value = false
        notify.error('Error', 'Request timed out')
        return
      }
      attempts++
    }
  }

  if (attempts >= maxAttempts) {
    errorMessage.value = 'Timeout waiting for image generation'
    isGenerating.value = false
    notify.error('Error', 'Request timed out')
  }
}

const downloadImage = () => {
  if (generatedImageUrl.value) {
    const link = document.createElement('a')
    link.href = generatedImageUrl.value
    link.download = `nano-banana-${Date.now()}.jpg`
    link.target = '_blank'
    link.click()
  }
}

const useAsInput = () => {
  if (generatedImageUrl.value && inputImages.value.length < 3) {
    // Add generated image as input (if we have the image data)
    // This would require fetching the image and converting it to a File
    // For now, just show a message
    notify.info('Info', 'To use generated image as input, please download and upload it manually')
  }
}

const clearResult = () => {
  generatedImageUrl.value = ''
  errorMessage.value = ''
  predictionId.value = ''
}

const goBack = () => {
  navigateTo('/')
}

// Cleanup URLs when component unmounts
onUnmounted(() => {
  imageUrls.value.forEach(url => {
    if (url) URL.revokeObjectURL(url)
  })
})
</script>

<style scoped>
/* Custom styles if needed */
</style>


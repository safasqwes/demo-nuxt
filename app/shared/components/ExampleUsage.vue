<template>
  <div class="example-usage">
    <!-- Element Plus Components Examples -->
    <div class="card card-hover p-6 mb-6">
      <h3 class="text-2xl font-bold mb-4 text-gradient">Element Plus Components</h3>
      
      <!-- Button Examples -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">Buttons</h4>
        <div class="flex flex-wrap gap-3">
          <el-button type="primary">Primary</el-button>
          <el-button type="success">Success</el-button>
          <el-button type="info">Info</el-button>
          <el-button type="warning">Warning</el-button>
          <el-button type="danger">Danger</el-button>
          <el-button plain>Plain</el-button>
        </div>
      </div>

      <!-- Input Examples -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">Input</h4>
        <el-input
          v-model="inputValue"
          placeholder="Please input"
          class="max-w-md"
        />
      </div>

      <!-- Alert Examples -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">Alerts</h4>
        <div class="space-y-3">
          <el-alert title="Success alert" type="success" :closable="false" />
          <el-alert title="Info alert" type="info" :closable="false" />
          <el-alert title="Warning alert" type="warning" :closable="false" />
          <el-alert title="Error alert" type="error" :closable="false" />
        </div>
      </div>

      <!-- Dialog Example -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">Dialog</h4>
        <el-button type="primary" @click="dialogVisible = true">
          Open Dialog
        </el-button>
        <el-dialog v-model="dialogVisible" title="Example Dialog" width="500">
          <span>This is an example dialog using Element Plus.</span>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="dialogVisible = false">
                Confirm
              </el-button>
            </div>
          </template>
        </el-dialog>
      </div>
    </div>

    <!-- Tailwind CSS Examples -->
    <div class="card card-hover p-6 mb-6">
      <h3 class="text-2xl font-bold mb-4 text-gradient">Tailwind CSS Utilities</h3>

      <!-- Grid Example -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">Responsive Grid</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div class="bg-primary-100 dark:bg-primary-900 p-4 rounded-lg text-center">
            Column 1
          </div>
          <div class="bg-secondary-100 dark:bg-secondary-900 p-4 rounded-lg text-center">
            Column 2
          </div>
          <div class="bg-primary-100 dark:bg-primary-900 p-4 rounded-lg text-center">
            Column 3
          </div>
        </div>
      </div>

      <!-- Custom Buttons with Tailwind -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">Custom Buttons</h4>
        <div class="flex flex-wrap gap-3">
          <button class="btn btn-primary">Primary Button</button>
          <button class="btn btn-secondary">Secondary Button</button>
          <button class="btn btn-outline">Outline Button</button>
        </div>
      </div>

      <!-- Gradient Text -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">Gradient Text</h4>
        <p class="text-4xl font-bold text-gradient">Beautiful Gradient Text</p>
      </div>

      <!-- Card with Hover Effect -->
      <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">Hover Effects</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="card card-hover p-6 text-center">
            <div class="text-4xl mb-3">🎨</div>
            <h5 class="font-bold mb-2">Design</h5>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Beautiful UI components
            </p>
          </div>
          <div class="card card-hover p-6 text-center">
            <div class="text-4xl mb-3">⚡</div>
            <h5 class="font-bold mb-2">Performance</h5>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Lightning fast
            </p>
          </div>
          <div class="card card-hover p-6 text-center">
            <div class="text-4xl mb-3">🚀</div>
            <h5 class="font-bold mb-2">Modern</h5>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Latest technologies
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Combined Example -->
    <div class="card card-hover p-6">
      <h3 class="text-2xl font-bold mb-4 text-gradient">
        Element Plus + Tailwind CSS
      </h3>
      <p class="mb-4 text-gray-600 dark:text-gray-400">
        Combining Element Plus components with Tailwind CSS utilities for powerful UIs
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <el-card shadow="hover">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-bold">Card with Tailwind</span>
                <el-tag type="success">New</el-tag>
              </div>
            </template>
            <div class="space-y-3">
              <p class="text-gray-600 dark:text-gray-400">
                This card uses Element Plus Card component styled with Tailwind CSS classes.
              </p>
              <el-button type="primary" class="w-full">Learn More</el-button>
            </div>
          </el-card>
        </div>

        <div>
          <el-card shadow="hover">
            <template #header>
              <div class="flex justify-between items-center">
                <span class="font-bold">Form Example</span>
                <el-tag type="primary">Popular</el-tag>
              </div>
            </template>
            <div class="space-y-4">
              <el-input
                v-model="email"
                placeholder="Email"
                prefix-icon="Message"
              />
              <el-input
                v-model="password"
                type="password"
                placeholder="Password"
                prefix-icon="Lock"
              />
              <el-button type="primary" class="w-full">Submit</el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const inputValue = ref('')
const dialogVisible = ref(false)
const email = ref('')
const password = ref('')
</script>

<style scoped>
.example-usage {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


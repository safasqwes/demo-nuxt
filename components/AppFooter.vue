<template>
  <footer class="bg-green-900 text-green-100 py-12" role="contentinfo">
    <div class="max-w-6xl mx-auto px-5">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="mb-4">
            <h3 class="text-2xl font-bold text-white mb-2">📚 NovelHub</h3>
            <p class="text-green-200 text-sm mb-3">Creative stories, built for readers.</p>
            <p class="text-green-300 text-xs leading-relaxed">
              Our mission is to empower readers worldwide to discover amazing stories. 
              We bring opportunity to the creative writing industry through professional 
              digital content, powerful reading tools, and accessible learning resources 
              to support you in achieving your reading goals.
            </p>
          </div>
        </div>

        <!-- Products Section -->
        <div>
          <h4 class="text-white font-semibold mb-4">Products</h4>
          <ul class="space-y-2">
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Web Novels</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Light Novels</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Audio Books</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Reading Tools</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Bookmarks</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Reading History</a></li>
          </ul>
        </div>

        <!-- Company Section -->
        <div>
          <h4 class="text-white font-semibold mb-4">Company</h4>
          <ul class="space-y-2">
                  <li><NuxtLink to="/about" class="text-green-200 hover:text-white transition-colors text-sm">About Us</NuxtLink></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">NovelHub for Business</a></li>
                  <li><NuxtLink to="/pricing" class="text-green-200 hover:text-white transition-colors text-sm">Pricing</NuxtLink></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Careers</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Press</a></li>
          </ul>
        </div>

        <!-- Resources Section -->
        <div>
          <h4 class="text-white font-semibold mb-4">Resources</h4>
          <ul class="space-y-2">
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Help Center</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Community</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Blog</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Tutorials</a></li>
                  <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">API Documentation</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-green-700 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-green-300 text-sm mb-4 md:mb-0">
            © 2025 NovelHub - Your Gateway to Amazing Web Novels
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-green-300 hover:text-white transition-colors text-sm">Terms of Use</a>
            <a href="#" class="text-green-300 hover:text-white transition-colors text-sm">Privacy Policy</a>
            <a href="#" class="text-green-300 hover:text-white transition-colors text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer component for NovelHub
// Displays brand information, navigation links, and legal information
</script>

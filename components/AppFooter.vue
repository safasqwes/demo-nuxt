<template>
  <footer class="bg-green-900 text-green-100 py-12" role="contentinfo">
    <div class="max-w-6xl mx-auto px-5">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Brand Section -->
        <div class="lg:col-span-1">
          <div class="mb-4">
            <h3 class="text-2xl font-bold text-white mb-2">{{ $t('footer.brand.title') }}</h3>
            <p class="text-green-200 text-sm mb-3">{{ $t('footer.brand.subtitle') }}</p>
            <p class="text-green-300 text-xs leading-relaxed">
              {{ $t('footer.brand.description') }}
            </p>
          </div>
        </div>

        <!-- Products Section -->
        <div>
          <h4 class="text-white font-semibold mb-4">{{ $t('footer.sections.products') }}</h4>
          <ul class="space-y-2">
            <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.webNovels') }}</a></li>
            <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.lightNovels') }}</a></li>
            <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.audioBooks') }}</a></li>
          </ul>
        </div>

        <!-- Company Section -->
        <div>
          <h4 class="text-white font-semibold mb-4">{{ $t('footer.sections.company') }}</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/about" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.aboutUs') }}</NuxtLink></li>
            <li><NuxtLink to="/use-cases" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.useCases') }}</NuxtLink></li>
            <li><NuxtLink to="/pricing" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.pricing') }}</NuxtLink></li>
          </ul>
        </div>

        <!-- Resources Section -->
        <div>
          <h4 class="text-white font-semibold mb-4">{{ $t('footer.sections.resources') }}</h4>
          <ul class="space-y-2">
            <li><NuxtLink to="/contact-us" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.contactUs') }}</NuxtLink></li>
            <li><NuxtLink to="/blog" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.blog') }}</NuxtLink></li>
            <li><a href="#" class="text-green-200 hover:text-white transition-colors text-sm">{{ $t('footer.links.community') }}</a></li>
          </ul>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="border-t border-green-700 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="text-green-300 text-sm mb-4 md:mb-0">
            {{ $t('footer.copyright') }}
          </div>
          <div class="flex space-x-6">
            <NuxtLink to="/terms-of-service" class="text-green-300 hover:text-white transition-colors text-sm">{{ $t('footer.legal.termsOfService') }}</NuxtLink>
            <NuxtLink to="/privacy-policy" class="text-green-300 hover:text-white transition-colors text-sm">{{ $t('footer.legal.privacyPolicy') }}</NuxtLink>
            <a href="#" class="text-green-300 hover:text-white transition-colors text-sm">{{ $t('footer.legal.cookiePolicy') }}</a>
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

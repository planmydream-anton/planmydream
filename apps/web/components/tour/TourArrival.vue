<template>
  <section id="arrival" class="py-12 md:py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <!-- Section heading with icon -->
        <div class="flex items-center gap-3 mb-8">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <!-- Plane icon -->
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900">
            Как добраться
          </h2>
        </div>

        <!-- Content rendered from HTML/markdown -->
        <div
          class="prose prose-gray max-w-none text-gray-700 leading-relaxed
                 prose-headings:font-bold prose-headings:text-gray-900
                 prose-p:mb-4 prose-p:leading-relaxed
                 prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1
                 prose-ol:list-decimal prose-ol:pl-5
                 prose-strong:text-gray-900 prose-strong:font-semibold
                 prose-a:text-orange-500 prose-a:underline hover:prose-a:text-orange-600"
          v-html="content"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  content: string
}>()
</script>

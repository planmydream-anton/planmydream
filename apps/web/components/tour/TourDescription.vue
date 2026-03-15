<template>
  <section v-if="tagline || description" class="py-12 md:py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <p
          v-if="tagline"
          class="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-4"
        >
          {{ tagline }}
        </p>
        <p
          v-if="description"
          class="text-base md:text-lg text-gray-600 leading-relaxed"
        >
          {{ description }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  tagline?: string
  description?: string
}>()
</script>

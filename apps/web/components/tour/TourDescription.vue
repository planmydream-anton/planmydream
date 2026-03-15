<template>
  <section v-if="tagline || description" class="py-4 md:py-6">
    <p
      v-if="tagline"
      class="text-lg md:text-xl font-bold text-gray-900 leading-snug mb-3"
    >
      {{ tagline }}
    </p>
    <p
      v-if="description"
      class="text-base text-gray-600 leading-relaxed"
    >
      {{ description }}
    </p>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  tagline?: string
  description?: string
}>()
</script>

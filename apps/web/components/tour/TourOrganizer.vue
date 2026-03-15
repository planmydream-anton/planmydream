<template>
  <section class="py-12 md:py-16 bg-white">
    <div class="container mx-auto px-4">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Организатор тура
        </h2>

        <div class="flex items-start gap-6 p-6 border border-gray-200 rounded-2xl bg-white shadow-sm">
          <!-- Photo or initials placeholder -->
          <div class="flex-shrink-0">
            <img
              v-if="organizer.photoUrl"
              :src="organizer.photoUrl"
              :alt="organizer.name"
              class="w-20 h-20 rounded-full object-cover border border-gray-100 shadow-sm"
            />
            <div
              v-else
              class="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center border border-orange-200"
            >
              <span class="text-2xl font-bold text-orange-600 select-none">
                {{ initials }}
              </span>
            </div>
          </div>

          <!-- Info -->
          <div class="min-w-0">
            <p class="text-lg font-bold text-gray-900 leading-tight">
              {{ organizer.name }}
            </p>
            <p class="text-sm text-orange-500 font-medium mt-0.5 mb-3">
              {{ organizer.role }}
            </p>
            <p v-if="organizer.bio" class="text-gray-600 text-sm leading-relaxed">
              {{ organizer.bio }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TeamMember } from '~/types/tour'

const props = defineProps<{
  organizer: TeamMember
}>()

const initials = computed(() => {
  return props.organizer.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
})
</script>

<template>
  <section id="about" class="py-16 md:py-24 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
        Наша команда
      </h2>

      <div v-if="team?.length" class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div 
          v-for="member in team" 
          :key="member.id"
          class="bg-white rounded-2xl p-6 md:p-8 shadow-sm"
        >
          <div class="flex items-start gap-5">
            <!-- Photo -->
            <div class="flex-shrink-0">
              <div 
                v-if="member.photoUrl"
                class="w-20 h-20 rounded-full overflow-hidden"
              >
                <NuxtImg 
                  :src="member.photoUrl" 
                  :alt="member.name"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div 
                v-else 
                class="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center"
              >
                <span class="text-2xl font-bold text-orange-500">
                  {{ member.name.charAt(0) }}
                </span>
              </div>
            </div>

            <!-- Info -->
            <div>
              <h3 class="text-xl font-bold text-gray-900 mb-1">
                {{ member.name }}
              </h3>
              <div class="text-orange-500 text-sm font-medium mb-3">
                {{ member.role }}
              </div>
            </div>
          </div>

          <!-- Bio -->
          <p class="text-gray-600 leading-relaxed mt-4">
            {{ member.bio }}
          </p>
        </div>
      </div>

      <!-- Loading -->
      <div v-else-if="pending" class="text-center text-gray-500">
        Загрузка...
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  photoUrl?: string
}

const { data: team, pending } = await useFetch<TeamMember[]>('/api/team')
</script>

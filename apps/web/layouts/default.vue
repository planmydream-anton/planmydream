<template>
  <div class="min-h-screen flex flex-col bg-white">
    <AppHeader />
    
    <main class="flex-grow">
      <slot />
    </main>
    
    <AppFooter />
    
    <!-- Модальные окна -->
    <Teleport to="body">
      <InquiryModal />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
// Layout готов принимать контент через slot
</script>

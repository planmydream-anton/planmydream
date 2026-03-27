<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <OrganizerSidebar />

    <div class="lg:pl-64">
      <OrganizerTopbar />

      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

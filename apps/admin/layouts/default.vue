<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
    <!-- Sidebar -->
    <AdminSidebar />

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Topbar -->
      <AdminTopbar />

      <!-- Page content -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

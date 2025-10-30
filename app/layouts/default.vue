<script setup lang="ts">
const isSidebarOpen = ref(true)

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="sidebar-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <!-- Header -->
      <AppHeader />

      <!-- Main Content -->
      <main class="flex-1 bg-base-100">
        <div class="min-h-screen">
          <slot />
        </div>
      </main>

      <!-- Footer -->
      <AppFooter />
    </div>

    <!-- Sidebar -->
    <AppSidebar />
  </div>
</template>

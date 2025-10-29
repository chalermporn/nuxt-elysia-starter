<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div class="min-h-screen bg-base-200">
    <!-- Header -->
    <header class="bg-base-100 shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-5 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-primary-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold">ระบบจัดการสมาชิก</h1>
              <p class="text-xs opacity-70">Member Management System</p>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="flex gap-2">
            <NuxtLink
              to="/members"
              class="btn btn-sm"
              :class="route.path.startsWith('/members') ? 'btn-primary' : 'btn-ghost'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              สมาชิก
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-base-100 mt-20 border-t border-base-300">
      <div class="container mx-auto px-5 py-8">
        <div class="text-center text-sm opacity-70">
          <p>&copy; 2025 Member Management System. Built with Nuxt 4 & Elysia.</p>
        </div>
      </div>
    </footer>

    <!-- Toast Notifications -->
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  name: string
  icon: string
  link: string
  badge?: string
  children?: MenuItem[]
}

const route = useRoute()

const menuItems: MenuItem[] = [
  {
    name: 'หน้าแรก',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    link: '/',
  },
  {
    name: 'สมาชิก',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    link: '/members',
    badge: '150',
  },
  {
    name: 'รายงาน',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    link: '/reports',
  },
  {
    name: 'การตั้งค่า',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    link: '/settings',
  },
]

function isActive(link: string) {
  if (link === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(link)
}
</script>

<template>
  <div class="drawer-side z-40">
    <label for="sidebar-drawer" aria-label="close sidebar" class="drawer-overlay" />
    <aside class="bg-base-200 min-h-screen w-72 flex flex-col">
      <!-- Sidebar Header -->
      <div class="p-4 bg-primary text-primary-content">
        <div class="flex items-center gap-3">
          <div class="avatar placeholder">
            <div class="bg-primary-content text-primary rounded-full w-12">
              <span class="text-xl">MS</span>
            </div>
          </div>
          <div>
            <div class="font-bold text-lg">
              Member System
            </div>
            <div class="text-xs opacity-75">
              ระบบจัดการสมาชิก
            </div>
          </div>
        </div>
      </div>

      <!-- Menu Items -->
      <ul class="menu p-4 flex-1">
        <li v-for="item in menuItems" :key="item.link">
          <NuxtLink
            :to="item.link"
            :class="{ active: isActive(item.link) }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="item.icon"
              />
            </svg>
            {{ item.name }}
            <span v-if="item.badge" class="badge badge-sm badge-primary">{{ item.badge }}</span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-base-300">
        <div class="flex items-center justify-between text-sm">
          <span class="opacity-70">เวอร์ชัน</span>
          <span class="badge badge-outline">v1.0.0</span>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  icon?: string
  actionText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'ไม่พบข้อมูล',
  message: 'ยังไม่มีข้อมูลในระบบ',
  icon: 'inbox',
})

const emit = defineEmits<{
  action: []
}>()

const icons = {
  inbox: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
  users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
    <div class="w-20 h-20 bg-base-300 rounded-full flex items-center justify-center mb-6">
      <svg
        class="w-10 h-10 opacity-50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="icons[icon as keyof typeof icons] || icons.inbox"
        />
      </svg>
    </div>

    <h3 class="text-xl font-bold mb-2">
      {{ title }}
    </h3>
    <p class="text-sm opacity-70 mb-6 text-center max-w-md">
      {{ message }}
    </p>

    <button
      v-if="actionText"
      class="btn btn-primary gap-2"
      @click="emit('action')"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      {{ actionText }}
    </button>
  </div>
</template>

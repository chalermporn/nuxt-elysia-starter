<script setup lang="ts">
import type { VNode } from 'vue'

interface Member {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  city: string
  status: 'active' | 'inactive'
  joinDate: string
}

interface Column {
  key: keyof Member
  pin?: boolean
  label: string
  width?: string
  sortable?: boolean
  format?: (value: any, row: Member) => string | number | VNode
}

interface Props {
  members: Member[]
  columns: Column[]
  isLoading?: boolean
  sortBy?: keyof Member | ''
  sortOrder?: 'asc' | 'desc'
  sticky?: boolean
}

interface Emits {
  (e: 'sort', column: keyof Member): void
}

defineProps<Props>()

const emit = defineEmits<Emits>()

function handleSort(column: keyof Member) {
  emit('sort', column)
}
</script>

<template>
  <div class=" rounded-box border border-base-content/5 bg-base-100" :class="{ 'overflow-x-auto': !sticky }">
    <table class="table table-zebra table-pin-rows table-pin-cols whitespace-nowrap">
      <thead :class="{ 'sticky top-0 z-10 bg-base-100 shadow-md': sticky }">
        <tr>
          <component
            :is="column?.pin ? 'th' : 'td'"
            v-for="column in columns"
            :key="column.key"
            :class="[
              column.width,
              column.sortable !== false ? 'cursor-pointer hover:bg-base-200' : '',
              sticky ? 'bg-base-100' : '',
            ]"
            @click="column.sortable !== false ? handleSort(column.key) : null"
          >
            <div class="flex items-center gap-1">
              {{ column.label }}
              <span v-if="sortBy === column.key" class="text-xs">
                {{ sortOrder === 'asc' ? '▲' : '▼' }}
              </span>
            </div>
          </component>
        </tr>
      </thead>
      <tbody>
        <!-- Skeleton Loading -->
        <template v-if="isLoading">
          <tr v-for="i in 10" :key="`skeleton-${i}`">
            <component
              :is="column?.pin ? 'th' : 'td'"
              v-for="column in columns"
              :key="`skeleton-${i}-${column.key}`"
              class="whitespace-nowrap"
            >
              <div class="skeleton h-4 w-20" />
            </component>
          </tr>
        </template>

        <!-- Actual Data -->
        <template v-else>
          <tr
            v-for="member in members"
            :key="member.id"
            class="hover"
          >
            <component
              :is="column?.pin ? 'th' : 'td'"
              v-for="column in columns"
              :key="`${member.id}-${column.key}`"
              class="whitespace-nowrap"
            >
              <component
                :is="column.format?.(member[column.key], member) ?? member[column.key]"
                v-if="column.format && typeof column.format(member[column.key], member) === 'object'"
              />
              <template v-else-if="column.format">
                {{ column.format(member[column.key], member) }}
              </template>
              <template v-else>
                {{ member[column.key] }}
              </template>
            </component>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

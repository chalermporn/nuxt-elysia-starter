<script setup lang="ts">
interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface Props {
  pagination: PaginationInfo
  currentPage: number
  maxVisiblePages?: number
}

interface Emits {
  (e: 'prev'): void
  (e: 'next'): void
  (e: 'goToPage', page: number): void
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 3,
})

const emit = defineEmits<Emits>()

function handlePrev() {
  emit('prev')
}

function handleNext() {
  emit('next')
}

function handleGoToPage(page: number) {
  emit('goToPage', page)
}

function handleFirstPage() {
  emit('goToPage', 1)
}

function handleLastPage() {
  emit('goToPage', props.pagination.totalPages)
}

// Calculate visible page numbers
const visiblePages = computed(() => {
  const total = props.pagination.totalPages
  const current = props.currentPage
  const maxVisible = props.maxVisiblePages

  if (total <= maxVisible) {
    // Show all pages if total is less than max
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const halfVisible = Math.floor(maxVisible / 2)
  let startPage = Math.max(1, current - halfVisible)
  let endPage = Math.min(total, current + halfVisible)

  // Adjust if we're near the start
  if (current <= halfVisible) {
    endPage = Math.min(total, maxVisible)
  }

  // Adjust if we're near the end
  if (current >= total - halfVisible) {
    startPage = Math.max(1, total - maxVisible + 1)
  }

  const pages: (number | string)[] = []

  // Add first page and ellipsis if needed
  if (startPage > 1) {
    pages.push(1)
    if (startPage > 2) {
      pages.push('...')
    }
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // Add ellipsis and last page if needed
  if (endPage < total) {
    if (endPage < total - 1) {
      pages.push('...')
    }
    pages.push(total)
  }

  return pages
})
</script>

<template>
  <div>
    <div class="flex justify-center mt-5">
      <div class="join">
        <!-- First Page Button -->
        <button
          class="join-item btn"
          :disabled="!pagination.hasPrev"
          @click="handleFirstPage"
        >
          «
        </button>

        <!-- Previous Button -->
        <button
          class="join-item btn"
          :disabled="!pagination.hasPrev"
          @click="handlePrev"
        >
          ‹
        </button>

        <!-- Page Numbers -->
        <button
          v-for="(page, index) in visiblePages"
          :key="`page-${index}`"
          class="join-item btn"
          :class="{ 'btn-active': currentPage === page }"
          :disabled="typeof page === 'string'"
          @click="typeof page === 'number' ? handleGoToPage(page) : null"
        >
          {{ page }}
        </button>

        <!-- Next Button -->
        <button
          class="join-item btn"
          :disabled="!pagination.hasNext"
          @click="handleNext"
        >
          ›
        </button>

        <!-- Last Page Button -->
        <button
          class="join-item btn"
          :disabled="!pagination.hasNext"
          @click="handleLastPage"
        >
          »
        </button>
      </div>
    </div>

    <div class="mt-2 text-center text-sm opacity-70">
      หน้า {{ pagination.page }} จาก {{ pagination.totalPages }}
    </div>
  </div>
</template>

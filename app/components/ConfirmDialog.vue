<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'info' | 'warning' | 'error' | 'success'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'ยืนยัน',
  cancelText: 'ยกเลิก',
  type: 'info',
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const typeClasses = {
  info: 'btn-info',
  warning: 'btn-warning',
  error: 'btn-error',
  success: 'btn-success',
}

const iconPaths = {
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget && !props.loading) {
    emit('cancel')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        @click="handleBackdropClick"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="open"
            class="bg-base-100 rounded-lg shadow-2xl w-full max-w-md"
          >
            <div class="p-6">
              <!-- Icon -->
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                  :class="`bg-${type} bg-opacity-20`"
                >
                  <svg
                    class="w-6 h-6"
                    :class="`text-${type}`"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      :d="iconPaths[type]"
                    />
                  </svg>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-bold">
                    {{ title }}
                  </h3>
                </div>
              </div>

              <!-- Message -->
              <p class="text-sm opacity-80 mb-6">
                {{ message }}
              </p>

              <!-- Actions -->
              <div class="flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="btn btn-ghost"
                  :disabled="loading"
                  @click="emit('cancel')"
                >
                  {{ cancelText }}
                </button>
                <button
                  type="button"
                  class="btn"
                  :class="typeClasses[type]"
                  :disabled="loading"
                  @click="emit('confirm')"
                >
                  <span v-if="loading" class="loading loading-spinner loading-sm" />
                  {{ loading ? 'กำลังดำเนินการ...' : confirmText }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

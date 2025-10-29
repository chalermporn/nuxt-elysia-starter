<script setup lang="ts">
interface Props {
  title: string
  open: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  loading: false,
})

const emit = defineEmits<{
  close: []
  submit: []
}>()

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    emit('close')
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
            class="bg-base-100 rounded-lg shadow-2xl w-full"
            :class="sizeClasses[size]"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-5 border-b border-base-300">
              <h2 class="text-xl font-bold">
                {{ title }}
              </h2>
              <button
                type="button"
                class="btn btn-sm btn-ghost btn-circle"
                :disabled="loading"
                @click="emit('close')"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="p-5 max-h-[calc(100vh-200px)] overflow-y-auto">
              <slot />
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-2 p-5 border-t border-base-300">
              <slot name="footer">
                <button
                  type="button"
                  class="btn btn-ghost"
                  :disabled="loading"
                  @click="emit('close')"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  :disabled="loading"
                  @click="emit('submit')"
                >
                  <span v-if="loading" class="loading loading-spinner loading-sm" />
                  {{ loading ? 'กำลังบันทึก...' : 'บันทึก' }}
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

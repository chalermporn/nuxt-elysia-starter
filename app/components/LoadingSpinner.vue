<script setup lang="ts">
interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const sizeClasses = {
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 py-8">
    <span
      class="loading loading-spinner text-primary"
      :class="sizeClasses[size]"
    />
    <p v-if="text" class="text-sm opacity-70">
      {{ text }}
    </p>
  </div>
</template>

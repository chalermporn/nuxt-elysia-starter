interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])

let nextId = 0

export function useToast() {
  function showToast(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = `toast-${++nextId}`
    const toast: Toast = { id, type, message, duration }

    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message: string, duration?: number) {
    return showToast(message, 'success', duration)
  }

  function error(message: string, duration?: number) {
    return showToast(message, 'error', duration)
  }

  function info(message: string, duration?: number) {
    return showToast(message, 'info', duration)
  }

  function warning(message: string, duration?: number) {
    return showToast(message, 'warning', duration)
  }

  return {
    toasts: readonly(toasts),
    showToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}

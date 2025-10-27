import { vi } from 'vitest'

export const useNuxtApp = vi.fn(() => ({
  $api: {
    members: {
      get: vi.fn().mockResolvedValue({
        data: {
          data: [],
          pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        },
        error: null,
      }),
    },
  },
}))

// Mock Vue onMounted to not execute in tests
export const onMounted = vi.fn()

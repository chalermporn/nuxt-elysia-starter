import { vi } from 'vitest'

export class Database {
  constructor(_path: string) {}

  query = vi.fn()
  prepare = vi.fn()
  close = vi.fn()
  run = vi.fn()
  all = vi.fn()
  get = vi.fn()
}

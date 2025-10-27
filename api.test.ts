import { beforeAll, describe, expect, it, vi } from 'vitest'

// Mock the database dependencies
vi.mock('./server/db/index.ts', () => {
  let isCountQuery = false

  const mockDb = {
    select: vi.fn((fields?: any) => {
      // Check if this is a count query
      isCountQuery = fields && fields.count
      return mockDb
    }),
    from: vi.fn(() => mockDb),
    where: vi.fn(() => mockDb),
    orderBy: vi.fn(() => mockDb),
    limit: vi.fn(() => mockDb),
    offset: vi.fn(() => {
      if (isCountQuery) {
        return Promise.resolve([{ count: 0 }])
      }
      // Return empty array for member data when count is 0
      return Promise.resolve([])
    }),
  }
  return { db: mockDb }
})

vi.mock('./server/db/schema.ts', () => ({
  members: {
    id: 'id',
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'email',
    phone: 'phone',
    age: 'age',
    city: 'city',
    status: 'status',
    joinDate: 'joinDate',
  },
}))

describe('API Tests', () => {
  let api: any

  beforeAll(async () => {
    const apiModule = await import('./api')
    api = apiModule.default
  })

  it('should create Elysia app', () => {
    const app = api()
    expect(app).toBeDefined()
    expect(app.handle).toBeDefined()
  })

  it('should have /hello endpoint', async () => {
    const app = api()
    const response = await app.handle(new Request('http://localhost/hello'))
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toEqual({ message: 'Hello world!' })
  })

  it('should have /members endpoint', async () => {
    const app = api()
    const response = await app.handle(new Request('http://localhost/members'))

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('data')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.data)).toBe(true)
  })

  it('should accept query parameters for /members', async () => {
    const app = api()
    const response = await app.handle(
      new Request('http://localhost/members?page=2&limit=5&search=test&sortBy=firstName&sortOrder=desc'),
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('pagination')
    expect(data.pagination.page).toBe(2)
    expect(data.pagination.limit).toBe(5)
  })

  it('should handle invalid sortBy parameter and fallback to id', async () => {
    const app = api()
    const response = await app.handle(
      new Request('http://localhost/members?sortBy=invalidField&sortOrder=asc'),
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('data')
    expect(data).toHaveProperty('pagination')
  })

  it('should handle asc sort order', async () => {
    const app = api()
    const response = await app.handle(
      new Request('http://localhost/members?sortBy=age&sortOrder=asc'),
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('data')
    expect(data).toHaveProperty('pagination')
  })

  it('should handle search with no query parameters', async () => {
    const app = api()
    const response = await app.handle(
      new Request('http://localhost/members'),
    )

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('data')
    expect(data.pagination.page).toBe(1)
    expect(data.pagination.limit).toBe(10)
  })
})

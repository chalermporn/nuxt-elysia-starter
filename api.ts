import { count, like, or } from 'drizzle-orm'
import { Elysia } from 'elysia'
import { db } from './server/db'
import { members } from './server/db/schema'

export default () => new Elysia()
  .get('/hello', () => ({ message: 'Hello world!' }))
  .get('/members', async ({ query }) => {
    const page = Number.parseInt(query.page as string) || 1
    const limit = Number.parseInt(query.limit as string) || 10
    const search = (query.search as string) || ''

    // Build where clause for search
    const whereClause = search
      ? or(
          like(members.firstName, `%${search}%`),
          like(members.lastName, `%${search}%`),
          like(members.email, `%${search}%`),
          like(members.city, `%${search}%`),
        )
      : undefined

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(members)
      .where(whereClause)

    const total = totalResult[0]?.count || 0
    const totalPages = Math.ceil(total / limit)
    const offset = (page - 1) * limit

    // Get paginated data
    const data = await db
      .select()
      .from(members)
      .where(whereClause)
      .limit(limit)
      .offset(offset)

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  })

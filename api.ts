import { asc, count, desc, eq, like, or } from 'drizzle-orm'
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { db } from './server/db'
import { members } from './server/db/schema'

// TypeBox schemas for API documentation and validation
const MemberSchema = t.Object({
  id: t.Integer({ description: 'Unique identifier for the member' }),
  firstName: t.String({ description: 'First name of the member' }),
  lastName: t.String({ description: 'Last name of the member' }),
  email: t.String({ format: 'email', description: 'Email address of the member' }),
  phone: t.String({ description: 'Phone number of the member' }),
  age: t.Integer({ minimum: 0, description: 'Age of the member' }),
  city: t.String({ description: 'City where the member resides' }),
  status: t.Union([t.Literal('active'), t.Literal('inactive')], {
    description: 'Status of the member',
  }),
  joinDate: t.String({ description: 'Date when the member joined (ISO 8601 format)' }),
  createdAt: t.String({ description: 'Timestamp when the record was created' }),
})

const PaginationSchema = t.Object({
  page: t.Integer({ description: 'Current page number' }),
  limit: t.Integer({ description: 'Number of items per page' }),
  total: t.Integer({ description: 'Total number of items' }),
  totalPages: t.Integer({ description: 'Total number of pages' }),
  hasNext: t.Boolean({ description: 'Whether there is a next page' }),
  hasPrev: t.Boolean({ description: 'Whether there is a previous page' }),
})

const MembersResponseSchema = t.Object({
  data: t.Array(MemberSchema, { description: 'Array of member records' }),
  pagination: PaginationSchema,
})

const MembersQuerySchema = t.Object({
  page: t.Optional(t.String({ description: 'Page number (default: 1)', pattern: '^[0-9]+$' })),
  limit: t.Optional(t.String({ description: 'Items per page (default: 10)', pattern: '^[0-9]+$' })),
  search: t.Optional(t.String({ description: 'Search query for firstName, lastName, email, or city' })),
  sortBy: t.Optional(t.String({ description: 'Field to sort by (default: id)' })),
  sortOrder: t.Optional(t.Union([t.Literal('asc'), t.Literal('desc')], { description: 'Sort order (default: asc)' })),
})

const CreateMemberSchema = t.Object({
  firstName: t.String({ minLength: 1, description: 'First name of the member' }),
  lastName: t.String({ minLength: 1, description: 'Last name of the member' }),
  email: t.String({ format: 'email', description: 'Email address of the member' }),
  phone: t.String({ minLength: 1, description: 'Phone number of the member' }),
  age: t.Integer({ minimum: 1, maximum: 150, description: 'Age of the member' }),
  city: t.String({ minLength: 1, description: 'City where the member resides' }),
  status: t.Union([t.Literal('active'), t.Literal('inactive')], {
    description: 'Status of the member',
    default: 'active',
  }),
})

const UpdateMemberSchema = t.Partial(CreateMemberSchema)

export default () => new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Member Management API',
          version: '1.0.0',
          description: 'A comprehensive API for managing member data with features including pagination, sorting, and search functionality. Built with Elysia, Nuxt 4, and SQLite.',
        },
        tags: [
          { name: 'General', description: 'General endpoints' },
          { name: 'Members', description: 'Member management endpoints' },
        ],
      },
    }),
  )
  .get('/hello', () => ({ message: 'Hello world!' }), {
    detail: {
      tags: ['General'],
      summary: 'Hello World endpoint',
      description: 'A simple endpoint that returns a greeting message',
    },
  })
  .get(
    '/members',
    async ({ query }) => {
      const page = Number.parseInt(query.page as string) || 1
      const limit = Number.parseInt(query.limit as string) || 10
      const search = (query.search as string) || ''
      const sortBy = (query.sortBy as string) || 'id'
      const sortOrder = (query.sortOrder as string) || 'asc'

      // Build where clause for search
      const whereClause = search
        ? or(
            like(members.firstName, `%${search}%`),
            like(members.lastName, `%${search}%`),
            like(members.email, `%${search}%`),
            like(members.city, `%${search}%`),
          )
        : undefined

      // Build order by clause
      const orderByColumn = members[sortBy as keyof typeof members] || members.id
      const orderByClause = sortOrder === 'desc' ? desc(orderByColumn) : asc(orderByColumn)

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
        .orderBy(orderByClause)
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
    },
    {
      query: MembersQuerySchema,
      response: MembersResponseSchema,
      detail: {
        tags: ['Members'],
        summary: 'Get paginated list of members',
        description: `
Retrieve a paginated list of members with optional filtering and sorting capabilities.

**Features:**
- **Pagination**: Control page number and items per page
- **Search**: Search across firstName, lastName, email, and city fields
- **Sorting**: Sort by any field in ascending or descending order
- **Response**: Includes data array and pagination metadata

**Example Usage:**
- Get first page: \`/members?page=1&limit=10\`
- Search members: \`/members?search=john\`
- Sort by age: \`/members?sortBy=age&sortOrder=desc\`
        `,
      },
    },
  )
  .post(
    '/members',
    async ({ body, set }) => {
      try {
        const newMember = await db.insert(members).values({
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          age: body.age,
          city: body.city,
          status: body.status || 'active',
          joinDate: new Date().toISOString().split('T')[0],
        }).returning()

        set.status = 201
        return newMember[0]
      }
      catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
          set.status = 409
          return { error: 'Email already exists' }
        }
        set.status = 500
        return { error: 'Failed to create member' }
      }
    },
    {
      body: CreateMemberSchema,
      response: {
        201: MemberSchema,
        409: t.Object({ error: t.String() }),
        500: t.Object({ error: t.String() }),
      },
      detail: {
        tags: ['Members'],
        summary: 'Create a new member',
        description: 'Create a new member with the provided information. Email must be unique.',
      },
    },
  )
  .patch(
    '/members/:id',
    async ({ params, body, set }) => {
      try {
        const id = Number.parseInt(params.id)

        if (Number.isNaN(id)) {
          set.status = 400
          return { error: 'Invalid member ID' }
        }

        // Check if member exists
        const existing = await db.select().from(members).where(eq(members.id, id))
        if (existing.length === 0) {
          set.status = 404
          return { error: 'Member not found' }
        }

        const updated = await db
          .update(members)
          .set(body)
          .where(eq(members.id, id))
          .returning()

        return updated[0]
      }
      catch (error: any) {
        if (error.message?.includes('UNIQUE constraint failed')) {
          set.status = 409
          return { error: 'Email already exists' }
        }
        set.status = 500
        return { error: 'Failed to update member' }
      }
    },
    {
      params: t.Object({ id: t.String() }),
      body: UpdateMemberSchema,
      response: {
        200: MemberSchema,
        400: t.Object({ error: t.String() }),
        404: t.Object({ error: t.String() }),
        409: t.Object({ error: t.String() }),
        500: t.Object({ error: t.String() }),
      },
      detail: {
        tags: ['Members'],
        summary: 'Update a member',
        description: 'Update an existing member. Only provided fields will be updated.',
      },
    },
  )
  .delete(
    '/members/:id',
    async ({ params, set }) => {
      try {
        const id = Number.parseInt(params.id)

        if (Number.isNaN(id)) {
          set.status = 400
          return { error: 'Invalid member ID' }
        }

        // Check if member exists
        const existing = await db.select().from(members).where(eq(members.id, id))
        if (existing.length === 0) {
          set.status = 404
          return { error: 'Member not found' }
        }

        await db.delete(members).where(eq(members.id, id))

        return { success: true, message: 'Member deleted successfully' }
      }
      catch (error) {
        set.status = 500
        return { error: 'Failed to delete member' }
      }
    },
    {
      params: t.Object({ id: t.String() }),
      response: {
        200: t.Object({ success: t.Boolean(), message: t.String() }),
        400: t.Object({ error: t.String() }),
        404: t.Object({ error: t.String() }),
        500: t.Object({ error: t.String() }),
      },
      detail: {
        tags: ['Members'],
        summary: 'Delete a member',
        description: 'Delete a member by ID.',
      },
    },
  )

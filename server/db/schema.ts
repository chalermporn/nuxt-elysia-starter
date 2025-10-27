import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const members = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  age: integer('age').notNull(),
  city: text('city').notNull(),
  status: text('status', { enum: ['active', 'inactive'] }).notNull().default('active'),
  joinDate: text('join_date').notNull(),
  createdAt: text('created_at').notNull().default('CURRENT_TIMESTAMP'),
})

export type Member = typeof members.$inferSelect
export type NewMember = typeof members.$inferInsert

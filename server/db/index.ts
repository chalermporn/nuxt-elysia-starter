/* eslint-disable perfectionist/sort-imports */
import { Database } from 'bun:sqlite'
import { drizzle } from 'drizzle-orm/bun-sqlite'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import * as schema from './schema'

// Get the correct database path for both dev and production
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = process.env.NODE_ENV === 'production'
  ? path.resolve(process.cwd(), 'sqlite.db')
  : path.resolve(__dirname, '../../sqlite.db')

const sqlite = new Database(dbPath)
export const db = drizzle(sqlite, { schema })

import type { Member, Pagination } from '../composables/useMembersTable'

export interface FetchMembersParams {
  page: number
  limit: number
  search: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface MembersResponse {
  data: Member[]
  pagination: Pagination
}

export function buildQueryParams(params: FetchMembersParams): Record<string, string> {
  const queryParams: Record<string, string> = {
    page: params.page.toString(),
    limit: params.limit.toString(),
    search: params.search,
  }

  if (params.sortBy) {
    queryParams.sortBy = params.sortBy
    queryParams.sortOrder = params.sortOrder || 'asc'
  }

  return queryParams
}

export function calculateDisplayRange(pagination: Pagination): { start: number, end: number } {
  const start = (pagination.page - 1) * pagination.limit + 1
  const end = Math.min(pagination.page * pagination.limit, pagination.total)
  return { start, end }
}

export function formatDate(dateString: string, locale = 'th-TH'): string {
  return new Date(dateString).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getStatusBadgeClass(status: 'active' | 'inactive'): string {
  return status === 'active' ? 'badge-success' : 'badge-error'
}

export function getStatusText(status: 'active' | 'inactive', lang = 'th'): string {
  if (lang === 'th') {
    return status === 'active' ? 'ใช้งาน' : 'ไม่ใช้งาน'
  }
  return status
}

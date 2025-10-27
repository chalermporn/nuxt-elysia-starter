import { ref } from 'vue'
import type { Ref } from 'vue'

export interface Member {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  age: number
  city: string
  status: 'active' | 'inactive'
  joinDate: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface MembersTableState {
  currentPage: Ref<number>
  searchQuery: Ref<string>
  itemsPerPage: Ref<number>
  sortBy: Ref<keyof Member | ''>
  sortOrder: Ref<'asc' | 'desc'>
  members: Ref<Member[]>
  isLoading: Ref<boolean>
  pagination: Ref<Pagination>
}

export function useMembersTable() {
  const currentPage = ref(1)
  const searchQuery = ref('')
  const itemsPerPage = ref(10)
  const sortBy = ref<keyof Member | ''>('')
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const members = ref<Member[]>([])
  const isLoading = ref(false)
  const pagination = ref<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })

  function handleSort(column: keyof Member) {
    if (sortBy.value === column) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    }
    else {
      sortBy.value = column
      sortOrder.value = 'asc'
    }
    currentPage.value = 1
  }

  function handleSearch() {
    currentPage.value = 1
  }

  function handleItemsPerPageChange() {
    currentPage.value = 1
  }

  function nextPage() {
    if (pagination.value.hasNext) {
      currentPage.value++
      return true
    }
    return false
  }

  function prevPage() {
    if (pagination.value.hasPrev) {
      currentPage.value--
      return true
    }
    return false
  }

  function goToPage(page: number) {
    currentPage.value = page
  }

  return {
    currentPage,
    searchQuery,
    itemsPerPage,
    sortBy,
    sortOrder,
    members,
    isLoading,
    pagination,
    handleSort,
    handleSearch,
    handleItemsPerPageChange,
    nextPage,
    prevPage,
    goToPage,
  }
}

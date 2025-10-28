import { describe, expect, it } from 'vitest'
import { useMembersTable } from './useMembersTable'

describe('useMembersTable Composable', () => {
  describe('initialization', () => {
    it('should initialize with default values', () => {
      const {
        currentPage,
        searchQuery,
        itemsPerPage,
        sortBy,
        sortOrder,
        members,
        isLoading,
        pagination,
      } = useMembersTable()

      expect(currentPage.value).toBe(1)
      expect(searchQuery.value).toBe('')
      expect(itemsPerPage.value).toBe(10)
      expect(sortBy.value).toBe('')
      expect(sortOrder.value).toBe('asc')
      expect(members.value).toEqual([])
      expect(isLoading.value).toBe(false)
      expect(pagination.value).toEqual({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      })
    })
  })

  describe('sorting', () => {
    it('should set sort column and order to ascending on first click', () => {
      const { sortBy, sortOrder, currentPage, handleSort } = useMembersTable()

      handleSort('firstName')

      expect(sortBy.value).toBe('firstName')
      expect(sortOrder.value).toBe('asc')
      expect(currentPage.value).toBe(1)
    })

    it('should toggle sort order when clicking same column', () => {
      const { sortOrder, handleSort } = useMembersTable()

      handleSort('firstName')
      expect(sortOrder.value).toBe('asc')

      handleSort('firstName')
      expect(sortOrder.value).toBe('desc')

      handleSort('firstName')
      expect(sortOrder.value).toBe('asc')
    })

    it('should reset to ascending when sorting different column', () => {
      const { sortBy, sortOrder, handleSort } = useMembersTable()

      handleSort('firstName')
      handleSort('firstName') // Now desc
      expect(sortOrder.value).toBe('desc')

      handleSort('lastName') // Change column
      expect(sortBy.value).toBe('lastName')
      expect(sortOrder.value).toBe('asc')
    })

    it('should reset page to 1 when sorting', () => {
      const { currentPage, handleSort } = useMembersTable()

      currentPage.value = 5
      handleSort('age')

      expect(currentPage.value).toBe(1)
    })
  })

  describe('search', () => {
    it('should reset page to 1 when searching', () => {
      const { currentPage, handleSearch } = useMembersTable()

      currentPage.value = 3
      handleSearch()

      expect(currentPage.value).toBe(1)
    })
  })

  describe('items Per Page', () => {
    it('should reset page to 1 when changing items per page', () => {
      const { currentPage, handleItemsPerPageChange } = useMembersTable()

      currentPage.value = 4
      handleItemsPerPageChange()

      expect(currentPage.value).toBe(1)
    })
  })

  describe('pagination', () => {
    it('should navigate to next page when hasNext is true', () => {
      const { currentPage, pagination, nextPage } = useMembersTable()

      pagination.value.hasNext = true
      const result = nextPage()

      expect(result).toBe(true)
      expect(currentPage.value).toBe(2)
    })

    it('should not navigate to next page when hasNext is false', () => {
      const { currentPage, pagination, nextPage } = useMembersTable()

      pagination.value.hasNext = false
      const result = nextPage()

      expect(result).toBe(false)
      expect(currentPage.value).toBe(1)
    })

    it('should navigate to previous page when hasPrev is true', () => {
      const { currentPage, pagination, prevPage } = useMembersTable()

      currentPage.value = 2
      pagination.value.hasPrev = true
      const result = prevPage()

      expect(result).toBe(true)
      expect(currentPage.value).toBe(1)
    })

    it('should not navigate to previous page when hasPrev is false', () => {
      const { currentPage, pagination, prevPage } = useMembersTable()

      currentPage.value = 1
      pagination.value.hasPrev = false
      const result = prevPage()

      expect(result).toBe(false)
      expect(currentPage.value).toBe(1)
    })

    it('should go to specific page', () => {
      const { currentPage, goToPage } = useMembersTable()

      goToPage(5)

      expect(currentPage.value).toBe(5)
    })
  })

  describe('state Management', () => {
    it('should allow updating search query', () => {
      const { searchQuery } = useMembersTable()

      searchQuery.value = 'test query'

      expect(searchQuery.value).toBe('test query')
    })

    it('should allow updating items per page', () => {
      const { itemsPerPage } = useMembersTable()

      itemsPerPage.value = 25

      expect(itemsPerPage.value).toBe(25)
    })

    it('should allow updating members list', () => {
      const { members } = useMembersTable()

      const mockMembers = [
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          age: 30,
          city: 'Bangkok',
          status: 'active' as const,
          joinDate: '2024-01-01',
        },
      ]

      members.value = mockMembers

      expect(members.value).toHaveLength(1)
      expect(members.value[0]?.firstName).toBe('John')
    })

    it('should allow updating loading state', () => {
      const { isLoading } = useMembersTable()

      isLoading.value = true
      expect(isLoading.value).toBe(true)

      isLoading.value = false
      expect(isLoading.value).toBe(false)
    })

    it('should allow updating pagination', () => {
      const { pagination } = useMembersTable()

      pagination.value = {
        page: 2,
        limit: 25,
        total: 100,
        totalPages: 4,
        hasNext: true,
        hasPrev: true,
      }

      expect(pagination.value.page).toBe(2)
      expect(pagination.value.limit).toBe(25)
      expect(pagination.value.total).toBe(100)
      expect(pagination.value.totalPages).toBe(4)
      expect(pagination.value.hasNext).toBe(true)
      expect(pagination.value.hasPrev).toBe(true)
    })
  })
})

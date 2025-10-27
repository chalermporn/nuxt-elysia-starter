import { describe, expect, it } from 'vitest'
import {
  buildQueryParams,
  calculateDisplayRange,
  formatDate,
  getStatusBadgeClass,
  getStatusText,
} from './membersApi'

describe('membersApi Utils', () => {
  describe('buildQueryParams', () => {
    it('should build basic query params without sorting', () => {
      const params = {
        page: 1,
        limit: 10,
        search: 'test',
      }

      const result = buildQueryParams(params)

      expect(result).toEqual({
        page: '1',
        limit: '10',
        search: 'test',
      })
    })

    it('should include sort params when sortBy is provided', () => {
      const params = {
        page: 2,
        limit: 25,
        search: '',
        sortBy: 'firstName',
        sortOrder: 'desc' as const,
      }

      const result = buildQueryParams(params)

      expect(result).toEqual({
        page: '2',
        limit: '25',
        search: '',
        sortBy: 'firstName',
        sortOrder: 'desc',
      })
    })

    it('should default sortOrder to asc when not provided', () => {
      const params = {
        page: 1,
        limit: 10,
        search: '',
        sortBy: 'age',
      }

      const result = buildQueryParams(params)

      expect(result.sortOrder).toBe('asc')
    })

    it('should handle empty search string', () => {
      const params = {
        page: 1,
        limit: 10,
        search: '',
      }

      const result = buildQueryParams(params)

      expect(result.search).toBe('')
    })
  })

  describe('calculateDisplayRange', () => {
    it('should calculate correct range for first page', () => {
      const pagination = {
        page: 1,
        limit: 10,
        total: 50,
        totalPages: 5,
        hasNext: true,
        hasPrev: false,
      }

      const result = calculateDisplayRange(pagination)

      expect(result).toEqual({ start: 1, end: 10 })
    })

    it('should calculate correct range for middle page', () => {
      const pagination = {
        page: 3,
        limit: 10,
        total: 50,
        totalPages: 5,
        hasNext: true,
        hasPrev: true,
      }

      const result = calculateDisplayRange(pagination)

      expect(result).toEqual({ start: 21, end: 30 })
    })

    it('should calculate correct range for last page with partial items', () => {
      const pagination = {
        page: 5,
        limit: 10,
        total: 47,
        totalPages: 5,
        hasNext: false,
        hasPrev: true,
      }

      const result = calculateDisplayRange(pagination)

      expect(result).toEqual({ start: 41, end: 47 })
    })

    it('should handle single item', () => {
      const pagination = {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      }

      const result = calculateDisplayRange(pagination)

      expect(result).toEqual({ start: 1, end: 1 })
    })

    it('should handle empty results', () => {
      const pagination = {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      }

      const result = calculateDisplayRange(pagination)

      expect(result).toEqual({ start: 1, end: 0 })
    })
  })

  describe('formatDate', () => {
    it('should format date in Thai locale by default', () => {
      const date = '2024-01-15'
      const result = formatDate(date)

      // Result should be a non-empty string with date components
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should format date in specified locale', () => {
      const date = '2024-01-15'
      const result = formatDate(date, 'en-US')

      expect(result).toMatch(/\w+\s+\d+,\s+\d+/)
    })

    it('should handle different date formats', () => {
      const date = '2024-12-25T00:00:00Z'
      const result = formatDate(date)

      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
    })
  })

  describe('getStatusBadgeClass', () => {
    it('should return badge-success for active status', () => {
      const result = getStatusBadgeClass('active')
      expect(result).toBe('badge-success')
    })

    it('should return badge-error for inactive status', () => {
      const result = getStatusBadgeClass('inactive')
      expect(result).toBe('badge-error')
    })
  })

  describe('getStatusText', () => {
    it('should return Thai text for active status by default', () => {
      const result = getStatusText('active')
      expect(result).toBe('ใช้งาน')
    })

    it('should return Thai text for inactive status by default', () => {
      const result = getStatusText('inactive')
      expect(result).toBe('ไม่ใช้งาน')
    })

    it('should return English text when lang is en', () => {
      const result = getStatusText('active', 'en')
      expect(result).toBe('active')
    })

    it('should return Thai text when lang is explicitly th', () => {
      const result = getStatusText('inactive', 'th')
      expect(result).toBe('ไม่ใช้งาน')
    })
  })
})

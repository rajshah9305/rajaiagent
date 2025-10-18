import { cn, formatDate, formatDuration, generateId } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })

    it('should handle empty strings', () => {
      expect(cn('base', '', 'valid')).toBe('base valid')
    })

    it('should handle arrays', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })

    it('should handle objects', () => {
      expect(cn({ 'class1': true, 'class2': false })).toBe('class1')
    })
  })

  describe('formatDate', () => {
    it('should format ISO date string correctly', () => {
      const date = '2024-01-15T14:30:00Z'
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jan 15, 2024/)
      expect(formatted).toMatch(/2:30/)
    })

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15T14:30:00Z')
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jan 15, 2024/)
      expect(formatted).toMatch(/2:30/)
    })

    it('should handle different time zones', () => {
      const date = '2024-01-15T14:30:00Z'
      const formatted = formatDate(date)
      // Should format according to local timezone
      expect(formatted).toBeDefined()
    })
  })

  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(30)).toBe('30s')
      expect(formatDuration(59)).toBe('59s')
    })

    it('should format minutes and seconds correctly', () => {
      expect(formatDuration(60)).toBe('1m 0s')
      expect(formatDuration(90)).toBe('1m 30s')
      expect(formatDuration(125)).toBe('2m 5s')
    })

    it('should format hours and minutes correctly', () => {
      expect(formatDuration(3600)).toBe('1h 0m')
      expect(formatDuration(3660)).toBe('1h 1m')
      expect(formatDuration(7320)).toBe('2h 2m')
    })

    it('should handle edge cases', () => {
      expect(formatDuration(0)).toBe('0s')
      expect(formatDuration(1)).toBe('1s')
    })

    it('should handle large durations', () => {
      expect(formatDuration(7200)).toBe('2h 0m')
      expect(formatDuration(7260)).toBe('2h 1m')
    })
  })

  describe('generateId', () => {
    it('should generate a string', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
    })

    it('should generate different IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('should generate IDs of consistent length', () => {
      const ids = Array.from({ length: 10 }, () => generateId())
      const lengths = ids.map(id => id.length)
      const uniqueLengths = new Set(lengths)
      expect(uniqueLengths.size).toBe(1)
    })

    it('should generate alphanumeric IDs', () => {
      const id = generateId()
      expect(id).toMatch(/^[a-z0-9]+$/)
    })

    it('should generate IDs with expected length', () => {
      const id = generateId()
      // Math.random().toString(36).substr(2, 9) should be 9 characters
      expect(id.length).toBe(9)
    })
  })
})

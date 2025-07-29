import { useState, useMemo } from 'react'
import { Course } from '../lib/supabase'

interface Filters {
  branch: string
  technology: string
  program: string
  duration: string
  priceRange: string
}

export default function useFilters(courses: Course[], searchTerm: string) {
  const [filters, setFilters] = useState<Filters>({
    branch: 'All',
    technology: 'All',
    program: 'All',
    duration: 'All',
    priceRange: 'All'
  })

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.technology.toLowerCase().includes(searchTerm.toLowerCase())

      // Branch filter
      const matchesBranch = filters.branch === 'All' || course.branch === filters.branch

      // Technology filter
      const matchesTechnology = filters.technology === 'All' || course.technology === filters.technology

      // Program filter
      const matchesProgram = filters.program === 'All' || course.program === filters.program

      // Duration filter
      const matchesDuration = filters.duration === 'All' || course.duration === filters.duration

      // Price range filter
      const matchesPriceRange = filters.priceRange === 'All' || (() => {
        const price = course.price
        switch (filters.priceRange) {
          case '₱0-₱5,000':
            return price >= 0 && price <= 5000
          case '₱5,001-₱10,000':
            return price > 5000 && price <= 10000
          case '₱10,001+':
            return price > 10000
          default:
            return true
        }
      })()

      return matchesSearch && matchesBranch && matchesTechnology && matchesProgram && matchesDuration && matchesPriceRange
    })
  }, [courses, searchTerm, filters])

  const updateFilter = (filterType: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }))
  }

  const clearFilters = () => {
    setFilters({
      branch: 'All',
      technology: 'All',
      program: 'All',
      duration: 'All',
      priceRange: 'All'
    })
  }

  return {
    filters,
    filteredCourses,
    updateFilter,
    clearFilters
  }
}
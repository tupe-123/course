import { useState, useMemo } from 'react'
import { Course } from '../lib/supabase'

interface Filters {
  branch: string
  program: string
  technology: string
  duration: string
  priceRange: string
}

const programTechnologies = {
  '2-Year Program': [
    'Programming',
    'Databases', 
    'Cyber Security',
    'Web Development',
    'Computer-Aided Design'
  ],
  'Senior High': [
    'Programming',
    'Web Development',
    'Digital Arts and Design',
    'Office Productivity',
    'Soft Skills'
  ],
  'Short Courses': [
    'Agriculture',
    'Automotive and Motorcycle Servicing',
    'CISCO Networking',
    'Computer-Aided Design',
    'Cyber Security',
    'Databases',
    'Digital Arts and Design',
    'Electrical',
    'Electronics',
    'Linux',
    'Machine Automation and Instrumentation (Mechatronics)',
    'Maritime-Electrotechnical',
    'Metal Trades-Welding and Pipefitting',
    'Office Productivity',
    'Process Automation (Instrumentation and Control)',
    'Programming',
    'Refrigeration and Air-conditioning Mechanic',
    'Soft Skills',
    'Web Development'
  ]
}

export default function useFilters(courses: Course[], searchTerm: string) {
  const [filters, setFilters] = useState<Filters>({
    branch: 'All',
    program: 'All',
    technology: 'All',
    duration: 'All',
    priceRange: 'All'
  })

  const [currentPage, setCurrentPage] = useState(1)
  const coursesPerPage = 10

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.technology.toLowerCase().includes(searchTerm.toLowerCase())

      // Branch filter
      const matchesBranch = filters.branch === 'All' || course.branch === filters.branch

      // Program filter
      const matchesProgram = filters.program === 'All' || course.program === filters.program

      // Technology filter (only apply if program is selected)
      const matchesTechnology = filters.technology === 'All' || course.technology === filters.technology

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

      return matchesSearch && matchesBranch && matchesProgram && matchesTechnology && matchesDuration && matchesPriceRange
    })
  }, [courses, searchTerm, filters])

  // Paginated courses
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * coursesPerPage
    const endIndex = startIndex + coursesPerPage
    return filteredCourses.slice(startIndex, endIndex)
  }, [filteredCourses, currentPage])

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage)

  const updateFilter = (filterType: keyof Filters, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterType]: value }
      
      // Reset technology when program changes
      if (filterType === 'program') {
        newFilters.technology = 'All'
      }
      
      return newFilters
    })
    
    // Reset to first page when filters change
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      branch: 'All',
      program: 'All',
      technology: 'All',
      duration: 'All',
      priceRange: 'All'
    })
    setCurrentPage(1)
  }

  const getAvailableTechnologies = () => {
    if (filters.program === 'All') return []
    return programTechnologies[filters.program as keyof typeof programTechnologies] || []
  }

  return {
    filters,
    filteredCourses: paginatedCourses,
    totalCourses: filteredCourses.length,
    currentPage,
    totalPages,
    updateFilter,
    clearFilters,
    setCurrentPage,
    getAvailableTechnologies
  }
}
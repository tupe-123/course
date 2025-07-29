import React from 'react'
import { Filter, X } from 'lucide-react'

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
  filters: {
    branch: string
    technology: string
    program: string
    duration: string
    priceRange: string
  }
  onFilterChange: (filterType: string, value: string) => void
  onClearFilters: () => void
  getAvailableTechnologies: () => string[]
}

export default function FilterSidebar({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearFilters,
  getAvailableTechnologies
}: FilterSidebarProps) {
  const branches = ['All', 'Pasig', 'Pasay', 'Jalajala']
  const programs = ['All', '2-Year Program', 'Senior High', 'Short Courses']
  const durations = ['All', 'Short', 'Medium', 'Long']
  const priceRanges = ['All', '₱0-₱5,000', '₱5,001-₱10,000', '₱10,001+']

  const availableTechnologies = getAvailableTechnologies()
  const showTechnologies = filters.program !== 'All' && availableTechnologies.length > 0

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />
      )}
      
      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Filter content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Programs Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Programs</h3>
              <div className="space-y-2">
                {programs.map(program => (
                  <label key={program} className="flex items-center">
                    <input
                      type="radio"
                      name="program"
                      value={program}
                      checked={filters.program === program}
                      onChange={(e) => onFilterChange('program', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{program}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Technology Filter - Only show when program is selected */}
            {showTechnologies && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Technology</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="technology"
                      value="All"
                      checked={filters.technology === 'All'}
                      onChange={(e) => onFilterChange('technology', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">All</span>
                  </label>
                  {availableTechnologies.map(tech => (
                    <label key={tech} className="flex items-center">
                      <input
                        type="radio"
                        name="technology"
                        value={tech}
                        checked={filters.technology === tech}
                        onChange={(e) => onFilterChange('technology', e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tech}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Branch Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Branch</h3>
              <div className="space-y-2">
                {branches.map(branch => (
                  <label key={branch} className="flex items-center">
                    <input
                      type="radio"
                      name="branch"
                      value={branch}
                      checked={filters.branch === branch}
                      onChange={(e) => onFilterChange('branch', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{branch}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Duration Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Duration</h3>
              <div className="space-y-2">
                {durations.map(duration => (
                  <label key={duration} className="flex items-center">
                    <input
                      type="radio"
                      name="duration"
                      value={duration}
                      checked={filters.duration === duration}
                      onChange={(e) => onFilterChange('duration', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{duration}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map(range => (
                  <label key={range} className="flex items-center">
                    <input
                      type="radio"
                      name="priceRange"
                      value={range}
                      checked={filters.priceRange === range}
                      onChange={(e) => onFilterChange('priceRange', e.target.value)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{range}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Clear filters button */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={onClearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
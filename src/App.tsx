@@ .. @@
 import SearchBar from './components/SearchBar'
 import FilterSidebar from './components/FilterSidebar'
 import CourseGrid from './components/CourseGrid'
+import Pagination from './components/Pagination'
 import useCourses from './hooks/useCourses'
 import useFilters from './hooks/useFilters'
@@ .. @@
   const [sidebarOpen, setSidebarOpen] = useState(false)
   const { courses, loading, error } = useCourses()
-  const { filters, filteredCourses, updateFilter, clearFilters } = useFilters(courses, searchTerm)
+  const { 
+    filters, 
+    filteredCourses, 
+    totalCourses,
+    currentPage,
+    totalPages,
+    updateFilter, 
+    clearFilters,
+    setCurrentPage,
+    getAvailableTechnologies
+  } = useFilters(courses, searchTerm)
@@ .. @@
           {/* Results summary */}
           <div className="mt-4 text-center">
             <p className="text-sm text-gray-600">
-              Showing {filteredCourses.length} of {courses.length} courses
+              Found {totalCourses} courses
               {searchTerm && (
                 <span> for "{searchTerm}"</span>
               )}
@@ .. @@
             filters={filters}
             onFilterChange={updateFilter}
             onClearFilters={clearFilters}
+            getAvailableTechnologies={getAvailableTechnologies}
           />
@@ .. @@
           {/* Course Grid */}
           <div className="flex-1 min-w-0">
             <CourseGrid courses={filteredCourses} loading={loading} />
+            
+            {/* Pagination */}
+            {!loading && (
+              <Pagination
+                currentPage={currentPage}
+                totalPages={totalPages}
+                onPageChange={setCurrentPage}
+                totalCourses={totalCourses}
+                coursesPerPage={10}
+              />
+            )}
           </div>
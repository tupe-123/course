import { useState, useEffect } from 'react'
import { supabase, Course } from '../lib/supabase'

export default function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initial fetch
    fetchCourses()

    // Set up real-time subscription
    const subscription = supabase
      .channel('courses')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'courses' },
        (payload) => {
          console.log('Real-time update:', payload)
          handleRealtimeChange(payload)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setCourses(data || [])
    } catch (err) {
      console.error('Error fetching courses:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRealtimeChange = (payload: any) => {
    switch (payload.eventType) {
      case 'INSERT':
        setCourses(prev => [payload.new as Course, ...prev])
        break
      case 'UPDATE':
        setCourses(prev => 
          prev.map(course => 
            course.id === payload.new.id ? payload.new as Course : course
          )
        )
        break
      case 'DELETE':
        setCourses(prev => 
          prev.filter(course => course.id !== payload.old.id)
        )
        break
    }
  }

  return { courses, loading, error, refetch: fetchCourses }
}
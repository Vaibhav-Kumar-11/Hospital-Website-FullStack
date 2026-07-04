import { useEffect, useState } from 'react'
import apiClient from '../api/client'

// Fetches doctors, optionally filtered by department slug, or a single doctor by id.
// Pass `skip: true` to opt out of fetching entirely (e.g. when the caller doesn't
// yet know which doctor/department to look up).
export default function useDoctors({ departmentSlug, doctorId, skip } = {}) {
  const [data, setData] = useState(doctorId ? null : [])
  const [loading, setLoading] = useState(!skip)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (skip) {
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)

    const url = doctorId
      ? `/api/doctors/${doctorId}/`
      : `/api/doctors/${departmentSlug ? `?department=${departmentSlug}` : ''}`

    apiClient
      .get(url)
      .then((response) => {
        if (isMounted) setData(response.data)
      })
      .catch((err) => {
        if (isMounted) {
          setError('We could not load doctor information right now. Please try again shortly.')
          console.error('useDoctors error:', err)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [departmentSlug, doctorId, skip])

  return { data, loading, error }
}

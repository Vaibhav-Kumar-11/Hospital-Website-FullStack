import { useEffect, useState } from 'react'
import apiClient from '../api/client'

// Fetches the list of all departments, or a single department if a slug is given.
export default function useDepartments(slug) {
  const [data, setData] = useState(slug ? null : [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)

    const url = slug ? `/api/departments/${slug}/` : '/api/departments/'

    apiClient
      .get(url)
      .then((response) => {
        if (isMounted) setData(response.data)
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            'We could not load department information right now. Please try again shortly.'
          )
          console.error('useDepartments error:', err)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  return { data, loading, error }
}

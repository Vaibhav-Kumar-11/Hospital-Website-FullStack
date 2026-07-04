import { useEffect, useState } from 'react'
import apiClient from '../api/client'

// Fetches available time slots for a doctor on a given date.
// Only fetches once both doctorId and date are present.
export default function useAvailableSlots(doctorId, date) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!doctorId || !date) {
      setData(null)
      setError(null)
      setLoading(false)
      return
    }

    let isMounted = true
    setLoading(true)
    setError(null)

    apiClient
      .get(`/api/doctors/${doctorId}/available-slots/?date=${date}`)
      .then((response) => {
        if (isMounted) setData(response.data.slots)
      })
      .catch((err) => {
        if (isMounted) {
          setError('We could not load available slots for that date. Please try again.')
          console.error('useAvailableSlots error:', err)
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [doctorId, date])

  return { data, loading, error }
}

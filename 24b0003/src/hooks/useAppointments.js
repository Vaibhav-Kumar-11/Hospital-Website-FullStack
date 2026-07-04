import { useCallback, useEffect, useState } from 'react'
import apiClient from '../api/client'

// Fetches the logged-in user's appointments. Exposes a refetch function so
// pages can refresh the list after cancelling an appointment.
export default function useAppointments() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAppointments = useCallback(() => {
    setLoading(true)
    setError(null)
    return apiClient
      .get('/api/appointments/')
      .then((response) => {
        setData(response.data)
      })
      .catch((err) => {
        setError('We could not load your appointments right now. Please try again shortly.')
        console.error('useAppointments error:', err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  return { data, loading, error, refetch: fetchAppointments }
}

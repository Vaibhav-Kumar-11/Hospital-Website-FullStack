import { useState } from 'react'
import { Link } from 'react-router-dom'
import useAppointments from '../hooks/useAppointments'
import AppointmentCard from '../components/AppointmentCard'
import apiClient from '../api/client'

export default function MyAppointmentsPage() {
  const { data: appointments, loading, error, refetch } = useAppointments()
  const [cancellingId, setCancellingId] = useState(null)
  const [cancelError, setCancelError] = useState(null)

  const sortedAppointments = [...(appointments || [])].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  async function handleCancel(appointment) {
    const confirmed = window.confirm(
      `Cancel your appointment with ${appointment.doctor_name} on ${appointment.date} at ${appointment.time_slot}?`
    )
    if (!confirmed) return

    setCancelError(null)
    setCancellingId(appointment.id)
    try {
      await apiClient.patch(`/api/appointments/${appointment.id}/`, { status: 'cancelled' })
      await refetch()
    } catch (err) {
      setCancelError('We could not cancel that appointment right now. Please try again shortly.')
      console.error('Cancel appointment error:', err)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-semibold text-slate-800">My Appointments</h1>
      <p className="mt-2 text-slate-500">All your upcoming and past appointments in one place.</p>

      {cancelError && (
        <p className="mt-6 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">
          {cancelError}
        </p>
      )}

      <div className="mt-8 space-y-4">
        {loading && <p className="text-slate-500">Loading your appointments...</p>}
        {error && (
          <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">{error}</p>
        )}
        {!loading && !error && sortedAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">You don't have any appointments yet.</p>
            <Link
              to="/departments"
              className="mt-4 inline-block px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
            >
              Find a doctor
            </Link>
          </div>
        )}
        {!loading &&
          !error &&
          sortedAppointments.map((appointment) => (
            <div key={appointment.id} className={cancellingId === appointment.id ? 'opacity-50' : ''}>
              <AppointmentCard appointment={appointment} onCancel={handleCancel} />
            </div>
          ))}
      </div>
    </div>
  )
}

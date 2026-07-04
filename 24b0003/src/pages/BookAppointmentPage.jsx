import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useDepartments from '../hooks/useDepartments'
import useDoctors from '../hooks/useDoctors'
import useAvailableSlots from '../hooks/useAvailableSlots'
import SlotPicker from '../components/SlotPicker'
import apiClient from '../api/client'
import formatTimeSlot from '../utils/formatTimeSlot'

function todayIsoDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function BookAppointmentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const doctorFromState = location.state?.doctor || null
  const doctorIdFromQuery = searchParams.get('doctor')

  // A doctor is "pre-selected" if we arrived via route state (from DoctorDetailPage)
  // or via a ?doctor=<id> query param. In the query-param case we only have an id,
  // so fetch the full doctor record to show its name/department like the other case.
  const shouldFetchDoctorFromQuery = !doctorFromState && Boolean(doctorIdFromQuery)
  const { data: doctorFromQuery } = useDoctors({
    doctorId: doctorIdFromQuery,
    skip: !shouldFetchDoctorFromQuery,
  })
  const preSelectedDoctor = doctorFromState || (shouldFetchDoctorFromQuery ? doctorFromQuery : null)

  const [selectedDepartmentSlug, setSelectedDepartmentSlug] = useState(
    doctorFromState?.department || ''
  )
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    doctorFromState?.id ? String(doctorFromState.id) : doctorIdFromQuery || ''
  )
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [symptomNote, setSymptomNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successData, setSuccessData] = useState(null)

  const { data: departments, loading: departmentsLoading, error: departmentsError } = useDepartments()
  const { data: doctorsInDepartment, loading: doctorsLoading, error: doctorsError } = useDoctors({
    departmentSlug: selectedDepartmentSlug || undefined,
  })
  const { data: slots, loading: slotsLoading, error: slotsError } = useAvailableSlots(
    selectedDoctorId,
    selectedDate
  )

  const minDate = useMemo(todayIsoDate, [])

  const doctorLabel = preSelectedDoctor?.name

  function handleDepartmentChange(event) {
    setSelectedDepartmentSlug(event.target.value)
    setSelectedDoctorId('')
    setSelectedSlot('')
  }

  function handleDoctorChange(event) {
    setSelectedDoctorId(event.target.value)
    setSelectedSlot('')
  }

  function handleDateChange(event) {
    setSelectedDate(event.target.value)
    setSelectedSlot('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError(null)

    if (!selectedDoctorId || !selectedDate || !selectedSlot) {
      setSubmitError('Please choose a doctor, date, and time slot before booking.')
      return
    }

    setSubmitting(true)
    try {
      const response = await apiClient.post('/api/appointments/', {
        doctor: Number(selectedDoctorId),
        date: selectedDate,
        time_slot: selectedSlot,
        symptom_note: symptomNote || undefined,
      })
      setSuccessData(response.data)
    } catch (error) {
      if (error.response?.status === 400) {
        setSubmitError(
          'That slot just became unavailable. Please pick another time slot for this doctor.'
        )
        setSelectedSlot('')
      } else {
        setSubmitError('We could not complete your booking right now. Please try again shortly.')
      }
      console.error('Booking error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 text-3xl">
          &#10003;
        </div>
        <h1 className="mt-6 text-2xl font-semibold text-slate-800">Appointment booked!</h1>
        <p className="mt-2 text-slate-500">
          Your appointment on {successData.date} at {formatTimeSlot(successData.time_slot)} has been confirmed.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/my-appointments')}
            className="px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
          >
            View my appointments
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-white text-brand-700 font-medium border border-brand-200 hover:bg-brand-50 transition-colors"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-semibold text-slate-800">Book an Appointment</h1>
      <p className="mt-2 text-slate-500">
        {doctorLabel
          ? `Booking with ${doctorLabel}. Choose a date and time that works for you.`
          : 'Choose a department and doctor, then pick a date and time that works for you.'}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {!preSelectedDoctor && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
            {departmentsError && (
              <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm mb-2">
                {departmentsError}
              </p>
            )}
            <select
              value={selectedDepartmentSlug}
              onChange={handleDepartmentChange}
              disabled={departmentsLoading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">Select a department</option>
              {(departments || []).map((department) => (
                <option key={department.id} value={department.slug}>
                  {department.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {!preSelectedDoctor && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Doctor</label>
            {doctorsError && (
              <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm mb-2">
                {doctorsError}
              </p>
            )}
            <select
              value={selectedDoctorId}
              onChange={handleDoctorChange}
              disabled={!selectedDepartmentSlug || doctorsLoading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:bg-slate-100"
            >
              <option value="">
                {selectedDepartmentSlug ? 'Select a doctor' : 'Select a department first'}
              </option>
              {(doctorsInDepartment || []).map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} -- {doctor.specialty}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <input
            type="date"
            min={minDate}
            value={selectedDate}
            onChange={handleDateChange}
            disabled={!selectedDoctorId}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400 disabled:bg-slate-100"
          />
        </div>

        {selectedDoctorId && selectedDate && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Available time slots</label>
            {slotsLoading && <p className="text-slate-500 text-sm">Loading available slots...</p>}
            {slotsError && (
              <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-3 text-sm">
                {slotsError}
              </p>
            )}
            {!slotsLoading && !slotsError && (
              <SlotPicker slots={slots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Symptom note <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={symptomNote}
            onChange={(event) => setSymptomNote(event.target.value)}
            rows={3}
            placeholder="Briefly describe what's bothering you..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
        </div>

        {submitError && (
          <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !selectedDoctorId || !selectedDate || !selectedSlot}
          className="w-full px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Booking...' : 'Confirm booking'}
        </button>
      </form>
    </div>
  )
}

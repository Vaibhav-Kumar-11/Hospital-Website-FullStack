import { Link, useNavigate, useParams } from 'react-router-dom'
import useDoctors from '../hooks/useDoctors'

export default function DoctorDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: doctor, loading, error } = useDoctors({ doctorId: id })

  if (loading) {
    return <p className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-slate-500">Loading doctor profile...</p>
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">{error}</p>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-slate-500">We couldn't find that doctor.</p>
        <Link to="/departments" className="mt-4 inline-block text-brand-600 font-medium hover:text-brand-700">
          &larr; Back to departments
        </Link>
      </div>
    )
  }

  function handleBookAppointment() {
    navigate('/book-appointment', { state: { doctor } })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      {doctor.department && (
        <Link
          to={`/departments/${doctor.department}`}
          className="text-sm text-brand-600 font-medium hover:text-brand-700"
        >
          &larr; Back to {doctor.department_name || 'department'}
        </Link>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{doctor.name}</h1>
            <p className="text-brand-600 font-medium mt-1">{doctor.specialty}</p>
            {doctor.department_name && (
              <p className="text-sm text-slate-400 mt-1">{doctor.department_name}</p>
            )}
          </div>
          {doctor.rating != null && (
            <div className="flex items-center gap-1 text-amber-500 font-medium shrink-0">
              <span aria-hidden="true">&#9733;</span>
              {doctor.rating}
            </div>
          )}
        </div>

        {doctor.years_experience != null && (
          <p className="mt-4 text-sm text-slate-500">
            {doctor.years_experience} {doctor.years_experience === 1 ? 'year' : 'years'} of experience
          </p>
        )}

        {doctor.bio && <p className="mt-4 text-slate-600 leading-relaxed">{doctor.bio}</p>}

        <button
          onClick={handleBookAppointment}
          className="mt-8 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
        >
          Book Appointment
        </button>
      </div>
    </div>
  )
}

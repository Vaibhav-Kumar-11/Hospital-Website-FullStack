import { Link, useParams } from 'react-router-dom'
import useDepartments from '../hooks/useDepartments'
import useDoctors from '../hooks/useDoctors'
import DoctorCard from '../components/DoctorCard'

export default function DepartmentDetailPage() {
  const { slug } = useParams()
  const { data: department, loading: departmentLoading, error: departmentError } = useDepartments(slug)
  const { data: doctors, loading: doctorsLoading, error: doctorsError } = useDoctors({ departmentSlug: slug })

  if (departmentLoading) {
    return <p className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-slate-500">Loading department...</p>
  }

  if (departmentError) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">{departmentError}</p>
        <Link to="/departments" className="mt-4 inline-block text-brand-600 font-medium hover:text-brand-700">
          &larr; Back to departments
        </Link>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <p className="text-slate-500">We couldn't find that department.</p>
        <Link to="/departments" className="mt-4 inline-block text-brand-600 font-medium hover:text-brand-700">
          &larr; Back to departments
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <Link to="/departments" className="text-sm text-brand-600 font-medium hover:text-brand-700">
        &larr; Back to departments
      </Link>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 text-3xl">
          <span aria-hidden="true">{department.icon || '🏥'}</span>
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-slate-800">{department.name}</h1>
        </div>
      </div>

      <p className="mt-4 text-slate-600 max-w-2xl">{department.description}</p>

      <h2 className="mt-12 text-xl font-semibold text-slate-800">Doctors in this department</h2>

      <div className="mt-6">
        {doctorsLoading && <p className="text-slate-500">Loading doctors...</p>}
        {doctorsError && (
          <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">{doctorsError}</p>
        )}
        {!doctorsLoading && !doctorsError && doctors && doctors.length === 0 && (
          <p className="text-slate-500">No doctors are listed for this department yet.</p>
        )}
        {!doctorsLoading && !doctorsError && doctors && doctors.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

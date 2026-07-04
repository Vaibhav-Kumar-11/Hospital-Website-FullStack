import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor }) {
  return (
    <Link
      to={`/doctors/${doctor.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-brand-700">
            {doctor.name}
          </h3>
          <p className="text-sm text-brand-600 font-medium">{doctor.specialty}</p>
        </div>
        {doctor.rating != null && (
          <div className="flex items-center gap-1 text-amber-500 text-sm font-medium shrink-0">
            <span aria-hidden="true">&#9733;</span>
            {doctor.rating}
          </div>
        )}
      </div>

      {doctor.department_name && (
        <p className="mt-2 text-xs uppercase tracking-wide text-slate-400">
          {doctor.department_name}
        </p>
      )}

      {doctor.years_experience != null && (
        <p className="mt-2 text-sm text-slate-500">
          {doctor.years_experience} {doctor.years_experience === 1 ? 'year' : 'years'} of experience
        </p>
      )}

      <span className="mt-4 inline-block text-sm font-medium text-brand-600 group-hover:text-brand-700">
        View profile &rarr;
      </span>
    </Link>
  )
}

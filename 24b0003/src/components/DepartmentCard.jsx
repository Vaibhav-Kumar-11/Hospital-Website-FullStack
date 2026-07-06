import { Link } from 'react-router-dom'
import getDepartmentIcon from '../utils/departmentIcons'

export default function DepartmentCard({ department }) {
  const Icon = getDepartmentIcon(department.icon)

  return (
    <Link
      to={`/departments/${department.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 mb-4">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-slate-800 group-hover:text-brand-700">
        {department.name}
      </h3>
      <p className="mt-1 text-sm text-slate-500 line-clamp-3">{department.description}</p>
      <span className="mt-4 inline-block text-sm font-medium text-brand-600 group-hover:text-brand-700">
        View department &rarr;
      </span>
    </Link>
  )
}

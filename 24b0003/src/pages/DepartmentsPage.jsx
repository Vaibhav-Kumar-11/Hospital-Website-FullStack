import useDepartments from '../hooks/useDepartments'
import DepartmentCard from '../components/DepartmentCard'

export default function DepartmentsPage() {
  const { data: departments, loading, error } = useDepartments()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-semibold text-slate-800">Departments</h1>
      <p className="mt-2 text-slate-500 max-w-2xl">
        Browse all departments at MediGuide and find the doctors available in each.
      </p>

      <div className="mt-10">
        {loading && <p className="text-slate-500">Loading departments...</p>}
        {error && (
          <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">{error}</p>
        )}
        {!loading && !error && departments && departments.length === 0 && (
          <p className="text-slate-500">No departments available yet. Please check back soon.</p>
        )}
        {!loading && !error && departments && departments.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
              <DepartmentCard key={department.id} department={department} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

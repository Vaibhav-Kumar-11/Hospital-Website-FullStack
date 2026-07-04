import { Link } from 'react-router-dom'
import useDepartments from '../hooks/useDepartments'
import DepartmentCard from '../components/DepartmentCard'

const STEPS = [
  {
    title: 'Tell us your symptoms',
    description: 'Use our simple symptom guide to describe how you’re feeling right now.',
  },
  {
    title: 'We match you to care',
    description: 'We point you to the right department and an available doctor -- no guesswork.',
  },
  {
    title: 'Book a real available slot',
    description: 'Pick a time that works and get a confirmed appointment in a few taps.',
  },
]

export default function HomePage() {
  const { data: departments, loading, error } = useDepartments()
  const preview = (departments || []).slice(0, 4)

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <h1 className="text-3xl sm:text-5xl font-semibold text-slate-800 leading-tight">
            Healthcare begins before you enter the hospital.
          </h1>
          <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
            Tell us how you're feeling, choose the right care, meet the right doctor -- removing
            the uncertainty from a hospital visit.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/symptom-guide"
              className="px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors w-full sm:w-auto"
            >
              Start with your symptoms
            </Link>
            <Link
              to="/departments"
              className="px-6 py-3 rounded-xl bg-white text-brand-700 font-medium border border-brand-200 hover:bg-brand-50 transition-colors w-full sm:w-auto"
            >
              Browse departments
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-semibold text-slate-800 text-center">How it works</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white font-semibold">
                {index + 1}
              </div>
              <h3 className="mt-4 font-semibold text-slate-800">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">Explore our departments</h2>
          <Link to="/departments" className="text-brand-600 font-medium hover:text-brand-700 text-sm">
            View all &rarr;
          </Link>
        </div>

        {loading && <p className="text-slate-500">Loading departments...</p>}
        {error && (
          <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">{error}</p>
        )}
        {!loading && !error && preview.length === 0 && (
          <p className="text-slate-500">No departments available yet. Please check back soon.</p>
        )}
        {!loading && !error && preview.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {preview.map((department) => (
              <DepartmentCard key={department.id} department={department} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

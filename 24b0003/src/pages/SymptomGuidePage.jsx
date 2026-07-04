import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SYMPTOM_MAP, FALLBACK_DEPARTMENT_SLUG } from '../data/symptomMap'
import useDepartments from '../hooks/useDepartments'
import useDoctors from '../hooks/useDoctors'
import DoctorCard from '../components/DoctorCard'

// All unique keywords, for the clickable quick-pick list.
const ALL_KEYWORDS = SYMPTOM_MAP.flatMap((entry) => entry.keywords).sort()

function matchDepartmentSlug(text) {
  const lower = text.trim().toLowerCase()
  if (!lower) return null

  for (const entry of SYMPTOM_MAP) {
    if (entry.keywords.some((keyword) => lower.includes(keyword))) {
      return entry.departmentSlug
    }
  }
  return null
}

export default function SymptomGuidePage() {
  const [inputValue, setInputValue] = useState('')
  const [searchedSlug, setSearchedSlug] = useState(null)
  const [isFallback, setIsFallback] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const activeSlug = searchedSlug

  // Only look up a department once the user has actually searched -- until then
  // there's no slug to look up, so we pass a slug that will never match anything
  // real and instead gate rendering on `hasSearched` below.
  const { data: department, loading: departmentLoading, error: departmentError } = useDepartments(
    hasSearched ? activeSlug : undefined
  )
  const { data: doctors, loading: doctorsLoading, error: doctorsError } = useDoctors({
    departmentSlug: activeSlug || undefined,
    skip: !hasSearched,
  })

  const matchedDepartmentName = useMemo(() => department?.name, [department])

  function runSearch(text) {
    const matchedSlug = matchDepartmentSlug(text)
    if (matchedSlug) {
      setSearchedSlug(matchedSlug)
      setIsFallback(false)
    } else {
      setSearchedSlug(FALLBACK_DEPARTMENT_SLUG)
      setIsFallback(true)
    }
    setHasSearched(true)
  }

  function handleSubmit(event) {
    event.preventDefault()
    runSearch(inputValue)
  }

  function handleKeywordClick(keyword) {
    setInputValue(keyword)
    runSearch(keyword)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-semibold text-slate-800">Symptom Guide</h1>
      <p className="mt-2 text-slate-500">
        Tell us how you're feeling and we'll point you to the right department to start with.
      </p>

      <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4">
        This is a simple guide, not a medical diagnosis. For emergencies, see the{' '}
        <Link to="/emergency" className="font-medium underline hover:text-amber-900">
          Emergency page
        </Link>
        .
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          placeholder="e.g. chest pain, fever, headache..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-400"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors"
        >
          Find my department
        </button>
      </form>

      <div className="mt-6">
        <p className="text-sm text-slate-500 mb-2">Or pick a common symptom:</p>
        <div className="flex flex-wrap gap-2">
          {ALL_KEYWORDS.map((keyword) => (
            <button
              key={keyword}
              type="button"
              onClick={() => handleKeywordClick(keyword)}
              className="px-3 py-1.5 rounded-full text-sm border border-slate-200 bg-white text-slate-600 hover:border-brand-400 hover:text-brand-700 transition-colors"
            >
              {keyword}
            </button>
          ))}
        </div>
      </div>

      {hasSearched && (
        <div className="mt-12">
          {isFallback && (
            <p className="rounded-xl bg-brand-50 border border-brand-100 text-brand-800 text-sm p-4 mb-6">
              We're not sure based on that description, but General Medicine is always a safe
              first stop.
            </p>
          )}

          {departmentLoading && <p className="text-slate-500">Looking up the right department...</p>}

          {departmentError && (
            <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">
              {departmentError}
            </p>
          )}

          {!departmentLoading && !departmentError && !department && (
            <p className="text-slate-500">
              We couldn't find that department right now. Please try the Departments page directly.
            </p>
          )}

          {!departmentLoading && !departmentError && department && (
            <>
              <h2 className="text-2xl font-semibold text-slate-800">
                Suggested department: {matchedDepartmentName}
              </h2>
              <p className="mt-2 text-slate-500 max-w-2xl">{department.description}</p>

              <h3 className="mt-8 text-lg font-semibold text-slate-800">Available doctors</h3>
              <div className="mt-4">
                {doctorsLoading && <p className="text-slate-500">Loading doctors...</p>}
                {doctorsError && (
                  <p className="text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4">
                    {doctorsError}
                  </p>
                )}
                {!doctorsLoading && !doctorsError && doctors && doctors.length === 0 && (
                  <p className="text-slate-500">No doctors are listed for this department yet.</p>
                )}
                {!doctorsLoading && !doctorsError && doctors && doctors.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {doctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

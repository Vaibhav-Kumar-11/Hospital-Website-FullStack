const FIRST_AID_BASICS = [
  'Bleeding: Apply firm, steady pressure with a clean cloth and call for help immediately.',
  'Choking: Encourage coughing; if unable to breathe, call for help immediately.',
  'CPR-awareness: If someone is unresponsive and not breathing normally, call for help immediately -- trained responders should perform CPR.',
  'Burns: Cool the area with running water and call for help immediately for anything beyond a minor burn.',
  'Unconsciousness: Keep the person safe and call for help immediately -- do not give food or water.',
  'Always prioritize calling real emergency services over attempting advanced care yourself.',
]

export default function EmergencyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-semibold text-slate-800">Emergency</h1>
      <p className="mt-2 text-slate-500">
        If you or someone nearby is having a medical emergency, act now.
      </p>

      <div className="mt-8 rounded-2xl bg-rose-50 border border-rose-200 p-8 text-center">
        <p className="text-sm font-medium text-rose-700 uppercase tracking-wide">
          In an emergency, call immediately
        </p>
        <a
          href="tel:108"
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 text-white text-xl font-semibold px-8 py-4 hover:bg-rose-700 transition-colors"
        >
          Call Emergency: 108
        </a>
        <p className="mt-4 text-slate-600">
          Nearest Emergency Entrance: <span className="font-medium">Gate 2, Ground Floor</span>
        </p>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">First-aid basics while help is on the way</h2>
        <ul className="mt-4 space-y-3">
          {FIRST_AID_BASICS.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-slate-600">
              <span className="text-brand-500 font-bold" aria-hidden="true">
                &bull;
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm p-4">
        This page is informational only and is not a substitute for professional medical care.
        Always call real emergency services in an actual emergency.
      </div>
    </div>
  )
}

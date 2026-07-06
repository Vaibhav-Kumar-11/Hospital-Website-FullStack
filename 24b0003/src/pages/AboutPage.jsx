export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-semibold text-slate-800">About MediGuide</h1>
      <p className="mt-4 text-slate-600 leading-relaxed">
        I built MediGuide around a simple idea: a first-time hospital visit shouldn't feel
        confusing. Instead of making you guess which department to visit or wait in line to find
        out, I wanted a site where you describe how you're feeling, get pointed to the right
        department and doctor, and book a real available slot -- all before you arrive.
      </p>
      <p className="mt-4 text-slate-600 leading-relaxed">
        This is a student capstone project I built to demonstrate a full-stack booking
        experience. It is not a real hospital system.
      </p>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Contact</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li>
            <span className="font-medium text-slate-700">Address:</span> 123 Wellness Avenue,
            Bengaluru, India
          </li>
          <li>
            <span className="font-medium text-slate-700">Phone:</span> +91 80 1234 5678
          </li>
          <li>
            <span className="font-medium text-slate-700">Email:</span> care@mediguide.example
          </li>
          <li>
            <span className="font-medium text-slate-700">Hours:</span> Open 24/7 for Emergency;
            OPD hours Mon-Sat, 8:00 AM - 8:00 PM
          </li>
        </ul>
      </div>
    </div>
  )
}

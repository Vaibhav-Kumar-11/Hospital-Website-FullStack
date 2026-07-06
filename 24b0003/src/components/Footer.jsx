import { Link } from 'react-router-dom'
import { Cross } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-brand-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid gap-8 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-white font-semibold text-lg mb-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white">
              <Cross size={16} />
            </span>
            MediGuide
          </div>
          <p className="text-sm text-brand-200 max-w-xs">
            Removing the uncertainty from your hospital visit -- from first symptom to booked
            appointment.
          </p>
        </div>

        <div>
          <h3 className="text-white font-medium mb-2 text-sm uppercase tracking-wide">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/symptom-guide" className="hover:text-white">Symptom Guide</Link></li>
            <li><Link to="/departments" className="hover:text-white">Departments</Link></li>
            <li><Link to="/hospital-map" className="hover:text-white">Hospital Map</Link></li>
            <li><Link to="/emergency" className="hover:text-white">Emergency</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-medium mb-2 text-sm uppercase tracking-wide">Contact</h3>
          <ul className="space-y-1 text-sm text-brand-200">
            <li>123 Wellness Avenue, Bengaluru</li>
            <li>+91 80 1234 5678</li>
            <li>care@mediguide.example</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-brand-700 py-4 text-center text-xs text-brand-300">
        &copy; {new Date().getFullYear()} MediGuide Hospital. A student capstone project.
      </div>
    </footer>
  )
}

import formatTimeSlot from '../utils/formatTimeSlot'

const STATUS_STYLES = {
  scheduled: 'bg-brand-100 text-brand-700',
  cancelled: 'bg-rose-100 text-rose-600',
  completed: 'bg-slate-200 text-slate-600',
}

export default function AppointmentCard({ appointment, onCancel }) {
  const statusClass = STATUS_STYLES[appointment.status] || 'bg-slate-100 text-slate-600'
  const canCancel = appointment.status === 'scheduled'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-base font-semibold text-slate-800">{appointment.doctor_name}</h3>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusClass}`}>
            {appointment.status}
          </span>
        </div>
        <p className="text-sm text-brand-600">{appointment.department_name}</p>
        <p className="mt-1 text-sm text-slate-500">
          {appointment.date} at {formatTimeSlot(appointment.time_slot)}
        </p>
        {appointment.symptom_note && (
          <p className="mt-1 text-sm text-slate-400 italic">"{appointment.symptom_note}"</p>
        )}
      </div>

      {canCancel && onCancel && (
        <button
          onClick={() => onCancel(appointment)}
          className="shrink-0 self-start sm:self-center px-4 py-2 rounded-lg text-sm font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  )
}

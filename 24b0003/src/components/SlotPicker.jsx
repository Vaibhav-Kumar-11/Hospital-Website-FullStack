import formatTimeSlot from '../utils/formatTimeSlot'

// Renders a list of "HH:MM" time-slot strings as selectable buttons.
export default function SlotPicker({ slots, selectedSlot, onSelect }) {
  if (!slots || slots.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">
        No available slots for this date. Please try a different date.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map((slot) => {
        const isSelected = slot === selectedSlot
        return (
          <button
            key={slot}
            type="button"
            onClick={() => onSelect(slot)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isSelected
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-brand-400 hover:text-brand-700'
            }`}
          >
            {formatTimeSlot(slot)}
          </button>
        )
      })}
    </div>
  )
}

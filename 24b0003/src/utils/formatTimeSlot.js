// Converts a 24-hour "HH:MM" time-slot value (as returned by the API) into a
// friendly 12-hour display label, e.g. "14:00" -> "2:00 PM".
export default function formatTimeSlot(value) {
  if (!value) return value
  const [hourStr, minute] = value.split(':')
  const hour = Number(hourStr)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minute} ${period}`
}

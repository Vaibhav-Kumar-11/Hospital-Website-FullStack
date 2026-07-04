import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Zones: schematic airport-terminal-map style. Department zones link to the
// matching DepartmentDetailPage via slug; utility zones (reception, parking,
// etc.) are informational only.
const ZONES = [
  { id: 'reception', label: 'Reception', x: 40, y: 40, width: 160, height: 90, color: '#c9dfe0', slug: null },
  { id: 'emergency', label: 'Emergency', x: 40, y: 150, width: 160, height: 100, color: '#f3c9c9', slug: null },
  { id: 'cardiology', label: 'Cardiology', x: 220, y: 40, width: 160, height: 90, color: '#b8d8da', slug: 'cardiology' },
  { id: 'pediatrics', label: 'Pediatrics', x: 220, y: 150, width: 160, height: 100, color: '#cfe6cf', slug: 'pediatrics' },
  { id: 'radiology', label: 'Radiology', x: 400, y: 40, width: 160, height: 90, color: '#d6cdea', slug: 'radiology' },
  { id: 'orthopedics', label: 'Orthopedics', x: 400, y: 150, width: 160, height: 100, color: '#f0ddb8', slug: 'orthopedics' },
  { id: 'pharmacy', label: 'Pharmacy', x: 580, y: 40, width: 140, height: 90, color: '#c9e0ea', slug: null },
  { id: 'general-medicine', label: 'General Medicine', x: 580, y: 150, width: 140, height: 100, color: '#dbe8c9', slug: 'general-medicine' },
  { id: 'cafeteria', label: 'Cafeteria', x: 40, y: 280, width: 200, height: 80, color: '#f0e3c9', slug: null },
  { id: 'parking', label: 'Parking', x: 260, y: 280, width: 460, height: 80, color: '#dcdfe3', slug: null },
]

export default function HospitalMapPage() {
  const [hoveredZone, setHoveredZone] = useState(null)
  const navigate = useNavigate()

  function handleZoneClick(zone) {
    if (zone.slug) {
      navigate(`/departments/${zone.slug}`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-semibold text-slate-800">Hospital Map</h1>
      <p className="mt-2 text-slate-500 max-w-2xl">
        A schematic overview of the ground floor. Click a department zone to see its doctors, or
        hover to preview.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm overflow-x-auto">
        <svg viewBox="0 0 760 400" className="w-full min-w-[640px]" role="img" aria-label="Hospital floor plan schematic">
          {/* Building outline */}
          <rect x="10" y="10" width="740" height="370" rx="12" fill="#fafbfb" stroke="#94a3b8" strokeWidth="3" />

          {/* Main entrance marker */}
          <rect x="90" y="0" width="60" height="14" fill="#94a3b8" />
          <text x="120" y="-4" textAnchor="middle" fontSize="11" fill="#64748b">
            Main Entrance
          </text>

          {ZONES.map((zone) => {
            const isHovered = hoveredZone === zone.id
            const isClickable = Boolean(zone.slug)
            return (
              <g
                key={zone.id}
                onMouseEnter={() => setHoveredZone(zone.id)}
                onMouseLeave={() => setHoveredZone(null)}
                onClick={() => handleZoneClick(zone)}
                style={{ cursor: isClickable ? 'pointer' : 'default' }}
              >
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  rx="10"
                  fill={zone.color}
                  stroke={isHovered ? '#326971' : '#94a3b8'}
                  strokeWidth={isHovered ? 3 : 1.5}
                  opacity={isHovered ? 1 : 0.9}
                />
                <text
                  x={zone.x + zone.width / 2}
                  y={zone.y + zone.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="14"
                  fontWeight="600"
                  fill="#26464c"
                >
                  {zone.label}
                </text>
                {isClickable && (
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 18}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#3f8489"
                  >
                    Click to view &rarr;
                  </text>
                )}
              </g>
            )
          })}

          {/* Gate 2 marker near Emergency zone, referenced on the Emergency page */}
          <text x="120" y="264" textAnchor="middle" fontSize="10" fill="#7f1d1d">
            Gate 2
          </text>
        </svg>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Map is a simplified schematic for orientation only and not to exact architectural scale.
      </p>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Baby, Bone, Sparkles, Stethoscope, UserCheck, Ambulance, Pill, Coffee, Car, DoorOpen, LogOut } from 'lucide-react'

const ICON_COLOR = '#26464c'

// Zones: schematic airport-terminal-map style. Department zones link to the
// matching DepartmentDetailPage via slug; utility zones (reception, parking,
// etc.) are informational only. This shows one floor's worth of MediGuide's
// 10 departments -- not all ten fit realistically on a single schematic floor.
const ZONES = [
  { id: 'reception', label: 'Reception', x: 40, y: 60, width: 150, height: 90, color: '#c9dfe0', slug: null, icon: UserCheck },
  { id: 'emergency', label: 'Emergency', x: 40, y: 170, width: 150, height: 100, color: '#f3c9c9', slug: null, icon: Ambulance },
  { id: 'cardiology', label: 'Cardiology', x: 210, y: 60, width: 150, height: 90, color: '#b8d8da', slug: 'cardiology', icon: Heart },
  { id: 'pediatrics', label: 'Pediatrics', x: 210, y: 170, width: 150, height: 100, color: '#cfe6cf', slug: 'pediatrics', icon: Baby },
  { id: 'dermatology', label: 'Dermatology', x: 380, y: 60, width: 150, height: 90, color: '#d6cdea', slug: 'dermatology', icon: Sparkles },
  { id: 'orthopedics', label: 'Orthopedics', x: 380, y: 170, width: 150, height: 100, color: '#f0ddb8', slug: 'orthopedics', icon: Bone },
  { id: 'pharmacy', label: 'Pharmacy', x: 550, y: 60, width: 150, height: 90, color: '#c9e0ea', slug: null, icon: Pill },
  { id: 'general-medicine', label: 'General Medicine', x: 550, y: 170, width: 150, height: 100, color: '#dbe8c9', slug: 'general-medicine', icon: Stethoscope },
  { id: 'cafeteria', label: 'Cafeteria', x: 40, y: 300, width: 200, height: 80, color: '#f0e3c9', slug: null, icon: Coffee },
  { id: 'parking', label: 'Parking', x: 260, y: 300, width: 440, height: 80, color: '#dcdfe3', slug: null, icon: Car },
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-3xl font-semibold text-slate-800">Hospital Map</h1>
      <p className="mt-2 text-slate-500 max-w-2xl">
        A schematic overview of the ground floor -- 5 of MediGuide's 10 departments are based
        here. Click a department zone to see its doctors, or hover to preview.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm overflow-x-auto">
        <svg viewBox="0 0 760 400" className="w-full min-w-[700px]" role="img" aria-label="Hospital floor plan schematic">
          {/* Building outline */}
          <rect x="10" y="10" width="740" height="370" rx="12" fill="#fafbfb" stroke="#94a3b8" strokeWidth="3" />

          {/* Main entrance marker, pointing down into Reception */}
          <g>
            <DoorOpen x={104} y={16} width={22} height={22} color="#64748b" />
            <text x="140" y="33" fontSize="11" fontWeight="600" fill="#64748b">
              Main Entrance
            </text>
            <line x1="115" y1="40" x2="115" y2="58" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowhead)" />
          </g>

          {/* Emergency exit marker, top-right corner */}
          <g>
            <LogOut x={650} y={16} width={20} height={20} color="#7f1d1d" />
            <text x="676" y="32" fontSize="11" fontWeight="600" fill="#7f1d1d">
              Emergency Exit
            </text>
          </g>

          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#64748b" />
            </marker>
          </defs>

          {ZONES.map((zone) => {
            const isHovered = hoveredZone === zone.id
            const isClickable = Boolean(zone.slug)
            const Icon = zone.icon
            const centerX = zone.x + zone.width / 2
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
                <Icon x={centerX - 11} y={zone.y + 12} width={22} height={22} color={ICON_COLOR} />
                <text
                  x={centerX}
                  y={zone.y + 52}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="600"
                  fill="#26464c"
                >
                  {zone.label}
                </text>
                {isClickable && (
                  <text
                    x={centerX}
                    y={zone.y + 70}
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

          {/* Gate 2 marker just below the Emergency zone, referenced on the Emergency page */}
          <text x="115" y="288" textAnchor="middle" fontSize="10" fill="#7f1d1d">
            Gate 2
          </text>
        </svg>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        Map is a simplified schematic for orientation only and not to exact architectural scale.
        The remaining departments are reachable any time from the{' '}
        <a href="/departments" className="text-brand-600 hover:text-brand-700 font-medium">
          Departments
        </a>{' '}
        page.
      </p>
    </div>
  )
}

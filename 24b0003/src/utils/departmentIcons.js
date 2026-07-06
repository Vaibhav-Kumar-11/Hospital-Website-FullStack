import { Stethoscope, Heart, Sparkles, Smile, Bone, Eye, Baby, Ribbon, Brain, Ear, Hospital } from 'lucide-react'

// Maps the short icon keyword seeded by the backend (e.g. "stethoscope") to an
// actual lucide-react icon component. Falls back to a generic hospital icon
// for any keyword that isn't recognized.
const ICON_MAP = {
  stethoscope: Stethoscope,
  heart: Heart,
  sparkles: Sparkles,
  tooth: Smile,
  bone: Bone,
  eye: Eye,
  baby: Baby,
  ribbon: Ribbon,
  brain: Brain,
  ear: Ear,
}

export default function getDepartmentIcon(iconKeyword) {
  return ICON_MAP[iconKeyword] || Hospital
}

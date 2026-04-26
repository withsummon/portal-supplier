import {
  BarChart3,
  Building2,
  Cpu,
  Database,
  Eye,
  FileText,
  MessageSquareText,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react'

export const PRODUCT_ICON_OPTIONS = [
  { id: 'Cpu', label: 'AI/CPU', icon: Cpu },
  { id: 'Database', label: 'Database', icon: Database },
  { id: 'BarChart3', label: 'Analytics', icon: BarChart3 },
  { id: 'Shield', label: 'Security', icon: Shield },
  { id: 'MessageSquareText', label: 'Chat', icon: MessageSquareText },
  { id: 'Eye', label: 'Vision', icon: Eye },
  { id: 'Building2', label: 'Business', icon: Building2 },
  { id: 'Users', label: 'Users', icon: Users },
  { id: 'Sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'FileText', label: 'Document', icon: FileText },
] as const

export function getProductIcon(iconName: string) {
  return (
    PRODUCT_ICON_OPTIONS.find((option) => option.id === iconName)?.icon ??
    PRODUCT_ICON_OPTIONS[0].icon
  )
}

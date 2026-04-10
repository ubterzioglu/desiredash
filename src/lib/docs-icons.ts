import {
  Book,
  Calendar,
  FileText,
  Home,
  Layers,
  type LucideIcon,
  TestTube,
} from 'lucide-react'

import type { DocIconKey } from '@/lib/docs-data'

const DOC_ICON_MAP: Record<DocIconKey, LucideIcon> = {
  book: Book,
  calendar: Calendar,
  'file-text': FileText,
  home: Home,
  layers: Layers,
  'test-tube': TestTube,
}

export function getDocIcon(iconKey: DocIconKey): LucideIcon {
  return DOC_ICON_MAP[iconKey]
}

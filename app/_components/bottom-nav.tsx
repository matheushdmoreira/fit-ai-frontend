'use client'

import {
  Calendar,
  ChartNoAxesColumn,
  House,
  Sparkles,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type NavItem = {
  icon: typeof House
  href: string
  label: string
  isCenter?: boolean
}

type BottomNavProps = {
  calendarHref?: string
}

export function BottomNav({ calendarHref }: BottomNavProps) {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { icon: House, href: '/', label: 'Início' },
    { icon: Calendar, href: calendarHref ?? '#', label: 'Agenda' },
    { icon: Sparkles, href: '#', label: 'AI', isCenter: true },
    { icon: ChartNoAxesColumn, href: '/stats', label: 'Estatísticas' },
    { icon: UserRound, href: '#', label: 'Perfil' },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-6 rounded-t-[20px] border-t border-border bg-background px-6 py-4">
      {navItems.map((item) => {
        const isActive =
          item.label === 'Agenda'
            ? pathname.startsWith('/workout-plans')
            : pathname === item.href
        const Icon = item.icon

        if (item.isCenter) {
          return (
            <span
              key={item.label}
              className="flex items-center justify-center rounded-full bg-primary p-4"
            >
              <Icon className="size-6 text-primary-foreground" />
            </span>
          )
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              'flex items-center p-3',
              isActive ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-6" />
          </Link>
        )
      })}
    </nav>
  )
}

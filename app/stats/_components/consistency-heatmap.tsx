import dayjs, { type Dayjs } from 'dayjs'
import { cn } from '@/lib/utils'

const MONTH_LABELS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
] as const

type ConsistencyByDay = Record<
  string,
  { workoutDayCompleted: boolean; workoutDayStarted: boolean }
>

type MonthGroup = {
  label: string
  weeks: Dayjs[][]
}

function getMondayOfWeek(date: Dayjs): Dayjs {
  const dow = date.day()
  return date.subtract(dow === 0 ? 6 : dow - 1, 'day')
}

function getSundayOfWeek(date: Dayjs): Dayjs {
  const dow = date.day()
  return date.add(dow === 0 ? 0 : 7 - dow, 'day')
}

function getHeatmapMonths(): MonthGroup[] {
  const today = dayjs()
  const firstMonthStart = today.subtract(2, 'month').startOf('month')
  const lastMonthEnd = today.endOf('month').startOf('day')

  const firstMonday = getMondayOfWeek(firstMonthStart)
  const lastSunday = getSundayOfWeek(lastMonthEnd)

  const validMonths = new Set<string>()
  for (let i = 0; i < 3; i++) {
    validMonths.add(today.subtract(2 - i, 'month').format('YYYY-MM'))
  }

  const monthMap = new Map<string, MonthGroup>()
  let current = firstMonday

  while (
    current.isBefore(lastSunday, 'day') ||
    current.isSame(lastSunday, 'day')
  ) {
    const week: Dayjs[] = []
    for (let d = 0; d < 7; d++) {
      week.push(current.add(d, 'day'))
    }

    const thursday = week[3]
    const monthKey = thursday.format('YYYY-MM')

    if (validMonths.has(monthKey)) {
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          label: MONTH_LABELS[thursday.month()],
          weeks: [],
        })
      }
      monthMap.get(monthKey)?.weeks.push(week)
    }

    current = current.add(7, 'day')
  }

  return Array.from(monthMap.values())
}

export function ConsistencyHeatmap({
  consistencyByDay,
}: {
  consistencyByDay: ConsistencyByDay
}) {
  const months = getHeatmapMonths()
  const allWeeks = months.flatMap((m) => m.weeks)
  const totalWeeks = allWeeks.length

  return (
    <div
      className="grid rounded-xl border border-border p-5"
      style={{
        gridTemplateColumns: `repeat(${totalWeeks}, 1fr)`,
        gap: '4px',
      }}
    >
      {months.map((month) => (
        <span
          key={month.label}
          className="mb-0.5 font-heading text-xs leading-[1.4] text-muted-foreground"
          style={{ gridColumn: `span ${month.weeks.length}` }}
        >
          {month.label}
        </span>
      ))}

      {Array.from({ length: 7 }, (_, dayIdx) =>
        allWeeks.map((week) => {
          const day = week[dayIdx]
          const dateStr = day.format('YYYY-MM-DD')
          const dayData = consistencyByDay[dateStr]

          return (
            <div
              key={dateStr}
              className={cn(
                'aspect-square rounded-md',
                dayData?.workoutDayCompleted && 'bg-primary',
                dayData?.workoutDayStarted &&
                  !dayData?.workoutDayCompleted &&
                  'bg-primary/20',
                !dayData?.workoutDayStarted &&
                  !dayData?.workoutDayCompleted &&
                  'border border-border',
              )}
            />
          )
        }),
      )}
    </div>
  )
}

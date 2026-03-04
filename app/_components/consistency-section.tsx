import dayjs from 'dayjs'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const WEEK_DAY_SHORT = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] as const

function getWeekDates() {
  const today = dayjs()
  const dow = today.day()
  const monday = today.subtract(dow === 0 ? 6 : dow - 1, 'day')
  return Array.from({ length: 7 }, (_, i) => monday.add(i, 'day'))
}

export function ConsistencySection({
  consistencyByDay,
  workoutStreak,
}: {
  consistencyByDay: Record<
    string,
    { workoutDayCompleted: boolean; workoutDayStarted: boolean }
  >
  workoutStreak: number
}) {
  const weekDates = getWeekDates()
  const todayStr = dayjs().format('YYYY-MM-DD')

  return (
    <section className="flex flex-col gap-3 px-5 pt-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg leading-[1.4] font-semibold text-foreground">
          Consistência
        </h2>
        <span className="cursor-pointer font-heading text-xs text-primary">
          Ver histórico
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center justify-between rounded-xl border border-border p-5">
          {weekDates.map((date, i) => {
            const dateStr = date.format('YYYY-MM-DD')
            const dayData = consistencyByDay[dateStr]
            const isToday = dateStr === todayStr

            return (
              <div key={dateStr} className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    'size-5 rounded-md',
                    dayData?.workoutDayCompleted && 'bg-primary',
                    dayData?.workoutDayStarted &&
                      !dayData?.workoutDayCompleted &&
                      'bg-primary/20',
                    !dayData?.workoutDayStarted &&
                      !dayData?.workoutDayCompleted &&
                      isToday &&
                      'border-[1.6px] border-primary',
                    !dayData?.workoutDayStarted &&
                      !dayData?.workoutDayCompleted &&
                      !isToday &&
                      'border border-border',
                  )}
                />
                <span className="font-heading text-xs leading-[1.4] text-muted-foreground">
                  {WEEK_DAY_SHORT[i]}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2 self-stretch rounded-xl bg-streak/8 px-6 py-2">
          <Image src="/fire-icon.svg" alt="" width={15} height={20} />
          <span className="font-heading text-base leading-[1.15] font-semibold text-foreground">
            {workoutStreak}
          </span>
        </div>
      </div>
    </section>
  )
}

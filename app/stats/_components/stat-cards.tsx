import { CircleCheck, CirclePercent, Hourglass } from 'lucide-react'

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${hours}h${String(minutes).padStart(2, '0')}m`
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof CircleCheck
  value: string
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
      <div className="flex size-[34px] items-center justify-center rounded-full bg-primary/8">
        <Icon className="size-4 text-primary" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
          {value}
        </p>
        <p className="font-heading text-xs leading-[1.4] text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  )
}

export function StatCards({
  completedWorkoutsCount,
  conclusionRate,
  totalTimeInSeconds,
}: {
  completedWorkoutsCount: number
  conclusionRate: number
  totalTimeInSeconds: number
}) {
  return (
    <>
      <div className="flex gap-3">
        <div className="flex-1">
          <StatCard
            icon={CircleCheck}
            value={String(completedWorkoutsCount)}
            label="Treinos Feitos"
          />
        </div>
        <div className="flex-1">
          <StatCard
            icon={CirclePercent}
            value={`${Math.round(conclusionRate * 100)}%`}
            label="Taxa de conclusão"
          />
        </div>
      </div>
      <StatCard
        icon={Hourglass}
        value={formatTime(totalTimeInSeconds)}
        label="Tempo Total"
      />
    </>
  )
}

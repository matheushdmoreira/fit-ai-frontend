import { Calendar, Dumbbell, Timer } from 'lucide-react'
import Image from 'next/image'

const WEEK_DAY_LABEL: Record<string, string> = {
  MONDAY: 'SEGUNDA',
  TUESDAY: 'TERÇA',
  WEDNESDAY: 'QUARTA',
  THURSDAY: 'QUINTA',
  FRIDAY: 'SEXTA',
  SATURDAY: 'SÁBADO',
  SUNDAY: 'DOMINGO',
}

type TrainingDayCardProps = {
  name: string
  weekDay: string
  estimatedDurationInSeconds: number
  exercisesCount: number
  coverImageUrl?: string
  action?: React.ReactNode
}

export function TrainingDayCard({
  name,
  weekDay,
  estimatedDurationInSeconds,
  exercisesCount,
  coverImageUrl,
  action,
}: TrainingDayCardProps) {
  const durationInMinutes = Math.round(estimatedDurationInSeconds / 60)

  const cardInfo = (
    <>
      <h3 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
        {name}
      </h3>
      <div className="flex gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-background/70">
          <Timer className="size-3.5" />
          {durationInMinutes}min
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-background/70">
          <Dumbbell className="size-3.5" />
          {exercisesCount} exercícios
        </span>
      </div>
    </>
  )

  return (
    <div className="relative flex h-[200px] w-full flex-col items-start justify-between overflow-hidden rounded-xl p-5">
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={name}
          fill
          className="pointer-events-none object-cover"
        />
      )}
      <div className="absolute inset-0 bg-foreground/40" />

      <div className="relative">
        <span className="inline-flex items-center gap-1 rounded-full bg-background/16 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-background backdrop-blur-sm">
          <Calendar className="size-3.5" />
          {WEEK_DAY_LABEL[weekDay] ?? weekDay}
        </span>
      </div>

      {action ? (
        <div className="relative flex w-full items-end justify-between">
          <div className="flex flex-col gap-2">{cardInfo}</div>
          {action}
        </div>
      ) : (
        <div className="relative flex flex-col gap-2">{cardInfo}</div>
      )}
    </div>
  )
}

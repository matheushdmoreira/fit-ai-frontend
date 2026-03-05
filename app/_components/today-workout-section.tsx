import Link from 'next/link'
import { TrainingDayCard } from '@/app/_components/training-day-card'

type TodayWorkoutSectionProps = {
  todayWorkoutDay: {
    id: string
    workoutPlanId: string
    name: string
    weekDay: string
    estimatedDurationInSeconds: number
    exercisesCount: number
    coverImageUrl?: string
  }
}

export function TodayWorkoutSection({
  todayWorkoutDay,
}: TodayWorkoutSectionProps) {
  return (
    <section className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg leading-[1.4] font-semibold text-foreground">
          Treino de Hoje
        </h2>
        <span className="cursor-pointer font-heading text-xs text-primary">
          Ver treinos
        </span>
      </div>

      <Link
        href={`/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`}
      >
        <TrainingDayCard
          name={todayWorkoutDay.name}
          weekDay={todayWorkoutDay.weekDay}
          estimatedDurationInSeconds={
            todayWorkoutDay.estimatedDurationInSeconds
          }
          exercisesCount={todayWorkoutDay.exercisesCount}
          coverImageUrl={todayWorkoutDay.coverImageUrl}
        />
      </Link>
    </section>
  )
}

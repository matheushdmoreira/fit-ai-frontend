import { Zap } from 'lucide-react'
import type { GetWorkoutDay200ExercisesItem } from '@/app/_lib/api/fetch-generated'
import { ExerciseHelpButton } from './exercise-help-button'

interface ExerciseCardProps {
  exercise: GetWorkoutDay200ExercisesItem
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="flex flex-col justify-center gap-3 rounded-xl border border-border p-5">
      <div className="flex items-center justify-between">
        <span className="font-heading text-base leading-[1.4] font-semibold text-foreground">
          {exercise.name}
        </span>

        <ExerciseHelpButton exerciseName={exercise.name} />
      </div>
      <div className="flex gap-1.5">
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
          {exercise.sets} séries
        </span>

        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
          {exercise.reps} reps
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-heading text-xs font-semibold uppercase text-muted-foreground">
          <Zap className="size-3.5" />
          {exercise.restTimeInSeconds}s
        </span>
      </div>
    </div>
  )
}

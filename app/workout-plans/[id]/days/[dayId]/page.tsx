import { CircleHelp, Zap } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/app/_components/bottom-nav'
import { TrainingDayCard } from '@/app/_components/training-day-card'
import {
  type GetWorkoutDay200,
  getWorkoutDay,
} from '@/app/_lib/api/fetch-generated'
import { authClient } from '@/app/_lib/auth-client'
import { Button } from '@/components/ui/button'
import { BackButton } from './_components/back-button'
import { CompleteWorkoutButton } from './_components/complete-workout-button'
import { StartWorkoutButton } from './_components/start-workout-button'

type PageParams = {
  id: string
  dayId: string
}

export default async function WorkoutDayPage({
  params,
}: {
  params: Promise<PageParams>
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session.data?.user) {
    redirect('/auth')
  }

  const { id: workoutPlanId, dayId: workoutDayId } = await params

  const response = await getWorkoutDay(workoutPlanId, workoutDayId)

  if (response.status !== 200) {
    redirect('/')
  }

  const workoutDay = response.data as GetWorkoutDay200

  const inProgressSession = workoutDay.sessions.find(
    (s) => s.startedAt && !s.completedAt,
  )
  const hasCompleted = workoutDay.sessions.some((s) => s.completedAt)
  const hasStartedNotCompleted = !!inProgressSession

  const sortedExercises = [...workoutDay.exercises].sort(
    (a, b) => a.order - b.order,
  )

  const cardAction = hasCompleted ? (
    <span className="rounded-full bg-background/20 px-4 py-2 font-heading text-sm font-semibold text-background backdrop-blur-sm">
      Concluído!
    </span>
  ) : !hasStartedNotCompleted ? (
    <StartWorkoutButton
      workoutPlanId={workoutPlanId}
      workoutDayId={workoutDayId}
    />
  ) : undefined

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center justify-between">
          <BackButton />

          <h1 className="font-heading text-lg leading-[1.4] font-semibold text-foreground">
            Treino de Hoje
          </h1>

          <div className="size-6" />
        </div>

        <TrainingDayCard
          name={workoutDay.name}
          weekDay={workoutDay.weekDay}
          estimatedDurationInSeconds={workoutDay.estimatedDurationInSeconds}
          exercisesCount={workoutDay.exercises.length}
          coverImageUrl={workoutDay.coverImageUrl}
          action={cardAction}
        />

        <div className="flex flex-col gap-3">
          {sortedExercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex flex-col justify-center gap-3 rounded-xl border border-border p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-heading text-base leading-[1.4] font-semibold text-foreground">
                  {exercise.name}
                </span>

                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground"
                >
                  <CircleHelp className="size-5" />
                </Button>
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
          ))}
        </div>

        {hasStartedNotCompleted && inProgressSession && (
          <CompleteWorkoutButton
            workoutPlanId={workoutPlanId}
            workoutDayId={workoutDayId}
            sessionId={inProgressSession.id}
          />
        )}
      </div>

      <BottomNav activePage="calendar" />
    </div>
  )
}

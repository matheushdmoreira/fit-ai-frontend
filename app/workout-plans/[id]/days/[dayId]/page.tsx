import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/app/_components/bottom-nav'
import { TrainingDayCard } from '@/app/_components/training-day-card'
import {
  type GetWorkoutDay200,
  getWorkoutDay,
} from '@/app/_lib/api/fetch-generated'
import { authClient } from '@/app/_lib/auth-client'
import { needsOnboarding } from '@/app/_lib/check-onboarding'
import { BackButton } from './_components/back-button'
import { CompleteWorkoutButton } from './_components/complete-workout-button'
import { ExerciseCard } from './_components/exercise-card'
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

  if (await needsOnboarding()) {
    redirect('/onboarding')
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
            <ExerciseCard key={exercise.id} exercise={exercise} />
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

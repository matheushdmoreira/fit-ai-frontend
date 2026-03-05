import { Calendar, Goal, Zap } from 'lucide-react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/app/_components/bottom-nav'
import { TrainingDayCard } from '@/app/_components/training-day-card'
import {
  type GetWorkoutPlan200,
  type GetWorkoutPlan200WorkoutDaysItem,
  getWorkoutPlan,
} from '@/app/_lib/api/fetch-generated'
import { authClient } from '@/app/_lib/auth-client'
import { needsOnboarding } from '@/app/_lib/check-onboarding'

const WEEK_DAY_LABEL: Record<string, string> = {
  MONDAY: 'SEGUNDA',
  TUESDAY: 'TERÇA',
  WEDNESDAY: 'QUARTA',
  THURSDAY: 'QUINTA',
  FRIDAY: 'SEXTA',
  SATURDAY: 'SÁBADO',
  SUNDAY: 'DOMINGO',
}

function RestDayCard({ day }: { day: GetWorkoutPlan200WorkoutDaysItem }) {
  return (
    <div className="flex h-[110px] w-full flex-col items-start justify-between rounded-xl bg-muted p-5">
      <div>
        <span className="inline-flex items-center gap-1 rounded-full bg-foreground/8 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-foreground backdrop-blur-sm">
          <Calendar className="size-3.5" />
          {WEEK_DAY_LABEL[day.weekDay] ?? day.weekDay}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Zap className="size-5 text-foreground" />
        <h3 className="font-heading text-2xl leading-[1.05] font-semibold text-foreground">
          Descanso
        </h3>
      </div>
    </div>
  )
}

export default async function WorkoutPlanPage({
  params,
}: {
  params: Promise<{ id: string }>
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

  const { id: workoutPlanId } = await params
  const response = await getWorkoutPlan(workoutPlanId)

  if (response.status !== 200) {
    redirect('/')
  }

  const workoutPlan = response.data as GetWorkoutPlan200

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <section className="relative h-[296px] shrink-0 overflow-hidden rounded-b-[20px]">
        <Image
          src="/banner-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0 rounded-b-[20px]"
          style={{
            backgroundImage:
              'linear-gradient(238deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
          }}
        />

        <div className="relative flex h-full flex-col justify-between px-5 pb-10 pt-5">
          <p className="font-display text-[22px] uppercase leading-[1.15] text-background">
            Fit.ai
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold uppercase text-primary-foreground">
                <Goal className="size-4" />
                {workoutPlan.name}
              </span>
            </div>
            <h1 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
              Plano de Treino
            </h1>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-3 p-5">
        {workoutPlan.workoutDays.map((day) =>
          day.isRest ? (
            <RestDayCard key={day.id} day={day} />
          ) : (
            <Link
              key={day.id}
              href={`/workout-plans/${workoutPlanId}/days/${day.id}`}
            >
              <TrainingDayCard
                name={day.name}
                weekDay={day.weekDay}
                estimatedDurationInSeconds={day.estimatedDurationInSeconds}
                exercisesCount={day.exercisesCount}
                coverImageUrl={day.coverImageUrl}
              />
            </Link>
          ),
        )}
      </section>

      <BottomNav activePage="calendar" />
    </div>
  )
}

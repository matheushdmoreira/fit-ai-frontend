import dayjs from 'dayjs'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/app/_components/bottom-nav'
import { type GetStats200, getStats } from '@/app/_lib/api/fetch-generated'
import { authClient } from '@/app/_lib/auth-client'
import { needsOnboarding } from '@/app/_lib/check-onboarding'
import { ConsistencyHeatmap } from '@/app/stats/_components/consistency-heatmap'
import { StatCards } from '@/app/stats/_components/stat-cards'
import { StreakBanner } from '@/app/stats/_components/streak-banner'

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session.data) {
    redirect('/auth')
  }

  if (await needsOnboarding()) {
    redirect('/onboarding')
  }

  const today = dayjs()
  const from = today.subtract(2, 'month').startOf('month').format('YYYY-MM-DD')
  const to = today.format('YYYY-MM-DD')

  const response = await getStats({ from, to })

  if (response.status !== 200) {
    redirect('/auth')
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = response.data as GetStats200

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <header className="flex h-14 items-center px-5">
        <p className="font-display text-[22px] uppercase leading-[1.15] text-foreground">
          Fit.ai
        </p>
      </header>

      <div className="px-5">
        <StreakBanner workoutStreak={workoutStreak} />
      </div>

      <section className="flex flex-col gap-3 p-5">
        <h2 className="font-heading text-lg font-semibold leading-[1.4] text-foreground">
          Consistência
        </h2>

        <ConsistencyHeatmap consistencyByDay={consistencyByDay} />

        <StatCards
          completedWorkoutsCount={completedWorkoutsCount}
          conclusionRate={conclusionRate}
          totalTimeInSeconds={totalTimeInSeconds}
        />
      </section>

      <BottomNav activePage="stats" />
    </div>
  )
}

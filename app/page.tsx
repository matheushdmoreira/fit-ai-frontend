import dayjs from 'dayjs'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { BannerSection } from '@/app/_components/banner-section'
import { BottomNav } from '@/app/_components/bottom-nav'
import { ConsistencySection } from '@/app/_components/consistency-section'
import { TodayWorkoutSection } from '@/app/_components/today-workout-section'
import {
  type GetHomeData200,
  getHomeData,
} from '@/app/_lib/api/fetch-generated'
import { authClient } from '@/app/_lib/auth-client'

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session.data) {
    redirect('/auth')
  }

  const response = await getHomeData(dayjs().format('YYYY-MM-DD'))

  if (response.status !== 200) {
    redirect('/auth')
  }

  const { todayWorkoutDay, workoutStreak, consistencyByDay } =
    response.data as GetHomeData200

  const firstName = session.data.user.name?.split(' ')[0] ?? ''

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <BannerSection firstName={firstName} />

      <ConsistencySection
        consistencyByDay={consistencyByDay}
        workoutStreak={workoutStreak}
      />

      {todayWorkoutDay && (
        <TodayWorkoutSection todayWorkoutDay={todayWorkoutDay} />
      )}

      <BottomNav
        calendarHref={
          todayWorkoutDay
            ? `/workout-plans/${todayWorkoutDay.workoutPlanId}/days/${todayWorkoutDay.id}`
            : undefined
        }
      />
    </div>
  )
}

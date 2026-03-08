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
  getUserTrainData,
} from '@/app/_lib/api/fetch-generated'
import { authClient } from '@/app/_lib/auth-client'

export default async function Home() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session.data?.user) {
    redirect('/auth')
  }

  const today = dayjs()
  const [homeData, trainData] = await Promise.all([
    getHomeData(today.format('YYYY-MM-DD')),
    getUserTrainData(),
  ])

  if (homeData.status !== 200) {
    throw new Error('Failed to fetch home data')
  }

  const needsOnboarding =
    !homeData.data.activeWorkoutPlanId ||
    (trainData.status === 200 && !trainData.data)
  if (needsOnboarding) redirect('/onboarding')

  const { todayWorkoutDay, workoutStreak, consistencyByDay } =
    homeData.data as GetHomeData200
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

      <BottomNav />
    </div>
  )
}

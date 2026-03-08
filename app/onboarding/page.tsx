import dayjs from 'dayjs'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ChatPanel } from '@/app/_components/chat-panel'
import { authClient } from '@/app/_lib/auth-client'
import { getHomeData, getUserTrainData } from '../_lib/api/fetch-generated'

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session.data?.user) {
    redirect('/auth')
  }

  const [homeData, trainData] = await Promise.all([
    getHomeData(dayjs().format('YYYY-MM-DD')),
    getUserTrainData(),
  ])

  if (
    homeData.status === 200 &&
    trainData.status === 200 &&
    homeData.data.activeWorkoutPlanId &&
    trainData.data
  ) {
    redirect('/')
  }

  return (
    <div className="flex h-svh flex-col bg-background">
      <ChatPanel embedded />
    </div>
  )
}

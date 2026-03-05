import { BicepsFlexed, Ruler, User, Weight } from 'lucide-react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/app/_components/bottom-nav'
import {
  type GetUserTrainData200,
  getUserTrainData,
} from '@/app/_lib/api/fetch-generated'
import { authClient } from '@/app/_lib/auth-client'
import { needsOnboarding } from '@/app/_lib/check-onboarding'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogoutButton } from './_components/logout-button'

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-xl bg-primary/8 p-5">
      <div className="flex items-center rounded-full bg-primary/8 p-2.5">
        {icon}
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="font-heading text-2xl font-semibold leading-[1.15] text-foreground">
          {value}
        </p>
        <p className="font-heading text-xs leading-[1.4] text-[#656565] uppercase">
          {label}
        </p>
      </div>
    </div>
  )
}

export default async function ProfilePage() {
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

  const response = await getUserTrainData()

  const trainData =
    response.status === 200 ? (response.data as GetUserTrainData200) : null

  const userName = session.data.user.name ?? ''
  const userImage = session.data.user.image ?? ''
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const weightKg = trainData
    ? (trainData.weightInGrams / 1000).toFixed(1).replace('.0', '')
    : '—'
  const heightCm = trainData ? String(trainData.heightInCentimeters) : '—'
  const bodyFat = trainData ? `${trainData.bodyFatPercentage}%` : '—'
  const age = trainData ? String(trainData.age) : '—'

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24">
      <header className="flex h-14 items-center px-5">
        <p className="font-display text-[22px] uppercase leading-[1.15] text-foreground">
          Fit.ai
        </p>
      </header>

      <div className="flex flex-col items-center gap-5 p-5">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-[52px]">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="text-base">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1.5">
              <p className="font-heading text-lg font-semibold leading-[1.05] text-foreground">
                {userName}
              </p>
              <p className="font-heading text-sm leading-[1.15] text-foreground/70">
                Plano Básico
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <StatCard
            icon={<Weight className="size-4 text-primary" />}
            value={weightKg}
            label="Kg"
          />
          <StatCard
            icon={<Ruler className="size-4 text-primary" />}
            value={heightCm}
            label="Cm"
          />
          <StatCard
            icon={<BicepsFlexed className="size-4 text-primary" />}
            value={bodyFat}
            label="Gc"
          />
          <StatCard
            icon={<User className="size-4 text-primary" />}
            value={age}
            label="Anos"
          />
        </div>

        <LogoutButton />
      </div>

      <BottomNav activePage="profile" />
    </div>
  )
}

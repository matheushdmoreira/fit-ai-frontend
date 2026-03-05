import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ChatPanel } from '@/app/_components/chat-panel'
import { authClient } from '@/app/_lib/auth-client'

export default async function OnboardingPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (!session.data) {
    redirect('/auth')
  }

  return (
    <div className="flex h-svh flex-col bg-background">
      <ChatPanel embedded />
    </div>
  )
}

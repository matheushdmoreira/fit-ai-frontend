'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { authClient } from '@/app/_lib/auth-client'

export default function Home() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session) {
      router.replace('/auth')
    }
  }, [isPending, session, router])

  if (isPending || !session) {
    return null
  }

  return <div>Home</div>
}

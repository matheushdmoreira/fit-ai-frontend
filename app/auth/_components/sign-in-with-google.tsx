'use client'

import Image from 'next/image'
import { authClient } from '@/app/_lib/auth-client'
import { Button } from '@/components/ui/button'

export const SignInWithGoogle = () => {
  const handleGoogleLogin = async () => {
    const callbackURL =
      typeof window !== 'undefined'
        ? `${window.location.origin}/`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/`

    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL,
    })

    if (error) {
      console.error(error.message)
    }
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      className="h-[38px] rounded-full bg-white px-6 text-black hover:bg-white/90"
    >
      <Image
        src="/google-icon.svg"
        alt=""
        width={16}
        height={16}
        className="shrink-0"
      />
      Fazer login com Google
    </Button>
  )
}

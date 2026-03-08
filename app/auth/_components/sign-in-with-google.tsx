'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { authClient } from '@/app/_lib/auth-client'
import { Button } from '@/components/ui/button'

export const SignInWithGoogle = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)

    const { error } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    })

    if (error) {
      console.error(error.message)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="h-[38px] rounded-full bg-white px-6 text-black hover:bg-white/90 disabled:opacity-80"
    >
      {isLoading ? (
        <Loader2 className="shrink-0 animate-spin text-black" size={16} />
      ) : (
        <Image
          src="/google-icon.svg"
          alt=""
          width={16}
          height={16}
          className="shrink-0"
        />
      )}
      {isLoading ? 'Redirecionando...' : 'Fazer login com Google'}
    </Button>
  )
}

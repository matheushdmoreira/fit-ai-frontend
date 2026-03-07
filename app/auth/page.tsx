'use client'

import { headers } from 'next/headers'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { authClient } from '@/app/_lib/auth-client'
import { Button } from '@/components/ui/button'

export default async function AuthPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  })

  if (session.data?.user) redirect('/')

  function handleGoogleLogin() {
    authClient.signIn.social({
      provider: 'google',
      callbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    })
  }

  return (
    <div className="relative flex min-h-svh flex-col bg-foreground">
      <div className="relative flex-1 overflow-hidden">
        <Image
          src="/login-bg.png"
          alt=""
          fill
          className="object-cover"
          priority
        />
        <div className="absolute left-1/2 top-12 -translate-x-1/2">
          <Image
            src="/fit-ai-logo.svg"
            alt="FIT.AI"
            width={85}
            height={38}
            priority
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-15 rounded-t-[20px] bg-primary px-5 pb-10 pt-12">
        <div className="flex w-full max-w-[362px] flex-col items-center gap-6">
          <h1 className="text-center font-heading text-[32px] leading-[1.05] font-semibold text-primary-foreground">
            O app que vai transformar a forma como você treina.
          </h1>
          <Button
            onClick={handleGoogleLogin}
            className="h-[38px] rounded-full bg-background px-6 text-sm font-semibold text-foreground hover:bg-background/90"
          >
            <Image src="/google-icon.svg" alt="" width={16} height={16} />
            Fazer login com Google
          </Button>
        </div>
        <p className="text-xs text-primary-foreground/70">
          ©2026 Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}

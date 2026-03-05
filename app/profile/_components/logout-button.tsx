'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/app/_lib/auth-client'

export function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await authClient.signOut()
    router.push('/auth')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 rounded-full px-4 py-2"
    >
      <span className="font-heading text-base font-semibold leading-none text-[#ff3838]">
        Sair da conta
      </span>
      <LogOut className="size-4 text-[#ff3838]" />
    </button>
  )
}

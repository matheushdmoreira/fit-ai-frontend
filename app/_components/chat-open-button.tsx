'use client'

import { Sparkles } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { chatSearchParams } from '../_lib/chat-params'

export function ChatOpenButton() {
  const [, setChatParams] = useQueryStates(chatSearchParams)

  return (
    <button
      type="button"
      onClick={() => setChatParams({ chat_open: true })}
      className="rounded-full bg-primary p-4"
    >
      <Sparkles className="size-6 text-primary-foreground" />
    </button>
  )
}

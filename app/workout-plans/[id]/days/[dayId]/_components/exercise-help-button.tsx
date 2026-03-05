'use client'

import { CircleHelp } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { chatSearchParams } from '@/app/_lib/chat-params'
import { Button } from '@/components/ui/button'

interface ExerciseHelpButtonProps {
  exerciseName: string
}

export function ExerciseHelpButton({ exerciseName }: ExerciseHelpButtonProps) {
  const [, setChatParams] = useQueryStates(chatSearchParams)

  return (
    <Button
      variant="ghost"
      size="icon-xs"
      className="text-muted-foreground"
      onClick={() =>
        setChatParams({
          chat_open: true,
          chat_initial_message: `Como executar o exercício ${exerciseName} corretamente?`,
        })
      }
    >
      <CircleHelp className="size-5" />
    </Button>
  )
}

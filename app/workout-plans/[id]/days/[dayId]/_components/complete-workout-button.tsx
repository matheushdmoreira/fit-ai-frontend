'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { completeWorkoutAction } from '../_actions'

type CompleteWorkoutButtonProps = {
  workoutPlanId: string
  workoutDayId: string
  sessionId: string
}

export function CompleteWorkoutButton({
  workoutPlanId,
  workoutDayId,
  sessionId,
}: CompleteWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    startTransition(async () => {
      await completeWorkoutAction(workoutPlanId, workoutDayId, sessionId)
    })
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isPending}
      className="w-full rounded-full py-3 font-heading text-sm font-semibold"
    >
      {isPending ? 'Concluindo...' : 'Marcar como concluído'}
    </Button>
  )
}

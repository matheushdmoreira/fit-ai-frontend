'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { startWorkoutAction } from '../_actions'

type StartWorkoutButtonProps = {
  workoutPlanId: string
  workoutDayId: string
}

export function StartWorkoutButton({
  workoutPlanId,
  workoutDayId,
}: StartWorkoutButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      await startWorkoutAction(workoutPlanId, workoutDayId)
    })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full px-4 py-2 font-heading text-sm font-semibold"
    >
      {isPending ? 'Iniciando...' : 'Iniciar Treino'}
    </Button>
  )
}

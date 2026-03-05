import Image from 'next/image'

export function StreakBanner({ workoutStreak }: { workoutStreak: number }) {
  const isActive = workoutStreak > 0

  return (
    <div className="relative flex flex-col items-center justify-center gap-6 overflow-hidden rounded-xl px-5 py-10">
      <Image
        src="/streak-banner-bg.png"
        alt=""
        fill
        className={`pointer-events-none object-cover ${isActive ? '' : 'grayscale brightness-[0.35]'}`}
      />

      <div className="relative flex flex-col items-center gap-3">
        <div className="flex items-center justify-center rounded-full border border-white/12 bg-white/12 p-3 backdrop-blur-xs">
          <Image
            src={
              isActive ? '/fire-icon-large.svg' : '/fire-icon-large-white.svg'
            }
            alt=""
            width={32}
            height={32}
          />
        </div>

        <div className="flex flex-col items-center gap-1">
          <p className="font-heading text-[48px] font-semibold leading-[0.95] text-white">
            {workoutStreak} {workoutStreak === 1 ? 'dia' : 'dias'}
          </p>
          <p className="font-heading text-base leading-[1.15] text-white/60">
            Sequência Atual
          </p>
        </div>
      </div>
    </div>
  )
}

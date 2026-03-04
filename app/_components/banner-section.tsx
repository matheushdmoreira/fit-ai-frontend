import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function BannerSection({ firstName }: { firstName: string }) {
  return (
    <section className="relative h-[296px] shrink-0 overflow-hidden rounded-b-[20px]">
      <Image
        src="/banner-bg.png"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0 rounded-b-[20px]"
        style={{
          backgroundImage:
            'linear-gradient(242deg, transparent 34%, var(--foreground) 100%)',
        }}
      />

      <div className="relative flex h-full flex-col justify-between px-5 pb-10 pt-5">
        <p className="font-display text-[22px] uppercase leading-[1.15] text-background">
          Fit.ai
        </p>

        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-heading text-2xl leading-[1.05] font-semibold text-background">
              Olá, {firstName}
            </h1>
            <p className="font-heading text-sm leading-[1.15] text-background/70">
              Bora treinar hoje?
            </p>
          </div>
          <Button className="rounded-full bg-primary px-4 py-2 font-heading text-sm font-semibold text-primary-foreground">
            Bora!
          </Button>
        </div>
      </div>
    </section>
  )
}

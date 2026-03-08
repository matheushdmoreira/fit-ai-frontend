'use client'

import { useChat } from '@ai-sdk/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DefaultChatTransport } from 'ai'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import { useQueryStates } from 'nuqs'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Streamdown } from 'streamdown'
import 'streamdown/styles.css'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { chatSearchParams } from '../_lib/chat-params'

const SUGGESTIONS = ['Monte meu plano de treino']
const ONBOARDING_SUGGESTIONS = [
  {
    label: 'Quero começar a melhorar minha saúde!',
    message: 'Quero começar a melhorar minha saúde!',
  },
]

const ONBOARDING_INITIAL_MESSAGES = [
  { id: 'onboarding-1', content: 'Bem-vindo ao FIT.AI! 🎉' },
  {
    id: 'onboarding-2',
    content:
      'O app que vai transformar a forma como você treina. Aqui você monta seu plano de treino personalizado, acompanha sua evolução com estatísticas detalhadas e conta com uma IA disponível 24h para te guiar em cada exercício.',
  },
  {
    id: 'onboarding-3',
    content:
      'Tudo pensado para você alcançar seus objetivos de forma inteligente e consistente.',
  },
  { id: 'onboarding-4', content: 'Vamos configurar seu perfil?' },
]

const chatFormSchema = z.object({
  message: z.string().trim().min(1),
})

type ChatFormValues = z.infer<typeof chatFormSchema>

interface ChatPanelProps {
  embedded?: boolean
}

export function ChatPanel({ embedded = false }: ChatPanelProps) {
  const [chatParams, setChatParams] = useQueryStates(chatSearchParams)
  const { chat_open: isOpen, chat_initial_message: initialMessage } = chatParams

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/ai' }),
  })

  const form = useForm<ChatFormValues>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { message: '' },
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const initialMessageSentRef = useRef(false)

  useEffect(() => {
    if (isOpen && initialMessage && !initialMessageSentRef.current) {
      initialMessageSentRef.current = true
      sendMessage({ text: initialMessage })
      setChatParams({ chat_initial_message: null })
    }

    if (!isOpen) {
      initialMessageSentRef.current = false
    }
  }, [isOpen, initialMessage, sendMessage, setChatParams])

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages and streaming content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleClose() {
    setChatParams({ chat_open: false, chat_initial_message: null })
  }

  function onSubmit(values: ChatFormValues) {
    sendMessage({ text: values.message })
    form.reset()
  }

  function handleSuggestion(text: string) {
    sendMessage({ text })
  }

  if (!isOpen && !embedded) return null

  const isStreaming = status === 'submitted' || status === 'streaming'

  if (embedded) {
    return (
      <div className="flex w-full flex-1 flex-col overflow-hidden bg-background">
        <header className="flex shrink-0 items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-primary/8 p-3">
              <Sparkles className="size-[18px] text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-heading text-base leading-[1.05] font-semibold text-foreground">
                Coach AI
              </span>
              <div className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-heading text-xs leading-[1.15] text-primary">
                  Online
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="rounded-full bg-primary px-4 py-2 font-heading text-sm font-semibold text-primary-foreground"
          >
            Acessar FIT.AI
          </Link>
        </header>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          {ONBOARDING_INITIAL_MESSAGES.map((message) => (
            <div key={message.id} className="flex justify-start pr-[60px]">
              <div className="rounded-xl bg-secondary p-3">
                <p className="font-heading text-sm leading-[1.4] text-foreground">
                  {message.content}
                </p>
              </div>
            </div>
          ))}

          {messages.map((message, index) => {
            const text = message.parts
              .filter((p) => p.type === 'text')
              .map((p) => p.text)
              .join('')

            if (message.role === 'user') {
              return (
                <div key={message.id} className="flex justify-end pl-[60px]">
                  <div className="rounded-xl bg-primary p-3">
                    <p className="font-heading text-sm leading-[1.4] text-primary-foreground">
                      {text}
                    </p>
                  </div>
                </div>
              )
            }

            const isLastAssistant =
              index === messages.length - 1 && message.role === 'assistant'

            return (
              <div key={message.id} className="flex justify-start pr-[60px]">
                <div className="rounded-xl bg-secondary p-3">
                  <div className="streamdown-chat font-heading text-sm leading-[1.4] text-foreground">
                    <Streamdown isAnimating={isLastAssistant && isStreaming}>
                      {text}
                    </Streamdown>
                  </div>
                </div>
              </div>
            )
          })}

          {status === 'submitted' && (
            <div className="flex justify-start pr-[60px]">
              <div className="rounded-xl bg-secondary p-3">
                <div className="flex items-center gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start pr-[60px]">
              <div className="rounded-xl bg-secondary p-3">
                <p className="font-heading text-sm leading-[1.4]">
                  Não foi possível gerar uma resposta no momento. Tente
                  novamente em instantes.
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          {messages.length === 0 && !isStreaming && (
            <div className="flex gap-2.5 overflow-x-auto px-5">
              {ONBOARDING_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => handleSuggestion(suggestion.message)}
                  className="shrink-0 rounded-full bg-[#e2e9fe] px-4 py-2 font-heading text-sm text-foreground"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2 border-t border-border p-5"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <input
                        {...field}
                        disabled={status !== 'ready'}
                        placeholder="Digite sua mensagem"
                        className="w-full rounded-full bg-secondary px-4 py-3 font-heading text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={!form.formState.isValid || status !== 'ready'}
                className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-primary disabled:opacity-50"
              >
                <ArrowUp className="size-5 text-primary-foreground" />
              </button>
            </form>
          </Form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center pt-40 px-4 pb-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={handleClose}
        aria-label="Fechar chat"
      />

      <div className="relative flex w-full flex-1 flex-col overflow-hidden rounded-[20px] bg-background">
        <header className="flex shrink-0 items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full bg-primary/8 p-3">
              <Sparkles className="size-[18px] text-primary" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="font-heading text-base leading-[1.05] font-semibold text-foreground">
                Coach AI
              </span>
              <div className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="font-heading text-xs leading-[1.15] text-primary">
                  Online
                </span>
              </div>
            </div>
          </div>
          <button type="button" onClick={handleClose}>
            <X className="size-6 text-foreground" />
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
          {messages.map((message, index) => {
            const text = message.parts
              .filter((p) => p.type === 'text')
              .map((p) => p.text)
              .join('')

            if (message.role === 'user') {
              return (
                <div key={message.id} className="flex justify-end pl-[60px]">
                  <div className="rounded-xl bg-primary p-3">
                    <p className="font-heading text-sm leading-[1.4] text-primary-foreground">
                      {text}
                    </p>
                  </div>
                </div>
              )
            }

            const isLastAssistant =
              index === messages.length - 1 && message.role === 'assistant'

            return (
              <div key={message.id} className="flex justify-start pr-[60px]">
                <div className="rounded-xl bg-secondary p-3">
                  <div className="streamdown-chat font-heading text-sm leading-[1.4] text-foreground">
                    <Streamdown isAnimating={isLastAssistant && isStreaming}>
                      {text}
                    </Streamdown>
                  </div>
                </div>
              </div>
            )
          })}

          {status === 'submitted' && (
            <div className="flex justify-start pr-[60px]">
              <div className="rounded-xl bg-secondary p-3">
                <div className="flex items-center gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start pr-[60px]">
              <div className="rounded-xl bg-secondary p-3">
                <p className="font-heading text-sm leading-[1.4] text-foreground">
                  Não foi possível gerar uma resposta no momento. Tente
                  novamente em instantes.
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex shrink-0 flex-col gap-3">
          {messages.length === 0 && !isStreaming && (
            <div className="flex gap-2.5 overflow-x-auto px-5">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="shrink-0 rounded-full bg-[#e2e9fe] px-4 py-2 font-heading text-sm text-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2 border-t border-border p-5"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <input
                        {...field}
                        disabled={status !== 'ready'}
                        placeholder="Digite sua mensagem"
                        className="w-full rounded-full bg-secondary px-4 py-3 font-heading text-sm text-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <button
                type="submit"
                disabled={!form.formState.isValid || status !== 'ready'}
                className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-primary disabled:opacity-50"
              >
                <ArrowUp className="size-5 text-primary-foreground" />
              </button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import { useQueryStates } from 'nuqs'
import { useEffect, useRef, useState } from 'react'
import { Streamdown } from 'streamdown'
import 'streamdown/styles.css'
import { chatSearchParams } from '../_lib/chat-params'

const SUGGESTIONS = ['Monte meu plano de treino']

export function ChatPanel() {
  const [chatParams, setChatParams] = useQueryStates(chatSearchParams)
  const { chat_open: isOpen, chat_initial_message: initialMessage } = chatParams

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/ai' }),
  })

  const [input, setInput] = useState('')
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleClose() {
    setChatParams({ chat_open: false, chat_initial_message: null })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || status !== 'ready') return
    sendMessage({ text: input })
    setInput('')
  }

  function handleSuggestion(text: string) {
    sendMessage({ text })
  }

  if (!isOpen) return null

  const isStreaming = status === 'submitted' || status === 'streaming'

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

          {isStreaming && messages.length === 0 && (
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

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== 'ready'}
              placeholder="Digite sua mensagem"
              className="flex-1 rounded-full bg-secondary px-4 py-3 font-heading text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim() || status !== 'ready'}
              className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-primary disabled:opacity-50"
            >
              <ArrowUp className="size-5 text-primary-foreground" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

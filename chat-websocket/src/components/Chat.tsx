import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useWebSocket} from '../hooks/useWebSocket'
import {WS_URL} from '../constants'

type ChatMessage = {
  id: string
  role: 'user' | 'ai'
  text: string
  at: number
}

const generateId = () => {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [activeUrl, setActiveUrl] = useState<string>(WS_URL)
  const [urlInput, setUrlInput] = useState<string>(WS_URL)

  const isStreamingRef = useRef<boolean>(false)
  const currentAiMessageIdRef = useRef<string | null>(null)

  const endStream = useCallback(() => {
    isStreamingRef.current = false
    currentAiMessageIdRef.current = null
  }, [])

  const appendAiChunk = useCallback((chunk: string) => {
    if (!chunk) return
    setMessages((prev) => {
      const existingId = currentAiMessageIdRef.current
      const hasExisting = Boolean(existingId && prev.some(m => m.id === existingId))
      if (!isStreamingRef.current || !hasExisting) {
        const newId = generateId()
        currentAiMessageIdRef.current = newId
        isStreamingRef.current = true
        return [
          ...prev,
          { id: newId, role: 'ai', text: chunk, at: Date.now() },
        ]
      }
      return prev.map(m => m.id === existingId ? { ...m, text: m.text + chunk } : m)
    })
  }, [])

  const handleMessage = useCallback((evt: MessageEvent) => {
    const raw = typeof evt.data === 'string' ? evt.data : String(evt.data)

    let done = false
    let chunk = ''

    // Try to parse common streaming payload shapes; fallback to plain text
    try {
      const payload = JSON.parse(raw)
      const maybeType = String((payload?.type ?? payload?.event ?? payload?.status ?? '') || '')
      const normalizedType = maybeType.toLowerCase()
      if (
        payload?.done === true ||
        ['done', 'end', 'complete', 'stop', 'finished', 'final'].includes(normalizedType)
      ) {
        done = true
      }

      if (typeof payload?.content === 'string') {
        chunk = payload.content
      } else if (typeof payload?.text === 'string') {
        chunk = payload.text
      } else if (typeof payload?.message === 'string') {
        chunk = payload.message
      } else if (payload?.delta && typeof payload.delta.content === 'string') {
        // Generic delta shape
        chunk = payload.delta.content
      } else if (
        payload?.choices &&
        Array.isArray(payload.choices) &&
        payload.choices[0]?.delta?.content
      ) {
        // OpenAI-style streaming shape
        chunk = String(payload.choices[0].delta.content)
      }
    } catch {
      const trimmed = raw.trim()
      if (trimmed === '[DONE]' || trimmed.toLowerCase() === 'done') {
        done = true
      } else {
        chunk = raw
      }
    }

    if (chunk) appendAiChunk(chunk)
    if (done) endStream()
  }, [appendAiChunk, endStream])

  const { isConnected, lastError, send, reconnect } = useWebSocket(activeUrl, handleMessage)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const connectionBadge = useMemo(() => {
    if (lastError) return (
      <span title={lastError} className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700 w-25 text-center inline-block">
        error
      </span>
    )
    return (
      <span className={`rounded-full px-2 py-1 text-xs w-25 text-center inline-block ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
        {isConnected ? 'connected' : 'disconnected'}
      </span>
    )
  }, [isConnected, lastError])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    try {
      endStream()
      send(trimmed)
      setMessages((prev) => [
        ...prev,
        { id: generateId(), role: 'user', text: trimmed, at: Date.now() },
      ])
      setInput('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleReconnect = () => {
    const nextUrl = urlInput.trim();
    if (!nextUrl) return
    if (nextUrl !== activeUrl) {
      setActiveUrl(nextUrl)
    } else {
      reconnect()
    }
    endStream()
  }

  return (
    <div className="flex h-[80vh] flex-col rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
          <p className="text-sm font-medium">Chat Bot</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            className="w-64 rounded-md border border-gray-300 px-2 py-1 text-sm"
            placeholder="ws://localhost:8080/chat"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button
            className="rounded-md border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50"
            onClick={handleReconnect}
            title="Reconnect to the WebSocket using the URL above"
          >
            Reconnect
          </button>
          {connectionBadge}
        </div>
      </div>

      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-500">
            Start chatting! Messages from the bot will appear here.
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : m.role === 'ai'
                    ? 'bg-gray-100 text-gray-900'
                    : 'bg-yellow-50 text-yellow-900'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-gray-200 p-3">
        <input
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
          placeholder="Type a message and hit Enter..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={handleSend}
          disabled={!isConnected}
        >
          Send
        </button>
      </div>
    </div>
  )
}

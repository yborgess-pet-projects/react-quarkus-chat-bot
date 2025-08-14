import {useEffect, useRef, useState, useCallback} from "react"

/**
 * Custom hook to manage WebSocket connections.
 *
 * @param {string} url - The WebSocket URL to connect to.
 * @param {(message: MessageEvent) => void} listener - Callback function to handle incoming messages.
 * @returns {Object} - An object containing connection status, last error, send function, close function, and reconnect function.
 */
export const useWebSocket = (url: string, listener: (message: MessageEvent) => void) => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)
  const ws = useRef<WebSocket | null>(null)

  const handleOpen = () => setIsConnected(true)
  const handleClose = () => setIsConnected(false)
  const handleError = (event: Event) => {
    setLastError('WebSocket error')
    console.error('WebSocket error', event)
  }

  const close = useCallback(() => {
    if (!ws.current) return

    if (
      ws.current.readyState === WebSocket.CLOSING ||
      ws.current.readyState === WebSocket.CLOSED
    ) return

    ws.current.removeEventListener("open", handleOpen);
    ws.current.removeEventListener("close", handleClose);
    ws.current.removeEventListener("error", handleError);
    ws.current.removeEventListener("message", listener);

    ws.current.close();
    ws.current = null;
    setIsConnected(false);
    setLastError(null);
  }, [listener])

  const init = useCallback((url: string, listener: (message: MessageEvent) => void) => {
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) return

    setLastError(null)
    try {
      if (ws.current) {
        close();
      }
      ws.current = new WebSocket(url)

      ws.current.addEventListener("open", handleOpen);
      ws.current.addEventListener("close", handleClose);
      ws.current.addEventListener("error", handleError);
      ws.current.addEventListener("message", listener);

    } catch (error) {
      setLastError(`Failed to connect: ${error instanceof Error ? error.message : String(error)}`)
      console.error('WebSocket connection error:', error)
    }
  }, [close])

  useEffect(() => {
    init(url, listener);

    return () => {
      close();
    }
  }, [url, listener, init, close])

  const send = (data: unknown) => {
    if (!ws.current) return

    if (ws.current.readyState !== WebSocket.OPEN) {
      setLastError('WebSocket is not connected')
    }
    const payload = typeof data === 'string' ? data : JSON.stringify(data)
    ws.current.send(payload)
  }

  const reconnect = () => {
    close();
    init(url, listener);
  }

  return { isConnected, lastError, send, close, reconnect }
}
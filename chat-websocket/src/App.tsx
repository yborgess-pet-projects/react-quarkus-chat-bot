import './App.css'
import { Chat } from './components/Chat'

function App() {

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
    <div className="mx-auto max-w-3xl p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">WebSocket Chat Bot</h1>
        <span className="text-xs text-gray-500">Simple React + Tailwind LLM chat served by a Quarkus backend</span>
      </header>
      <Chat />
    </div>
  </div>
  )
}

export default App

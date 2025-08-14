# Real-Time AI Chat Application

A full-stack chat application featuring real-time AI conversations with proper streaming support. Built with Quarkus backend and React frontend, using WebSockets for instant communication and LangChain4j for AI integration.

## 🏗️ Architecture

```
┌─────────────────────┐    WebSocket     ┌──────────────────────┐    LangChain4j    ┌─────────────┐
│   React Frontend    │ ◄──────────────► │   Quarkus Backend    │ ◄───────────────► │   Ollama    │
│                     │  JSON Messages   │                      │   AI Integration  │  Llama3:8b  │
│ • TypeScript        │                  │ • Java 21            │                   │             │
│ • Tailwind CSS      │                  │ • WebSockets Next    │                   │             │
│ • Vite              │                  │ • SmallRye Mutiny    │                   │             │
└─────────────────────┘                  └──────────────────────┘                   └─────────────┘
```

## ✨ Features

- **Real-time streaming responses** - AI responses stream in real-time with proper completion detection
- **WebSocket communication** - Persistent bidirectional connection for instant messaging
- **Structured JSON protocol** - Reliable message format with clear stream boundaries
- **Session memory** - Conversation context maintained across messages (10 message window)
- **Responsive UI** - Clean, modern interface that works on desktop and mobile
- **Connection management** - Automatic reconnection with visual connection status
- **Error handling** - Graceful handling of connection errors and timeouts

## 🛠️ Technology Stack

### Backend (`chat-websocket-backend/`)
- **Quarkus 3.25.2** - Supersonic Subatomic Java framework
- **Java 21** - Modern Java runtime
- **LangChain4j** - Java framework for AI/LLM integration
- **Ollama** - Local LLM runtime (Llama3:8b model)
- **WebSockets Next** - Real-time communication
- **SmallRye Mutiny** - Reactive programming
- **Maven** - Build and dependency management

### Frontend (`chat-websocket/`)
- **React 19.1.1** - Modern UI library
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.1** - Fast build tool and dev server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **PNPM** - Efficient package management

## 🚀 Quick Start

### Prerequisites

1. **Java 21+** and **Maven 3.9+**
2. **Node.js 18+** and **PNPM**
3. **Ollama** with Llama3:8b model

### Setup Ollama

```bash
# Install Ollama from https://ollama.ai/
# Pull the required model
ollama run llama3:8b
```

### Run the Application

1. **Start the Backend** (Terminal 1):
   ```bash
   cd chat-websocket-backend
   ./mvnw compile quarkus:dev
   ```
   Backend will be available at `http://localhost:8080`

2. **Start the Frontend** (Terminal 2):
   ```bash
   cd chat-websocket
   pnpm install
   pnpm dev
   ```
   Frontend will be available at `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📡 WebSocket Protocol

The application uses a structured JSON protocol for reliable stream handling:

### Message Format

**Client to Server** (Plain text):
```
Hello, how are you?
```

**Server to Client** (JSON stream):
```json
{"type": "chunk", "content": "I'm doing"}
{"type": "chunk", "content": " great! How"}
{"type": "chunk", "content": " can I help you?"}
{"type": "done", "content": null}
```

### Connection Details
- **Endpoint**: `ws://localhost:8080/chat`
- **Protocol**: WebSocket with JSON messages
- **Reconnection**: Automatic with exponential backoff

## 🔧 Configuration

### Backend Configuration

Edit `chat-websocket-backend/src/main/resources/application.properties`:

```properties
# Ollama model configuration
quarkus.langchain4j.ollama.chat-model.model-id=llama3:8b
quarkus.langchain4j.ollama.chat-model.temperature=0.5
quarkus.langchain4j.ollama.timeout=180s

# Chat memory settings
quarkus.langchain4j.chat-memory.type=MESSAGE_WINDOW
quarkus.langchain4j.chat-memory.memory-window.max-messages=10
```

### Frontend Configuration

Create `chat-websocket/.env`:

```env
VITE_WS_URL=ws://localhost:8080/chat
```

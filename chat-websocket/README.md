# Chat WebSocket Frontend

A modern React-based chat interface that connects to the Quarkus WebSocket backend for real-time AI-powered conversations.

## Overview

This frontend application provides a clean, responsive chat interface with real-time WebSocket communication. It features streaming message support with proper completion detection, connection management, and a modern UI built with React and Tailwind CSS.

## Technologies Used

- **React 19.1.1** - Modern UI library with latest features
- **TypeScript 5.8.3** - Type-safe JavaScript development
- **Vite 7.1.1** - Fast build tool and development server
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **WebSocket API** - Real-time bidirectional communication
- **PNPM** - Fast, disk space efficient package manager

## Key Features

- Real-time chat interface with streaming responses
- Automatic WebSocket connection management with reconnection
- Proper stream completion detection for AI responses
- Responsive design that works on desktop and mobile
- Configurable WebSocket URL with connection status indicator
- Message history with user/AI role distinction
- Auto-scrolling to latest messages
- Connection error handling and display

## Architecture

### Components

- **`Chat.tsx`** - Main chat interface component
- **`useWebSocket.ts`** - Custom hook for WebSocket connection management

### Stream Protocol

The frontend handles structured JSON messages from the backend:

```json
{"type": "chunk", "content": "part of AI response"}
{"type": "done", "content": null}
```

It also supports various streaming formats for compatibility with different backends.

## Prerequisites

- Node.js 18 or later
- PNPM (recommended) or npm
- Running chat-websocket-backend service

## Build and Run

### Development Mode

Install dependencies:

```bash
pnpm install
```

Start development server with hot reload:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Production Build

Build for production:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

Serve production build (requires a web server):

```bash
# Using a simple HTTP server
npx serve dist
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_WS_URL=ws://localhost:8080/chat
```

### WebSocket URL

The WebSocket URL can be configured in three ways:

1. **Environment variable**: `VITE_WS_URL`
2. **Default**: `ws://localhost:8080/chat`
3. **Runtime**: Use the URL input field in the chat interface

## Development

### Code Quality

Run linting:

```bash
pnpm lint
```

### Type Checking

TypeScript compilation is integrated into the build process. For standalone type checking:

```bash
pnpm build
```

## Project Structure

```
src/
├── components/
│   └── Chat.tsx              # Main chat interface
├── hooks/
│   └── useWebSocket.ts       # WebSocket connection hook
├── constants/
│   └── index.ts              # Configuration constants
├── App.tsx                   # Root application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

## Usage

1. Ensure the backend service is running at `ws://localhost:8080/chat`
2. Open the frontend application in your browser
3. Check the connection status indicator (should show "connected")
4. Type a message and press Enter or click Send
5. Watch as the AI streams its response in real-time
6. The interface automatically detects when responses are complete

### Connection Management

- **Green indicator**: Successfully connected
- **Gray indicator**: Disconnected
- **Red indicator**: Connection error (hover for details)
- **Reconnect button**: Manually reconnect or change WebSocket URL

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

Modern browsers with WebSocket and ES2020 support are required.

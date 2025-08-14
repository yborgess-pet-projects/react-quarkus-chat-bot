# Chat WebSocket Backend

A Quarkus-based backend service that provides real-time chat functionality using WebSockets and AI integration through LangChain4j with Ollama.

## Overview

This backend service provides a WebSocket endpoint for real-time chat communication with an AI assistant. It streams responses using structured JSON messages to clearly indicate when streams begin and end.

## Technologies Used

- **Quarkus 3.25.2** - Supersonic Subatomic Java framework
- **Java 21** - Runtime and development platform
- **LangChain4j** - Java framework for AI/LLM integration
- **Ollama** - Local LLM runtime (Llama3:8b model)
- **WebSockets Next** - Real-time bidirectional communication
- **Maven** - Build and dependency management
- **SmallRye Mutiny** - Reactive programming streams

## Key Features

- Real-time WebSocket chat endpoint at `/chat`
- Streaming AI responses with proper completion detection
- Session-scoped chat memory (10 message window)
- Structured JSON response format for reliable frontend parsing
- Docker support for containerized deployment

## API

### WebSocket Endpoint: `/chat`

**Connection**: `ws://localhost:8080/chat`

**Message Format**:
- **Input**: Plain text message
- **Output**: Structured JSON stream
  ```json
  {"type": "chunk", "content": "part of AI response"}
  {"type": "done", "content": null}
  ```

## Prerequisites

- Java 21 or later
- Maven 3.9.x or later
- Ollama running locally with Llama3:8b model

### Ollama Setup

1. Install Ollama: https://ollama.ai/
2. Pull the required model:
   ```bash
   ollama pull llama3:8b
   ```
3. Verify Ollama is running:
   ```bash
   ollama list
   ```

## Build and Run

### Development Mode

Run the application in development mode with live reload:

```bash
./mvnw compile quarkus:dev
```

The application will be available at `http://localhost:8080`

### Production Build

Create a production JAR:

```bash
./mvnw package
```

Run the production JAR:

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

### Native Build

Create a native executable (requires GraalVM):

```bash
./mvnw package -Pnative
```

Run the native executable:

```bash
./target/chat-websocket-backend-1.0.0-SNAPSHOT-runner
```

### Docker

Build and run using Docker:

```bash
# JVM mode
docker build -f src/main/docker/Dockerfile.jvm -t chat-backend .
docker run -i --rm -p 8080:8080 chat-backend

# Native mode (requires native build first)
docker build -f src/main/docker/Dockerfile.native -t chat-backend-native .
docker run -i --rm -p 8080:8080 chat-backend-native
```

## Configuration

Key configuration options in `application.properties`:

```properties
# Ollama model configuration
quarkus.langchain4j.ollama.chat-model.model-id=llama3:8b
quarkus.langchain4j.ollama.chat-model.temperature=0.5
quarkus.langchain4j.ollama.timeout=180s

# Chat memory settings
quarkus.langchain4j.chat-memory.type=MESSAGE_WINDOW
quarkus.langchain4j.chat-memory.memory-window.max-messages=10
```

## Testing

Run tests:

```bash
./mvnw test
```

## Project Structure

```
src/main/java/org/demo/chat/
├── Chat.java           # LangChain4j AI service interface
├── ChatMessage.java    # JSON response structure
└── ChatWebsocket.java  # WebSocket endpoint handler
```
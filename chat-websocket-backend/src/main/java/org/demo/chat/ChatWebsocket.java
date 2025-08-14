package org.demo.chat;

import java.io.Serializable;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;

import io.quarkus.websockets.next.OnOpen;
import io.quarkus.websockets.next.OnTextMessage;
import io.quarkus.websockets.next.WebSocket;
import io.smallrye.mutiny.Multi;

@WebSocket(path = "/chat")
@SessionScoped
public class ChatWebsocket implements Serializable {

    @Inject
    Chat chat;

    @OnOpen
    public String onOpen() {
        return "Hello, how can I help you today?";
    }

    @OnTextMessage
    public Multi<ChatMessage> onMessage(String message) {
        return chat.chat(message)
                .map(ChatMessage::chunk)
                .onCompletion().switchTo(Multi.createFrom().item(ChatMessage.done()));
    }
}

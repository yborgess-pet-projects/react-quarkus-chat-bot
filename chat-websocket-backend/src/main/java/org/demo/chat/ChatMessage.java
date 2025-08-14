package org.demo.chat;

public class ChatMessage {
    public String type;
    public String content;

    public ChatMessage() {}

    public ChatMessage(String type, String content) {
        this.type = type;
        this.content = content;
    }

    public static ChatMessage chunk(String content) {
        return new ChatMessage("chunk", content);
    }

    public static ChatMessage done() {
        return new ChatMessage("done", null);
    }
}
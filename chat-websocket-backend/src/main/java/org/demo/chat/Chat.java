package org.demo.chat;

import jakarta.enterprise.context.SessionScoped;

import io.quarkiverse.langchain4j.RegisterAiService;
import io.smallrye.mutiny.Multi;

@SessionScoped
@RegisterAiService
public interface Chat {
    Multi<String> chat(String userMessage);
}


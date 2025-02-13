package com.steam.controller;


import com.steam.dto.PromptRequest;
import com.steam.service.DeepSeekClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import reactor.core.publisher.Flux;

@RestController
public class DeepSeekController {
    private final DeepSeekClient deepSeekClient;

    @Autowired
    public DeepSeekController(DeepSeekClient deepSeekClient) {
        this.deepSeekClient = deepSeekClient;
    }

    @PostMapping(value = "/generate", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> generate(@RequestBody PromptRequest request) {
        return deepSeekClient.processWithDeepSeek(request.getPrompt());
    }
}

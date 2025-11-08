package com.insurance.glossary.ai;

public interface AiClient {
    AiResponse generateAnswer(String systemPrompt, String context, String question) throws AiClientException;
}

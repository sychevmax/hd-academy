package com.insurance.glossary.ai;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ai")
public class AiProperties {
    /** Provider key (e.g., google). Kept for future provider switch. */
    private String provider = "google";
    /** Gemini model name */
    private String geminiModel = "gemini-2.5-flash";
    /** API base URL (v1) */
    private String apiBase = "https://generativelanguage.googleapis.com/v1";
    /** API key (can be populated from Spring props/.env) */
    private String apiKey;
    /** Temperature for sampling */
    private Double temperature = 0.3;
    /** Max output tokens */
    private Integer maxOutputTokens = 1024;

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getGeminiModel() { return geminiModel; }
    public void setGeminiModel(String geminiModel) { this.geminiModel = geminiModel; }

    public String getApiBase() { return apiBase; }
    public void setApiBase(String apiBase) { this.apiBase = apiBase; }

    public String getApiKey() { return apiKey; }
    public void setApiKey(String apiKey) { this.apiKey = apiKey; }

    public Double getTemperature() { return temperature; }
    public void setTemperature(Double temperature) { this.temperature = temperature; }

    public Integer getMaxOutputTokens() { return maxOutputTokens; }
    public void setMaxOutputTokens(Integer maxOutputTokens) { this.maxOutputTokens = maxOutputTokens; }
}

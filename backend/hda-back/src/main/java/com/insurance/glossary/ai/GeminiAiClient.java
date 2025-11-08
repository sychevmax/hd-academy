package com.insurance.glossary.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Component
public class GeminiAiClient implements AiClient {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private final AiProperties props;

    public GeminiAiClient(AiProperties props) {
        this.props = props;
    }

    @Override
    public AiResponse generateAnswer(String systemPrompt, String context, String question) throws AiClientException {
        // Resolve API key: prefer Spring property (works with .env via spring-dotenv), fallback to env var
        String apiKey = props.getApiKey();
        if (apiKey == null || apiKey.isBlank()) {
            apiKey = System.getenv("GOOGLE_AI_API_KEY");
        }
        if (apiKey == null || apiKey.isBlank()) {
            throw new AiClientException("Gemini API key is not configured. Set ai.api-key (e.g., via .env) or environment variable GOOGLE_AI_API_KEY.");
        }

        try {
            String model = props.getGeminiModel();
            String base = props.getApiBase() == null || props.getApiBase().isBlank()
                    ? "https://generativelanguage.googleapis.com/v1"
                    : props.getApiBase();
            String url = base + "/models/" + model + ":generateContent?key=" + apiKey;

            // Build request JSON per Gemini REST API v1
            StringBuilder userContent = new StringBuilder();
            userContent.append("You are an insurance assistant. Answer clearly and concisely using your general insurance knowledge. ");
            userContent.append("Do not limit your answer to the provided glossary; you may use it only if it helps. The following context is optional.\n\n");
            if (context != null && !context.isBlank()) {
                userContent.append("Optional context:\n").append(context).append("\n\n");
            }
            userContent.append("Question: ").append(question).append("\n\n");
            userContent.append("When possible, include a final line starting with 'Sources:' to mention any external standards, laws, guidelines, or reputable materials you directly relied on. Omit if none.");

            String payload = "{" +
                    "\"contents\":[{" +
                    "\"role\":\"user\",\"parts\":[{" +
                    "\"text\": " + MAPPER.writeValueAsString(systemPrompt + "\n\n" + userContent.toString()) +
                    "}]}]," +
                    "\"generationConfig\": {" +
                    "\"temperature\":" + props.getTemperature() + "," +
                    "\"maxOutputTokens\":" + props.getMaxOutputTokens() +
                    "}" +
                    "}";

            HttpClient http = HttpClient.newBuilder()
                    .connectTimeout(Duration.ofSeconds(10))
                    .build();

            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(30))
                .header("Content-Type", "application/json; charset=UTF-8")
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();

            HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (resp.statusCode() / 100 != 2) {
                throw new AiClientException("Gemini API error: HTTP " + resp.statusCode() + " - " + resp.body());
            }

            return parseResponse(resp.body());
        } catch (AiClientException e) {
            throw e;
        } catch (Exception e) {
            throw new AiClientException("Failed to call Gemini API", e);
        }
    }

    private AiResponse parseResponse(String body) throws Exception {
        JsonNode root = MAPPER.readTree(body);
        JsonNode candidates = root.path("candidates");
        if (!candidates.isArray() || candidates.isEmpty()) {
            throw new AiClientException("Gemini response missing candidates");
        }
        StringBuilder answer = new StringBuilder();
        JsonNode parts = candidates.get(0).path("content").path("parts");
        if (parts.isArray()) {
            for (JsonNode p : parts) {
                String t = p.path("text").asText("");
                answer.append(t);
            }
        }
        // Extract simple sources section if present (lines starting with "Sources:")
        List<AiResponse.Source> sources = new ArrayList<>();
        // We do not attempt to parse citations from the model; sources are provided by retriever.
        return new AiResponse(answer.toString().trim(), sources);
    }
}

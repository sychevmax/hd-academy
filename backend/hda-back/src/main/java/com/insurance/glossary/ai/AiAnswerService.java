package com.insurance.glossary.ai;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class AiAnswerService {

    private static final String SYSTEM_PROMPT = "You are an insurance domain assistant. Answer clearly and concisely using only factual content. Prefer the provided glossary context. If the question is outside scope or the context is insufficient, say so. Include short citations to the used glossary terms (by name) at the end if applicable.";

    private final GlossaryRetriever retriever;
    private final AiClient aiClient;

    public AiAnswerService(GlossaryRetriever retriever, AiClient aiClient) {
        this.retriever = retriever;
        this.aiClient = aiClient;
    }

    public AiResponse ask(String question, Integer topK) throws AiClientException {
        if (!StringUtils.hasText(question)) {
            throw new IllegalArgumentException("Question must not be blank");
        }
        int k = (topK == null || topK <= 0 || topK > 20) ? 5 : topK;

        // Retrieve glossary context (limit context size for token/cost control)
        GlossaryRetriever.RetrievalResult rr = retriever.retrieve(question, k, 1800);

        // Call Gemini
        AiResponse aiResp = aiClient.generateAnswer(SYSTEM_PROMPT, rr.context(), question);
        // Attach our sources (retrieval provenance)
        aiResp.setSources(rr.sources());
        return aiResp;
    }
}

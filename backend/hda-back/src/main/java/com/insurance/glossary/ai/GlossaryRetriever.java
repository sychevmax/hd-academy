package com.insurance.glossary.ai;

import com.insurance.glossary.entity.GlossaryTerm;
import com.insurance.glossary.repository.GlossaryTermRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Component
public class GlossaryRetriever {

    private final GlossaryTermRepository repository;

    public GlossaryRetriever(GlossaryTermRepository repository) {
        this.repository = repository;
    }

    /**
     * Retrieve up to topK relevant glossary terms for the given question and
     * build a compact context string, along with sources metadata.
     */
    public RetrievalResult retrieve(String question, int topK, int maxChars) {
        String q = normalize(question);
        List<GlossaryTerm> hits = repository.fullTextSearch(q);
        if (hits == null) hits = List.of();
        List<GlossaryTerm> top = hits.stream().limit(Math.max(1, topK)).collect(Collectors.toList());

        StringBuilder ctx = new StringBuilder();
        List<AiResponse.Source> sources = new ArrayList<>();
        for (GlossaryTerm t : top) {
            String line = String.format("- %s: %s\n", safe(t.getTerm()), safe(t.getDefinition()));
            if (ctx.length() + line.length() > maxChars) break;
            ctx.append(line);
            sources.add(new AiResponse.Source(t.getId(), t.getTerm()));
        }
        return new RetrievalResult(ctx.toString(), sources);
    }

    private static String normalize(String s) {
        if (s == null) return "";
        return s.toLowerCase(Locale.ROOT).trim();
    }

    private static String safe(String s) { return s == null ? "" : s.trim(); }

    public record RetrievalResult(String context, List<AiResponse.Source> sources) {}
}

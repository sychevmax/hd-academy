package com.insurance.glossary.ai;

import java.util.List;

public class AiResponse {
    private String answer;
    private List<Source> sources;

    public AiResponse() {}

    public AiResponse(String answer, List<Source> sources) {
        this.answer = answer;
        this.sources = sources;
    }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public List<Source> getSources() { return sources; }
    public void setSources(List<Source> sources) { this.sources = sources; }

    public static class Source {
        private Integer id;
        private String term;

        public Source() {}
        public Source(Integer id, String term) {
            this.id = id; this.term = term;
        }
        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }
        public String getTerm() { return term; }
        public void setTerm(String term) { this.term = term; }
    }
}

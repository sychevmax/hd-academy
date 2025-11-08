package com.insurance.glossary.ai.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AskRequest {

    @Schema(description = "User's question about insurance", example = "What is the difference between deductible and copay?")
    @NotBlank
    @Size(min = 3, max = 4000)
    private String question;

    @Schema(description = "How many glossary terms to use for grounding (1-20). Default 5.")
    private Integer topK;

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Integer getTopK() {
        return topK;
    }

    public void setTopK(Integer topK) {
        this.topK = topK;
    }
}

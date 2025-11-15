package com.insurance.glossary.entity;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "glossary_terms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Slf4j
public class GlossaryTerm {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String term;

    @Column(length = 30)
    private String abbreviation;

    @Column(name = "synonyms", columnDefinition = "TEXT")
    private String synonyms;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String definition;

    @Column(name = "examples", columnDefinition = "TEXT")
    private String examples;

    @Column(length = 30)
    private String category;

    @Column(name = "related_terms", columnDefinition = "TEXT")
    private String relatedTerms;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }

    // Helper methods to work with JSON arrays
    @Transient
    public List<String> getSynonymsList() {
        return parseJsonArray(synonyms);
    }

    public void setSynonymsList(List<String> synonymsList) {
        this.synonyms = toJsonArray(synonymsList);
    }

    @Transient
    public List<String> getExamplesList() {
        return parseJsonArray(examples);
    }

    public void setExamplesList(List<String> examplesList) {
        this.examples = toJsonArray(examplesList);
    }

    @Transient
    public List<String> getRelatedTermsList() {
        return parseJsonArray(relatedTerms);
    }

    public void setRelatedTermsList(List<String> relatedTermsList) {
        this.relatedTerms = toJsonArray(relatedTermsList);
    }

    private List<String> parseJsonArray(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            log.error("Error parsing JSON array: {}", json, e);
            return new ArrayList<>();
        }
    }

    private String toJsonArray(List<String> list) {
        if (list == null || list.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            log.error("Error converting list to JSON: {}", list, e);
            return null;
        }
    }
}
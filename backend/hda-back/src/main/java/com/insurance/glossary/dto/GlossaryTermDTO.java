package com.insurance.glossary.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.insurance.glossary.entity.GlossaryTerm;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlossaryTermDTO {

    private Integer id;
    private String term;
    private String abbreviation;
    private List<String> synonyms;
    private String definition;
    private List<String> examples;
    private String category;

    @JsonProperty("related_terms")
    private List<String> relatedTerms;

    @JsonProperty("last_updated")
    private LocalDateTime lastUpdated;

    // Conversion methods
    public static GlossaryTermDTO fromEntity(GlossaryTerm entity) {
        if (entity == null) {
            return null;
        }

        return GlossaryTermDTO.builder()
                .id(entity.getId())
                .term(entity.getTerm())
                .abbreviation(entity.getAbbreviation())
                .synonyms(entity.getSynonymsList())
                .definition(entity.getDefinition())
                .examples(entity.getExamplesList())
                .category(entity.getCategory())
                .relatedTerms(entity.getRelatedTermsList())
                .lastUpdated(entity.getLastUpdated())
                .build();
    }

    public GlossaryTerm toEntity() {
        GlossaryTerm entity = new GlossaryTerm();
        entity.setId(this.id);
        entity.setTerm(this.term);
        entity.setAbbreviation(this.abbreviation);
        entity.setSynonymsList(this.synonyms);
        entity.setDefinition(this.definition);
        entity.setExamplesList(this.examples);
        entity.setCategory(this.category);
        entity.setRelatedTermsList(this.relatedTerms);
        entity.setLastUpdated(this.lastUpdated);
        return entity;
    }
}
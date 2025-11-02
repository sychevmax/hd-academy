package com.insurance.glossary.service;

import com.insurance.glossary.dto.GlossaryTermDTO;
import com.insurance.glossary.entity.GlossaryTerm;
import com.insurance.glossary.exception.TermNotFoundException;
import com.insurance.glossary.repository.GlossaryTermRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GlossaryTermService {

    private final GlossaryTermRepository repository;

    /**
     * Get term by ID
     */
    public GlossaryTermDTO getById(Long id) {
        GlossaryTerm entity = repository.findById(id)
                .orElseThrow(() -> new TermNotFoundException("Term with id " + id + " not found"));
        return GlossaryTermDTO.fromEntity(entity);
    }

    /**
     * Full-text search
     */
    public List<GlossaryTermDTO> search(String searchText) {
        if (searchText == null || searchText.trim().isEmpty()) {
            return List.of();
        }
        return repository.fullTextSearch(searchText.trim())
                .stream()
                .map(GlossaryTermDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all categories
     */
    public List<String> getAllCategories() {
        return repository.findAllCategories();
    }

    /**
     * Get terms by category
     */
    public List<GlossaryTermDTO> getByCategory(String category) {
        return repository.findByCategoryOrderByTermAsc(category)
                .stream()
                .map(GlossaryTermDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all terms
     */
    public List<GlossaryTermDTO> getAllTerms() {
        return repository.findAll()
                .stream()
                .map(GlossaryTermDTO::fromEntity)
                .collect(Collectors.toList());
    }
}
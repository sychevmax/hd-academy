package com.insurance.glossary.controller;

import com.insurance.glossary.dto.GlossaryTermDTO;
import com.insurance.glossary.service.GlossaryTermService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/glossary")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GlossaryTermController {

    private final GlossaryTermService service;

    /**
     * GET /api/v1/glossary/{id}
     * Get term by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<GlossaryTermDTO> getTermById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * GET /api/v1/glossary/search?q={searchText}
     * Full-text search
     */
    @GetMapping("/search")
    public ResponseEntity<List<GlossaryTermDTO>> searchTerms(
            @RequestParam(name = "q") String searchText) {
        return ResponseEntity.ok(service.search(searchText));
    }

    /**
     * GET /api/v1/glossary/categories
     * Get all categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    /**
     * GET /api/v1/glossary/category/{category}
     * Get terms by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<GlossaryTermDTO>> getTermsByCategory(
            @PathVariable String category) {
        return ResponseEntity.ok(service.getByCategory(category));
    }

    /**
     * GET /api/v1/glossary
     * Get all terms (optional, for convenience)
     */
    @GetMapping
    public ResponseEntity<List<GlossaryTermDTO>> getAllTerms() {
        return ResponseEntity.ok(service.getAllTerms());
    }
}
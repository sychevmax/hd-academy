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
@io.swagger.v3.oas.annotations.tags.Tag(name = "Glossary", description = "Operations for insurance glossary terms")
public class GlossaryTermController {

    private final GlossaryTermService service;

    /**
     * GET /api/v1/glossary/{id}
     * Get term by ID
     */
    @io.swagger.v3.oas.annotations.Operation(
            summary = "Get glossary term by id",
            description = "Returns a single glossary term by its unique identifier.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Term found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Term not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<GlossaryTermDTO> getTermById(
            @io.swagger.v3.oas.annotations.Parameter(description = "Term ID", required = true)
            @PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /**
     * GET /api/v1/glossary/search?q={searchText}
     * Full-text search
     */
    @io.swagger.v3.oas.annotations.Operation(
            summary = "Search glossary terms",
            description = "Performs a full-text search across term, definition, abbreviation and synonyms.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Search results returned")
    })
    @GetMapping("/search")
    public ResponseEntity<List<GlossaryTermDTO>> searchTerms(
            @io.swagger.v3.oas.annotations.Parameter(name = "q", description = "Search text", required = true)
            @RequestParam(name = "q") String searchText) {
        return ResponseEntity.ok(service.search(searchText));
    }

    /**
     * GET /api/v1/glossary/categories
     * Get all categories
     */
    @io.swagger.v3.oas.annotations.Operation(
            summary = "List all categories",
            description = "Returns all unique glossary categories in alphabetical order.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Categories returned")
    })
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    /**
     * GET /api/v1/glossary/category/{category}
     * Get terms by category
     */
    @io.swagger.v3.oas.annotations.Operation(
            summary = "Get terms by category",
            description = "Returns all glossary terms that belong to the specified category, ordered by term.")
    @io.swagger.v3.oas.annotations.responses.ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Terms returned")
    })
    @GetMapping("/category/{category}")
    public ResponseEntity<List<GlossaryTermDTO>> getTermsByCategory(
            @io.swagger.v3.oas.annotations.Parameter(description = "Category name", required = true)
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
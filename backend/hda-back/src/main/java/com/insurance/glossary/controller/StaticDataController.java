package com.insurance.glossary.controller;

import com.insurance.glossary.service.StaticDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/static-data")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@io.swagger.v3.oas.annotations.tags.Tag(name = "Static Data", description = "Operations for serving static JSON data")
public class StaticDataController {

    private final StaticDataService service;

    @io.swagger.v3.oas.annotations.Operation(
            summary = "Get Value Measures data",
            description = "Returns the General Insurance Value Measures dataset.")
    @GetMapping("/value-measures")
    public ResponseEntity<Object> getValueMeasures() {
        return ResponseEntity.ok(service.getValueMeasures());
    }
}

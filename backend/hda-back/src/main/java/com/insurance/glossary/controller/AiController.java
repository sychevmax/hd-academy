package com.insurance.glossary.controller;

import com.insurance.glossary.ai.AiAnswerService;
import com.insurance.glossary.ai.AiClientException;
import com.insurance.glossary.ai.AiResponse;
import com.insurance.glossary.ai.dto.AskRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI", description = "Ask Gemini questions about the insurance domain")
public class AiController {

    private final AiAnswerService service;

    public AiController(AiAnswerService service) {
        this.service = service;
    }

    @PostMapping("/ask")
    @Operation(
            summary = "Ask a question about insurance",
            description = "Uses Gemini with the local glossary as context to answer questions about insurance.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Answer generated",
                            content = @Content(schema = @Schema(implementation = AiResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid input"),
                    @ApiResponse(responseCode = "503", description = "AI service unavailable")
            }
    )
    public ResponseEntity<AiResponse> ask(@Valid @RequestBody AskRequest request) throws AiClientException {
        AiResponse resp = service.ask(request.getQuestion(), request.getTopK());
        return ResponseEntity.ok(resp);
    }
}

package com.insurance.glossary.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@Slf4j
@RequiredArgsConstructor
public class StaticDataService {

    private final ObjectMapper objectMapper;
    private final ResourceLoader resourceLoader;

    @Value("${app.data.static-files-path:classpath:data/}")
    private String staticFilesPath;

    @Value("${app.data.value-measures-file:value_measures_motor_clean.json}")
    private String valueMeasuresFile;

    public Object getValueMeasures() {
        return getStaticData(valueMeasuresFile);
    }

    private Object getStaticData(String filename) {
        try {
            // Construct resource location. Ensure path ends with / if it's a directory
            String location = staticFilesPath.endsWith("/") ? staticFilesPath + filename : staticFilesPath + "/" + filename;
            
            log.info("Attempting to read static data from: {}", location);
            Resource resource = resourceLoader.getResource(location);
            
            if (!resource.exists()) {
                log.error("Static data file not found at: {}", location);
                throw new RuntimeException("Data file not found: " + filename);
            }
            
            return objectMapper.readValue(resource.getInputStream(), Object.class);
        } catch (IOException e) {
            log.error("Error reading static data file: {}", filename, e);
            throw new RuntimeException("Failed to read data file: " + filename, e);
        }
    }
}

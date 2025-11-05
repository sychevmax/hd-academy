package com.insurance.glossary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Web MVC configuration for serving the React SPA from Spring Boot.
 *
 * Behavior:
 * - Static assets are served from classpath:/static/ by Spring Boot defaults.
 * - Any non-API request (not starting with /api/, /v3/, /swagger-ui/, /actuator) that
 *   does not directly resolve to a static resource will be forwarded to index.html,
 *   enabling client-side routing for the SPA.
 */
@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Serve SPA entry for root
        registry.addViewController("/").setViewName("forward:/index.html");

        // Spring 6 PathPatternParser-compatible catch-all for client-side routes
        // More specific mappings (REST controllers, actuator, swagger, static resources)
        // will match before this fallback.
        registry.addViewController("/{*path}").setViewName("forward:/index.html");
    }
}

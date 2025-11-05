package com.insurance.glossary.config;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorViewResolver;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * SPA fallback based on 404 errors only.
 *
 * Behaviour:
 * - If a request results in 404 (no controller/static resource matched),
 *   forward to index.html so the React router can handle it.
 * - Do NOT forward for requests that look like static resources (contain a dot),
 *   or reserved server paths (api, swagger-ui, v3, actuator, error),
 *   or non-HTML requests (e.g., JSON API). Those should remain 404 or their native status.
 */
@Configuration
public class SpaErrorViewResolver implements ErrorViewResolver {

    private static final List<String> RESERVED_PREFIXES = List.of(
            "/api", "/swagger-ui", "/v3", "/actuator", "/error"
    );

    @Override
    public ModelAndView resolveErrorView(HttpServletRequest request, HttpStatus status, Map<String, Object> model) {
        if (status != HttpStatus.NOT_FOUND) {
            return null; // only handle 404s
        }

        String uri = extractErrorRequestUri(request);
        if (!StringUtils.hasText(uri)) {
            return null;
        }

        // Do not forward resource files (e.g., .js, .css, images, etc.)
        if (uri.contains(".")) {
            return null;
        }

        // Skip known server paths
        for (String prefix : RESERVED_PREFIXES) {
            if (uri.startsWith(prefix)) {
                return null;
            }
        }

        // Prefer forwarding only for HTML-ish requests
        String accept = request.getHeader("Accept");
        if (accept != null && !accept.toLowerCase(Locale.ROOT).contains("text/html")) {
            return null;
        }

        // Forward to SPA entry
        return new ModelAndView("forward:/index.html");
    }

    private String extractErrorRequestUri(HttpServletRequest request) {
        Object attr = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        String uri = (attr instanceof String) ? (String) attr : null;
        if (!StringUtils.hasText(uri)) {
            uri = request.getRequestURI();
        }
        return uri;
    }
}

package com.insurance.glossary.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "Insurance Glossary Service API",
                version = "1.0.0",
                description = "REST API for searching and retrieving insurance glossary terms.",
                contact = @Contact(name = "HD Academy", email = "support@example.com"),
                license = @License(name = "Apache 2.0", url = "https://www.apache.org/licenses/LICENSE-2.0")
        ),
        servers = {
                @Server(url = "/", description = "Default Server")
        }
)
@Configuration
public class OpenApiConfig {
    // Additional OpenAPI customizers/beans can be added here if needed
}

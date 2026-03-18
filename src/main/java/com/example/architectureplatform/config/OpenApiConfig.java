package com.example.architectureplatform.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI architecturePlatformOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Architecture Platform API")
                        .description("API documentation for the Enterprise Architecture Firm Management Platform")
                        .version("v1.0")
                );
    }
}

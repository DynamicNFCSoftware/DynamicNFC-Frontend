package com.dynamicnfc.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
                                "https://localhost:3000", "https://localhost:3001", "https://localhost:3002",

                                "http://3.128.244.219:3000", "http://3.128.244.219:3001", "http://3.128.244.219:3002",
                                "https://3.128.244.219:3000", "https://3.128.244.219:3001", "https://3.128.244.219:3002",

                                "http://dynamicnfc.ca", "https://dynamicnfc.ca",
                                "http://www.dynamicnfc.ca", "https://www.dynamicnfc.ca"
                        )
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}


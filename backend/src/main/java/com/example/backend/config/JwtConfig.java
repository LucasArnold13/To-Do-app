package com.example.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.backend.service.SecretManagerService;

@Configuration
public class JwtConfig {

    @Bean
    public String jwtSecret(SecretManagerService secretsService) {
        return secretsService
                .getJwtSecret("todo/JwtKey")
                .getJwtSecret();
    }
}

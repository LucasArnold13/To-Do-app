package com.example.backend.service;

import org.springframework.stereotype.Service;

import com.example.backend.model.DbSecret;
import com.example.backend.model.JwtSecret;
import com.fasterxml.jackson.databind.ObjectMapper;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

@Service
public class SecretManagerService {

    private final SecretsManagerClient client;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SecretManagerService() {
        this.client = SecretsManagerClient.builder()
                .region(Region.EU_CENTRAL_1)
                .build();
    }

public DbSecret getDbSecret(String secretName) {
        return getSecret(secretName, DbSecret.class);
    }

    public JwtSecret getJwtSecret(String secretName) {
        return getSecret(secretName, JwtSecret.class);
    }

    private <T> T getSecret(String secretName, Class<T> clazz) {
        GetSecretValueResponse response = client.getSecretValue(
                GetSecretValueRequest.builder()
                        .secretId(secretName)
                        .build()
        );

        try {
            return objectMapper.readValue(response.secretString(), clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse secret " + secretName, e);
        }
    }
}


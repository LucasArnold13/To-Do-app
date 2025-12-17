package com.example.backend.config;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.backend.model.DbSecret;
import com.example.backend.service.SecretManagerService;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource(SecretManagerService secretsService) {
        DbSecret secret = secretsService.getDbSecret("todo/psql");

        String url = String.format(
                "jdbc:postgresql://%s:%s/%s",
                secret.getHost(),
                secret.getPort(),
                secret.getDbInstanceIdentifier()
        );

        HikariDataSource ds = new HikariDataSource();
        ds.setJdbcUrl(url);
        ds.setUsername(secret.getUsername());
        ds.setPassword(secret.getPassword());

        return ds;
    }
}


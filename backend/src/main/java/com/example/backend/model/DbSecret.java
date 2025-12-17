package com.example.backend.model;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class DbSecret {
    private String username;
    private String password;
    private String host;
    private String port;
    private String dbInstanceIdentifier;
}

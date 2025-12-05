package com.dynamicnfc.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String email;
    private Long accountId;
    private String sessionId;
}
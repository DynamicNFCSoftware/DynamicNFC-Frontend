package com.dynamicnfc.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLinkResponse {
    private Long id;
    private String platform;
    private String link;
}

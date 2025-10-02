package com.dynamicnfc.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SocialLinkRequest {
    private String platform;
    private String link;
}

package com.dynamicnfc.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class UserResponse {
    private Long id;
    private String hashId; // HashIds ile encode edilmiş ID
    private String profilePicture;
    private String coverPhoto;
    private String companyLogo;

    private String name;
    private String jobTitle;
    private String department;
    private String companyName;

    private String email;
    private String phone;
    private String companyUrl;
    private String address;

    private List<SocialLinkResponse> socialLinks;
}

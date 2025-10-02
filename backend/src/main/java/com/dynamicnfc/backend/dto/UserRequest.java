package com.dynamicnfc.backend.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
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

    private List<SocialLinkRequest> socialLinks;

    // Getters & Setters
}

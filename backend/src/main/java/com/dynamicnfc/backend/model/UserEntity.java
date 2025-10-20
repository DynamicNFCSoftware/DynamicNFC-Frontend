package com.dynamicnfc.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@Column(unique = false, nullable = true)
    //private String nfcSerialNumber; // Optional NFC serial number field

    // Media fields (Base64 strings)
    @Lob
    @Column(columnDefinition = "TEXT")
    private String profilePicture;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String coverPhoto;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String companyLogo;


    // Personal & company info
    private String name;
    private String jobTitle;
    private String department;
    private String companyName;

    // Contact info
    private String email;
    private String phone;
    private String companyUrl;
    private String address;

    // Relationships
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SocialLink> socialLinks = new ArrayList<>();
}

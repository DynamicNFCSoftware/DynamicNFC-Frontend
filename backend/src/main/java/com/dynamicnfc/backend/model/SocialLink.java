package com.dynamicnfc.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class SocialLink {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Social media platform name (e.g. "twitter", "instagram")
    private String platform;

    // URL or username
    private String link;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

}

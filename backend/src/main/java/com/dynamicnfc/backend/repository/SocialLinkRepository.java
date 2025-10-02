package com.dynamicnfc.backend.repository;

import com.dynamicnfc.backend.model.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
}

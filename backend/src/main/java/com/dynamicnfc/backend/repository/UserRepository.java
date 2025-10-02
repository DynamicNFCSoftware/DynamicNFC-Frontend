package com.dynamicnfc.backend.repository;

import com.dynamicnfc.backend.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}
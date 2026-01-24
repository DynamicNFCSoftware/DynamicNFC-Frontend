package com.dynamicnfc.backend.repository;

import com.dynamicnfc.backend.model.Account;
import com.dynamicnfc.backend.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    List<UserEntity> findByAccount(Account account);
}

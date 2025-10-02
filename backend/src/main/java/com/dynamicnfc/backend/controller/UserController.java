package com.dynamicnfc.backend.controller;

import com.dynamicnfc.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import com.dynamicnfc.backend.dto.*;
import com.dynamicnfc.backend.mapper.UserMapper;
import com.dynamicnfc.backend.model.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

     @GetMapping
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    @PostMapping
    public UserResponse createUser(@RequestBody UserRequest userRequest) {
        UserEntity entity = new UserEntity();
        entity.setProfilePicture(userRequest.getProfilePicture());
        entity.setCoverPhoto(userRequest.getCoverPhoto());
        entity.setCompanyLogo(userRequest.getCompanyLogo());
        entity.setName(userRequest.getName());
        entity.setJobTitle(userRequest.getJobTitle());
        entity.setDepartment(userRequest.getDepartment());
        entity.setCompanyName(userRequest.getCompanyName());
        entity.setEmail(userRequest.getEmail());
        entity.setPhone(userRequest.getPhone());
        entity.setCompanyUrl(userRequest.getCompanyUrl());
        entity.setAddress(userRequest.getAddress());

        if (userRequest.getSocialLinks() != null) {
            entity.setSocialLinks(
                userRequest.getSocialLinks().stream().map(s -> {
                    SocialLink sl = new SocialLink();
                    sl.setPlatform(s.getPlatform());
                    sl.setLink(s.getLink());
                    sl.setUser(entity);
                    return sl;
                }).toList()
            );
        }

        UserEntity saved = userRepository.save(entity);
        return UserMapper.toResponse(saved);
    }
}
package com.dynamicnfc.backend.controller;

import com.dynamicnfc.backend.repository.UserRepository;
import com.dynamicnfc.backend.dto.*;
import com.dynamicnfc.backend.mapper.UserMapper;
import com.dynamicnfc.backend.model.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get a single user by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(UserMapper::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserMapper::toResponse)
                .toList();
    }


    /**
     * Multipart form-data'dan base64'e çeviren endpoint
     */
    @PostMapping(value = "/upload", consumes = {"multipart/form-data"})
    public ResponseEntity<UserResponse> createUserWithFiles(
            @RequestParam(value = "companyLogo", required = false) MultipartFile companyLogo,
            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture,
            @RequestParam(value = "coverPhoto", required = false) MultipartFile coverPhoto,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "jobTitle", required = false) String jobTitle,
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "companyName", required = false) String companyName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "companyUrl", required = false) String companyUrl,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "socialLinks", required = false) String socialLinksJson
    ) {
        try {
            UserEntity entity = new UserEntity();
            entity.setName(name);
            entity.setJobTitle(jobTitle);
            entity.setDepartment(department);
            entity.setCompanyName(companyName);
            entity.setEmail(email);
            entity.setPhone(phone);
            entity.setCompanyUrl(companyUrl);
            entity.setAddress(address);

            // Multipart dosyaları base64'e çevir
            if (companyLogo != null && !companyLogo.isEmpty()) {
                entity.setCompanyLogo(convertToBase64(companyLogo));
            }
            if (profilePicture != null && !profilePicture.isEmpty()) {
                entity.setProfilePicture(convertToBase64(profilePicture));
            }
            if (coverPhoto != null && !coverPhoto.isEmpty()) {
                entity.setCoverPhoto(convertToBase64(coverPhoto));
            }

            // Social links parsing
            if (socialLinksJson != null && !socialLinksJson.isBlank()) {
                List<SocialLinkRequest> slRequests = objectMapper.readValue(
                        socialLinksJson, new TypeReference<List<SocialLinkRequest>>() {}
                );
                List<SocialLink> links = new ArrayList<>();
                for (SocialLinkRequest s : slRequests) {
                    SocialLink sl = new SocialLink();
                    sl.setPlatform(s.getPlatform());
                    sl.setLink(s.getLink());
                    sl.setUser(entity);
                    links.add(sl);
                }
                entity.setSocialLinks(links);
            }

            UserEntity saved = userRepository.save(entity);
            return ResponseEntity.ok(UserMapper.toResponse(saved));
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * MultipartFile'ı base64 string'e çeviren metod
     */
    private String convertToBase64(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;
        
        byte[] fileBytes = file.getBytes();
        String base64String = Base64.getEncoder().encodeToString(fileBytes);
        
        // MIME type ile birlikte döndür (frontend için)
        String mimeType = file.getContentType();
        return "data:" + mimeType + ";base64," + base64String;
    }

}
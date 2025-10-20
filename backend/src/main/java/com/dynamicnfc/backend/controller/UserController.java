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

@CrossOrigin(origins = {
    "http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
    "https://localhost:3000", "https://localhost:3001", "https://localhost:3002",
    "http://3.128.244.219:3000", "http://3.128.244.219:3001", "http://3.128.244.219:3002", 
    "https://3.128.244.219:3000", "https://3.128.244.219:3001", "https://3.128.244.219:3002",
    "http://dynamicnfc.ca", "https://dynamicnfc.ca", 
    "http://www.dynamicnfc.ca", "https://www.dynamicnfc.ca"
})
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
            return ResponseEntity.status(500).header("X-Error-Message", e.getMessage()).build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).header("X-Error-Message", ex.getMessage()).build();
        }
    }

    /**
     * Update an existing user (multipart/form-data). Only provided fields/files are updated.
     */
    @RequestMapping(value = "/{id}/upload", method = {RequestMethod.PUT, RequestMethod.POST}, consumes = {"multipart/form-data"})
    public ResponseEntity<UserResponse> updateUserWithFiles(
            @PathVariable Long id,
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
            return userRepository.findById(id).map(entity -> {
                // update scalar fields only when provided (not null)
                if (name != null) entity.setName(name);
                if (jobTitle != null) entity.setJobTitle(jobTitle);
                if (department != null) entity.setDepartment(department);
                if (companyName != null) entity.setCompanyName(companyName);
                if (email != null) entity.setEmail(email);
                if (phone != null) entity.setPhone(phone);
                if (companyUrl != null) entity.setCompanyUrl(companyUrl);
                if (address != null) entity.setAddress(address);

                // update files only when provided
                try {
                    if (companyLogo != null && !companyLogo.isEmpty()) {
                        entity.setCompanyLogo(convertToBase64(companyLogo));
                    }
                    if (profilePicture != null && !profilePicture.isEmpty()) {
                        entity.setProfilePicture(convertToBase64(profilePicture));
                    }
                    if (coverPhoto != null && !coverPhoto.isEmpty()) {
                        entity.setCoverPhoto(convertToBase64(coverPhoto));
                    }
                } catch (IOException ioEx) {
                    throw new RuntimeException(ioEx);
                }

                if (socialLinksJson != null) {
                    try {
                        // If socialLinksJson is empty or blank, clear the links
                        if (socialLinksJson.isBlank()) {
                            entity.setSocialLinks(new ArrayList<>());
                        } else {
                            List<SocialLinkRequest> slRequests = objectMapper.readValue(
                                socialLinksJson, new TypeReference<List<SocialLinkRequest>>() {}
                            );

                           // clear and rebuild existing collection
                            entity.getSocialLinks().clear();
                            for (SocialLinkRequest s : slRequests) {
                                if (s.getLink() == null || s.getLink().trim().isEmpty()) continue;
                                SocialLink sl = new SocialLink();
                                sl.setPlatform(s.getPlatform());
                                sl.setLink(s.getLink());
                                sl.setUser(entity);
                                entity.getSocialLinks().add(sl);
                            }
                            // Replace existing links with the newly constructed list
                            //entity.setSocialLinks(newLinks);
                        }
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }


                UserEntity saved = userRepository.save(entity);
                return ResponseEntity.ok(UserMapper.toResponse(saved));
            }).orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException ex) {
            return ResponseEntity.status(500).header("X-Error-Message", ex.getMessage()).build();
        } catch (Exception ex) {
            return ResponseEntity.status(500).header("X-Error-Message", ex.getMessage()).build();
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
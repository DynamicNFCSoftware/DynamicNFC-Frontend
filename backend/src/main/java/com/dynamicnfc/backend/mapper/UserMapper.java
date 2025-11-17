package com.dynamicnfc.backend.mapper;

import com.dynamicnfc.backend.dto.*;
import com.dynamicnfc.backend.model.*;
import com.dynamicnfc.backend.util.HashIdUtil;

import java.util.stream.Collectors;

public class UserMapper {

    public static UserResponse toResponse(UserEntity entity) {
        UserResponse dto = new UserResponse();
        dto.setId(entity.getId());
        dto.setProfilePicture(entity.getProfilePicture());
        dto.setCoverPhoto(entity.getCoverPhoto());
        dto.setCompanyLogo(entity.getCompanyLogo());
        dto.setName(entity.getName());
        dto.setJobTitle(entity.getJobTitle());
        dto.setDepartment(entity.getDepartment());
        dto.setCompanyName(entity.getCompanyName());
        dto.setEmail(entity.getEmail());
        dto.setPhone(entity.getPhone());
        dto.setCompanyUrl(entity.getCompanyUrl());
        dto.setAddress(entity.getAddress());
        dto.setBackgroundColor(entity.getBackgroundColor());

        if (entity.getSocialLinks() != null) {
            dto.setSocialLinks(
                entity.getSocialLinks().stream().map(s -> {
                    SocialLinkResponse sl = new SocialLinkResponse();
                    sl.setId(s.getId());
                    sl.setPlatform(s.getPlatform());
                    sl.setLink(s.getLink());
                    return sl;
                }).collect(Collectors.toList())
            );
        }
        return dto;
    }
    
    public static UserResponse toResponse(UserEntity entity, HashIdUtil hashIdUtil) {
        UserResponse dto = toResponse(entity);
        if (hashIdUtil != null && entity.getId() != null) {
            dto.setHashId(hashIdUtil.encode(entity.getId()));
        }
        return dto;
    }
}

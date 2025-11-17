package com.dynamicnfc.backend.dto;

import java.util.List;

public class UserRequest {
    private String name;
    private String jobTitle;
    private String department;
    private String companyName;
    private String email;
    private String phone;
    private String companyUrl;
    private String address;
    private String profilePicture; // Base64 string
    private String coverPhoto;     // Base64 string
    private String companyLogo;    // Base64 string
    private String backgroundColor; // Hex color code
    private List<SocialLinkRequest> socialLinks;

    // Getter ve Setter metodları
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getCompanyUrl() { return companyUrl; }
    public void setCompanyUrl(String companyUrl) { this.companyUrl = companyUrl; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    
    public String getCoverPhoto() { return coverPhoto; }
    public void setCoverPhoto(String coverPhoto) { this.coverPhoto = coverPhoto; }
    
    public String getCompanyLogo() { return companyLogo; }
    public void setCompanyLogo(String companyLogo) { this.companyLogo = companyLogo; }
    
    public String getBackgroundColor() { return backgroundColor; }
    public void setBackgroundColor(String backgroundColor) { this.backgroundColor = backgroundColor; }
    
    public List<SocialLinkRequest> getSocialLinks() { return socialLinks; }
    public void setSocialLinks(List<SocialLinkRequest> socialLinks) { this.socialLinks = socialLinks; }
}
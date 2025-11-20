// User.js
export class User {
  constructor({
    id,
    name,
    jobTitle,
    department,
    companyName,
    email,
    phone,
    companyUrl,
    address,
    profilePicture,
    coverPhoto,
    companyLogo,
    socialLinks
  }) {
    this.id = id;
    this.name = name;
    this.jobTitle = jobTitle;
    this.department = department;
    this.companyName = companyName;
    this.email = email;
    this.phone = phone;
    this.companyUrl = companyUrl;
    this.address = address;
    this.profilePicture = profilePicture;
    this.coverPhoto = coverPhoto;
    this.companyLogo = companyLogo;
    this.socialLinks = socialLinks; // array
  }
}

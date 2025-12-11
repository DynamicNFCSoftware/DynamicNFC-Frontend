import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

export default function CreateCard() {
  const ICONS = {
    name: `
    <svg aria-hidden="true" class="svg-inline--fa fa-user " data-icon="user" data-prefix="far" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" fill="currentColor"></path></svg>
  `,

    jobTitle: `
    <svg aria-hidden="true" class="svg-inline--fa fa-user-astronaut " data-icon="user-astronaut" data-prefix="far" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224 48a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm181.2 80.4C379 53.6 307.8 0 224 0S69 53.6 42.8 128.4C27.6 130.9 16 144.1 16 160l0 64c0 15.9 11.6 29.1 26.8 31.6c9.7 27.6 25.5 52.4 45.8 72.6C35.6 359.1 0 416.5 0 482.3C0 498.7 13.3 512 29.7 512L160 512l0-48c0-8.8 7.2-16 16-16s16 7.2 16 16l0 48 226.3 0c16.4 0 29.7-13.3 29.7-29.7c0-65.8-35.6-123.2-88.6-154.1c20.3-20.2 36.2-45 45.8-72.6c15.2-2.5 26.8-15.7 26.8-31.6l0-64c0-15.9-11.6-29.1-26.8-31.6zM319.7 358.5c44.5 18 77.1 59.3 82.6 108.7l-66.4 0 0-19.2c0-17.7-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32l0 19.2-66.4 0c5.6-49.5 38.1-90.7 82.6-108.7C156.5 374.7 189.1 384 224 384s67.5-9.3 95.7-25.5zM160 128c-26.5 0-48 21.5-48 48l0 16c0 53 43 96 96 96l32 0c53 0 96-43 96-96l0-16c0-26.5-21.5-48-48-48l-128 0zm39.3 45.5l6 21.2 21.2 6c3.3 .9 5.5 3.9 5.5 7.3s-2.2 6.4-5.5 7.3l-21.2 6-6 21.2c-.9 3.3-3.9 5.5-7.3 5.5s-6.4-2.2-7.3-5.5l-6-21.2-21.2-6c-3.3-.9-5.5-3.9-5.5-7.3s2.2-6.4 5.5-7.3l21.2-6 6-21.2c.9-3.3 3.9-5.5 7.3-5.5s6.4 2.2 7.3 5.5zM256 464a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z" fill="currentColor"></path></svg>
  `,

    department: `
    <svg aria-hidden="true" class="svg-inline--fa fa-users " data-icon="users" data-prefix="fas" focusable="false" role="img" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z" fill="currentColor"></path></svg>
  `,

    companyName: `
   <svg aria-hidden="true" class="svg-inline--fa fa-building " data-icon="building" data-prefix="fas" focusable="false" role="img" viewBox="0 0 384 512" xmlns="http://www.w3.org/2000/svg"><path d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z" fill="currentColor"></path></svg>
  `,

    email: `
    <svg aria-hidden="true" class="svg-inline--fa fa-envelope " data-icon="envelope" data-prefix="fas" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" fill="currentColor"></path></svg>
  `,

    phone: `
    <svg aria-hidden="true" class="svg-inline--fa fa-phone " data-icon="phone" data-prefix="fas" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z" fill="currentColor"></path></svg>
  `,

    companyUrl: `
    <svg aria-hidden="true" class="svg-inline--fa fa-link fa-w-16 " data-icon="link" data-prefix="far" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z" fill="currentColor"></path></svg>
  `,

    twitter: `
    <svg aria-hidden="true" class="svg-inline--fa fa-x-twitter " data-icon="x-twitter" data-prefix="fab" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" fill="currentColor"></path></svg>
  `,

    instagram: `
    <svg aria-hidden="true" class="svg-inline--fa fa-instagram " data-icon="instagram" data-prefix="fab" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="currentColor"></path></svg>
  `,

    facebook: `
    <svg aria-hidden="true" class="svg-inline--fa fa-facebook " data-icon="facebook" data-prefix="fab" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" fill="currentColor"></path></svg>
  `,

    linkedin: `
    <svg aria-hidden="true" class="svg-inline--fa fa-linkedin-in " data-icon="linkedin-in" data-prefix="fab" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" fill="currentColor"></path></svg>
  `,

    youtube: `
  <svg aria-hidden="true" class="svg-inline--fa fa-youtube " data-icon="youtube" data-prefix="fab" focusable="false" role="img" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" fill="currentColor"></path></svg>
  `,

    other: `
   <svg aria-hidden="true" class="svg-inline--fa fa-link fa-w-16 " data-icon="link" data-prefix="far" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z" fill="currentColor"></path></svg>
  `
  };

  const [qrUrl, setQrUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [collectedFields, setCollectedFields] = useState(null);
  const [selected, setSelected] = useState([]);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [pendingField, setPendingField] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");

    script.src = "https://dynamicnfc.ca/assets/js/card-create.js";
    script.async = true;

    document.body.appendChild(script);

    // Tüm link stylesheet'leri bul
    const links = Array.from(document.querySelectorAll("link[rel='stylesheet']"));

    // sakla
    const oldLinks = links.map((link) => ({ link, href: link.href }));

    // hepsini devre dışı bırak
    links.forEach((link) => (link.disabled = true));
    //css ekle


    const link = document.createElement("link");

    link.href = "https://dynamicnfc.ca/assets/css/f0be61666b9614df.css"; // CSS dosyanın URL'si
    link.rel = "stylesheet";
    link.type = "text/css";

    document.head.appendChild(link); // CSS linkleri <head> içinde olmalı

    const link2 = document.createElement("link");

    link2.href = "https://dynamicnfc.ca/assets/css/f984sdf8q4q5qwq.css"; // CSS dosyanın URL'si
    link2.rel = "stylesheet";
    link2.type = "text/css";

    document.head.appendChild(link2); // CSS linkleri <head> içinde olmalı
    return () => {
      // sayfadan çıkarken geri aç
      oldLinks.forEach((item) => (item.link.disabled = false));
    };
  }, []);

  function dataURLtoFile(dataurl, filename) {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  const submitCardToAPI = async () => {
    try {
      if (!collectedFields) {
        alert("No data collected from step 1.");
        return;
      }

      setIsSaving(true);

      const formData = new FormData();

      // Normal bilgiler
      if (collectedFields.name) formData.append("name", collectedFields.name);
      if (collectedFields.jobTitle) formData.append("jobTitle", collectedFields.jobTitle);
      if (collectedFields.department) formData.append("department", collectedFields.department);
      if (collectedFields.companyName) formData.append("companyName", collectedFields.companyName);
      if (collectedFields.email) formData.append("email", collectedFields.email);
      if (collectedFields.phone) formData.append("phone", collectedFields.phone);
      if (collectedFields.companyUrl) formData.append("companyUrl", collectedFields.companyUrl);
      if (collectedFields.backgroundColor) formData.append("backgroundColor", collectedFields.backgroundColor);

      // Social Links
      if (collectedFields.socialLinks && collectedFields.socialLinks.length > 0) {
        const socialLinksArray = collectedFields.socialLinks.map((link) => ({
          platform: link.key,
          link: link.value,
        }));

        formData.append("socialLinks", JSON.stringify(socialLinksArray));
      }

      // Dosyaları ekle
      if (collectedFields.coverPhotoSrc) {
        formData.append(
          "companyLogo",
          dataURLtoFile(collectedFields.coverPhotoSrc, "cover.png")
        );
      }

      if (collectedFields.profilePictureSrc) {
        formData.append(
          "profilePicture",
          dataURLtoFile(collectedFields.profilePictureSrc, "profile.png")
        );
      }

      if (collectedFields.companyLogoSrc) {
        formData.append(
          "coverPhoto",
          dataURLtoFile(collectedFields.companyLogoSrc, "company.png")
        );
      }

      // Backend'e gönder
      const res = await fetch("/api/users/upload", {
        method: "POST",
        body: formData,
        // credentials: "include"
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${text}`);
      }

      const data = await res.json();

      const hashId = data.hashId || data.hash_id || (data.id ? String(data.id) : null);

      if (!hashId) {
        alert("Saved but backend did not return hashId.");
        setIsSaving(false);
        return;
      }

      // QR oluştur
      const domain = window.location.origin.replace(/:\d+$/, "");
      const targetUrl = `${domain}/Card/?hashId=${encodeURIComponent(hashId)}`;
      const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        targetUrl
      )}`;

      setQrUrl(qrApi);

      alert("Card created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to submit card: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const [positions, setPositions] = useState({
    topLeft: null,
    topRight: null,
    bottomLeft: null,
    bottomRight: null,
  });

  const collectFields = () => {
    const fields = {};
    const socialKeys = ["twitter", "instagram", "facebook", "other", "youtube", "linkedin"];
    const socialLinks = [];

    document.querySelectorAll("#card-fields li").forEach((li) => {
      const valueDiv = li.querySelector(".Field_field-data-value__p3KXA");
      if (valueDiv) {
        const value = valueDiv.textContent.trim();
        const icon = li.querySelector(".category");
        const key = icon?.dataset.apiKey || "unknown";

        if (socialKeys.includes(key)) {
          socialLinks.push({ key, value });
        } else {
          fields[key] = value;
        }
      }
    });

    return {
      ...fields,
      socialLinks,
      profilePictureSrc: document.getElementById("profileCircle")?.src || null,
      coverPhotoSrc: document.getElementById("coverCircle")?.src || null,
      companyLogoSrc: document.getElementById("companyCircle")?.src || null,
      backgroundColor: document.getElementById("bg-card-bg")?.style.background || null,
    };
  };

  const handleNext = () => {
    const data = collectFields();

    const normalFieldsCount = Object.entries(data)
      .filter(([key, value]) => {
        return (
          key !== "socialLinks" &&
          key !== "profilePictureSrc" &&
          key !== "coverPhotoSrc" &&
          key !== "companyLogoSrc" &&
          value && value.trim() !== ""
        );
      })
      .length;

    const socialCount = data.socialLinks ? data.socialLinks.length : 0;

    const total = normalFieldsCount + socialCount;

    if (total < 4) {
      alert("Please add at least 4 fields to proceed.");
      return;
    }

    setCollectedFields(data);
    setIsNext(true);
  };

  const handleSelectField = (key, value) => {
    if (selected.length >= 4) {
      alert("You can only select up to 4 fields.");
      return;
    }

    // Tıklanan field'ı geçici olarak sakla
    setPendingField({ key, value });

    // Modalı aç
    setPositionModalOpen(true);
  };

  const removeSlot = (slotKey) => {
    setPositions(prev => ({
      ...prev,
      [slotKey]: null,
    }));

    setSelected(prev => prev.filter(item => item.posKey !== slotKey));
  };

  const assignPosition = (posKey) => {
    if (!pendingField) return;

    setPositions(prev => ({
      ...prev,
      [posKey]: pendingField.value,
    }));

    setSelected(prev => [
      ...prev,
      { key: pendingField.key, value: pendingField.value, posKey }
    ]);

    setPendingField(null);
    setPositionModalOpen(false);
  };

  return (
    <>
      <div>
        <div
          className="OnboardingLayout_onboarding-layout__tWpCH" style={{ "background": "white", minHeight: "100vh" }}>
          <div
            className="OnboardingLayout_side-section__S4_s4  bg-card-bg"
            id="bg-card-bg"
            data-allow-overflow="true"
            data-centered="true"
            data-theme="light"
            style={{ "background": "#f45a5740", height: "auto" }}>
            <div className="OnboardingLayout_side-section-bounds__PEYtk">
              <div className="OnboardingLayout_side-section-content__LwDmM">
                {!isNext ? (
                  <div className="customize-card_side-section-content__DnTBV">
                    <div
                      className="Card_card-measurer__87Mvw"
                      data-mode="standalone">
                      <div
                        className="Card_card-container__OxmEq"
                        style={{
                          "--card-color": "244,90,87",
                        }}>
                        <section
                          className="Card_card__Jh6sd"
                          data-edit-mode="true"
                          data-mode="standalone"
                          data-size="regular">
                          <header
                            className="CardHeader_card-header__mOiLv"
                            data-card-layout="1C"
                            data-edit-mode="true"
                            data-empty="true"
                            data-has-floating-images="false"
                            data-image-type="cover"
                            data-mode="standalone">
                            <div
                              className="CardHeader_banner-image-container__6g0Pz CardHeader_base-is-locked-overlay__Mlkud"
                              data-can-lock="false"
                              data-edit-mode="true"
                              data-image-type="cover"
                              data-is-locked="false"
                              style={{
                                opacity: "1",
                              }}>
                              <img
                                alt="cover"
                                className="CardHeader_banner-image__2KOX9"
                                data-edit-mode="true"
                                data-editor-version="web_editor_v1"
                                data-image-type="cover"
                                data-mode="standalone"
                                id="companyCircle"
                                src="assets/images/empty-cover-photo.5e4f5f6e.png"
                              />
                            </div>
                            <div
                              className="CardHeader_left-picture__v05WN CardHeader_base-is-locked-overlay__Mlkud"
                              data-can-lock="false"
                              data-edit-mode="true"
                              data-has-image="true"
                              data-image-type="profile"
                              data-is-interactive="true"
                              data-is-locked="false"
                              style={{
                                opacity: "1",
                              }}>
                              <img
                                alt="Profile"
                                className="CardHeader_left-picture-img__yFgFE"
                                id="profileCircle"
                                src="assets/images/empty-profile-photo.5e4f5f6e.png"
                              />
                            </div>
                            <div
                              className="CardHeader_right-picture__uGU1E CardHeader_base-is-locked-overlay__Mlkud"
                              data-can-lock="false"
                              data-edit-mode="true"
                              data-has-image="true"
                              data-is-interactive="true"
                              data-is-locked="false"
                              style={{
                                opacity: "1",
                              }}>
                              <img
                                alt="Logo"
                                className="CardHeader_right-picture-img__L0u2u"
                                id="coverCircle"
                                src="assets/images/empty-company-logo.5e4f5f6e.png"
                              />
                            </div>
                          </header>
                          <div className="Card_card-body__aO0rx">
                            <div className="Card_user-details__pnVPN" />
                            <div>
                              <ul
                                className="Card_card-items__X_o8P" id="card-fields" style={{ marginTop: "60px" }}></ul>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                    <div className="common_color-selector-container__sIW1V">
                      <div className="ColorSelector_color-selector-container__o0Low">
                        <ul className="ColorSelector_color-presets__5FZm0">
                          <li>
                            <span
                              data-reach-tooltip-trigger=""
                              data-state="tooltip-hidden">
                              <button
                                className="ColorSelector_custom-color__d1Vun ColorSelector_color-btn__UO46H"
                                data-locked="true"
                                data-selected="false"
                                data-color="#F45A57"
                                style={{
                                  "--color": "#F45A57",
                                }}>
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-crown ColorSelector_lock-icon__U_SMV"
                                  data-icon="crown"
                                  data-prefix="fas"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 576 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M309 106c11.4-7 19-19.7 19-34c0-22.1-17.9-40-40-40s-40 17.9-40 40c0 14.4 7.6 27 19 34L209.7 220.6c-9.1 18.2-32.7 23.4-48.6 10.7L72 160c5-6.7 8-15 8-24c0-22.1-17.9-40-40-40S0 113.9 0 136s17.9 40 40 40c.2 0 .5 0 .7 0L86.4 427.4c5.5 30.4 32 52.6 63 52.6l277.2 0c30.9 0 57.4-22.1 63-52.6L535.3 176c.2 0 .5 0 .7 0c22.1 0 40-17.9 40-40s-17.9-40-40-40s-40 17.9-40 40c0 9 3 17.3 8 24l-89.1 71.3c-15.9 12.7-39.5 7.5-48.6-10.7L309 106z"
                                    fill="currentColor"></path>
                                </svg>
                              </button>
                            </span>
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="true"
                              data-size="sm"
                              data-color="#F45A57"
                              style={{
                                "--color": "#F45A57",
                                "--outline": "#F45A57",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#4a0f0fff"
                              style={{
                                "--color": "#4a0f0fff",
                                "--outline": "#4a0f0fff",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#FAC000"
                              style={{
                                "--color": "#FAC000",
                                "--outline": "#FAC000",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#faff72ff"
                              style={{
                                "--color": "#faff72ff",
                                "--outline": "#faff72ff",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#7cce5eff"
                              style={{
                                "--color": "#7cce5eff",
                                "--outline": "#7cce5eff",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#00E0BB"
                              style={{
                                "--color": "#00E0BB",
                                "--outline": "#00E0BB",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#0F9BFF"
                              style={{
                                "--color": "#0F9BFF",
                                "--outline": "#0F9BFF",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#0f187f"
                              style={{
                                "--color": "#0f187f",
                                "--outline": "#0f187f",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#A53DF5"
                              style={{
                                "--color": "#A53DF5",
                                "--outline": "#A53DF5",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#1a1a1aff"
                              style={{
                                "--color": "#1a1a1aff",
                                "--outline": "#1a1a1aff",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#35393B"
                              style={{
                                "--color": "#35393B",
                                "--outline": "#35393B",
                              }}
                              type="button"
                            />
                          </li>
                          <li>
                            <button
                              className="ColorSelector_color__OGoSm ColorSelector_color-btn__UO46H"
                              data-selected="false"
                              data-size="sm"
                              data-color="#ACB9BE"
                              style={{
                                "--color": "#ACB9BE",
                                "--outline": "#ACB9BE",
                              }}
                              type="button"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {!qrUrl ? (
                      <div className="customize-card_side-section-content__DnTBV">
                        <div
                          className="Card_card-measurer__87Mvw">
                          <div
                            className="Card_card-container__OxmEq"
                            style={{
                              "--card-color": "244,90,87",
                            }}>
                            <section style={{ minHeight: 250 }}
                              className="Card_card__Jh6sd"
                              data-edit-mode="true"
                              data-mode="standalone"
                              data-size="regular">
                              <div className="Card_card-body__aO0rx">
                                <div className="Card_user-details__pnVPN" />
                                <div>
                                  <div style={{ position: "absolute", top: 12, left: 12 }}>
                                    {positions.topLeft && (
                                      <div style={{ position: "relative", paddingRight: "20px" }}>
                                        {positions.topLeft}
                                        <span
                                          onClick={() => removeSlot("topLeft")}
                                          style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            cursor: "pointer",
                                            color: "red",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          ×
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ position: "absolute", top: 12, right: 12 }}>
                                    {positions.topRight && (
                                      <div style={{ position: "relative", paddingRight: "20px" }}>
                                        {positions.topRight}
                                        <span
                                          onClick={() => removeSlot("topRight")}
                                          style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            cursor: "pointer",
                                            color: "red",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          ×
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <div style={{ position: "absolute", bottom: 12, left: 12 }}>
                                    {positions.bottomLeft && (
                                      <div style={{ position: "relative", paddingRight: "20px" }}>
                                        {positions.bottomLeft}
                                        <span
                                          onClick={() => removeSlot("bottomLeft")}
                                          style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            cursor: "pointer",
                                            color: "red",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          ×
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div style={{ position: "absolute", bottom: 12, right: 12 }}>
                                    {positions.bottomRight && (
                                      <div style={{ position: "relative", paddingRight: "20px" }}>
                                        {positions.bottomRight}
                                        <span
                                          onClick={() => removeSlot("bottomRight")}
                                          style={{
                                            position: "absolute",
                                            right: 0,
                                            top: 0,
                                            cursor: "pointer",
                                            color: "red",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          ×
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <p>QR Has been created successfully!</p>
                        <h4 style={{ marginBottom: 8 }}>Your QR (scan to open)</h4>
                        <img
                          src={qrUrl}
                          alt="QR Code"
                          style={{
                            width: 200,
                            height: 200,
                            display: 'block',
                            margin: '0 auto',
                            background: 'white',
                            padding: 8,
                            borderRadius: 8,
                          }}
                        />
                        <div style={{ marginTop: 8 }}>
                          <a
                            href={qrUrl}
                            download={`card-${Date.now()}.png`}
                            style={{
                              marginRight: 8,
                              textDecoration: 'none',
                              padding: '8px 12px',
                              borderRadius: 8,
                              background: '#10b981',
                              color: 'white',
                            }}
                          >
                            Download QR
                          </a>
                          <button
                            onClick={() =>
                              navigator.clipboard.writeText(
                                `${window.location.origin}/card/?hashId=${encodeURIComponent(
                                  qrUrl.split('data=')[1] || ''
                                )}`
                              )
                            }
                          >
                            Copy URL
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="OnboardingLayout_main-section__8IX3X" style={{ position: "relative" }}>
            <div className="OnboardingLayout_main-section-contents__2nidC">

              {!isNext ? (
                <>
                  <div className="OnboardingLayout_main-section-header__rRqBL">
                    <h1 className="OnboardingLayout_main-section-header-heading__WQ5ju">
                      Create your first card
                    </h1>
                    <p className="OnboardingLayout_main-section-header-explainer__Fs5hY">
                      Ready to design your card? Pick a field below to get started!{" "}
                    </p>
                  </div>
                  <div className="customize-card_card-edit-section__GI5mw">
                    <div className="customize-card_card-edit-section-header-row__XTMKv">
                      <h3 className="customize-card_card-edit-section-header__j0lk8">
                        Add images
                      </h3>
                    </div>
                    <div className="customize-card_card-images__fP1Je">
                      <div className="CardHeaderPictures_picture-preview-container__Lo_so">
                        <div className="CardHeaderPictures_picture-preview-button-container__FzV7i">
                          <button
                            className="CardHeaderPictures_picture-preview__TkNhH"
                            data-api-key="companyLogo"
                            data-can-lock="false"
                            data-empty="true"
                            data-locked="false"
                            id="buttonsCompany">
                            <div
                              className="CardHeaderPictures_empty-picture____jiZ"
                              id="companyUploadPreview">
                              <div className="CardHeaderPictures_empty-picture-icon-container__1ayZg">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-plus fa-sm "
                                  data-icon="plus"
                                  data-prefix="far"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 448 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 160L40 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l160 0 0 160c0 13.3 10.7 24 24 24s24-10.7 24-24l0-160 160 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-160 0 0-160z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div>Company Logo</div>
                              <div className="CardHeaderPictures_required-label__7zTA1" />
                            </div>
                          </button>
                        </div>
                        <div className="CardHeaderPictures_picture-preview-button-container__FzV7i">
                          <button
                            className="CardHeaderPictures_picture-preview__TkNhH"
                            data-api-key="profilePicture"
                            data-can-lock="false"
                            data-empty="true"
                            data-locked="false"
                            id="buttonsProfile">
                            <div className="CardHeaderPictures_empty-picture____jiZ">
                              <div
                                className="CardHeaderPictures_empty-picture-icon-container__1ayZg"
                                id="profileUploadPreview">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-plus fa-sm "
                                  data-icon="plus"
                                  data-prefix="far"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 448 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 160L40 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l160 0 0 160c0 13.3 10.7 24 24 24s24-10.7 24-24l0-160 160 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-160 0 0-160z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div>Profile Picture</div>
                              <div className="CardHeaderPictures_required-label__7zTA1" />
                            </div>
                          </button>
                        </div>
                        <div className="CardHeaderPictures_picture-preview-button-container__FzV7i">
                          <button
                            className="CardHeaderPictures_picture-preview__TkNhH"
                            data-can-lock="false"
                            data-api-key="coverPhoto"
                            data-empty="true"
                            data-locked="false"
                            id="buttonsCover">
                            <div className="CardHeaderPictures_empty-picture____jiZ">
                              <div
                                className="CardHeaderPictures_empty-picture-icon-container__1ayZg"
                                id="coverUploadPreview">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-plus fa-sm "
                                  data-icon="plus"
                                  data-prefix="far"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 448 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 160L40 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l160 0 0 160c0 13.3 10.7 24 24 24s24-10.7 24-24l0-160 160 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-160 0 0-160z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div>Cover Photo</div>
                              <div className="CardHeaderPictures_required-label__7zTA1" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="customize-card_card-edit-section__GI5mw">
                    <div className="customize-card_card-edit-section-header-row__XTMKv">
                      <h3 className="customize-card_card-edit-section-header__j0lk8">
                        Add your details
                      </h3>
                    </div>
                    <div className="AddFieldSection_add-field-section__HmcKE">
                      <div>
                        <h4 className="AddFieldSection_add-field-heading__hooMf">
                          Personal
                        </h4>
                        <ul className="AddFieldSection_field-list__KF1cU">
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              id="name-field-btn"
                              data-api-key="name"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-user "
                                  data-icon="user"
                                  data-prefix="far"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 448 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Name
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              id="job_title-field-btn"
                              data-api-key="jobTitle"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-user-astronaut "
                                  data-icon="user-astronaut"
                                  data-prefix="far"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 448 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M224 48a144 144 0 1 1 0 288 144 144 0 1 1 0-288zm181.2 80.4C379 53.6 307.8 0 224 0S69 53.6 42.8 128.4C27.6 130.9 16 144.1 16 160l0 64c0 15.9 11.6 29.1 26.8 31.6c9.7 27.6 25.5 52.4 45.8 72.6C35.6 359.1 0 416.5 0 482.3C0 498.7 13.3 512 29.7 512L160 512l0-48c0-8.8 7.2-16 16-16s16 7.2 16 16l0 48 226.3 0c16.4 0 29.7-13.3 29.7-29.7c0-65.8-35.6-123.2-88.6-154.1c20.3-20.2 36.2-45 45.8-72.6c15.2-2.5 26.8-15.7 26.8-31.6l0-64c0-15.9-11.6-29.1-26.8-31.6zM319.7 358.5c44.5 18 77.1 59.3 82.6 108.7l-66.4 0 0-19.2c0-17.7-14.3-32-32-32l-160 0c-17.7 0-32 14.3-32 32l0 19.2-66.4 0c5.6-49.5 38.1-90.7 82.6-108.7C156.5 374.7 189.1 384 224 384s67.5-9.3 95.7-25.5zM160 128c-26.5 0-48 21.5-48 48l0 16c0 53 43 96 96 96l32 0c53 0 96-43 96-96l0-16c0-26.5-21.5-48-48-48l-128 0zm39.3 45.5l6 21.2 21.2 6c3.3 .9 5.5 3.9 5.5 7.3s-2.2 6.4-5.5 7.3l-21.2 6-6 21.2c-.9 3.3-3.9 5.5-7.3 5.5s-6.4-2.2-7.3-5.5l-6-21.2-21.2-6c-3.3-.9-5.5-3.9-5.5-7.3s2.2-6.4 5.5-7.3l21.2-6 6-21.2c.9-3.3 3.9-5.5 7.3-5.5s6.4 2.2 7.3 5.5zM256 464a16 16 0 1 1 32 0 16 16 0 1 1 -32 0z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Job title
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              id="department-field-btn"
                              data-api-key="department"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-users "
                                  data-icon="users"
                                  data-prefix="fas"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 640 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Department
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              id="org_name-field-btn"
                              role="button"
                              data-api-key="companyName"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-building "
                                  data-icon="building"
                                  data-prefix="fas"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 384 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M48 0C21.5 0 0 21.5 0 48L0 464c0 26.5 21.5 48 48 48l96 0 0-80c0-26.5 21.5-48 48-48s48 21.5 48 48l0 80 96 0c26.5 0 48-21.5 48-48l0-416c0-26.5-21.5-48-48-48L48 0zM64 240c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zm112-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM80 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32zM272 96l32 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Company name
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <br />
                        <h4 className="AddFieldSection_add-field-heading__hooMf">
                          General
                        </h4>
                        <ul className="AddFieldSection_field-list__KF1cU">
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              id="email-field-btn"
                              role="button"
                              data-api-key="email"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-envelope "
                                  data-icon="envelope"
                                  data-prefix="fas"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Email
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-api-key="phone"
                              data-disabled="false"
                              id="phone-field-btn"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-phone "
                                  data-icon="phone"
                                  data-prefix="fas"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Phone
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              id="url-field-btn"
                              role="button"
                              data-api-key="companyUrl"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-link fa-w-16 "
                                  data-icon="link"
                                  data-prefix="far"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Website
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <br />
                        <h4 className="AddFieldSection_add-field-heading__hooMf">
                          Social
                        </h4>
                        <ul className="AddFieldSection_field-list__KF1cU">
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              data-api-key="twitter"
                              id="url-field-btn"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-x-twitter "
                                  data-icon="x-twitter"
                                  data-prefix="fab"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                X
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              data-api-key="instagram"
                              id="url-field-btn"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-instagram "
                                  data-icon="instagram"
                                  data-prefix="fab"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 448 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Instagram
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              data-api-key="linkedin"
                              id="url-field-btn"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-linkedin-in "
                                  data-icon="linkedin-in"
                                  data-prefix="fab"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 448 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                LinkedIn
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              data-api-key="facebook"
                              id="url-field-btn"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-facebook "
                                  data-icon="facebook"
                                  data-prefix="fab"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Facebook
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              id="url-field-btn"
                              data-api-key="youtube"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-youtube "
                                  data-icon="youtube"
                                  data-prefix="fab"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 576 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                YouTube
                              </div>
                            </div>
                          </li>
                          <li>
                            <div
                              className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                              data-disabled="false"
                              id="url-field-btn"
                              data-api-key="other"
                              role="button"
                              tabIndex="0">
                              <div className="FieldButton_field-button-icon-container__R17_O">
                                <svg
                                  aria-hidden="true"
                                  className="svg-inline--fa fa-link fa-w-16 "
                                  data-icon="link"
                                  data-prefix="far"
                                  focusable="false"
                                  role="img"
                                  viewBox="0 0 512 512"
                                  xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z"
                                    fill="currentColor"></path>
                                </svg>
                              </div>
                              <div className="FieldButton_field-button-label__usbta">
                                Other
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="OnboardingLayout_navigation-buttons-section__3Cusm">
                      <div
                        className="OnboardingLayout_forward-button__lmyFn"
                        data-full-width="false">
                        <div data-reach-tooltip-trigger="" data-state="tooltip-hidden">
                          <button onClick={handleNext}
                            aria-disabled="false"
                            className="Button_button__OFOdO"
                            data-disabled="false"
                            data-is-full-width="true"
                            data-loading="false"
                            data-size="medium"
                            data-theme="light"
                            data-type="primary"
                            data-variant="primary"
                            type="submit">
                            <div className="Button_button-content__tRj6R">Next</div>
                            <div className="Button_loader-container__VRaoC">
                              <div className="Loader_loader__7ZWW3" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="OnboardingLayout_main-section-header__rRqBL">
                    <h1 className="OnboardingLayout_main-section-header-heading__WQ5ju">
                      Create your first card
                    </h1>
                    <p className="OnboardingLayout_main-section-header-explainer__Fs5hY">
                      Ready to design your card? Pick a field below to get started!{" "}
                    </p>
                  </div>
                  <div className="customize-card_card-edit-section__GI5mw">
                    <div className="customize-card_card-edit-section-header-row__XTMKv">
                      <h3 className="customize-card_card-edit-section-header__j0lk8">
                        Collected details
                      </h3>
                    </div>
                    <div className="AddFieldSection_add-field-section__HmcKE">
                      <div>
                        <br />
                        <h4 className="AddFieldSection_add-field-heading__hooMf">
                          General
                        </h4>
                        <ul className="AddFieldSection_field-list__KF1cU">

                          {Object.entries(collectedFields).map(([key, value]) => {
                            if (
                              key === "backgroundColor" ||
                              key === "profilePictureSrc" ||
                              key === "coverPhotoSrc" ||
                              key === "companyLogoSrc" ||
                              key === "socialLinks"
                            ) {
                              return null;
                            }

                            return (
                              <li
                                key={key}
                                onClick={() => handleSelectField(key, value)}
                              >
                                <div
                                  className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                                  data-disabled="false"
                                  id="url-field-btn"
                                  role="button"
                                  tabIndex="0">
                                  <div
                                    className="FieldButton_field-button-icon-container__R17_O"
                                    dangerouslySetInnerHTML={{ __html: ICONS[key] || "" }}
                                  ></div>
                                  <div className="FieldButton_field-button-label__usbta">
                                    {value}
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div>
                        <br />
                        <h4 className="AddFieldSection_add-field-heading__hooMf">
                          Social Links
                        </h4>
                        <ul className="AddFieldSection_field-list__KF1cU">
                          {collectedFields.socialLinks?.map((s, i) => (
                            <li
                              key={s.key + i}
                              onClick={() => handleSelectField(s.key, s.value)}
                            >
                              <div
                                className="FieldButton_field-button__HMdrH FieldButton_base-field___CXj_"
                                data-disabled="false"
                                id="url-field-btn"
                                role="button"
                                tabIndex="0">
                                <div
                                  className="FieldButton_field-button-icon-container__R17_O"
                                  dangerouslySetInnerHTML={{ __html: ICONS[s.key] || "" }}
                                ></div>
                                <div className="FieldButton_field-button-label__usbta">
                                  {s.value}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="OnboardingLayout_navigation-buttons-section__3Cusm" style={{ position: "absolute", bottom: 0 }}>
                      <div className="customize-card_legal-disclaimer__sjoOp">
                        By continuing, you agree to our{" "}
                        <a
                          className="customize-card_legal-disclaimer-link__V2Ntu"
                          href="https://blinq.me/legal/privacy-policy"
                          rel="noreferrer"
                          target="_blank">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a
                          className="customize-card_legal-disclaimer-link__V2Ntu"
                          href="https://blinq.me/legal/terms-conditions"
                          rel="noreferrer"
                          target="_blank">
                          Terms of Service
                        </a>
                      </div>
                      <div
                        className="OnboardingLayout_forward-button__lmyFn"
                        data-full-width="false">
                        <div data-reach-tooltip-trigger="" data-state="tooltip-hidden">
                          {!qrUrl ? (
                            <>
                              <button onClick={submitCardToAPI}
                                aria-disabled="false"
                                className="Button_button__OFOdO"
                                data-disabled="false"
                                data-is-full-width="true"
                                data-loading="false"
                                data-size="medium"
                                data-theme="light"
                                data-type="primary"
                                data-variant="primary"
                                type="submit">
                                <div className="Button_button-content__tRj6R">Create Card</div>
                                <div className="Button_loader-container__VRaoC">
                                  <div className="Loader_loader__7ZWW3" />
                                </div>
                              </button>
                            </>
                          ) : (
                            <Link
                              to="/"
                              aria-disabled="false"
                              className="Button_button__OFOdO"
                              data-disabled="false"
                              data-is-full-width="true"
                              data-loading="false"
                              data-size="medium"
                              data-theme="light"
                              data-type="primary"
                              data-variant="primary"
                              type="submit">
                              <div className="Button_button-content__tRj6R">Return to home</div>
                              <div className="Button_loader-container__VRaoC">
                                <div className="Loader_loader__7ZWW3" />
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="Popover_popover__XcLdh" id="popupField">
          <div className="EditCardPopover_edit-card-popover__OH5DY">
            <form className="EditCardPopover_popover-body__aqKms">
              <div className="Popover_scrollable__53oYT">
                <div className="Popover_popover-content__PXmKI Popover_popover-content-base__WAqCO">
                  <div className="Card_edit-card-field-popover__ZNCon">
                    <div className="NameEditPopover_name-edit-popover__Viwa5">
                      <div className="LinkStatusContainer_card-edit-input-container__rZmpe">
                        <div className="Input_input__BAC_9">
                          <label className="Input_input-container__qyxTr">
                            <input
                              autoComplete="given-name"
                              className="Input_input-el__Jg4VW"
                              defaultValue=""
                              type="text"
                            />
                            <span className="Input_label-text__V0k_r" id="inputName">
                              First name
                            </span>
                            <span className="Input_error-text__eCV_0">
                              This field can't be empty
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="Popover_sticky-bottom__ij0v7">
                <div className="Popover_buttons-content__dD3rJ Popover_popover-content-base__WAqCO">
                  <div className="EditCardPopover_action-btns-container__FLie8">
                    <div className="EditCardPopover_controls-section-other-btns___DTmg">
                      <button
                        aria-disabled="false"
                        className="Button_button__OFOdO"
                        data-disabled="false"
                        data-is-full-width="true"
                        data-loading="false"
                        data-size="medium"
                        data-theme="light"
                        data-type="primary"
                        data-variant="secondary"
                        id="cancel-btn"
                        type="button">
                        <div className="Button_button-content__tRj6R">Cancel</div>
                        <div className="Button_loader-container__VRaoC">
                          <div className="Loader_loader__7ZWW3" />
                        </div>
                      </button>
                      <button
                        aria-disabled="true"
                        className="Button_button__OFOdO"
                        data-disabled="true"
                        data-is-full-width="true"
                        data-loading="false"
                        data-size="medium"
                        data-theme="light"
                        data-type="primary"
                        data-variant="primary"
                        disabled
                        type="submit">
                        <div className="Button_button-content__tRj6R">Save</div>
                        <div className="Button_loader-container__VRaoC">
                          <div className="Loader_loader__7ZWW3" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="Popover_popover__XcLdh" id="companyPopup">
          <div data-reach-popover-content="true">
            <div className="EditCardPopover_edit-card-popover__OH5DY">
              <div className="EditCardPopover_popover-body__aqKms">
                <div
                  className="CardHeader_edit-popover-content__PiA4D"
                  data-function="selector">
                  <div className="Popover_scrollable__53oYT">
                    <div className="Popover_title-container__Pj7Mq">
                      <div className="Popover_title-content__J6JFU Popover_popover-content-base__WAqCO">
                        <span className="Popover_title-text__PKd8E">
                          Add company logo{" "}
                        </span>
                        <button
                          className="Popover_title-close__qfXja"
                          id="cancel-btn">
                          <svg
                            aria-hidden="true"
                            className="svg-inline--fa fa-xmark fa-lg "
                            data-icon="xmark"
                            data-prefix="fal"
                            focusable="false"
                            role="img"
                            viewBox="0 0 384 512"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.6 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"
                              fill="currentColor"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="Popover_popover-content__PXmKI Popover_popover-content-base__WAqCO">
                      <div className="LinkStatusContainer_card-edit-input-container__rZmpe">
                        <div
                          style={{
                            height: "132px",
                          }}>
                          <div className="ImageSelector_image-selector__R2HjF">
                            <div
                              className="ImageSelector_drop-zone__ddEuM"
                              data-dragging="false"
                              data-invalid-files="false"
                              id="companyDropZone"
                              role="presentation"
                              tabIndex="0">
                              <input
                                accept="image/jpeg,.jpeg,image/jpg,.jpg,image/png,.png"
                                id="companyUpload"
                                style={{
                                  border: "0px",
                                  clip: "rect(0px, 0px, 0px, 0px)",
                                  clipPath: "inset(50%)",
                                  height: "1px",
                                  margin: "0px -1px -1px 0px",
                                  overflow: "hidden",
                                  padding: "0px",
                                  position: "absolute",
                                  whiteSpace: "nowrap",
                                  width: "1px",
                                }}
                                tabIndex="-1"
                                type="file"
                              />
                              <div
                                className="ImageSelector_drop-zone-icon__htH5e"
                                style={{
                                  opacity: "1",
                                }}>
                                <svg height="0" width="0">
                                  <radialGradient
                                    cx="15%"
                                    cy="30%"
                                    id="dropzone-gradient"
                                    r="150%">
                                    <stop offset="0" stopColor="#97c8ed" />
                                    <stop offset="0.6" stopColor="#1f87ff" />
                                  </radialGradient>
                                </svg>
                              </div>
                              <p
                                className="ImageSelector_drop-zone-text__89sVL"
                                style={{
                                  opacity: "1",
                                }}>
                                Drop your image here, or
                                <span className="ImageSelector_browse-text__TKA9a">
                                  browse
                                </span>
                              </p>
                              <p
                                className="ImageSelector_drop-zone-subtext__leU2g"
                                style={{
                                  opacity: "1",
                                }}>
                                Supports JPG, JPEG, and PNG
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Popover_popover__XcLdh" id="profilePopup">
          <div data-reach-popover-content="true">
            <div className="EditCardPopover_edit-card-popover__OH5DY">
              <div className="EditCardPopover_popover-body__aqKms">
                <div
                  className="CardHeader_edit-popover-content__PiA4D"
                  data-function="selector">
                  <div className="Popover_scrollable__53oYT">
                    <div className="Popover_title-container__Pj7Mq">
                      <div className="Popover_title-content__J6JFU Popover_popover-content-base__WAqCO">
                        <span className="Popover_title-text__PKd8E">
                          Add company logo{" "}
                        </span>
                        <button
                          className="Popover_title-close__qfXja"
                          id="cancel-btn">
                          <svg
                            aria-hidden="true"
                            className="svg-inline--fa fa-xmark fa-lg "
                            data-icon="xmark"
                            data-prefix="fal"
                            focusable="false"
                            role="img"
                            viewBox="0 0 384 512"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.6 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"
                              fill="currentColor"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="Popover_popover-content__PXmKI Popover_popover-content-base__WAqCO">
                      <div className="LinkStatusContainer_card-edit-input-container__rZmpe">
                        <div
                          style={{
                            height: "132px",
                          }}>
                          <div className="ImageSelector_image-selector__R2HjF">
                            <div
                              className="ImageSelector_drop-zone__ddEuM"
                              data-dragging="false"
                              data-invalid-files="false"
                              id="profileDropZone"
                              role="presentation"
                              tabIndex="0">
                              <input
                                accept="image/jpeg,.jpeg,image/jpg,.jpg,image/png,.png"
                                id="profileUpload"
                                style={{
                                  border: "0px",
                                  clip: "rect(0px, 0px, 0px, 0px)",
                                  clipPath: "inset(50%)",
                                  height: "1px",
                                  margin: "0px -1px -1px 0px",
                                  overflow: "hidden",
                                  padding: "0px",
                                  position: "absolute",
                                  whiteSpace: "nowrap",
                                  width: "1px",
                                }}
                                tabIndex="-1"
                                type="file"
                              />
                              <div
                                className="ImageSelector_drop-zone-icon__htH5e"
                                style={{
                                  opacity: "1",
                                }}>
                                <svg height="0" width="0">
                                  <radialGradient
                                    cx="15%"
                                    cy="30%"
                                    id="dropzone-gradient"
                                    r="150%">
                                    <stop offset="0" stopColor="#97c8ed" />
                                    <stop offset="0.6" stopColor="#1f87ff" />
                                  </radialGradient>
                                </svg>
                              </div>
                              <p
                                className="ImageSelector_drop-zone-text__89sVL"
                                style={{
                                  opacity: "1",
                                }}>
                                Drop your image here, or
                                <span className="ImageSelector_browse-text__TKA9a">
                                  browse
                                </span>
                              </p>
                              <p
                                className="ImageSelector_drop-zone-subtext__leU2g"
                                style={{
                                  opacity: "1",
                                }}>
                                Supports JPG, JPEG, and PNG
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Popover_popover__XcLdh" id="coverPopup">
          <div data-reach-popover-content="true">
            <div className="EditCardPopover_edit-card-popover__OH5DY">
              <div className="EditCardPopover_popover-body__aqKms">
                <div
                  className="CardHeader_edit-popover-content__PiA4D"
                  data-function="selector">
                  <div className="Popover_scrollable__53oYT">
                    <div className="Popover_title-container__Pj7Mq">
                      <div className="Popover_title-content__J6JFU Popover_popover-content-base__WAqCO">
                        <span className="Popover_title-text__PKd8E">
                          Add company logo{" "}
                        </span>
                        <button
                          className="Popover_title-close__qfXja"
                          id="cancel-btn">
                          <svg
                            aria-hidden="true"
                            className="svg-inline--fa fa-xmark fa-lg "
                            data-icon="xmark"
                            data-prefix="fal"
                            focusable="false"
                            role="img"
                            viewBox="0 0 384 512"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.6 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"
                              fill="currentColor"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="Popover_popover-content__PXmKI Popover_popover-content-base__WAqCO">
                      <div className="LinkStatusContainer_card-edit-input-container__rZmpe">
                        <div
                          style={{
                            height: "132px",
                          }}>
                          <div className="ImageSelector_image-selector__R2HjF">
                            <div
                              className="ImageSelector_drop-zone__ddEuM"
                              data-dragging="false"
                              data-invalid-files="false"
                              id="coverDropZone"
                              role="presentation"
                              tabIndex="0">
                              <input
                                accept="image/jpeg,.jpeg,image/jpg,.jpg,image/png,.png"
                                id="coverUpload"
                                style={{
                                  border: "0px",
                                  clip: "rect(0px, 0px, 0px, 0px)",
                                  clipPath: "inset(50%)",
                                  height: "1px",
                                  margin: "0px -1px -1px 0px",
                                  overflow: "hidden",
                                  padding: "0px",
                                  position: "absolute",
                                  whiteSpace: "nowrap",
                                  width: "1px",
                                }}
                                tabIndex="-1"
                                type="file"
                              />
                              <div
                                className="ImageSelector_drop-zone-icon__htH5e"
                                style={{
                                  opacity: "1",
                                }}>
                                <svg height="0" width="0">
                                  <radialGradient
                                    cx="15%"
                                    cy="30%"
                                    id="dropzone-gradient"
                                    r="150%">
                                    <stop offset="0" stopColor="#97c8ed" />
                                    <stop offset="0.6" stopColor="#1f87ff" />
                                  </radialGradient>
                                </svg>
                              </div>
                              <p
                                className="ImageSelector_drop-zone-text__89sVL"
                                style={{
                                  opacity: "1",
                                }}>
                                Drop your image here, or
                                <span className="ImageSelector_browse-text__TKA9a">
                                  browse
                                </span>
                              </p>
                              <p
                                className="ImageSelector_drop-zone-subtext__leU2g"
                                style={{
                                  opacity: "1",
                                }}>
                                Supports JPG, JPEG, and PNG
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {positionModalOpen && (
          <div
            className="position-modal-overlay"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <div
              className="position-modal"
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                width: "320px",
                textAlign: "center"
              }}
            >

              <h3>Select position</h3>

              <div style={{ marginTop: "16px", display: "grid", gap: "12px" }}>
                <button className="pos-btn" onClick={() => assignPosition("topLeft")}>
                  Top Left
                </button>
                <button className="pos-btn" onClick={() => assignPosition("topRight")}>
                  Top Right
                </button>
                <button className="pos-btn" onClick={() => assignPosition("bottomLeft")}>
                  Bottom Left
                </button>
                <button className="pos-btn" onClick={() => assignPosition("bottomRight")}>
                  Bottom Right
                </button>
              </div>

              <button
                style={{ marginTop: "20px", color: "red" }}
                onClick={() => setPositionModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

}
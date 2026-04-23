// src/features/cardCreate/cardCreate.js

let initialized = false;

export function initCardCreate(root = document) {
  if (initialized) return;
  initialized = true;

  // =======================
  // DOM ELEMENTS
  // =======================
  const popup = root.getElementById('popupField');
  if (!popup) return;

  let currentButton = null;

  const input = popup.querySelector('input');
  const saveBtn = popup.querySelector('button[type="submit"]');
  const cancelBtn = popup.querySelector('#cancel-btn');

  const xBtn = root.querySelector('#x-btn');
  const xBtnProfile = root.querySelector('#x-btn-profile');
  const xBtnCover = root.querySelector('#x-btn-cover');
  const inputName = root.getElementById('inputName');

  const cardList = root.querySelector('.Card_card-items__X_o8P');
  const buttons = root.querySelectorAll('.FieldButton_field-button__HMdrH');
  const colorButtons = root.querySelectorAll('.ColorSelector_color-btn__UO46H');

  const profilePopup = root.getElementById('profilePopup');
  const companyPopup = root.getElementById('companyPopup');
  const coverPopup = root.getElementById('coverPopup');

  const buttonsProfile = root.getElementById('buttonsProfile');
  const buttonsCompany = root.getElementById('buttonsCompany');
  const buttonsCover = root.getElementById('buttonsCover');

  const profileDropZone = root.getElementById('profileDropZone');
  const companyDropZone = root.getElementById('companyDropZone');
  const coverDropZone = root.getElementById('coverDropZone');

  const profileUpload = root.getElementById('profileUpload');
  const companyUpload = root.getElementById('companyUpload');
  const coverUpload = root.getElementById('coverUpload');

  const profileCircle = root.getElementById('profileCircle');
  const companyCircle = root.getElementById('companyCircle');
  const coverCircle = root.getElementById('coverCircle');

  const profileUploadPreview = root.getElementById('profileUploadPreview');
  const companyUploadPreview = root.getElementById('companyUploadPreview');
  const coverUploadPreview = root.getElementById('coverUploadPreview');

  const tabButtons = root.querySelectorAll('.tab-btn');
  const card = root.querySelector('.Card_card-measurer__87Mvw');

  coverCircle.style.visibility = "hidden";
  companyCircle.style.visibility = "hidden";
  profileCircle.style.visibility = "hidden";

  // =======================
  // HELPERS
  // =======================
  function hideAllPopups() {
    if (profilePopup) profilePopup.style.visibility = 'hidden';
    if (companyPopup) companyPopup.style.visibility = 'hidden';
    if (coverPopup) coverPopup.style.visibility = 'hidden';
  }

  function positionPopup(button, popupEl) {
    const rect = button.getBoundingClientRect();
    popupEl.style.top = (window.scrollY + rect.top + popupEl.offsetHeight - 200) + 'px';
    popupEl.style.left = (window.scrollX + rect.left) + 'px';
  }

  function previewImage(inputEl, preview, circle) {
    const f = inputEl.files[0];
    if (!f) return;

    const reader = new FileReader();
    reader.onload = e => {
      preview.style.backgroundImage = `url(${e.target.result})`;
      preview.style.backgroundRepeat = 'no-repeat';
      preview.style.backgroundPosition = 'center';
      circle.src = e.target.result;
    };
    reader.readAsDataURL(f);
  }

  function setCompactView() {
    card.querySelectorAll('.Field_card-item-icon-circle__HH1IG, .remove-field-btn')
      .forEach(el => el.style.display = 'none');

    card.querySelectorAll('li').forEach((li, i) => li.style.display = i < 4 ? '' : 'none');
  }

  function setFullView() {
    card.querySelectorAll('.Field_card-item-icon-circle__HH1IG, .remove-field-btn')
      .forEach(el => el.style.display = '');

    card.querySelectorAll('li').forEach(li => li.style.display = '');
  }

  // =======================
  // EVENT HANDLERS
  // =======================
  function handleFieldClick(e) {
    e.stopPropagation();
    currentButton = e.currentTarget;

    const rect = currentButton.getBoundingClientRect();
    popup.style.top = (window.scrollY + rect.top - popup.offsetHeight - 8) + 'px';
    popup.style.left = (window.scrollX + rect.left) + 'px';
    popup.style.visibility = 'visible';
    hideAllPopups();

    const label = currentButton.querySelector('.FieldButton_field-button-label__usbta')?.innerText || '';
    inputName.innerText = label;

    input.dataset.icon = currentButton.querySelector('.FieldButton_field-button-icon-container__R17_O')?.innerHTML || '';
    input.dataset.apiKey = currentButton.getAttribute('data-api-key') || '';
    input.value = '';
  }

  function handleColorClick(e) {
    const color = e.currentTarget.dataset.color;

    // Tüm .Field_card-item-icon-circle__HH1IG elementlerini seç
    const circles = root.querySelectorAll('.Field_card-item-icon-circle__HH1IG');

    circles.forEach(circle => {
      circle.style.backgroundColor = color;
    });
  }


  function handleTabClick(e) {
    e.stopPropagation();
    tabButtons.forEach(b => b.classList.remove('active'));
    const btn = e.currentTarget;
    btn.classList.add('active');
    btn.dataset.tab === 'compact' ? setCompactView() : setFullView();
  }

  function handleProfileClick(e) {
    e.stopPropagation();
    hideAllPopups();
    positionPopup(buttonsProfile, profilePopup);
    profilePopup.style.visibility = 'visible';
    popup.style.visibility = 'hidden';
  }

  function handleCompanyClick(e) {
    e.stopPropagation();
    hideAllPopups();
    positionPopup(buttonsCompany, companyPopup);
    companyPopup.style.visibility = 'visible';
    popup.style.visibility = 'hidden';
  }

  function handleCoverClick(e) {
    e.stopPropagation();
    hideAllPopups();
    positionPopup(buttonsCover, coverPopup);
    coverPopup.style.visibility = 'visible';
    popup.style.visibility = 'hidden';
  }

  function handleSaveField(e) {
    e.preventDefault();
    const value = input.value.trim();
    if (!value) return alert("Field can't be empty");

    const apiKey = input.dataset.apiKey;

    const validation = validateField(apiKey, value);
    if (!validation.valid) {
      return alert(validation.message);
    }
    // Eğer sabit alanlardan biriyse
    if (['name', 'department', 'jobTitle', 'companyName'].includes(apiKey)) {
      const fieldMap = {
        name: 'cardName',
        department: 'cardDepartment',
        jobTitle: 'cardJobTitle',
        companyName: 'cardCompany'
      };
      const elId = fieldMap[apiKey];
      const el = document.getElementById(elId);
      if (el) el.innerText = value; // sadece içini güncelle
      popup.style.visibility = 'hidden';
      return; // UL içine ekleme yapma
    }

    // Normal field ekleme
    const existingLi = [...cardList.querySelectorAll('li')].find(li =>
      li.querySelector('.category')?.dataset.apiKey === apiKey
    );

    if (existingLi) {
      const valueEl = existingLi.querySelector('.Field_field-data-value__p3KXA');
      if (valueEl) valueEl.innerText = value;
      popup.style.visibility = 'hidden';
      return;
    }

    const li = document.createElement('li');
    li.innerHTML = `
    <div class="Card_card-field__pWM1J">
      <div class="Card_card-item__o4aNw">
        <div class="Field_card-field__eA4QQ">
          <div class="Field_card-item-icon-circle__HH1IG">
            ${input.dataset.icon}
            <p class="category" data-api-key="${apiKey}" style="display:none"></p>
          </div>
          <div class="Field_field-data__5aXfY">
            <div class="Field_field-data-value__p3KXA">${value}</div>
            <button class="remove-field-btn">×</button>
          </div>
        </div>
      </div>
    </div>
  `;
    li.querySelector('.remove-field-btn').addEventListener('click', () => li.remove());
    cardList.appendChild(li);
    popup.style.visibility = 'hidden';
  }

  function validateField(apiKey, value) {
    value = value.trim();
    if (!value) return { valid: false, message: "Field can't be empty" };

    switch (apiKey) {
      case "name":
        // Sadece harf ve boşluk, rakam veya özel karakter yok
        if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/.test(value)) {
          return { valid: false, message: "Name can only contain letters" };
        }
        break;

      case "email":
        // Basit mail doğrulama
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return { valid: false, message: "Please enter a valid email" };
        }
        break;

      case "phone":
        if (!/^\d+$/.test(value)) {
          return { valid: false, message: "Phone can only contain numbers" };
        }
        break;

      case "twitter":
      case "instagram":
      case "companyUrl":
      case "youtube":
      case "linkedin":
      case "facebook":
      case "other":
        // Basit www doğrulama
        if (!/^www\./.test(value)) {
          return { valid: false, message: "Website must start with www." };
        }
        break;

      case "companyName":
      case "department":
      case "jobTitle":
        // Normal text, rakam olabilir ama çok kısa olamaz
        if (value.length < 2) {
          return { valid: false, message: "Value is too short" };
        }
        break;

      default:
        break; // Diğer field'lar için ek kontrol yok
    }

    return { valid: true };
  }

  // =======================
  // ATTACH LISTENERS
  // =======================
  buttons.forEach(btn => btn.addEventListener('click', handleFieldClick));
  colorButtons.forEach(btn => btn.addEventListener('click', handleColorClick));
  tabButtons.forEach(btn => btn.addEventListener('click', handleTabClick));

  if (buttonsProfile) buttonsProfile.addEventListener('click', handleProfileClick);
  if (buttonsCompany) buttonsCompany.addEventListener('click', handleCompanyClick);
  if (buttonsCover) buttonsCover.addEventListener('click', handleCoverClick);

  if (input) input.addEventListener('input', () => {
    if (input.value.trim().length > 0) {
      saveBtn.className = 'active';
      saveBtn.removeAttribute('disabled');
    }
  });

  if (saveBtn) saveBtn.addEventListener('click', handleSaveField);
  if (cancelBtn) cancelBtn.addEventListener('click', () => popup.style.visibility = 'hidden');
  if (xBtn) xBtn.addEventListener('click', hideAllPopups);
  if (xBtnProfile) xBtnProfile.addEventListener('click', hideAllPopups);
  if (xBtnCover) xBtnCover.addEventListener('click', hideAllPopups);

  // Drop zones
  if (profileDropZone) profileDropZone.addEventListener('click', e => { e.stopPropagation(); profileUpload.click(); });
  if (companyDropZone) companyDropZone.addEventListener('click', e => { e.stopPropagation(); companyUpload.click(); });
  if (coverDropZone) coverDropZone.addEventListener('click', e => { e.stopPropagation(); coverUpload.click(); });

  // Image uploads
  if (profileUpload) profileUpload.addEventListener('change', () => {
    previewImage(profileUpload, profileUploadPreview, profileCircle); hideAllPopups();
    profileCircle.style.visibility = "visible";
  });
  if (companyUpload) companyUpload.addEventListener('change', () => {
    previewImage(companyUpload, companyUploadPreview, companyCircle); hideAllPopups();
    companyCircle.style.visibility = "visible";
  });
  if (coverUpload) coverUpload.addEventListener('change', () => {
    previewImage(coverUpload, coverUploadPreview, coverCircle); hideAllPopups();
    coverCircle.style.visibility = "visible";
  });
}

// =======================
// DESTROY FUNCTION
// =======================
export function destroyCardCreate(root = document) {
  initialized = false;
  // Note: For simplicity, this version does not remove all listeners individually,
  // but you can store handlers in arrays if you want full cleanup on unmount.
}

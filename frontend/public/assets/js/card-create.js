/* =======================
   ORTAK DEĞİŞKENLER
======================= */
const popup = document.getElementById('popupField');
let currentButton = null;

const input = popup.querySelector('input');
const saveBtn = popup.querySelector('button[type="submit"]');
const cancelBtn = popup.querySelector('#cancel-btn');

const xBtn = document.querySelector('#x-btn');
const inputName = document.getElementById('inputName');

const cardList = document.querySelector('.Card_card-items__X_o8P');
const buttons = document.querySelectorAll('.FieldButton_field-button__HMdrH');
const colorButtons = document.querySelectorAll('.ColorSelector_color-btn__UO46H');

const profilePopup = document.getElementById('profilePopup');
const companyPopup = document.getElementById('companyPopup');
const coverPopup = document.getElementById('coverPopup');

const buttonsProfile = document.getElementById('buttonsProfile');
const buttonsCompany = document.getElementById('buttonsCompany');
const buttonsCover = document.getElementById('buttonsCover');

const profileDropZone = document.getElementById('profileDropZone');
const companyDropZone = document.getElementById('companyDropZone');
const coverDropZone = document.getElementById('coverDropZone');

const profileUpload = document.getElementById('profileUpload');
const companyUpload = document.getElementById('companyUpload');
const coverUpload = document.getElementById('coverUpload');

const profileCircle = document.getElementById('profileCircle');
const companyCircle = document.getElementById('companyCircle');
const coverCircle = document.getElementById('coverCircle');

const profileUploadPreview = document.getElementById('profileUploadPreview');
const companyUploadPreview = document.getElementById('companyUploadPreview');
const coverUploadPreview = document.getElementById('coverUploadPreview');

const tabButtons = document.querySelectorAll('.tab-btn');
const card = document.querySelector('.Card_card-measurer__87Mvw');

/* =======================
   YARDIMCI FONKSİYONLAR
======================= */
function hideAllPopups() {
  profilePopup.style.visibility = 'hidden';
  companyPopup.style.visibility = 'hidden';
  coverPopup.style.visibility = 'hidden';
}

function positionPopup(button, popupEl) {
  const rect = button.getBoundingClientRect();
  popupEl.style.top =
    (window.scrollY + rect.top + popupEl.offsetHeight - 200) + 'px';
  popupEl.style.left =
    (window.scrollX + rect.left) + 'px';
}

/* =======================
   FIELD BUTTON POPUP
======================= */
buttons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    currentButton = btn;
    const rect = btn.getBoundingClientRect();

    popup.style.top =
      (window.scrollY + rect.top - popup.offsetHeight - 8) + 'px';
    popup.style.left =
      (window.scrollX + rect.left) + 'px';

    popup.style.visibility = 'visible';
    hideAllPopups();

    const label = btn.querySelector(
      '.FieldButton_field-button-label__usbta'
    ).innerText;

    inputName.innerText = label;

    input.dataset.icon =
      btn.querySelector(
        '.FieldButton_field-button-icon-container__R17_O'
      ).innerHTML;

    input.dataset.apiKey = btn.getAttribute('data-api-key');
    input.value = '';
  });
});

input.addEventListener('input', () => {
  if (input.value.trim().length > 0) {
    saveBtn.className = 'active';
    saveBtn.removeAttribute('disabled');
  }
});

cancelBtn.addEventListener('click', () => {
  popup.style.visibility = 'hidden';
});

xBtn.addEventListener('click', () => {
  hideAllPopups();
});

/* =======================
   SAVE FIELD
======================= */
saveBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return alert("Field can't be empty");

  const apiKey = input.dataset.apiKey;

  const exists = [...cardList.querySelectorAll('li')].some(li =>
    li.querySelector('.category')?.dataset.apiKey === apiKey &&
    li.querySelector('.Field_field-data-value__p3KXA')?.innerText === value
  );

  if (exists) {
    alert("This field already exists.");
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

  li.querySelector('.remove-field-btn')
    .addEventListener('click', () => li.remove());

  cardList.appendChild(li);
  popup.style.visibility = 'hidden';
});

/* =======================
   COLOR BUTTONS
======================= */
colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const color = btn.dataset.color;
    const bg = document.getElementById('bg-card-bg');
    if (bg) bg.style.backgroundColor = color;
  });
});

/* =======================
   PROFILE / COMPANY / COVER BUTTONS
======================= */
buttonsProfile.addEventListener('click', (e) => {
  e.stopPropagation();
  hideAllPopups();
  positionPopup(buttonsProfile, profilePopup);
  profilePopup.style.visibility = 'visible';
  popup.style.visibility = 'hidden';
});

buttonsCompany.addEventListener('click', (e) => {
  e.stopPropagation();
  hideAllPopups();
  positionPopup(buttonsCompany, companyPopup);
  companyPopup.style.visibility = 'visible';
  popup.style.visibility = 'hidden';
});

buttonsCover.addEventListener('click', (e) => {
  e.stopPropagation();
  hideAllPopups();
  positionPopup(buttonsCover, coverPopup);
  coverPopup.style.visibility = 'visible';
  popup.style.visibility = 'hidden';
});

/* =======================
   DROP ZONE (POPUP KAPANMAZ)
======================= */
profileDropZone.addEventListener('click', e => {
  e.stopPropagation();
  profileUpload.click();
});

companyDropZone.addEventListener('click', e => {
  e.stopPropagation();
  companyUpload.click();
});

coverDropZone.addEventListener('click', e => {
  e.stopPropagation();
  coverUpload.click();
});

/* =======================
   IMAGE UPLOAD PREVIEW
======================= */
function previewImage(input, preview, circle) {
  const f = input.files[0];
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

profileUpload.addEventListener('change', () =>
  previewImage(profileUpload, profileUploadPreview, profileCircle)
);

companyUpload.addEventListener('change', () =>
  previewImage(companyUpload, companyUploadPreview, companyCircle)
);

coverUpload.addEventListener('change', () =>
  previewImage(coverUpload, coverUploadPreview, coverCircle)
);

/* =======================
   TAB VIEW
======================= */
function setCompactView() {
  card.querySelectorAll(
    '.Field_card-item-icon-circle__HH1IG, .remove-field-btn'
  ).forEach(el => el.style.display = 'none');

  card.querySelectorAll('li').forEach((li, i) =>
    li.style.display = i < 4 ? '' : 'none'
  );
}

function setFullView() {
  card.querySelectorAll(
    '.Field_card-item-icon-circle__HH1IG, .remove-field-btn'
  ).forEach(el => el.style.display = '');

  card.querySelectorAll('li').forEach(li => li.style.display = '');
}

tabButtons.forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    btn.dataset.tab === 'compact' ? setCompactView() : setFullView();
  });
});

/* =======================
   BODY CLICK → POPUP KAPAT
======================= */

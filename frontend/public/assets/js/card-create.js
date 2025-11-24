    const popup = document.getElementById('popupField');
    let currentButton = null;
    const input = popup.querySelector('input');
    const inputName = document.getElementById('inputName');
    const saveBtn = popup.querySelector('button[type="submit"]');
    const cancelBtn = popup.querySelector('#cancel-btn');
    const cardList = document.querySelector('.Card_card-items__X_o8P');

    // Tüm field butonlarıinputName
    const buttons = document.querySelectorAll('.FieldButton_field-button__HMdrH');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentButton = btn;

            const rect = btn.getBoundingClientRect();
            popup.style.top = (window.scrollY + rect.top - popup.offsetHeight - 8) + 'px';
            popup.style.left = (window.scrollX + rect.left) + 'px';
            popup.style.visibility = 'visible';

            const label = btn.querySelector('.FieldButton_field-button-label__usbta').innerText;
            inputName.innerText = label;
            // Input placeholder yerine ikon HTML'i alıyoruz
            const iconHTML = btn.querySelector('.FieldButton_field-button-icon-container__R17_O').innerHTML;
            input.dataset.icon = iconHTML;
            input.dataset.apiKey = btn.getAttribute('data-api-key');

            input.value = '';

            saveBtn.disabled = false;
            saveBtn.setAttribute('data-disabled', 'false');
            saveBtn.setAttribute('aria-disabled', 'false');
        });
    });

    cancelBtn.addEventListener('click', (e) => {
        popup.style.visibility = 'hidden';
    });

    saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const value = input.value.trim();
        if (!value) return alert("Field can't be empty");

        // Mevcut kartlarda aynı field var mı kontrol et
        const apiKey = input.dataset.apiKey;

        // Mevcut li'lerde aynı apiKey ve value var mı kontrol et
        const exists = Array.from(cardList.querySelectorAll('li')).some(li => {
            const itemApiKey = li.querySelector('.category')?.dataset.apiKey;
            const itemValue = li.querySelector('.Field_field-data-value__p3KXA')?.innerText;
            return itemApiKey === apiKey && itemValue === value;
        });

        if (exists) {
            alert("This field already exists in the card.");
            popup.style.visibility = 'hidden';
            return;
        }

        // Yeni li oluştur
        const li = document.createElement('li');
        li.innerHTML = `
    <div class="Card_card-field__pWM1J" tabindex="0" role="button">
      <div class="Card_card-field-btn__r_t01">
        <div class="Card_card-item__o4aNw">
          <div class="Field_card-field__eA4QQ">
            <div class="Field_card-item-icon-circle__HH1IG">
              ${input.dataset.icon}  
              <p class="category" style="display:none;" data-api-key="${apiKey}">${inputName.innerText}</p>
            </div>
            <div class="Field_field-data__5aXfY">
              <div class="Field_field-data-value__p3KXA">${value}</div>
              <button class="remove-field-btn" style="
                margin-left: 10px;
                background: none;
                border: none;
                color: red;
                font-weight: bold;
                cursor: pointer;
              ">×</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

        // Çarpı butonuna tıklandığında li'yi kaldır
        li.querySelector('.remove-field-btn').addEventListener('click', () => {
            li.remove();
        });

        cardList.appendChild(li);
        popup.style.visibility = 'hidden';
    });

    const colorButtons = document.querySelectorAll('.ColorSelector_color-btn__UO46H');

    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;

            const selamElement = document.getElementById('bg-card-bg');

            if (selamElement && color) {
                selamElement.style.backgroundColor = color;
            }
        });
    });




    const profilePopup = document.getElementById('profilePopup');
    const buttonsProfile = document.getElementById('buttonsProfile');

    buttonsProfile.addEventListener('click', (e) => {
        currentButton = buttonsProfile;

        // Butonun pozisyonuna göre popup'ı ayarla
        const rect = buttonsProfile.getBoundingClientRect();
        profilePopup.style.top = (window.scrollY + rect.top + profilePopup.offsetHeight - 200) + 'px';
        profilePopup.style.left = (window.scrollX + rect.left) + 'px';
        profilePopup.style.visibility = 'visible';
    });

    const profileDropZone = document.getElementById('profileDropZone');
    const fileInputProfile = document.getElementById('profileUpload');

    profileDropZone.addEventListener('click', () => {
        fileInputProfile.click(); // kullanıcı dropzone'a tıklayınca file input açılır

        profilePopup.style.visibility = 'hidden';
        companyPopup.style.visibility = 'hidden';
        coverPopup.style.visibility = 'hidden';
    });



    const companyPopup = document.getElementById('companyPopup');
    const buttonsCompany = document.getElementById('buttonsCompany');

    buttonsCompany.addEventListener('click', (e) => {
        currentButton = buttonsCompany;

        // Butonun pozisyonuna göre popup'ı ayarla
        const rect = buttonsCompany.getBoundingClientRect();
        companyPopup.style.top = (window.scrollY + rect.top + companyPopup.offsetHeight - 200) + 'px';
        companyPopup.style.left = (window.scrollX + rect.left) + 'px';
        companyPopup.style.visibility = 'visible';
    });

    const fileInputCompany = document.getElementById('companyUpload');
    const companyDropZone = document.getElementById('companyDropZone');

    companyDropZone.addEventListener('click', () => {
        fileInputCompany.click(); // kullanıcı dropzone'a tıklayınca file input açılır

        profilePopup.style.visibility = 'hidden';
        companyPopup.style.visibility = 'hidden';
        coverPopup.style.visibility = 'hidden';
    });



    const coverPopup = document.getElementById('coverPopup');
    const buttonsCover = document.getElementById('buttonsCover');

    buttonsCover.addEventListener('click', (e) => {
        currentButton = buttonsCover;

        // Butonun pozisyonuna göre popup'ı ayarla
        const rect = buttonsCover.getBoundingClientRect();
        coverPopup.style.top = (window.scrollY + rect.top + coverPopup.offsetHeight - 200) + 'px';
        coverPopup.style.left = (window.scrollX + rect.left) + 'px';
        coverPopup.style.visibility = 'visible';
    });

    const fileInputCover = document.getElementById('coverUpload');
    const coverDropZone = document.getElementById('coverDropZone');

    coverDropZone.addEventListener('click', () => {
        fileInputCover.click(); // kullanıcı dropzone'a tıklayınca file input açılır

        profilePopup.style.visibility = 'hidden';
        companyPopup.style.visibility = 'hidden';
        coverPopup.style.visibility = 'hidden';
    });



    const companyCircle = document.getElementById('companyCircle');
    const companyUpload = document.getElementById('companyUpload');
    const companyUploadPreview = document.getElementById('companyUploadPreview');

    companyUpload.addEventListener('change', () => {
        const f = companyUpload.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'logo-preview';
            companyUploadPreview.style.backgroundImage = `url(${e.target.result})`;
            companyUploadPreview.style.backgroundRepeat = 'no-repeat';
            companyUploadPreview.style.backgroundPosition = 'center';

            companyCircle.src = e.target.result;
        }
        reader.readAsDataURL(f);
    });



    const profileCircle = document.getElementById('profileCircle');
    const profileUpload = document.getElementById('profileUpload');
    const profileUploadPreview = document.getElementById('profileUploadPreview');

    profileUpload.addEventListener('change', () => {
        const f = profileUpload.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'logo-preview';
            profileUploadPreview.style.backgroundImage = `url(${e.target.result})`;
            profileUploadPreview.style.backgroundRepeat = 'no-repeat';
            profileUploadPreview.style.backgroundPosition = 'center';

            profileCircle.src = e.target.result;
        }
        reader.readAsDataURL(f);
    });



    const coverCircle = document.getElementById('coverCircle');
    const coverUpload = document.getElementById('coverUpload');
    const coverUploadPreview = document.getElementById('coverUploadPreview');

    coverUpload.addEventListener('change', () => {
        const f = coverUpload.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'logo-preview';
            coverUploadPreview.style.backgroundImage = `url(${e.target.result})`;
            coverUploadPreview.style.backgroundRepeat = 'no-repeat';
            coverUploadPreview.style.backgroundPosition = 'center';

            coverCircle.src = e.target.result;
        }
        reader.readAsDataURL(f);
    });



    const tabButtons = document.querySelectorAll('.tab-btn');
    const card = document.querySelector('.Card_card-measurer__87Mvw');

    function setCompactView() {
        // SVG ve X butonlarını gizle
        card.querySelectorAll('ul.Card_card-items__X_o8P li .Field_card-item-icon-circle__HH1IG, ul.Card_card-items__X_o8P li .remove-field-btn')
            .forEach(el => el.style.display = 'none');


        card.querySelectorAll('ul.Card_card-items__X_o8P li .Card_card-item__o4aNw')
            .forEach(el => el.style.minHeight = '5px');

        // Tüm li'leri al
        const lis = card.querySelectorAll('ul.Card_card-items__X_o8P li');

        lis.forEach((li, index) => {
            if (index < 4) {
                li.style.display = '';     // ilk 5 görünür
            } else {
                li.style.display = 'none'; // diğerleri gizli
            }
        });
    }

    function setFullView() {
        // SVG + X butonları geri gelsin
        card.querySelectorAll('ul.Card_card-items__X_o8P li .Field_card-item-icon-circle__HH1IG, ul.Card_card-items__X_o8P li .remove-field-btn')
            .forEach(el => el.style.display = '');

        // Tüm li'ler geri gelsin
        card.querySelectorAll('ul.Card_card-items__X_o8P li')
            .forEach(li => li.style.display = '');
    }

    // Tab butonları
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();

            // active class yönetimi
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            if (button.dataset.tab === 'compact') {
                setCompactView();
            } else {
                setFullView();
            }
        });
    });

    // Body click → full view’e dön
    document.body.addEventListener('click', () => {
        // Tab görsel olarak da full olsun
        tabButtons.forEach(btn =>
            btn.classList.toggle('active', btn.dataset.tab === 'full')
        );

        setFullView();
    });
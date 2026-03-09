import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/* ═══════════════════════════════════════════════════════ */
/* i18n — English / Arabic Translation System             */
/* ═══════════════════════════════════════════════════════ */
const TRANSLATIONS = {
  en: {
    // Nav
    home: "Home", enterprise: "Enterprise", nfcCards: "NFC Cards",
    login: "Login", logout: "Logout", dashboard: "Dashboard",
    // Page
    heading: "Built for enterprise. Secure from day one.",
    subheading: "With Single Sign-On (SSO) integration securely manage user access and authentication across your organization. GDPR and CCPA compliant, SOC 2 Type II Certified.",
    // Cards
    cardWhite: "White Digital Business Card", cardBlack: "Black Digital Business Card",
    cardGolden: "Golden Digital Business Card", cardSilver: "Silver Digital Business Card",
    cardMetalGold: "Metal Golden Digital Business Card", cardMetalSilver: "Metal Silver Digital Business Card",
    cardMetalBlack: "Metal Black Digital Business Card", cardRoseGold: "Metal Rose Gold Digital Business Card",
    card24k: "24K Gold Digital Business Card", cardBamboo: "Bambu Digital Business Card",
    cardWood: "Wooden Digital Business Card", cardTransparent: "Transparent PVC Digital Business Card",
    // Footer
    footProduct: "Product", footEnterprise: "Enterprise", footNfcCards: "NFC Business Cards",
    footOrderCard: "Order Card", footAccount: "Account", footCreateCard: "Create Card",
    footLogin: "Log in", footSignup: "Sign up",
    footCopyright: "© 2026 DynamicNFC Technologies Pty Ltd. All Rights Reserved.",
  },
  ar: {
    home: "الرئيسية", enterprise: "المؤسسات", nfcCards: "بطاقات NFC",
    login: "تسجيل الدخول", logout: "تسجيل الخروج", dashboard: "لوحة التحكم",
    heading: "مصمم للمؤسسات. آمن منذ اليوم الأول.",
    subheading: "من خلال تكامل تسجيل الدخول الموحد (SSO)، أدِر وصول المستخدمين والمصادقة عبر مؤسستك بأمان. متوافق مع GDPR وCCPA، حاصل على شهادة SOC 2 Type II.",
    cardWhite: "بطاقة أعمال رقمية بيضاء", cardBlack: "بطاقة أعمال رقمية سوداء",
    cardGolden: "بطاقة أعمال رقمية ذهبية", cardSilver: "بطاقة أعمال رقمية فضية",
    cardMetalGold: "بطاقة أعمال رقمية معدنية ذهبية", cardMetalSilver: "بطاقة أعمال رقمية معدنية فضية",
    cardMetalBlack: "بطاقة أعمال رقمية معدنية سوداء", cardRoseGold: "بطاقة أعمال رقمية ذهبي وردي",
    card24k: "بطاقة أعمال رقمية ذهب عيار ٢٤", cardBamboo: "بطاقة أعمال رقمية من الخيزران",
    cardWood: "بطاقة أعمال رقمية من خشب الجوز", cardTransparent: "بطاقة أعمال رقمية شفافة",
    footProduct: "المنتج", footEnterprise: "المؤسسات", footNfcCards: "بطاقات NFC للأعمال",
    footOrderCard: "اطلب بطاقتك", footAccount: "الحساب", footCreateCard: "إنشاء بطاقة",
    footLogin: "تسجيل الدخول", footSignup: "إنشاء حساب",
    footCopyright: "© 2026 DynamicNFC Technologies Pty Ltd. جميع الحقوق محفوظة.",
  },
};

const CARD_TITLE_KEYS = {
  white: "cardWhite", black: "cardBlack", golden: "cardGolden", silver: "cardSilver",
  "metal-golden": "cardMetalGold", "metal-silver": "cardMetalSilver",
  "metal-black": "cardMetalBlack", "metal-rosegold": "cardRoseGold",
  "24k-gold": "card24k", bambu: "cardBamboo", wooden: "cardWood", transparent: "cardTransparent",
};

function detectLang() {
  const n = navigator.language || navigator.userLanguage || "en";
  return n.startsWith("ar") ? "ar" : "en";
}

/* ═══════════════════════════════════════════════════════ */
/* Card catalogue — matches CreatePhysicalCard CARD_TYPES */
/* ═══════════════════════════════════════════════════════ */
const cards = [
  { id: "white", titleKey: "cardWhite", price: "39,90 CAD", front: "assets/images/beyaz-on.png", back: "assets/images/beyaz-arka.png", tertemiz: "assets/images/beyaz-tertemiz.png", className: "flip-card--whie flip-card--color-black" },
  { id: "black", titleKey: "cardBlack", price: "39,90 CAD", front: "assets/images/gri-on.png", back: "assets/images/gri-arka.png", tertemiz: "assets/images/gri-tertemiz.png", className: "flip-card--black flip-card--color-white" },
  { id: "golden", titleKey: "cardGolden", price: "69,90 CAD", front: "assets/images/sari-on.png", back: "assets/images/sari-arka.png", tertemiz: "assets/images/sari-tertemiz.png", className: "flip-card--gold flip-card--color-black" },
  { id: "silver", titleKey: "cardSilver", price: "49,90 CAD", front: "assets/images/silver-on.png", back: "assets/images/silver-arka.png", tertemiz: "assets/images/silver-tertemiz.png", className: "flip-card--silver flip-card--color-black" },
  { id: "metal-golden", titleKey: "cardMetalGold", price: "89,90 CAD", front: "assets/images/metal-gold-on.png", back: "assets/images/metal-gold-arka.png", tertemiz: "assets/images/metal-gold-tertemiz.png", className: "flip-card--metal-gold flip-card--color-black" },
  { id: "metal-silver", titleKey: "cardMetalSilver", price: "89,90 CAD", front: "assets/images/metal-silver-on.png", back: "assets/images/metal-silver-arka.png", tertemiz: "assets/images/metal-silver-tertemiz.png", className: "flip-card--metal-silver flip-card--color-black" },
  { id: "metal-black", titleKey: "cardMetalBlack", price: "89,90 CAD", front: "assets/images/metal-black-on.png", back: "assets/images/metal-black-arka.png", tertemiz: "assets/images/metal-black-tertemiz.png", className: "flip-card--metal-black flip-card--color-white" },
  { id: "metal-rosegold", titleKey: "cardRoseGold", price: "99,90 CAD", front: "assets/images/rosegold-on.png", back: "assets/images/rosegold-arka.png", tertemiz: "assets/images/rosegold-tertemiz.png", className: "flip-card--rosegold flip-card--color-black" },
  { id: "24k-gold", titleKey: "card24k", price: "149,90 CAD", front: "assets/images/24k-on.png", back: "assets/images/24k-arka.png", tertemiz: "assets/images/24k-tertemiz.png", className: "flip-card--24k flip-card--color-black" },
  { id: "bambu", titleKey: "cardBamboo", price: "59,90 CAD", front: "assets/images/bambu-on.png", back: "assets/images/bambu-arka.png", tertemiz: "assets/images/bambu-tertemiz.png", className: "flip-card--bamboo flip-card--color-black" },
  { id: "wooden", titleKey: "cardWood", price: "59,90 CAD", front: "assets/images/wood-on.png", back: "assets/images/wood-arka.png", tertemiz: "assets/images/wood-tertemiz.png", className: "flip-card--wood flip-card--color-white" },
  { id: "transparent", titleKey: "cardTransparent", price: "49,90 CAD", front: "assets/images/transparent-on.png", back: "assets/images/transparent-arka.png", tertemiz: "assets/images/transparent-tertemiz.png", className: "flip-card--transparent flip-card--color-black" },
];

/* ═══════════════════════════════════════════════════════ */
/* Component                                               */
/* ═══════════════════════════════════════════════════════ */
export default function OrderCard() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/"); };

  // ── i18n ──
  const [lang, setLang] = useState(detectLang);
  const isRTL = lang === "ar";
  const t = useCallback((key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key, [lang]);

  return (
    <>
      <div className="navbar_ab">
        <div className="css w-embed"></div>
        <div role="banner" className="navbar black w-nav">
          <div className="nav-container nav-container-mobile">
            <div className="brand-wrapper">
              <Link to="/" aria-current="page" className="brand w-nav-brand w--current"></Link>
            </div>
            <nav role="navigation" className="nav-menu w-nav-menu">
              <Link to="/" className="nav-dropdown desktop-only w-dropdown">
                <div className="nav-link dropdown w-dropdown-toggle">
                  <div className="dropdown-text"><p>{t("home")}</p></div>
                </div>
              </Link>
              <Link to="/enterprise" className="nav-dropdown desktop-only w-dropdown">
                <div className="nav-link dropdown w-dropdown-toggle">
                  <div className="dropdown-text"><p>{t("enterprise")}</p></div>
                </div>
              </Link>
              <Link to="/nfc-cards" className="nav-dropdown desktop-only w-dropdown">
                <div className="nav-link dropdown w-dropdown-toggle">
                  <div className="dropdown-text"><p>{t("nfcCards")}</p></div>
                </div>
              </Link>
            </nav>
            <div className="navbar-auth-buttons">
              {/* Language Switcher — marketplace format */}
              <div className="lang-switcher" style={{ display: "flex", gap: "0.25rem", marginRight: "0.5rem" }}>
                <button
                  className={`lang-btn-order${lang === "en" ? " active" : ""}`}
                  onClick={() => setLang("en")}
                >EN</button>
                <button
                  className={`lang-btn-order${lang === "ar" ? " active" : ""}`}
                  onClick={() => setLang("ar")}
                >ع</button>
              </div>
              {isAuthenticated && isAuthenticated() && (
                <Link to="/dashboard" className="button light white analytics w-button">
                  {t("dashboard")}
                </Link>
              )}
              {isAuthenticated && isAuthenticated() ? (
                <button onClick={handleLogout} className="button light white analytics w-button">
                  {t("logout")}
                </button>
              ) : (
                <Link to="/login" className="button light white analytics w-button">
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="page-wrapper grey" dir={isRTL ? "rtl" : "ltr"}>
        <div className="main-wrapper">
          <div className="section-built">
            <div className="section_business u-hide-twocol">
              <div className="padding-global padding-section-large mobile-top-none">
                <div className="container-large">
                  <div className="business_comp less">
                    <div className="business_first-row">
                      <div className="business_heading-wrap">
                        <div className="home-team_text-comp text-align-center cc-max-832">
                          <h5 className="heading-style-h5">{t("heading")}</h5>
                          <div className="text-size-medium">{t("subheading")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <main className="product-detail-page-x">
            <div className="detail-top__right page-top">
              <div className="circle">
                <span className="circle__item circle__item--sm" />
                <span className="circle__item circle__item--md" />
                <span className="circle__item circle__item--lg" />
                <span className="circle__item circle__item--xl" />
              </div>
            </div>

            {/* ═══ PRODUCTS — 12 Card Types ═══ */}
            <section className="detail-products">
              <div className="container">
                <div className="detail-products__wrapper">
                  {cards.map((card) => (
                    <div key={card.id} className="card-trowas__item">
                      <div className="card-trowas__img">
                        <Link
                          to="/create-physical-card"
                          state={{ card: { id: card.id } }}
                          className={`flip-card ${card.className}`}
                        >
                          <div className="flip-card__inner flip-card--image" style={{ height: 271 }}>
                            <div className="flip-card__front">
                              <img className="flip-card__bg" src={card.front} alt={t(card.titleKey)} />
                            </div>
                            <div className="flip-card__back">
                              <img className="flip-card__bg" src={card.back} alt={t(card.titleKey)} />
                            </div>
                          </div>
                        </Link>
                      </div>
                      <div className="card-trowas__content">
                        <h2>{t(card.titleKey)}</h2>
                        <h5>{card.price}</h5>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="div-block-139">
              <footer className="footer w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">
                <div className="w-embed"></div>
                <div className="container">
                  <div className="wrapper">
                    <div className="footer-row">
                      <div className="footer-col vertical">
                        <a href="#" className="brand footer w-inline-block" />
                        <div className="footer-app-btn-wrapper">
                          <a href="https://dl.DynamicNFC.me/?v=web01" className="appstore-link w-inline-block">
                            <img src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899af03d8217ac_app-store.webp" loading="lazy" alt="app store" className="app-store-img" />
                          </a>
                          <a href="https://dl.DynamicNFC.me/?v=android01" className="appstore-link google w-inline-block">
                            <img src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899acbea8217ab_google-play-store.webp" loading="lazy" sizes="100vw" srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899acbea8217ab_google-play-store-p-500.webp 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899acbea8217ab_google-play-store.webp 564w" alt="google play store" className="app-store-img" />
                          </a>
                          <a href="https://app.vanta.com/DynamicNFC/trust/wywxgtvmdkpf4v8wmskgd1" className="appstore-link google w-inline-block">
                            <img src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6434fc2bac4abe874b62c1d4_Frame 2.webp" loading="lazy" alt="" className="app-store-img" />
                          </a>
                        </div>
                      </div>
                      <div className="footer-col horizontal" style={{ justifyContent: "flex-end" }}>
                        <div className="footer-nav" style={{ marginRight: "40px" }}>
                          <div className="footer-title w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">{t("footProduct")}</div>
                          <Link to="/enterprise" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">{t("footEnterprise")}</Link>
                          <Link to="/nfc-cards" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">{t("footNfcCards")}</Link>
                          <Link to="/order-card" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">{t("footOrderCard")}</Link>
                        </div>
                        <div className="footer-nav">
                          <div className="footer-title w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"><strong>{t("footAccount")}</strong></div>
                          <Link to="/create-card" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">{t("footCreateCard")}</Link>
                          <a href="#" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">{t("footLogin")}</a>
                          <a href="#" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">{t("footSignup")}</a>
                        </div>
                      </div>
                    </div>
                    <div className="footer-row last">
                      <div className="footer-col horizontal legal">
                        <div className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 text">{t("footCopyright")}</div>
                      </div>
                      <div className="footer-col">
                        <div className="social-buttons-wrapper">
                          <a rel="noopener" href="https://www.instagram.com/DynamicNFC.app/" target="_blank" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 social-icon"> </a>
                          <a rel="noopener" href="https://www.youtube.com/channel/UCopwKOpWolEHxJONR5ZVjMQ" target="_blank" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 social-icon"> </a>
                          <a rel="noopener" href="https://www.facebook.com/dynamicnfctechnologies" target="_blank" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 social-icon"> </a>
                          <a rel="noopener" href="https://www.linkedin.com/company/DynamicNFC-me" target="_blank" className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 social-icon last"> </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function OrderCard() {
    return (
        <>
            <div className="navbar_ab">
                <div className="css w-embed"></div>
                <div role="banner" className="navbar black w-nav">
                    <div className="nav-container">
                        <div className="brand-wrapper">
                            <Link to="/"
                                aria-current="page"
                                className="brand w-nav-brand w--current"
                            ></Link>
                        </div>
                        <nav role="navigation" className="nav-menu w-nav-menu">
                            <Link to="/" className="nav-dropdown desktop-only w-dropdown">
                                <div className="nav-link dropdown w-dropdown-toggle">
                                    <div
                                        className="dropdown-text"
                                        style={{ color: "black" }}
                                    >
                                        Home
                                    </div>
                                </div>
                            </Link>
                            <Link to="/enterprise" className="nav-dropdown desktop-only w-dropdown">
                                <div className="nav-link dropdown w-dropdown-toggle">
                                    <div
                                        className="dropdown-text"
                                        style={{ color: "black" }}
                                    >
                                        Enterprise
                                    </div>
                                </div>
                            </Link>
                            <Link to="/nfc-cards" className="nav-dropdown desktop-only w-dropdown" >
                                <div className="nav-link dropdown w-dropdown-toggle">
                                    <div
                                        className="dropdown-text"
                                        style={{ color: "black" }}
                                    >
                                        NFC Cards
                                    </div>
                                </div>
                            </Link>
                        </nav>
                        <div className="navbar-cta-wrapper">
                            <Link to="/create-card" className="button analytics w-button">
                                Create digital card
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="page-wrapper grey">
                <div class="main-wrapper">
                    <div className="section-built">
                        <div className="section_business u-hide-twocol">
                            <div className="padding-global padding-section-large mobile-top-none">
                                <div className="container-large">
                                    <div className="business_comp less">

                                        {/* Başlık */}
                                        <div className="business_first-row">
                                            <div className="business_heading-wrap">
                                                <div className="home-team_text-comp text-align-center cc-max-832">
                                                    <h5 className="heading-style-h5">
                                                        Built for enterprise. Secure from day one.
                                                    </h5>
                                                    <div className="text-size-medium">
                                                        With Single Sign-On (SSO) integration securely manage user access and authentication across your organization. GDPR and CCPA compliant, SOC 2 Type II Certified.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <main className=" product-detail-page-x">
                        <div className="detail-top__right page-top">
                                        <div className="circle">
                                            <span className="circle__item circle__item--sm" />
                                            <span className="circle__item circle__item--md" />
                                            <span className="circle__item circle__item--lg" />
                                            <span className="circle__item circle__item--xl" />
                                        </div>
                                    </div>

                        {/* PRODUCTS */}
                        <section className="detail-products">
                            <div className="container">
                                <div className="detail-products__wrapper">
                                    {/* CARD ITEM */}
                                    <div className="card-trowas__item">
                                        <div className="card-trowas__img">
                                            <Link
                                                className="flip-card flip-card--whie flip-card--color-black"
                                            >
                                                <div
                                                    className="flip-card__inner flip-card--image"
                                                    style={{ height: 271 }}
                                                >
                                                    <div className="flip-card__front">
                                                        <img
                                                            className="flip-card__bg"
                                                            src="https://trowas.com/storage/new/images/products/urun/1/trowas-dijital-kartvizit-beyaz-dijital-kartvizit-on.webp"
                                                            alt="White Digital Business Card"
                                                        />
                                                    </div>
                                                    <div className="flip-card__back">
                                                        <img
                                                            className="flip-card__bg"
                                                            src="https://trowas.com/storage/new/images/products/urun/1/trowas-dijital-kartvizit-beyaz-dijital-kartvizit-arka.webp"
                                                            alt="White Digital Business Card"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="card-trowas__content">
                                            <div className="card-trowas__top">
                                                <Link
                                                    className="card-trowas__txt txt txt--px22 txt--font400"
                                                >
                                                    <h2>White Digital Business Card</h2>
                                                </Link>
                                            </div>

                                            <div className="card-trowas__price txt txt--px20 txt--font700">
                                                <h5>39,90 USD</h5>
                                            </div>

                                            {/* <div className="card-trowas__buttons">
                                                <Link
                                                    to="/en/digital-business-cards/white-digital-business-card"
                                                    className="btn btn--primary btn--green"
                                                >
                                                    <div className="btn-icon">
                                                        <svg viewBox="0 0 21 14">
                                                            <path d="M1.33333 6.29167L20 8.04167" />
                                                        </svg>
                                                    </div>
                                                    <div className="btn-txt">Buy</div>
                                                </Link>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div className="card-trowas__item">
                                        <div className="card-trowas__img">
                                            <Link
                                                className="flip-card flip-card--black flip-card--color-white"
                                            >
                                                <div className="flip-card__inner flip-card--image" style={{ height: 271 }}>
                                                    <div className="flip-card__front">
                                                        <img
                                                            className="flip-card__bg"
                                                            src="https://trowas.com/storage/new/images/products/urun/2/trowas-dijital-kartvizit-siyah-dijital-kartvizit-on.webp"
                                                            alt="Black Digital Business Card"
                                                        />
                                                    </div>
                                                    <div className="flip-card__back">
                                                        <img
                                                            className="flip-card__bg"
                                                            src="https://trowas.com/storage/new/images/products/urun/2/trowas-dijital-kartvizit-siyah-dijital-kartvizit-arka.webp"
                                                            alt="Black Digital Business Card"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="card-trowas__content">
                                            <div className="card-trowas__top">
                                                <Link
                                                    className="card-trowas__txt txt txt--px22 txt--font400"
                                                >
                                                    <h2>Black Digital Business Card</h2>
                                                </Link>
                                            </div>

                                            <div className="card-trowas__price txt txt--px20 txt--font700">
                                                <h5>39,90 USD</h5>
                                            </div>

                                            {/* <div className="card-trowas__buttons">
                                                <Link
                                                    to="/en/digital-business-cards/black-digital-business-card"
                                                    className="btn btn--primary btn--green"
                                                >
                                                    <div className="btn-icon">
                                                        <svg viewBox="0 0 21 14">
                                                            <path d="M1.33333 6.29167L20 8.04167" />
                                                        </svg>
                                                    </div>
                                                    <div className="btn-txt">Buy</div>
                                                </Link>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div className="card-trowas__item">
                                        <div className="card-trowas__img">
                                            <Link
                                                className="flip-card flip-card--gold flip-card--color-black"
                                            >
                                                <div className="flip-card__inner flip-card--image" style={{ height: 271 }}>
                                                    <div className="flip-card__front">
                                                        <img
                                                            className="flip-card__bg"
                                                            src="https://trowas.com/storage/new/images/products/urun/3/trowas-dijital-kartvizit-altin-dijital-kartvizit-on.webp"
                                                            alt="Gold Digital Business Card"
                                                        />
                                                    </div>
                                                    <div className="flip-card__back">
                                                        <img
                                                            className="flip-card__bg"
                                                            src="https://trowas.com/storage/new/images/products/urun/3/trowas-dijital-kartvizit-altin-dijital-kartvizit-arka.webp"
                                                            alt="Gold Digital Business Card"
                                                        />
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="card-trowas__content">
                                            <div className="card-trowas__top">
                                                <Link
                                                    className="card-trowas__txt txt txt--px22 txt--font400"
                                                >
                                                    <h2>Gold Digital Business Card</h2>
                                                </Link>
                                            </div>

                                            <div className="card-trowas__price txt txt--px20 txt--font700">
                                                <h5>69,90 USD</h5>
                                            </div>

                                            {/* <div className="card-trowas__buttons">
                                                <Link
                                                    className="btn btn--primary btn--green"
                                                >
                                                    <div className="btn-icon">
                                                        <svg viewBox="0 0 21 14">
                                                            <path d="M1.33333 6.29167L20 8.04167" />
                                                        </svg>
                                                    </div>
                                                    <div className="btn-txt">Buy</div>
                                                </Link>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="div-block-139">
                            <footer
                                className="footer w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"
                            >
                                <div className="w-embed"></div>
                                <div className="container">
                                    <div className="wrapper">
                                        <div className="footer-row">
                                            <div className="footer-col vertical">
                                                <a href="#" className="brand footer w-inline-block" />
                                                <div className="footer-app-btn-wrapper">
                                                    <a
                                                        href="https://dl.DynamicNFC.me/?v=web01"
                                                        className="appstore-link w-inline-block"
                                                    >
                                                        <img
                                                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899af03d8217ac_app-store.webp"
                                                            loading="lazy"
                                                            alt="app store"
                                                            className="app-store-img"
                                                        />
                                                    </a>
                                                    <a
                                                        href="https://dl.DynamicNFC.me/?v=android01"
                                                        className="appstore-link google w-inline-block"
                                                    >
                                                        <img
                                                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899acbea8217ab_google-play-store.webp"
                                                            loading="lazy"
                                                            sizes="100vw"
                                                            srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899acbea8217ab_google-play-store-p-500.webp 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899acbea8217ab_google-play-store.webp 564w"
                                                            alt="google play store"
                                                            className="app-store-img"
                                                        />
                                                    </a>
                                                    <a
                                                        href="https://app.vanta.com/DynamicNFC/trust/wywxgtvmdkpf4v8wmskgd1"
                                                        className="appstore-link google w-inline-block"
                                                    >
                                                        <img
                                                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6434fc2bac4abe874b62c1d4_Frame 2.webp"
                                                            loading="lazy"
                                                            alt=""
                                                            className="app-store-img"
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="footer-col horizontal" style={{ justifyContent: 'flex-end' }}>
                                                <div className="footer-nav" style={{ marginRight: '40px' }}>
                                                    <div className="footer-title w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">
                                                        Product
                                                    </div>
                                                    <Link
                                                        to="/enterprise"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"
                                                    >
                                                        Enterprise
                                                    </Link>
                                                    <Link
                                                        to="/nfc-cards"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"
                                                    >
                                                        NFC Business Cards
                                                    </Link>
                                                    <Link
                                                        to="/order-card"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"
                                                    >
                                                        Order Card
                                                    </Link>
                                                </div>
                                                <div className="footer-nav">
                                                    <div className="footer-title w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366">
                                                        <strong>Account</strong>
                                                    </div>
                                                    <Link
                                                        to="/create-card"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"
                                                    >
                                                        Create Card
                                                    </Link>
                                                    <a
                                                        href="#"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"
                                                    >
                                                        Log in
                                                    </a>
                                                    <a
                                                        href="#"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"
                                                    >
                                                        Sign up
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="footer-row last">
                                            <div className="footer-col horizontal legal">
                                                <div className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 text">
                                                    © 2026 DynamicNFC Technologies Pty Ltd. All Rights
                                                    Reserved.
                                                </div>
                                            </div>
                                            <div className="footer-col">
                                                <div className="social-buttons-wrapper">
                                                    <a
                                                        rel="noopener"
                                                        href="https://www.instagram.com/DynamicNFC.app/"
                                                        target="_blank"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 social-icon"
                                                    >
                                                        
                                                    </a>
                                                    <a
                                                        rel="noopener"
                                                        href="https://www.youtube.com/channel/UCopwKOpWolEHxJONR5ZVjMQ"
                                                        target="_blank"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 social-icon"
                                                    >
                                                        
                                                    </a>
                                                    <a
                                                        rel="noopener"
                                                        href="https://www.facebook.com/dynamicnfctechnologies"
                                                        target="_blank"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 social-icon"
                                                    >
                                                        
                                                    </a>
                                                    <a
                                                        rel="noopener"
                                                        href="https://www.linkedin.com/company/DynamicNFC-me"
                                                        target="_blank"
                                                        className="footer-item w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 social-icon last"
                                                    >
                                                        
                                                    </a>
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

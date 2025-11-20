import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Enterprise() {
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
                                Create my card
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

                                        {/* Dashboard kartları */}
                                        <div className="darshboard-main-wrap hide-mobile-portrait">
                                            <div className="dashboard-cards-wrap z-index-1">

                                                <div className="dashboard-highlet-card z-index-1">
                                                    <div className="dashboard-highlet-card-inner">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6803c6994932edd90b46eea5_pngwing.com%201.svg"
                                                            loading="lazy"
                                                            alt="SSO Icon"
                                                        />
                                                    </div>
                                                    <div className="text-size-small text-color-mildblack">Single Sign—On (SSO)</div>
                                                </div>

                                                <div className="dashboard-highlet-card z-index-1">
                                                    <div className="dashboard-highlet-card-inner">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6803c9f43494ae7eba88a1e4_image%205837.svg"
                                                            loading="lazy"
                                                            alt="SOC 2 Icon"
                                                        />
                                                    </div>
                                                    <div className="text-size-small text-color-mildblack">SOC 2 Type II Certified</div>
                                                </div>

                                                <div className="dashboard-highlet-card z-index-1">
                                                    <div className="dashboard-highlet-card-inner">
                                                        <img
                                                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6803c9f35d447db9827b77bb_image%205838.svg"
                                                            loading="lazy"
                                                            alt="GDPR Icon"
                                                        />
                                                    </div>
                                                    <div className="text-size-small text-color-mildblack">GDPR Compliant</div>
                                                </div>

                                                <div className="line-sso hide-desk"></div>
                                            </div>

                                            <div className="dashboard-lines-wrap">
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6803c75fd674b660e69c64d0_Group%201171275416.svg"
                                                    alt=""
                                                    className="abs-lines"
                                                />
                                            </div>

                                            <div className="dashobard-image-wrap z-index-1">
                                                <img
                                                    width="70"
                                                    height="auto"
                                                    style={{ "width": "100%" }}
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811705c045234e62e9d9801_Cards%20dashboard%20(1).avif"
                                                    alt="The DynamicNFC dashboard where an admin is viewing their team list."
                                                    loading="lazy"
                                                    className="large-image"
                                                />
                                            </div>
                                        </div>

                                        {/* Mobil için dashboard */}
                                        <div className="darshboard-main-wrap-mobile">
                                            <img
                                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6817c2ac1c8686a5b35f8d86_3813a181cb9011beb7279bbb76fb1dcfbddacba1-min.avif"
                                                srcSet="
                    https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6817c2ac1c8686a5b35f8d86_3813a181cb9011beb7279bbb76fb1dcfbddacba1-min-p-500.avif 500w,
                    https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6817c2ac1c8686a5b35f8d86_3813a181cb9011beb7279bbb76fb1dcfbddacba1-min-p-800.avif 800w,
                    https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6817c2ac1c8686a5b35f8d86_3813a181cb9011beb7279bbb76fb1dcfbddacba1-min-p-1080.avif 1080w,
                    https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6817c2ac1c8686a5b35f8d86_3813a181cb9011beb7279bbb76fb1dcfbddacba1-min-p-1600.avif 1600w,
                    https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6817c2ac1c8686a5b35f8d86_3813a181cb9011beb7279bbb76fb1dcfbddacba1-min-p-2000.avif 2000w,
                    https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6817c2ac1c8686a5b35f8d86_3813a181cb9011beb7279bbb76fb1dcfbddacba1-min.avif 4096w
                  "
                                                sizes="100vw"
                                                alt="DynamicNFC's dashboard team list"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* CTA Butonlar */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section_home-card" style={{ display: "block" }}>
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="padding-section-large is-home-card">
                                    <div className="home-card_list">
                                        <div className="home-card_comp">
                                            <div className="home-card_item-left">
                                                <h5 className="heading-style-h5">Share your card in seconds.</h5>
                                                <div className="text-size-medium">
                                                    Scan. Tap. Done. QR, NFC, or link - your details land instantly.
                                                </div>
                                                <Link to="/create-card" className="button">
                                                    <div className="text-size-regular text-color-white">Create my card</div>
                                                </Link>
                                            </div>
                                            <div className="home-card_item-right">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e34_Frame 1948758285.webp"
                                                    loading="lazy"
                                                    alt="2 phones with DynamicNFC cards"
                                                    className="home-card_image"
                                                />
                                            </div>
                                        </div>

                                        <div className="home-card_comp">
                                            <div className="home-card_item-right">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e2e_Frame 1948758285 (1).webp"
                                                    loading="lazy"
                                                    alt="a DynamicNFC card with the email being updated"
                                                    className="home-card_image"
                                                />
                                            </div>
                                            <div className="home-card_item-left">
                                                <h5 className="heading-style-h5">Works everywhere. Looks sharp doing it.</h5>
                                                <div className="text-size-medium">
                                                    iOS, Android, desktop, browser - your card shows up polished, every time. No app needed on their end.
                                                </div>
                                                <Link to="/create-card" className="button">
                                                    <div className="text-size-regular text-color-white">Create my card</div>
                                                </Link>
                                            </div>
                                        </div>

                                        <div className="home-card_comp">
                                            <div className="home-card_item-left">
                                                <h5 className="heading-style-h5">Never forget a face - or a moment.</h5>
                                                <div className="text-size-medium">DynamicNFC keeps track of who you met and when.</div>
                                                <Link to="/create-card" className="button">
                                                    <div className="text-size-regular text-color-white">Create my card</div>
                                                </Link>
                                            </div>
                                            <div className="home-card_item-right">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e917b529434acc5fc998_Frame 1948758285 (2).webp"
                                                    loading="lazy"
                                                    alt="a DynamicNFC contact page with one contact highlighted"
                                                    className="home-card_image"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="section_home-DynamicNFC-card" style={{ marginBottom: "150px" }}>
                        <div className="padding-global">
                            <div className="container-large">
                                <div className="features-main-wrap">
                                    <div className="perk_text-comp">
                                        <h2 className="heading-style-h5">More features</h2>
                                    </div>
                                    <p className="paragraph-5">
                                        More than 3 million people across 500,000 companies choose DynamicNFC
                                        <br />
                                    </p>
                                    <div className="features-gird">
                                        <div className="perk_item w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8">
                                            <div className="perk_icon-wrap">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680bcddf897a555d9b9a97ea_Frame%202147226682.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="perk_image w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8"
                                                />
                                            </div>
                                            <div className="perk_text-wrap">
                                                <div className="text-size-medium text-weight-semibold text-color-mildblack">
                                                    Share with anyone
                                                </div>
                                                <div className="text-size-regular">
                                                    Recipients don’t need to have the DynamicNFC app.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="perk_item w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8">
                                            <div className="perk_icon-wrap">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680bcddf6fc008826be0e047_617ac0d059899a4efd82176e_icons8-qr-code%201%201.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="perk_image w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8"
                                                />
                                            </div>
                                            <div className="perk_text-wrap">
                                                <div className="text-size-medium text-weight-semibold text-color-mildblack">
                                                    QR code technology
                                                </div>
                                                <div className="text-size-regular">
                                                    Even as your DynamicNFC card changes, your QR will stay the same. Print, share and embed without a worry.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="perk_item w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8">
                                            <div className="perk_icon-wrap">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680bcddfb8840aa3a139b885_617ac0d059899ac5f5821771_icons8-infinite%201.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="perk_image w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8"
                                                />
                                            </div>
                                            <div className="perk_text-wrap">
                                                <div className="text-size-medium text-weight-semibold text-color-mildblack">
                                                    Create and share with no limits
                                                </div>
                                                <div className="text-size-regular">
                                                    No matter how big your team is, DynamicNFC will scale as you grow.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="perk_item w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8">
                                            <div className="perk_icon-wrap">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680bcddf109db02baba0f2fd_646c279638ee741f3460f632_Globe%201.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="perk_image w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8"
                                                />
                                            </div>
                                            <div className="perk_text-wrap">
                                                <div className="text-size-medium text-weight-semibold text-color-mildblack">
                                                    For global teams
                                                </div>
                                                <div className="text-size-regular">
                                                    DynamicNFC can support all languages and regions.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="perk_item w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8">
                                            <div className="perk_icon-wrap">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680bcddfd4fe7c099835d3a9_646c27a4c1ee63426e786d3f_Ticks%201.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="perk_image w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8"
                                                />
                                            </div>
                                            <div className="perk_text-wrap">
                                                <div className="text-size-medium text-weight-semibold text-color-mildblack">
                                                    Available everywhere
                                                </div>
                                                <div className="text-size-regular">
                                                    DynamicNFC is available on iOS, Android and via the web.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="perk_item w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8">
                                            <div className="perk_icon-wrap">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680bcddf0431d57376c8c312_617ac0d059899a9d15821770_icons8-duplicate%201%201.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="perk_image w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8"
                                                />
                                            </div>
                                            <div className="perk_text-wrap">
                                                <div className="text-size-medium text-weight-semibold text-color-mildblack">
                                                    Dedicated account management
                                                </div>
                                                <div className="text-size-regular">
                                                    Maximize your ROI on DynamicNFC.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="perk_item w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8">
                                            <div className="perk_icon-wrap">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680bcddffff342135d0fbfc5_646c2788b01f8c167ed200af_Padlock%201.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="perk_image w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8"
                                                />
                                            </div>
                                            <div className="perk_text-wrap">
                                                <div className="text-size-medium text-weight-semibold text-color-mildblack">
                                                    Secure sharing
                                                </div>
                                                <div className="text-size-regular">
                                                    We protect you and your clients privacy at all times.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="perk_item w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8">
                                            <div className="perk_icon-wrap">
                                                <img
                                                    src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680bcddfb958cebc1daed3b4_617ac0d059899a8bf382176d_icons8-headset%201%201.svg"
                                                    loading="lazy"
                                                    alt=""
                                                    className="perk_image w-variant-23181bf7-6224-8ee9-c826-0a7d471e2dc8"
                                                />
                                            </div>
                                            <div className="perk_text-wrap">
                                                <div className="text-size-medium text-weight-semibold text-color-mildblack">
                                                    Priority support
                                                </div>
                                                <div className="text-size-regular">
                                                    Skip the queue - the DynamicNFC support team is here to help you every step of the way.
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="div-block-139">
                        <footer
                            className="footer w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366"
                        >
                            <div className="w-embed"></div>
                            <div className="container">
                                <div className="wrapper">
                                    <div className="footer-row">
                                        <div className="footer-col vertical">
                                            <img
                                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/642500383b49e124c851b0ea_logo-light.avif"
                                                loading="lazy"
                                                alt="DynamicNFC logo with white text"
                                                className="logo w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 logo--white"
                                            />
                                            <img
                                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/642500bb3135f91b8a637d38_logo-dark.avif"
                                                loading="lazy"
                                                alt="DynamicNFC logo with dark text"
                                                className="logo w-variant-40e64df4-7ac3-6c46-0947-00da0b61d366 logo--black"
                                            />
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
                </div>

            </div>
        </>

    )
}

export default Enterprise
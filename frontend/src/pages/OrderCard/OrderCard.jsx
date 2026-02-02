import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

export default function OrderCard() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const cards = [
        {
            id: "white",
            title: "White Digital Business Card",
            price: "39,90 CAD",
            front: "assets/images/beyaz-on.png",
            back: "assets/images/beyaz-arka.png",
            tertemiz: "assets/images/beyaz-tertemiz.png",
            className: "flip-card--whie flip-card--color-black"
        },
        {
            id: "gray",
            title: "Black Digital Business Card",
            price: "39,90 CAD",
            front: "assets/images/gri-on.png",
            back: "assets/images/gri-arka.png",
            tertemiz: "assets/images/gri-tertemiz.png",
            className: "flip-card--black flip-card--color-white"
        },
        {
            id: "gold",
            title: "Gold Digital Business Card",
            price: "69,90 CAD",
            front: "assets/images/sari-on.png",
            back: "assets/images/sari-arka.png",
            tertemiz: "assets/images/sari-tertemiz.png",
            className: "flip-card--gold flip-card--color-black"
        }
    ];


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
                            {/* <Link to="/create-card" className="button analytics w-button">
                                Create digital card
                            </Link> */}
                            {isAuthenticated && isAuthenticated() ? (
                              <button 
                                onClick={handleLogout} 
                                className="button analytics w-button" 
                                style={{marginLeft: '10px'}}
                              >
                                Logout
                              </button>
                            ) : (
                              <Link to="/login" className="button analytics w-button" style={{marginLeft: '10px'}}>
                                Login
                              </Link>
                            )}
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
                                    {cards.map((card) => (
                                        <div key={card.id} className="card-trowas__item">
                                            <div className="card-trowas__img">
                                                <Link
                                                    to="/create-physical-card"
                                                    state={{ card }}
                                                    className={`flip-card ${card.className}`}
                                                >
                                                    <div className="flip-card__inner flip-card--image" style={{ height: 271 }}>
                                                        <div className="flip-card__front">
                                                            <img className="flip-card__bg" src={card.front} alt={card.title} />
                                                        </div>
                                                        <div className="flip-card__back">
                                                            <img className="flip-card__bg" src={card.back} alt={card.title} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>

                                            <div className="card-trowas__content">
                                                <h2>{card.title}</h2>
                                                <h5>{card.price}</h5>
                                            </div>
                                        </div>
                                    ))}

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

import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';

export default function CreatePhysicalCard() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();
    
    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    const card = state?.card;
    const [fullName, setFullName] = useState("");
    const [logoPreview, setLogoPreview] = useState(null);
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    return (
        <>
             <div className="navbar_ab">
                <div className="css w-embed"></div>
                <div role="banner" className="navbar black w-nav">
                    <div className="nav-container nav-container-mobile">
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
                                    >
                                        <p>Home</p>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/enterprise" className="nav-dropdown desktop-only w-dropdown">
                                <div className="nav-link dropdown w-dropdown-toggle">
                                    <div
                                        className="dropdown-text"
                                    >
                                        <p>Enterprise</p>
                                    </div>
                                </div>
                            </Link>
                            <Link to="/nfc-cards" className="nav-dropdown desktop-only w-dropdown" >
                                <div className="nav-link dropdown w-dropdown-toggle">
                                    <div
                                        className="dropdown-text"
                                    >
                                        <p>NFC Cards</p>
                                    </div>
                                </div>
                            </Link>
                        </nav>
                        <div className="navbar-auth-buttons">
                            {isAuthenticated && isAuthenticated() && (
                                <Link to="/dashboard" className="button light white analytics w-button">
                                    Dashboard
                                </Link>
                            )}
                            {isAuthenticated && isAuthenticated() ? (
                                <button
                                    onClick={handleLogout}
                                    className="button light white analytics w-button"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link to="/login" className="button light white analytics w-button">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <main className="detail-pae t-deail-page ">
                <section className="product">
                    <div className="container">
                        <div className="product__top">
                            <div className="product__left">
                                <div className="product__card">
                                    <div className="flip-card flip-card--alt js-flip-card flip-card-- flip-card--color-lazer flip-card--color-black">
                                        <div className="flip-card__inner">
                                            <div className="flip-card__front">
                                                <img
                                                    src={card?.tertemiz}
                                                    className="flip-card__bg"
                                                    alt={card?.title}
                                                />
                                                <div className="flip-card__content">
                                                    <div className="flip-card__content-top">
                                                        <div className="flip-card__logo">
                                                            <img
                                                                decoding="async"
                                                                src={logoPreview || ""}
                                                                alt=""
                                                                style={{ display: logoPreview ? "block" : "none" }}
                                                            />
                                                        </div>
                                                        <span
                                                            className="flip-card__nfc icon icon-font"
                                                            data-icon-id="iconNFC"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 35 63.98"
                                                            >
                                                                <path
                                                                    d="M32.63,17.96c-0.63,0-1.23,0.25-1.67,0.69c-1.77,1.76-3.15,3.82-4.1,6.12c-0.95,2.3-1.43,4.73-1.42,7.22
		c-0.01,2.5,0.47,4.92,1.42,7.22c0.95,2.3,2.33,4.35,4.09,6.1l0,0c0.89,0.89,2.45,0.89,3.35,0c0.45-0.45,0.69-1.04,0.69-1.67
		c0-0.62-0.25-1.23-0.69-1.67c-2.67-2.67-4.13-6.21-4.13-9.99c0-3.77,1.47-7.32,4.13-9.98c0.45-0.45,0.69-1.04,0.69-1.67
		s-0.25-1.23-0.69-1.67C33.86,18.21,33.27,17.96,32.63,17.96z"
                                                                />
                                                                <path
                                                                    d="M23.65,8.99c-0.63,0-1.23,0.25-1.67,0.69c-2.96,2.94-5.26,6.38-6.86,10.23c-1.59,3.85-2.4,7.92-2.38,12.08
		c-0.01,4.17,0.79,8.24,2.39,12.08c1.59,3.85,3.9,7.29,6.85,10.22l0,0c0.67,0.67,1.7,0.88,2.58,0.51c0.29-0.12,0.55-0.29,0.77-0.51
		c0.22-0.22,0.39-0.48,0.51-0.77c0.12-0.29,0.18-0.59,0.18-0.91c0-0.63-0.25-1.23-0.69-1.67c-5.07-5.07-7.85-11.8-7.85-18.97
		s2.79-13.9,7.86-18.97c0.45-0.45,0.69-1.04,0.69-1.67c0-0.63-0.25-1.23-0.69-1.67S24.28,8.99,23.65,8.99z"
                                                                />
                                                                <path
                                                                    d="M13.14,0.52l-0.17,0.17c-4.13,4.13-7.36,8.97-9.6,14.37S0,26.16,0,32s1.13,11.55,3.37,16.95c2.24,5.4,5.47,10.23,9.6,14.37
		c0.89,0.89,2.45,0.89,3.35,0c0.44-0.44,0.69-1.05,0.69-1.67c0-0.63-0.25-1.23-0.69-1.67c-3.69-3.69-6.58-8.01-8.58-12.83
		c-2-4.82-3.01-9.92-3.01-15.14c0-5.22,1.01-10.31,3.01-15.14c2-4.82,4.89-9.14,8.58-12.83l0,0c0.45-0.45,0.69-1.04,0.69-1.67
		c0-0.63-0.25-1.23-0.69-1.67C15.48-0.16,14.06-0.23,13.14,0.52z"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="flip-card__content-bottom">
                                                        <div className="flip-card__name js-card-name class">
                                                            {fullName || "Name Surname"}
                                                        </div>
                                                        <span
                                                            className="flip-card__qr icon icon-font"
                                                            data-icon-id="iconCardQR"
                                                        >
                                                            <svg
                                                                id="Layer_1"
                                                                data-name="Layer 1"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 1000 1000"
                                                            >
                                                                <defs>
                                                                    <style
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                "\n                                                                .cls-1 {\n                                                                    fill: none;\n                                                                }\n                                                            "
                                                                        }}
                                                                    />
                                                                </defs>
                                                                <rect x={320} width={40} height={40} />
                                                                <rect x={440} width={40} height={40} />
                                                                <rect x={520} width={40} height={40} />
                                                                <rect x={640} width={40} height={40} />
                                                                <rect x={320} y={40} width={40} height={40} />
                                                                <rect x={400} y={40} width={40} height={40} />
                                                                <rect x={640} y={40} width={40} height={40} />
                                                                <rect x={360} y={80} width={40} height={40} />
                                                                <rect x={520} y={80} width={40} height={40} />
                                                                <rect x={560} y={80} width={40} height={40} />
                                                                <rect x={600} y={80} width={40} height={40} />
                                                                <rect x={320} y={120} width={40} height={40} />
                                                                <rect x={360} y={120} width={40} height={40} />
                                                                <rect x={480} y={160} width={40} height={40} />
                                                                <rect x={520} y={160} width={40} height={40} />
                                                                <rect x={560} y={160} width={40} height={40} />
                                                                <rect x={600} y={160} width={40} height={40} />
                                                                <rect x={640} y={160} width={40} height={40} />
                                                                <rect x={400} y={200} width={40} height={40} />
                                                                <rect x={440} y={200} width={40} height={40} />
                                                                <rect x={480} y={200} width={40} height={40} />
                                                                <rect x={560} y={200} width={40} height={40} />
                                                                <rect x={320} y={240} width={40} height={40} />
                                                                <rect x={400} y={240} width={40} height={40} />
                                                                <rect x={480} y={240} width={40} height={40} />
                                                                <rect x={560} y={240} width={40} height={40} />
                                                                <rect x={640} y={240} width={40} height={40} />
                                                                <rect x={320} y={280} width={40} height={40} />
                                                                <rect x={440} y={280} width={40} height={40} />
                                                                <rect x={480} y={280} width={40} height={40} />
                                                                <rect x={520} y={280} width={40} height={40} />
                                                                <rect x={560} y={280} width={40} height={40} />
                                                                <rect x={600} y={280} width={40} height={40} />
                                                                <rect y={320} width={40} height={40} />
                                                                <rect x={80} y={320} width={40} height={40} />
                                                                <rect x={120} y={320} width={40} height={40} />
                                                                <rect x={200} y={320} width={40} height={40} />
                                                                <rect x={240} y={320} width={40} height={40} />
                                                                <rect x={280} y={320} width={40} height={40} />
                                                                <rect x={480} y={320} width={40} height={40} />
                                                                <rect x={520} y={320} width={40} height={40} />
                                                                <rect x={560} y={320} width={40} height={40} />
                                                                <rect x={640} y={320} width={40} height={40} />
                                                                <rect x={720} y={320} width={40} height={40} />
                                                                <rect x={840} y={320} width={40} height={40} />
                                                                <rect x={920} y={320} width={40} height={40} />
                                                                <rect x={960} y={320} width={40} height={40} />
                                                                <rect y={360} width={40} height={40} />
                                                                <rect x={40} y={360} width={40} height={40} />
                                                                <rect x={160} y={360} width={40} height={40} />
                                                                <rect x={320} y={360} width={40} height={40} />
                                                                <rect x={440} y={360} width={40} height={40} />
                                                                <rect x={640} y={360} width={40} height={40} />
                                                                <rect x={680} y={360} width={40} height={40} />
                                                                <rect x={760} y={360} width={40} height={40} />
                                                                <rect x={920} y={360} width={40} height={40} />
                                                                <rect y={400} width={40} height={40} />
                                                                <rect x={40} y={400} width={40} height={40} />
                                                                <rect x={160} y={400} width={40} height={40} />
                                                                <rect x={240} y={400} width={40} height={40} />
                                                                <rect x={280} y={400} width={40} height={40} />
                                                                <rect x={320} y={400} width={40} height={40} />
                                                                <rect x={360} y={400} width={40} height={40} />
                                                                <rect x={440} y={400} width={40} height={40} />
                                                                <rect x={560} y={400} width={40} height={40} />
                                                                <rect x={680} y={400} width={40} height={40} />
                                                                <rect x={800} y={400} width={40} height={40} />
                                                                <rect x={40} y={440} width={40} height={40} />
                                                                <rect x={120} y={440} width={40} height={40} />
                                                                <rect x={360} y={440} width={40} height={40} />
                                                                <rect x={400} y={440} width={40} height={40} />
                                                                <rect x={480} y={440} width={40} height={40} />
                                                                <rect x={520} y={440} width={40} height={40} />
                                                                <rect x={560} y={440} width={40} height={40} />
                                                                <rect x={600} y={440} width={40} height={40} />
                                                                <rect x={720} y={440} width={40} height={40} />
                                                                <rect x={840} y={440} width={40} height={40} />
                                                                <rect x={880} y={440} width={40} height={40} />
                                                                <rect x={160} y={480} width={40} height={40} />
                                                                <rect x={240} y={480} width={40} height={40} />
                                                                <rect x={320} y={480} width={40} height={40} />
                                                                <rect x={440} y={480} width={40} height={40} />
                                                                <rect x={680} y={480} width={40} height={40} />
                                                                <rect x={720} y={480} width={40} height={40} />
                                                                <rect x={760} y={480} width={40} height={40} />
                                                                <rect x={800} y={480} width={40} height={40} />
                                                                <rect x={880} y={480} width={40} height={40} />
                                                                <rect x={920} y={480} width={40} height={40} />
                                                                <rect x={960} y={480} width={40} height={40} />
                                                                <rect x={80} y={520} width={40} height={40} />
                                                                <rect x={120} y={520} width={40} height={40} />
                                                                <rect x={160} y={520} width={40} height={40} />
                                                                <rect x={360} y={520} width={40} height={40} />
                                                                <rect x={400} y={520} width={40} height={40} />
                                                                <rect x={440} y={520} width={40} height={40} />
                                                                <rect x={520} y={520} width={40} height={40} />
                                                                <rect x={600} y={520} width={40} height={40} />
                                                                <rect x={680} y={520} width={40} height={40} />
                                                                <rect x={720} y={520} width={40} height={40} />
                                                                <rect x={760} y={520} width={40} height={40} />
                                                                <rect x={800} y={520} width={40} height={40} />
                                                                <rect x={960} y={520} width={40} height={40} />
                                                                <rect x={40} y={560} width={40} height={40} />
                                                                <rect x={80} y={560} width={40} height={40} />
                                                                <rect x={120} y={560} width={40} height={40} />
                                                                <rect x={240} y={560} width={40} height={40} />
                                                                <rect x={360} y={560} width={40} height={40} />
                                                                <rect x={400} y={560} width={40} height={40} />
                                                                <rect x={480} y={560} width={40} height={40} />
                                                                <rect x={560} y={560} width={40} height={40} />
                                                                <rect x={680} y={560} width={40} height={40} />
                                                                <rect x={720} y={560} width={40} height={40} />
                                                                <rect x={800} y={560} width={40} height={40} />
                                                                <rect x={880} y={560} width={40} height={40} />
                                                                <rect x={920} y={560} width={40} height={40} />
                                                                <rect y={600} width={40} height={40} />
                                                                <rect x={80} y={600} width={40} height={40} />
                                                                <rect x={320} y={600} width={40} height={40} />
                                                                <rect x={360} y={600} width={40} height={40} />
                                                                <rect x={480} y={600} width={40} height={40} />
                                                                <rect x={520} y={600} width={40} height={40} />
                                                                <rect x={680} y={600} width={40} height={40} />
                                                                <rect x={760} y={600} width={40} height={40} />
                                                                <rect x={800} y={600} width={40} height={40} />
                                                                <rect x={960} y={600} width={40} height={40} />
                                                                <rect x={120} y={640} width={40} height={40} />
                                                                <rect x={160} y={640} width={40} height={40} />
                                                                <rect x={200} y={640} width={40} height={40} />
                                                                <rect x={240} y={640} width={40} height={40} />
                                                                <rect x={280} y={640} width={40} height={40} />
                                                                <rect x={440} y={640} width={40} height={40} />
                                                                <rect x={640} y={640} width={40} height={40} />
                                                                <rect x={680} y={640} width={40} height={40} />
                                                                <rect x={720} y={640} width={40} height={40} />
                                                                <rect x={760} y={640} width={40} height={40} />
                                                                <rect x={800} y={640} width={40} height={40} />
                                                                <rect x={840} y={640} width={40} height={40} />
                                                                <rect x={880} y={640} width={40} height={40} />
                                                                <rect x={920} y={640} width={40} height={40} />
                                                                <rect x={960} y={640} width={40} height={40} />
                                                                <rect x={320} y={680} width={40} height={40} />
                                                                <rect x={400} y={680} width={40} height={40} />
                                                                <rect x={480} y={680} width={40} height={40} />
                                                                <rect x={520} y={680} width={40} height={40} />
                                                                <rect x={600} y={680} width={40} height={40} />
                                                                <rect x={640} y={680} width={40} height={40} />
                                                                <rect x={800} y={680} width={40} height={40} />
                                                                <rect x={880} y={680} width={40} height={40} />
                                                                <rect x={960} y={680} width={40} height={40} />
                                                                <rect x={320} y={720} width={40} height={40} />
                                                                <rect x={360} y={720} width={40} height={40} />
                                                                <rect x={440} y={720} width={40} height={40} />
                                                                <rect x={480} y={720} width={40} height={40} />
                                                                <rect x={640} y={720} width={40} height={40} />
                                                                <rect x={720} y={720} width={40} height={40} />
                                                                <rect x={800} y={720} width={40} height={40} />
                                                                <rect x={880} y={720} width={40} height={40} />
                                                                <rect x={920} y={720} width={40} height={40} />
                                                                <rect x={960} y={720} width={40} height={40} />
                                                                <rect x={320} y={760} width={40} height={40} />
                                                                <rect x={400} y={760} width={40} height={40} />
                                                                <rect x={480} y={760} width={40} height={40} />
                                                                <rect x={600} y={760} width={40} height={40} />
                                                                <rect x={640} y={760} width={40} height={40} />
                                                                <rect x={800} y={760} width={40} height={40} />
                                                                <rect x={920} y={760} width={40} height={40} />
                                                                <rect x={960} y={760} width={40} height={40} />
                                                                <rect x={440} y={800} width={40} height={40} />
                                                                <rect x={480} y={800} width={40} height={40} />
                                                                <rect x={520} y={800} width={40} height={40} />
                                                                <rect x={640} y={800} width={40} height={40} />
                                                                <rect x={680} y={800} width={40} height={40} />
                                                                <rect x={720} y={800} width={40} height={40} />
                                                                <rect x={760} y={800} width={40} height={40} />
                                                                <rect x={800} y={800} width={40} height={40} />
                                                                <rect x={840} y={800} width={40} height={40} />
                                                                <rect x={320} y={840} width={40} height={40} />
                                                                <rect x={360} y={840} width={40} height={40} />
                                                                <rect x={400} y={840} width={40} height={40} />
                                                                <rect x={480} y={840} width={40} height={40} />
                                                                <rect x={520} y={840} width={40} height={40} />
                                                                <rect x={560} y={840} width={40} height={40} />
                                                                <rect x={680} y={840} width={40} height={40} />
                                                                <rect x={720} y={840} width={40} height={40} />
                                                                <rect x={800} y={840} width={40} height={40} />
                                                                <rect x={840} y={840} width={40} height={40} />
                                                                <rect x={880} y={840} width={40} height={40} />
                                                                <rect x={920} y={840} width={40} height={40} />
                                                                <rect x={960} y={840} width={40} height={40} />
                                                                <rect x={320} y={880} width={40} height={40} />
                                                                <rect x={360} y={880} width={40} height={40} />
                                                                <rect x={400} y={880} width={40} height={40} />
                                                                <rect x={440} y={880} width={40} height={40} />
                                                                <rect x={480} y={880} width={40} height={40} />
                                                                <rect x={520} y={880} width={40} height={40} />
                                                                <rect x={720} y={880} width={40} height={40} />
                                                                <rect x={800} y={880} width={40} height={40} />
                                                                <rect x={880} y={880} width={40} height={40} />
                                                                <rect x={920} y={880} width={40} height={40} />
                                                                <rect x={360} y={920} width={40} height={40} />
                                                                <rect x={400} y={920} width={40} height={40} />
                                                                <rect x={680} y={920} width={40} height={40} />
                                                                <rect x={800} y={920} width={40} height={40} />
                                                                <rect x={880} y={920} width={40} height={40} />
                                                                <rect x={320} y={960} width={40} height={40} />
                                                                <rect x={400} y={960} width={40} height={40} />
                                                                <rect x={480} y={960} width={40} height={40} />
                                                                <rect x={560} y={960} width={40} height={40} />
                                                                <rect x={680} y={960} width={40} height={40} />
                                                                <rect x={760} y={960} width={40} height={40} />
                                                                <rect x={800} y={960} width={40} height={40} />
                                                                <rect x={840} y={960} width={40} height={40} />
                                                                <rect x={880} y={960} width={40} height={40} />
                                                                <rect x={920} y={960} width={40} height={40} />
                                                                <rect x={960} y={960} width={40} height={40} />
                                                                <rect
                                                                    className="cls-1"
                                                                    x={42}
                                                                    y={42}
                                                                    width={196}
                                                                    height={196}
                                                                ></rect>
                                                                <path
                                                                    d="M1954.8-120h-238V160h280V-120Zm0,238h-196V-78h196Z"
                                                                    transform="translate(-1716.8 120)"
                                                                />
                                                                <rect
                                                                    className="cls-1"
                                                                    x={762}
                                                                    y={42}
                                                                    width={196}
                                                                    height={196}
                                                                ></rect>
                                                                <path
                                                                    d="M2674.8-120h-238V160h280V-120Zm0,238h-196V-78h196Z"
                                                                    transform="translate(-1716.8 120)"
                                                                />
                                                                <rect
                                                                    className="cls-1"
                                                                    x={42}
                                                                    y={762}
                                                                    width={196}
                                                                    height={196}
                                                                ></rect>
                                                                <path
                                                                    d="M1954.8,600h-238V880h280V600Zm0,238h-196V642h196Z"
                                                                    transform="translate(-1716.8 120)"
                                                                />
                                                                <rect x={80} y={80} width={120} height={120} />
                                                                <rect x={800} y={80} width={120} height={120} />
                                                                <rect x={80} y={800} width={120} height={120} />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flip-card__back">
                                                <img
                                                    src={card?.tertemiz}
                                                    className="flip-card__bg"
                                                    alt={card?.title}
                                                />
                                                <div className="flip-card__logo">
                                                    <img
                                                        decoding="async"
                                                        src={logoPreview || ""}
                                                        alt=""
                                                        style={{ display: logoPreview ? "block" : "none" }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                id="urundetay"
                                className="product__right js-validate-form"
                            >
                                <input
                                    type="hidden"
                                    name="_token"
                                />
                                <div className="circle">
                                    <span className="circle__item circle__item--md" />
                                    <span className="circle__item circle__item--lg" />
                                    <span className="circle__item circle__item--xl" />
                                </div>
                                <div className="product__right__title txt txt--px28 txt--font700 c-tertiary mb-2">
                                    <h1>{card?.title}</h1>
                                </div>
                                <input type="hidden" name="product" />
                                <div className="product__right__buttons">
                                    <div className="product__right__button__count">
                                        <div
                                            className="product__right__button__minus js-minus urun-azalt"
                                            id="azalt"
                                        >
                                            <span className="icon icon-font" data-icon-id="iconMinus">
                                                <svg viewBox="0 0 18 2" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M0.75 0C0.335786 0 0 0.335786 0 0.75C0 1.16421 0.335786 1.5 0.75 1.5H16.75C17.1642 1.5 17.5 1.16421 17.5 0.75C17.5 0.335786 17.1642 0 16.75 0H0.75Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="product__right__button__input">
                                            <input
                                                className="productNumber"
                                                type="number"
                                                id="number"
                                                name="number"
                                                defaultValue={1}
                                                size={2}
                                            />
                                            <span>Quantity</span>
                                        </div>
                                        <div
                                            className="product__right__button__plus js-plus urun-artir"
                                            id="artir"
                                        >
                                            <span className="icon icon-font" data-icon-id="iconPlus">
                                                <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.5 0.75C9.5 0.335786 9.16421 0 8.75 0C8.33579 0 8 0.335786 8 0.75L8 8H0.75C0.335786 8 0 8.33579 0 8.75C0 9.16421 0.335786 9.5 0.75 9.5H8V16.75C8 17.1642 8.33579 17.5 8.75 17.5C9.16421 17.5 9.5 17.1642 9.5 16.75V9.5H16.75C17.1642 9.5 17.5 9.16421 17.5 8.75C17.5 8.33579 17.1642 8 16.75 8H9.5L9.5 0.75Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="btn btn--secondary btn--green js-valid-form"
                                        onclick="sepeteat(this)"
                                    >
                                        <div className="btn-icon">
                                            <span className="icon icon-font" data-icon-id="iconBasket">
                                                <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M7.35926 6.66667C7.84952 2.90466 11.0659 0 14.9612 0C18.8565 0 22.0733 2.90498 22.5633 6.66667L23.4466 6.66667C24.7742 6.66662 25.8751 6.66659 26.7392 6.78731C27.6475 6.91423 28.4637 7.19446 29.0844 7.88795C29.7051 8.58145 29.8935 9.42358 29.9193 10.3404C29.9439 11.2124 29.8222 12.3066 29.6756 13.626L29.2651 17.3208C28.9584 20.0813 28.7175 22.2493 28.3084 23.9344C27.889 25.6616 27.2653 27.0096 26.1073 28.046C24.9483 29.0834 23.533 29.5538 21.7605 29.7796C20.0299 30 17.8324 30 15.0326 30H14.8899C12.0901 30 9.89257 30 8.16198 29.7796C6.38947 29.5538 4.97416 29.0834 3.81512 28.046C2.65718 27.0096 2.03346 25.6616 1.6141 23.9344C1.20497 22.2493 0.964087 20.0812 0.657379 17.3207L0.246859 13.6261C0.100212 12.3066 -0.0213977 11.2124 0.00317355 10.3404C0.0290049 9.42358 0.217392 8.58145 0.838098 7.88795C1.4588 7.19446 2.27499 6.91423 3.18331 6.78731C4.04732 6.66659 5.14824 6.66662 6.47582 6.66667L7.35926 6.66667ZM9.38243 6.66667H20.5399C20.0676 4.01399 17.7496 2 14.9612 2C12.1729 2 9.85454 4.01427 9.38243 6.66667ZM3.46007 8.76807C2.77918 8.86321 2.50263 9.02708 2.32835 9.2218C2.15407 9.41651 2.02174 9.70946 2.00238 10.3967C1.98221 11.1125 2.08593 12.0669 2.24278 13.4785L2.63723 17.0287C2.9536 19.8759 3.18225 21.9164 3.55764 23.4625C3.92631 24.9809 4.4085 25.893 5.14896 26.5557C5.88831 27.2175 6.85234 27.5966 8.41469 27.7956C10.0043 27.9981 12.0745 28 14.9612 28C17.8479 28 19.9182 27.9981 21.5078 27.7956C23.0701 27.5966 24.0341 27.2175 24.7735 26.5557C25.514 25.893 25.9962 24.9809 26.3648 23.4625C26.7402 21.9164 26.9689 19.8759 27.2852 17.0287L27.6797 13.4785C27.8365 12.0669 27.9403 11.1125 27.9201 10.3967C27.9007 9.70946 27.7684 9.41651 27.5941 9.2218C27.4198 9.02708 27.1433 8.86321 26.4624 8.76807C25.7531 8.66897 24.7932 8.66667 23.3729 8.66667H6.54961C5.1293 8.66667 4.16931 8.66897 3.46007 8.76807Z"
                                                    ></path>
                                                    <path d="M22.9614 13C22.9614 13.7364 22.3645 14.3333 21.6281 14.3333C20.8917 14.3333 20.2948 13.7364 20.2948 13C20.2948 12.2636 20.8917 11.6667 21.6281 11.6667C22.3645 11.6667 22.9614 12.2636 22.9614 13Z"></path>
                                                    <path d="M9.62809 13C9.62809 13.7364 9.03114 14.3333 8.29476 14.3333C7.55838 14.3333 6.96143 13.7364 6.96143 13C6.96143 12.2636 7.55838 11.6667 8.29476 11.6667C9.03114 11.6667 9.62809 12.2636 9.62809 13Z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                        <div className="btn-txt">Add to card</div>
                                    </div>
                                </div>
                                <div className="product__right__total">
                                    <div className="txt txt--px20 txt--font400">Total</div>
                                    <input
                                        type="hidden"
                                        name="total"
                                        id="total"
                                        defaultValue={2499}
                                    />
                                    <div className="txt txt--px48 txt--font700 c-primary total-price">
                                        69.99 $
                                    </div>
                                </div>
                                <div className="product__right__accordion">
                                    <div className="accordion-item opened active">
                                        <div className="accordion-header js-accordion-trigger active">
                                            <div className="accordion-header__title txt--px20 txt--font400">
                                                Card Details
                                            </div>
                                        </div>
                                        <div
                                            className="accordion-content"
                                            style={{ height: "648.391px" }}
                                        >
                                            <div className="accordion-calc txt txt--sm">
                                                <div className="input-column">
                                                    <div className="input-item input-item--valued">
                                                        <input
                                                            className="vname js-card-name-input js-disable-space isimyeri"
                                                            type="text"
                                                            required=""
                                                            aria-invalid="false"
                                                            value={fullName}
                                                            onChange={(e) => setFullName(e.target.value)}
                                                        />
                                                        <span className="input-item__placeholder">
                                                            Name Surname <strong>*</strong>
                                                        </span>
                                                    </div>
                                                    <div className="input-info txt txt--px20 txt--font400 c-secondary">

                                                        Will appear on the front of the card.
                                                    </div>
                                                </div>
                                                <div className="input-column">
                                                    <label
                                                        className="input-item js-cv-upload"
                                                        htmlFor="logo-0"
                                                    >
                                                        <span className="input-item__placeholder">
                                                            Logo <strong />
                                                        </span>
                                                        <span
                                                            className="upload-icon icon icon-font"
                                                            data-icon-id="iconUpload"
                                                        >
                                                            <svg
                                                                viewBox="0 0 28 28"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M7.62377 25.9179L7.44778 27.0291L7.44778 27.0291L7.62377 25.9179ZM2.08208 20.3762L3.19323 20.2002L2.08208 20.3762ZM25.9179 20.3762L27.0291 20.5522L27.0291 20.5522L25.9179 20.3762ZM20.3762 25.9179L20.5522 27.0291L20.5522 27.0291L20.3762 25.9179ZM25.5667 11.991C25.1935 11.4942 24.4883 11.394 23.9915 11.7672C23.4947 12.1403 23.3945 12.8455 23.7676 13.3423L25.5667 11.991ZM4.23236 13.3423C4.60551 12.8455 4.50528 12.1403 4.0085 11.7672C3.51171 11.394 2.80648 11.4942 2.43333 11.991L4.23236 13.3423ZM12.875 20.6667C12.875 21.288 13.3787 21.7917 14 21.7917C14.6213 21.7917 15.125 21.288 15.125 20.6667H12.875ZM7.78514 6.63438C7.39912 7.12123 7.48086 7.82884 7.96771 8.21486C8.45457 8.60088 9.16217 8.51914 9.54819 8.03229L7.78514 6.63438ZM10.5305 4.98271L9.64894 4.28375L9.64894 4.28375L10.5305 4.98271ZM17.4695 4.98271L18.3511 4.28375L17.4695 4.98271ZM18.4518 8.03229C18.8378 8.51914 19.5454 8.60088 20.0323 8.21486C20.5191 7.82884 20.6009 7.12123 20.2149 6.63438L18.4518 8.03229ZM13.6658 2.02652L13.4888 0.915532L13.4888 0.915532L13.6658 2.02652ZM14.3342 2.02652L14.5112 0.915533L14.5112 0.915532L14.3342 2.02652ZM24.875 16.6667V18H27.125V16.6667H24.875ZM18 24.875H10V27.125H18V24.875ZM3.125 18V16.6667H0.875V18H3.125ZM10 24.875C8.71834 24.875 8.20848 24.8715 7.79976 24.8068L7.44778 27.0291C8.07549 27.1285 8.80432 27.125 10 27.125V24.875ZM0.875 18C0.875 19.1957 0.871509 19.9245 0.970928 20.5522L3.19323 20.2002C3.12849 19.7915 3.125 19.2817 3.125 18H0.875ZM7.79976 24.8068C5.42852 24.4312 3.56879 22.5715 3.19323 20.2002L0.970928 20.5522C1.49898 23.8862 4.11379 26.501 7.44778 27.0291L7.79976 24.8068ZM24.875 18C24.875 19.2817 24.8715 19.7915 24.8068 20.2002L27.0291 20.5522C27.1285 19.9245 27.125 19.1957 27.125 18H24.875ZM18 27.125C19.1957 27.125 19.9245 27.1285 20.5522 27.0291L20.2002 24.8068C19.7915 24.8715 19.2817 24.875 18 24.875V27.125ZM24.8068 20.2002C24.4312 22.5715 22.5715 24.4312 20.2002 24.8068L20.5522 27.0291C23.8862 26.501 26.501 23.8862 27.0291 20.5522L24.8068 20.2002ZM27.125 16.6667C27.125 14.9139 26.5449 13.2934 25.5667 11.991L23.7676 13.3423C24.4633 14.2684 24.875 15.4178 24.875 16.6667H27.125ZM3.125 16.6667C3.125 15.4178 3.53675 14.2684 4.23236 13.3423L2.43333 11.991C1.45511 13.2934 0.875 14.9139 0.875 16.6667H3.125ZM15.125 20.6667V3.33333H12.875V20.6667H15.125ZM9.54819 8.03229L11.412 5.68166L9.64894 4.28375L7.78514 6.63438L9.54819 8.03229ZM16.588 5.68166L18.4518 8.03229L20.2149 6.63438L18.3511 4.28375L16.588 5.68166ZM11.412 5.68166C12.1722 4.72284 12.6838 4.08046 13.1129 3.64973C13.5369 3.22403 13.7401 3.15386 13.8428 3.13751L13.4888 0.915532C12.6856 1.04349 12.0644 1.51413 11.5188 2.06181C10.9782 2.60445 10.375 3.368 9.64894 4.28375L11.412 5.68166ZM18.3511 4.28375C17.625 3.368 17.0218 2.60445 16.4812 2.06181C15.9356 1.51413 15.3144 1.0435 14.5112 0.915533L14.1572 3.13751C14.2599 3.15386 14.4631 3.22403 14.8872 3.64973C15.3162 4.08046 15.8278 4.72284 16.588 5.68166L18.3511 4.28375ZM13.8428 3.13751C13.8954 3.12912 13.9479 3.125 14 3.125L14 0.875C13.8289 0.875 13.6581 0.888559 13.4888 0.915532L13.8428 3.13751ZM14 3.125C14.0521 3.125 14.1046 3.12912 14.1572 3.13751L14.5112 0.915532C14.3419 0.888559 14.1711 0.875 14 0.875L14 3.125ZM15.125 3.33333V2H12.875V3.33333H15.125Z"></path>
                                                            </svg>
                                                        </span>
                                                        <input
                                                            className="cv-upload"
                                                            type="file"
                                                            id="logo-0"
                                                            onChange={handleLogoChange}
                                                        />
                                                    </label>
                                                    <div className="input-info txt txt--px20 txt--font400 c-secondary">
                                                        Formats: svg, eps, pdf, png, jpg
                                                    </div>
                                                </div>
                                                <div className="input-column">
                                                    <div className="input-radios">
                                                        <label className="custom-radio black">
                                                            <input
                                                                data-color="black"
                                                                type="radio"
                                                                defaultChecked="checked"
                                                                name="renk[0]"
                                                            />
                                                            <span className="custom-radio__checkmark" />
                                                            <div className="custom-radio__wrapper">
                                                                <div className="custom-radio__color" />
                                                                <div className="txt txt--px20 txt--font400">

                                                                    Laser Printing
                                                                </div>
                                                            </div>
                                                        </label>
                                                    </div>   <div className="product__right__buttons mb-5">
                                                        <div className="product__right__button__count">
                                                            <div
                                                                className="product__right__button__minus js-minus urun-azalt"
                                                                id="azalt"
                                                            >
                                                                <span className="icon icon-font" data-icon-id="iconMinus">
                                                                    <svg viewBox="0 0 18 2" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M0.75 0C0.335786 0 0 0.335786 0 0.75C0 1.16421 0.335786 1.5 0.75 1.5H16.75C17.1642 1.5 17.5 1.16421 17.5 0.75C17.5 0.335786 17.1642 0 16.75 0H0.75Z"></path>
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            <div className="product__right__button__input">
                                                                <input
                                                                    className="productNumber"
                                                                    type="number"
                                                                    id="number"
                                                                    name="number"
                                                                    defaultValue={1}
                                                                    size={2}
                                                                />
                                                                <span>Quantity</span>
                                                            </div>
                                                            <div
                                                                className="product__right__button__plus js-plus urun-artir"
                                                                id="artir"
                                                            >
                                                                <span className="icon icon-font" data-icon-id="iconPlus">
                                                                    <svg viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M9.5 0.75C9.5 0.335786 9.16421 0 8.75 0C8.33579 0 8 0.335786 8 0.75L8 8H0.75C0.335786 8 0 8.33579 0 8.75C0 9.16421 0.335786 9.5 0.75 9.5H8V16.75C8 17.1642 8.33579 17.5 8.75 17.5C9.16421 17.5 9.5 17.1642 9.5 16.75V9.5H16.75C17.1642 9.5 17.5 9.16421 17.5 8.75C17.5 8.33579 17.1642 8 16.75 8H9.5L9.5 0.75Z"></path>
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="btn btn--secondary btn--green js-valid-form"
                                                            onclick="sepeteat(this)"
                                                        >
                                                            <div className="btn-icon">
                                                                <span className="icon icon-font" data-icon-id="iconBasket">
                                                                    <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                                                                        <path
                                                                            fillRule="evenodd"
                                                                            clipRule="evenodd"
                                                                            d="M7.35926 6.66667C7.84952 2.90466 11.0659 0 14.9612 0C18.8565 0 22.0733 2.90498 22.5633 6.66667L23.4466 6.66667C24.7742 6.66662 25.8751 6.66659 26.7392 6.78731C27.6475 6.91423 28.4637 7.19446 29.0844 7.88795C29.7051 8.58145 29.8935 9.42358 29.9193 10.3404C29.9439 11.2124 29.8222 12.3066 29.6756 13.626L29.2651 17.3208C28.9584 20.0813 28.7175 22.2493 28.3084 23.9344C27.889 25.6616 27.2653 27.0096 26.1073 28.046C24.9483 29.0834 23.533 29.5538 21.7605 29.7796C20.0299 30 17.8324 30 15.0326 30H14.8899C12.0901 30 9.89257 30 8.16198 29.7796C6.38947 29.5538 4.97416 29.0834 3.81512 28.046C2.65718 27.0096 2.03346 25.6616 1.6141 23.9344C1.20497 22.2493 0.964087 20.0812 0.657379 17.3207L0.246859 13.6261C0.100212 12.3066 -0.0213977 11.2124 0.00317355 10.3404C0.0290049 9.42358 0.217392 8.58145 0.838098 7.88795C1.4588 7.19446 2.27499 6.91423 3.18331 6.78731C4.04732 6.66659 5.14824 6.66662 6.47582 6.66667L7.35926 6.66667ZM9.38243 6.66667H20.5399C20.0676 4.01399 17.7496 2 14.9612 2C12.1729 2 9.85454 4.01427 9.38243 6.66667ZM3.46007 8.76807C2.77918 8.86321 2.50263 9.02708 2.32835 9.2218C2.15407 9.41651 2.02174 9.70946 2.00238 10.3967C1.98221 11.1125 2.08593 12.0669 2.24278 13.4785L2.63723 17.0287C2.9536 19.8759 3.18225 21.9164 3.55764 23.4625C3.92631 24.9809 4.4085 25.893 5.14896 26.5557C5.88831 27.2175 6.85234 27.5966 8.41469 27.7956C10.0043 27.9981 12.0745 28 14.9612 28C17.8479 28 19.9182 27.9981 21.5078 27.7956C23.0701 27.5966 24.0341 27.2175 24.7735 26.5557C25.514 25.893 25.9962 24.9809 26.3648 23.4625C26.7402 21.9164 26.9689 19.8759 27.2852 17.0287L27.6797 13.4785C27.8365 12.0669 27.9403 11.1125 27.9201 10.3967C27.9007 9.70946 27.7684 9.41651 27.5941 9.2218C27.4198 9.02708 27.1433 8.86321 26.4624 8.76807C25.7531 8.66897 24.7932 8.66667 23.3729 8.66667H6.54961C5.1293 8.66667 4.16931 8.66897 3.46007 8.76807Z"
                                                                        ></path>
                                                                        <path d="M22.9614 13C22.9614 13.7364 22.3645 14.3333 21.6281 14.3333C20.8917 14.3333 20.2948 13.7364 20.2948 13C20.2948 12.2636 20.8917 11.6667 21.6281 11.6667C22.3645 11.6667 22.9614 12.2636 22.9614 13Z"></path>
                                                                        <path d="M9.62809 13C9.62809 13.7364 9.03114 14.3333 8.29476 14.3333C7.55838 14.3333 6.96143 13.7364 6.96143 13C6.96143 12.2636 7.55838 11.6667 8.29476 11.6667C9.03114 11.6667 9.62809 12.2636 9.62809 13Z"></path>
                                                                    </svg>
                                                                </span>
                                                            </div>
                                                            <div className="btn-txt">Add to Cart</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="product__right__infos">
                                    <div
                                        className="product__right__info"
                                        data-tippy-content="Tüm siparişleriniz Türkiye’nin her yerine ücretsiz kargo!(Türkiye dışındaki ülkeler hariç)"
                                    >
                                        <div
                                            className="product__right__info__icon icon icon-font"
                                            data-icon-id="iconTruck"
                                        >
                                            <svg viewBox="0 0 46 33" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M0.0497864 3.22601C0.0497864 2.76727 0.0497864 2.35292 0.0497864 1.93857C0.0497864 0.443947 0.468961 0 1.91439 0C6.46749 0 11.0206 0 15.5737 0C19.8377 0 24.1162 0 28.3802 0C29.9413 0 30.346 0.41435 30.346 2.04215C30.346 3.44798 30.346 4.86861 30.346 6.27444C30.346 6.49641 30.3604 6.70359 30.3749 6.99955C31.0687 6.99955 31.7192 6.99955 32.3696 6.99955C33.2947 6.99955 34.2053 6.99955 35.1304 6.99955C37.79 6.99955 37.313 6.85157 38.9608 8.77534C40.9554 11.0839 42.9501 13.422 44.9304 15.7453C45.3206 16.1892 45.6531 16.6924 46 17.1659C46 20.7915 46 24.417 46 28.0426C45.6675 28.9157 45.0316 29.2117 44.1499 29.1525C43.4994 29.1081 42.8345 29.1673 42.1841 29.1377C41.7215 29.1229 41.5481 29.3152 41.3168 29.7148C40.8398 30.5139 40.3195 31.3722 39.6112 31.9197C38.9029 32.4673 37.92 32.6596 37.0672 33C36.8071 33 36.5469 33 36.2723 33C36.2144 32.9704 36.1566 32.926 36.0988 32.9112C34.0607 32.5856 32.6876 31.461 31.9215 29.4928C31.8492 29.3152 31.5312 29.1525 31.3289 29.1525C25.6917 29.1377 20.0545 29.1377 14.4029 29.1229C14.0126 29.1229 13.8247 29.2709 13.6946 29.6408C13.1743 31.0762 12.1769 32.0677 10.7749 32.6152C10.3557 32.778 9.90762 32.8668 9.45953 33C9.15599 33 8.85245 33 8.53446 33C8.11528 32.8816 7.69611 32.7928 7.29139 32.63C5.88932 32.0825 4.87752 31.1058 4.34271 29.6704C4.19817 29.2709 3.99581 29.1081 3.57664 29.1229C2.85392 29.1525 2.13121 29.1525 1.40849 29.1229C0.512324 29.0933 0.049787 28.6049 0.00642413 27.6874C-0.00803017 27.2879 0.00642413 26.8883 0.00642413 26.3852L0.0497864 3.22601ZM27.7153 26.4888C27.7298 26.178 27.7442 25.9265 27.7442 25.6897C27.7442 18.2906 27.7442 10.8767 27.7587 3.47758C27.7587 2.81166 27.5563 2.66368 26.9348 2.66368C19.1006 2.67848 11.2663 2.67848 3.41764 2.66368C2.78165 2.66368 2.62265 2.85605 2.62265 3.49238C2.63711 10.8915 2.63711 18.3054 2.63711 25.7045C2.63711 25.9413 2.65156 26.178 2.66601 26.4C3.95245 26.622 3.99581 26.5776 4.53062 25.5565C5.54242 23.6179 7.13239 22.6117 9.28608 22.7152C11.3386 22.8188 12.8274 23.9139 13.6513 25.8377C13.8681 26.3408 14.0849 26.4888 14.6053 26.4888C18.7247 26.474 22.8298 26.474 26.9492 26.474C27.195 26.4888 27.4262 26.4888 27.7153 26.4888ZM43.3549 26.4888C43.3693 26.252 43.3982 26.1188 43.3982 26.0005C43.3982 23.47 43.4127 20.9395 43.3838 18.409C43.3838 18.113 43.1959 17.7726 43.008 17.5359C40.8976 15.0498 38.7873 12.5785 36.6336 10.122C36.4313 9.8852 36.0554 9.70762 35.7519 9.69283C34.1764 9.64843 32.6009 9.69283 31.0253 9.66323C30.4472 9.64843 30.346 9.8704 30.346 10.4031C30.3605 15.5233 30.3604 20.6583 30.3604 25.7785C30.3604 26.0005 30.3749 26.2076 30.3894 26.5036C30.6929 26.5036 30.9531 26.474 31.1988 26.5036C31.6469 26.548 31.8926 26.4 32.0661 25.9265C32.7888 24.0027 34.6389 22.73 36.6481 22.7152C38.7006 22.7004 40.5796 23.9435 41.3313 25.8969C41.5192 26.3852 41.7504 26.5628 42.2419 26.5184C42.5888 26.4592 42.9357 26.4888 43.3549 26.4888ZM9.08372 30.3215C10.3991 30.2919 11.4976 29.1377 11.4831 27.8058C11.4687 26.474 10.3268 25.3345 9.0259 25.3641C7.72502 25.3789 6.59758 26.548 6.62649 27.865C6.64095 29.1969 7.78284 30.3363 9.08372 30.3215ZM39.1198 27.8058C39.1053 26.4444 38.0068 25.3197 36.677 25.3493C35.3472 25.3789 34.292 26.5036 34.3065 27.8798C34.3209 29.1969 35.4195 30.3067 36.7203 30.3067C38.0501 30.3067 39.1198 29.1821 39.1198 27.8058Z"></path>
                                            </svg>
                                        </div>
                                        <div className="product__right__info__content txt txt--px20 txt--font400">

                                            Free <span className="txt--font700">Shipping</span>
                                        </div>
                                    </div>
                                    <div
                                        className="product__right__info"
                                        data-tippy-content="Üretilen QR'da kullanım sınırı ve zaman kısıtlaması yoktur."
                                    >
                                        <div
                                            className="product__right__info__icon icon icon-font"
                                            data-icon-id="iconAnindaHazir"
                                        >
                                            <svg
                                                version={1.0}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="512.000000pt"
                                                height="512.000000pt"
                                                viewBox="0 0 512.000000 512.000000"
                                                preserveAspectRatio="xMidYMid meet"
                                            >
                                                <g
                                                    transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                                                    stroke="none"
                                                >
                                                    <path d="M3287 4824 c-162 -29 -321 -102 -452 -208 -44 -35 -294 -279 -556 -543 -379 -381 -487 -495 -532 -563 -49 -74 -66 -92 -139 -139 -68 -44 -178 -149 -594 -565 -548 -547 -586 -592 -655 -757 -57 -138 -73 -227 -73 -394 1 -129 4 -164 27 -249 95 -354 363 -618 722 -712 84 -22 122 -26 235 -26 150 -1 225 12 362 62 168 61 223 104 556 434 167 166 310 313 318 328 18 35 18 62 -2 104 -27 56 -102 81 -157 53 -12 -6 -152 -141 -312 -299 -159 -158 -312 -302 -338 -319 -222 -150 -516 -167 -763 -45 -39 19 -101 60 -138 90 -293 242 -360 653 -160 987 28 46 156 181 488 515 l451 453 6 -108 c3 -59 12 -134 19 -167 l12 -58 -344 -347 c-367 -370 -378 -383 -413 -517 -44 -169 13 -355 147 -479 68 -63 143 -101 241 -122 116 -24 262 3 356 66 75 50 892 872 931 937 64 106 84 238 55 362 -20 84 -52 144 -123 232 -69 83 -87 134 -79 214 6 61 24 100 68 151 l31 35 60 -32 c237 -126 404 -448 373 -718 -7 -56 -10 -64 -38 -79 -61 -32 -134 -110 -163 -174 l-29 -62 0 -805 0 -805 28 -60 c36 -78 104 -146 181 -182 l61 -28 805 0 805 0 61 28 c77 36 145 104 181 182 l28 60 0 805 0 805 -28 60 c-47 100 -126 169 -227 199 -46 14 -129 16 -584 16 l-530 0 395 398 c341 341 403 409 448 482 194 320 197 715 7 1033 -212 355 -624 544 -1029 471z m317 -238 c151 -29 272 -94 387 -206 239 -235 294 -592 137 -894 -40 -76 -69 -108 -503 -544 l-460 -463 -6 94 c-4 51 -12 126 -19 166 l-13 72 345 347 c308 309 349 354 376 412 95 203 50 429 -114 580 -121 110 -283 152 -443 115 -137 -33 -152 -45 -609 -499 -233 -232 -439 -445 -459 -474 -48 -74 -74 -153 -80 -247 -9 -134 31 -248 125 -362 74 -89 86 -117 86 -198 0 -49 -5 -81 -18 -105 -22 -42 -75 -100 -92 -100 -28 0 -164 102 -227 170 -74 80 -145 209 -173 315 -52 202 -14 433 101 611 45 68 930 964 1043 1055 175 140 397 196 616 155z m-89 -574 c47 -24 96 -73 121 -122 26 -51 24 -162 -3 -215 -12 -22 -153 -171 -315 -333 l-294 -293 -39 58 c-49 74 -183 209 -257 258 -32 21 -58 41 -58 44 0 4 134 140 298 303 329 327 334 331 447 324 35 -2 77 -12 100 -24z m-1760 -1619 c49 -75 184 -209 258 -258 l58 -39 -293 -294 c-299 -300 -328 -324 -415 -338 -92 -14 -207 48 -256 140 -29 54 -30 174 -3 226 17 32 592 620 607 620 3 0 23 -26 44 -57z m2807 -231 l33 -32 0 -770 0 -770 -33 -32 -32 -33 -770 0 -770 0 -32 33 -33 32 0 769 0 769 25 27 c14 15 34 31 45 36 11 4 361 7 777 6 l758 -2 32 -33z"></path>
                                                    <path d="M3155 2031 c-11 -5 -31 -21 -45 -36 l-25 -27 0 -289 0 -289 33 -32 c28 -28 39 -33 82 -33 43 0 54 5 82 33 l33 32 3 205 3 205 200 0 199 0 0 -199 0 -199 -85 -3 c-80 -4 -86 -6 -117 -37 -28 -28 -33 -39 -33 -82 0 -43 5 -54 33 -82 l32 -33 325 -3 325 -3 0 -119 0 -119 -205 -3 -205 -3 -32 -33 c-28 -28 -33 -39 -33 -82 0 -43 5 -54 33 -82 l32 -33 290 0 290 0 32 33 33 32 0 290 0 290 -33 32 -32 33 -205 3 -205 3 0 200 0 199 119 0 119 0 3 -85 c4 -80 6 -86 37 -117 28 -28 39 -33 82 -33 43 0 54 5 82 33 l33 32 0 170 0 170 -33 32 -32 33 -598 2 c-328 1 -606 -2 -617 -6z"></path>
                                                    <path d="M3155 1151 c-11 -5 -31 -21 -45 -36 -25 -26 -25 -29 -25 -196 l0 -169 33 -32 32 -33 170 0 170 0 32 33 c28 28 33 39 33 82 0 43 -5 54 -33 82 -31 31 -37 33 -116 36 l-84 4 -4 84 c-3 78 -5 86 -34 115 -33 33 -92 46 -129 30z"></path>
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="product__right__info__content txt txt--px20 txt--font400">

                                            Free <span className="txt--font700">QR</span>
                                        </div>
                                    </div>
                                    <div
                                        className="product__right__info"
                                        data-tippy-content="Bir uygulamaya ihtiyaç duymadan herhangi bir akıllı telefonda kolayca çalışır."
                                    >
                                        <div
                                            className="product__right__info__icon icon icon-font"
                                            data-icon-id="iconPhoneapp"
                                        >
                                            <svg viewBox="0 0 47 48" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M7.74072 43.0362C7.74072 30.4065 7.74072 17.7769 7.74072 5.14727C7.76109 5.10653 7.80184 5.07597 7.81202 5.03523C8.35184 2.66208 10.0222 1.31764 12.4361 1.31764C15.0129 1.31764 17.6 1.31764 20.1768 1.31764C24.0166 1.31764 27.8667 1.30745 31.7065 1.31764C33.6417 1.32782 35.037 2.2343 35.8722 3.97597C36.0454 4.34264 36.137 4.75004 36.2592 5.14727C36.2592 17.7769 36.2592 30.4065 36.2592 43.0362C36.2287 43.1278 36.1879 43.2195 36.1676 43.3213C35.7398 45.0324 34.7009 46.163 33.0102 46.6926C32.8167 46.7537 32.6231 46.8047 32.4296 46.8658C25.4833 46.8658 18.5268 46.8658 11.5704 46.8658C11.5602 46.8556 11.55 46.8352 11.5398 46.8352C9.4722 46.3973 8.20924 45.1445 7.77128 43.0769C7.77128 43.0565 7.75091 43.0463 7.74072 43.0362ZM9.52313 24.0612C9.52313 30.0806 9.52313 36.1 9.52313 42.1195C9.52313 44.0139 10.6028 45.0936 12.5074 45.0936C18.8222 45.0936 25.1268 45.0936 31.4417 45.0936C33.4074 45.0936 34.4667 44.0343 34.4667 42.0787C34.4667 30.101 34.4667 18.1232 34.4667 6.14542C34.4667 5.98245 34.4667 5.81949 34.4565 5.65653C34.3954 4.45467 33.55 3.42597 32.3685 3.2019C31.8694 3.11023 31.3398 3.12042 30.8204 3.1306C30.6574 3.1306 30.4333 3.26301 30.3417 3.4056C29.7407 4.3019 29.1704 5.22875 28.6 6.14542C28.3657 6.52227 28.05 6.68523 27.6018 6.68523C23.8639 6.67505 20.1157 6.67505 16.3778 6.68523C15.9296 6.68523 15.6139 6.52227 15.3796 6.14542C14.9416 5.42227 14.4324 4.73986 14.0454 3.99634C13.6889 3.30375 13.2305 3.07967 12.4463 3.11023C10.6129 3.18153 9.52313 4.2306 9.52313 6.07412C9.52313 12.0528 9.52313 18.0519 9.52313 24.0612ZM15.675 3.15097C16.0315 3.71116 16.337 4.22042 16.6833 4.71949C16.7444 4.80097 16.9074 4.8519 17.0296 4.8519C20.35 4.86208 23.6805 4.86208 27.0009 4.8519C27.1129 4.8519 27.2861 4.80097 27.337 4.71949C27.6731 4.22042 27.9889 3.71116 28.3352 3.15097C24.0981 3.15097 19.9324 3.15097 15.675 3.15097Z"></path>
                                                <path d="M16.2047 8.79358C17.4676 8.79358 18.7306 8.79358 19.9936 8.79358C20.788 8.79358 21.1139 9.10932 21.1139 9.88339C21.1139 11.2278 21.1139 12.5825 21.1139 13.9269C21.1139 14.7112 20.788 15.0167 19.9936 15.0167C17.4676 15.0167 14.9417 15.0167 12.4158 15.0167C11.6213 15.0167 11.2954 14.701 11.2954 13.9269C11.2954 12.5825 11.2954 11.2278 11.2954 9.88339C11.2954 9.09913 11.6213 8.79358 12.4158 8.79358C13.6787 8.79358 14.9417 8.79358 16.2047 8.79358Z"></path>
                                                <path d="M16.2047 9C17.3839 9 18.563 9 19.7422 9C20.484 9 20.7883 9.29479 20.7883 10.0175C20.7883 11.2728 20.7883 12.5375 20.7883 13.7928C20.7883 14.525 20.484 14.8103 19.7422 14.8103C17.3839 14.8103 15.0255 14.8103 12.6671 14.8103C11.9254 14.8103 11.6211 14.5155 11.6211 13.7928C11.6211 12.5375 11.6211 11.2728 11.6211 10.0175C11.6211 9.28528 11.9254 9 12.6671 9C13.8463 9 15.0255 9 16.2047 9Z"></path>
                                                <path d="M27.7955 15.0269C26.5325 15.0269 25.2696 15.0269 24.0066 15.0269C23.2122 15.0269 22.8862 14.7111 22.8862 13.937C22.8862 12.5926 22.8862 11.238 22.8862 9.89353C22.8862 9.12964 23.202 8.80371 23.9557 8.80371C26.5122 8.80371 29.0686 8.80371 31.6149 8.80371C32.3686 8.80371 32.6844 9.12964 32.6844 9.89353C32.6844 11.238 32.6844 12.5926 32.6844 13.937C32.6844 14.7213 32.3584 15.0269 31.564 15.0269C30.3214 15.0269 29.0584 15.0269 27.7955 15.0269Z"></path>
                                                <path d="M27.7955 27.4834C26.5325 27.4834 25.2696 27.4834 24.0066 27.4834C23.2122 27.4834 22.8862 27.1677 22.8862 26.3936C22.8862 25.0492 22.8862 23.6945 22.8862 22.3501C22.8862 21.5862 23.202 21.2603 23.9557 21.2603C26.5122 21.2603 29.0686 21.2603 31.6149 21.2603C32.3686 21.2603 32.6844 21.5862 32.6946 22.3501C32.6946 23.6945 32.6946 25.0492 32.6946 26.3936C32.6946 27.1779 32.3686 27.4834 31.5742 27.4834C30.3214 27.4834 29.0585 27.4834 27.7955 27.4834Z"></path>
                                                <path d="M16.2047 27.4834C14.9417 27.4834 13.6787 27.4834 12.4158 27.4834C11.6213 27.4834 11.2954 27.1677 11.2954 26.3936C11.2954 25.0492 11.2954 23.6945 11.2954 22.3501C11.2954 21.5862 11.6112 21.2603 12.3649 21.2603C14.9213 21.2603 17.4778 21.2603 20.0241 21.2603C20.7778 21.2603 21.0936 21.5862 21.1038 22.3501C21.1038 23.6945 21.1038 25.0492 21.1038 26.3936C21.1038 27.1779 20.7778 27.4834 19.9834 27.4834C18.7306 27.4834 17.4676 27.4834 16.2047 27.4834Z"></path>
                                                <path d="M16.2047 42.4556C14.9417 42.4556 13.6787 42.4556 12.4158 42.4556C11.6213 42.4556 11.2954 42.0074 11.2954 40.8972C11.2954 38.9722 11.2954 37.0472 11.2954 35.112C11.2954 34.012 11.6112 33.5537 12.3649 33.5537C14.9213 33.5537 17.4778 33.5537 20.0241 33.5537C20.7778 33.5537 21.0936 34.0222 21.1038 35.112C21.1038 37.037 21.1038 38.9621 21.1038 40.8972C21.1038 42.0176 20.7778 42.4556 19.9834 42.4658C18.7306 42.4556 17.4676 42.4556 16.2047 42.4556Z"></path>
                                                <path d="M16.1946 18.5815C14.9214 18.5815 13.6381 18.5815 12.3649 18.5815C11.7131 18.5815 11.3158 18.2352 11.3057 17.6954C11.3057 17.1556 11.7029 16.7991 12.3446 16.7991C14.9112 16.7991 17.4881 16.7991 20.0547 16.7991C20.7066 16.7991 21.1038 17.1454 21.114 17.6852C21.114 18.225 20.7066 18.5815 20.0649 18.5815C18.7714 18.5917 17.4779 18.5815 16.1946 18.5815Z"></path>
                                                <path d="M27.7956 16.7991C29.0687 16.7991 30.352 16.7991 31.6252 16.7991C32.277 16.7991 32.6844 17.1352 32.6946 17.675C32.7048 18.2352 32.2974 18.5917 31.6252 18.5917C29.0687 18.5917 26.5122 18.5917 23.9659 18.5917C23.2937 18.5917 22.8761 18.2352 22.8965 17.675C22.9067 17.1352 23.3141 16.8093 23.9659 16.8093C25.2391 16.7991 26.5122 16.7991 27.7956 16.7991Z"></path>
                                                <path d="M16.1844 31.038C14.8603 31.038 13.5362 31.0482 12.2223 31.038C11.6825 31.038 11.3057 30.6408 11.3057 30.1519C11.3057 29.6528 11.6825 29.2862 12.2223 29.2556C12.2631 29.2556 12.314 29.2556 12.3547 29.2556C14.9214 29.2556 17.4983 29.2556 20.0649 29.2556C20.7066 29.2556 21.114 29.6121 21.114 30.1519C21.114 30.6917 20.7066 31.0482 20.0649 31.0482C18.7714 31.038 17.4779 31.038 16.1844 31.038Z"></path>
                                                <path d="M27.8363 29.2455C29.0993 29.2455 30.3622 29.2455 31.6252 29.2455C32.277 29.2455 32.6844 29.5816 32.6946 30.1214C32.7048 30.6816 32.2974 31.0381 31.6252 31.0381C29.0687 31.0381 26.5122 31.0381 23.9659 31.0381C23.2937 31.0381 22.8761 30.6816 22.8965 30.1214C22.9067 29.5816 23.3141 29.2557 23.9659 29.2557C25.2492 29.2455 26.5428 29.2455 27.8363 29.2455Z"></path>
                                                <path d="M27.7955 35.3056C26.5224 35.3056 25.2391 35.3056 23.9659 35.3056C23.2937 35.3056 22.8761 34.9492 22.8965 34.389C22.9067 33.8492 23.3141 33.5131 23.9659 33.5131C26.5224 33.5131 29.0789 33.5131 31.6252 33.5131C32.2974 33.5131 32.715 33.8695 32.7048 34.4297C32.6946 34.9695 32.2872 35.3056 31.6353 35.3056C30.352 35.3056 29.0687 35.3056 27.7955 35.3056Z"></path>
                                                <path d="M25.9622 38.8602C25.2594 38.8602 24.5668 38.8704 23.864 38.8602C23.2631 38.85 22.8659 38.4732 22.8862 37.9436C22.8964 37.4343 23.2835 37.0778 23.864 37.0778C25.29 37.0676 26.7159 37.0676 28.1418 37.0778C28.7224 37.0778 29.1094 37.4343 29.1298 37.9436C29.14 38.4732 28.7427 38.85 28.152 38.8602C27.4187 38.8704 26.6955 38.8602 25.9622 38.8602Z"></path>
                                                <path d="M29.5779 42.425C28.8649 42.425 28.1519 42.4352 27.439 42.425C26.8381 42.4149 26.4408 42.038 26.4612 41.5084C26.4714 40.9991 26.8584 40.6426 27.439 40.6426C28.8649 40.6325 30.2908 40.6325 31.7168 40.6426C32.2973 40.6426 32.6843 40.9991 32.7047 41.5084C32.7149 42.038 32.3177 42.4149 31.7269 42.425C31.0038 42.425 30.2908 42.425 29.5779 42.425Z"></path>
                                                <path d="M32.6947 37.9844C32.6845 38.4835 32.2669 38.8807 31.7679 38.8705C31.2891 38.8501 30.9021 38.4529 30.9021 37.9742C30.9021 37.4751 31.3299 37.0779 31.829 37.0881C32.3179 37.0983 32.7049 37.5057 32.6947 37.9844Z"></path>
                                                <path d="M23.7621 40.6427C24.2408 40.6325 24.6483 41.0195 24.6788 41.488C24.6992 41.9871 24.302 42.4149 23.8029 42.4251C23.3038 42.4353 22.8862 42.0279 22.8862 41.5288C22.8862 41.0501 23.2834 40.6528 23.7621 40.6427Z"></path>
                                                <rect
                                                    x="45.5173"
                                                    y="0.569298"
                                                    width={2}
                                                    height="64.1891"
                                                    rx={1}
                                                    transform="rotate(45 45.5173 0.569298)"
                                                    stroke="white"
                                                    strokeWidth="0.5"
                                                ></rect>
                                            </svg>
                                        </div>
                                        <div className="product__right__info__content txt txt--px20 txt--font400">

                                            Application <span className="txt--font700">Not Required </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="product__other">
                    <div className="container">
                        <div className="product__other__wrapper">
                            <div className="product__other__item">
                                <div className="product__other__icon">
                                    <div className="icon icon-font" data-icon-id="iconHeight">
                                        <svg viewBox="0 0 72 71" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M60.2047 4.03211C62.2381 4.02304 63.6352 4.0191 64.6994 4.13532C65.0453 4.17309 65.3343 4.22176 65.5798 4.28059L44.126 25.7344C43.5348 26.3256 43.5348 27.2841 44.126 27.8753C44.7172 28.4665 45.6758 28.4665 46.267 27.8753L67.7208 6.42156C67.7796 6.66702 67.8283 6.95607 67.866 7.30193C67.9822 8.36617 67.9783 9.76328 67.9692 11.7967L67.9469 16.8069C67.9431 17.643 68.6179 18.3238 69.454 18.3276C70.2901 18.3313 70.9709 17.6565 70.9746 16.8204L70.9974 11.72C71.006 9.7989 71.013 8.22882 70.8759 6.97323C70.7333 5.6676 70.4193 4.51166 69.6495 3.51697C69.4829 3.30165 69.3031 3.0972 69.1113 2.90476C68.9145 2.70741 68.7052 2.5227 68.4844 2.35182C67.4897 1.58204 66.3337 1.26802 65.0281 1.12543C63.7725 0.988317 62.2025 0.995351 60.2814 1.00396L55.1809 1.02671C54.3448 1.03044 53.6701 1.71125 53.6738 2.54734C53.6775 3.38343 54.3583 4.05819 55.1944 4.05446L60.2047 4.03211Z"></path>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M64.9738 1.62252C63.7528 1.48918 62.2154 1.49534 60.2837 1.50399L55.1831 1.52675C54.6232 1.52925 54.1713 1.9852 54.1738 2.54515C54.1763 3.1051 54.6322 3.55701 55.1922 3.55451L60.2024 3.53216C62.2238 3.52314 63.6545 3.51828 64.7537 3.63831C65.1151 3.67779 65.4257 3.72954 65.6963 3.7944L66.565 4.00258L44.4796 26.088C44.0836 26.4839 44.0836 27.1259 44.4796 27.5218C44.8755 27.9178 45.5175 27.9178 45.9134 27.5218L67.9988 5.43644L68.207 6.30507C68.2718 6.5757 68.3236 6.88626 68.3631 7.24769C68.4831 8.34684 68.4782 9.7776 68.4692 11.7989L68.4469 16.8092C68.4444 17.3691 68.8963 17.8251 69.4562 17.8276C70.0162 17.8301 70.4721 17.3782 70.4746 16.8182L70.4974 11.7178C70.506 9.78604 70.5122 8.24857 70.3789 7.02756C70.2412 5.76678 69.9443 4.71484 69.2541 3.82302C69.1002 3.62422 68.9343 3.43546 68.7571 3.25779C68.5755 3.07559 68.3822 2.90505 68.1784 2.74728C67.2865 2.05711 66.2346 1.7602 64.9738 1.62252ZM60.3073 0.503877C62.2053 0.495371 63.7986 0.488231 65.0824 0.62843C66.4329 0.775911 67.6928 1.10705 68.7904 1.95645C69.0281 2.14043 69.2536 2.33932 69.4654 2.55181C69.6719 2.75902 69.8655 2.97916 70.0449 3.211C70.8943 4.30856 71.2255 5.5685 71.373 6.91899C71.5132 8.20288 71.506 9.79627 71.4975 11.6944L71.4746 16.8227C71.4697 17.9349 70.564 18.8326 69.4518 18.8276C68.3395 18.8226 67.4419 17.917 67.4469 16.8047L67.4692 11.7945C67.478 9.82271 67.4812 8.48468 67.3807 7.46877L46.6205 28.2289C45.8341 29.0154 44.5589 29.0154 43.7725 28.2289C42.986 27.4424 42.986 26.1673 43.7725 25.3808L64.5326 4.6207C63.5167 4.52022 62.1787 4.52335 60.2069 4.53215L55.1967 4.5545C54.0844 4.55946 53.1788 3.66185 53.1738 2.54962C53.1688 1.43739 54.0665 0.531722 55.1787 0.52676L60.3073 0.503877Z"
                                            ></path>
                                            <path d="M11.7963 67.3116C9.76292 67.3207 8.36581 67.3247 7.30156 67.2084C6.9557 67.1707 6.66665 67.122 6.42118 67.0632L27.8749 45.6094C28.4662 45.0182 28.4662 44.0596 27.8749 43.4684C27.2837 42.8772 26.3252 42.8772 25.734 43.4684L4.28022 64.9222C4.2214 64.6767 4.17272 64.3877 4.13495 64.0418C4.01873 62.9776 4.02267 61.5805 4.03174 59.5471L4.05409 54.5368C4.05783 53.7007 3.38306 53.0199 2.54697 53.0162C1.71088 53.0125 1.03008 53.6872 1.02635 54.5233L1.00359 59.6238C0.99498 61.5449 0.987951 63.1149 1.12507 64.3705C1.26765 65.6762 1.58167 66.8321 2.35146 67.8268C2.51809 68.0421 2.69788 68.2465 2.88971 68.439C3.08643 68.6363 3.2958 68.821 3.5166 68.9919C4.51129 69.7617 5.66723 70.0757 6.97287 70.2183C8.22844 70.3554 9.79851 70.3484 11.7195 70.3398L16.8201 70.317C17.6562 70.3133 18.3309 69.6325 18.3272 68.7964C18.3235 67.9603 17.6426 67.2856 16.8066 67.2893L11.7963 67.3116Z"></path>
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M7.02715 69.7212C8.24814 69.8546 9.78561 69.8484 11.7173 69.8398L16.8178 69.817C17.3778 69.8145 17.8297 69.3585 17.8272 68.7986C17.8247 68.2386 17.3687 67.7867 16.8088 67.7892L11.7985 67.8116C9.77719 67.8206 8.34643 67.8255 7.24728 67.7054C6.88585 67.666 6.57529 67.6142 6.30465 67.5494L5.43603 67.3412L27.5214 45.2558C27.9173 44.8598 27.9173 44.2179 27.5214 43.8219C27.1254 43.426 26.4835 43.426 26.0875 43.8219L4.00217 65.9073L3.79399 65.0387C3.72913 64.7681 3.67737 64.4575 3.6379 64.0961C3.51787 62.9969 3.52273 61.5662 3.53175 59.5448L3.5541 54.5346C3.5566 53.9746 3.10469 53.5186 2.54474 53.5162C1.98479 53.5137 1.52884 53.9656 1.52634 54.5255L1.50358 59.626C1.49493 61.5577 1.48877 63.0952 1.62211 64.3162C1.7598 65.577 2.0567 66.6289 2.74688 67.5207C2.90073 67.7195 3.06672 67.9083 3.24383 68.086C3.42545 68.2682 3.61875 68.4387 3.82261 68.5965C4.71443 69.2866 5.76637 69.5835 7.02715 69.7212ZM11.6936 70.8399C9.79566 70.8484 8.20239 70.8555 6.91858 70.7153C5.56809 70.5678 4.30814 70.2367 3.21059 69.3873C2.97284 69.2033 2.74741 69.0044 2.5356 68.7919C2.32905 68.5847 2.13546 68.3646 1.95604 68.1328C1.10664 67.0352 0.775507 65.7753 0.628023 64.4248C0.487817 63.1409 0.49496 61.5475 0.503468 59.6493L0.526351 54.521C0.531313 53.4088 1.43698 52.5112 2.5492 52.5162C3.66143 52.5211 4.55905 53.4268 4.55409 54.539L4.53174 59.5493C4.52294 61.521 4.51981 62.8591 4.62029 63.875L25.3804 43.1148C26.1669 42.3284 27.442 42.3284 28.2285 43.1148C29.015 43.9013 29.015 45.1764 28.2285 45.9629L7.46836 66.723C8.48428 66.8235 9.82231 66.8204 11.7941 66.8116L16.8043 66.7893C17.9166 66.7843 18.8222 67.6819 18.8272 68.7941C18.8321 69.9064 17.9345 70.812 16.8223 70.817L11.6936 70.8399Z"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="product__other__title txt txt--px28 txt--font700 c-primary">
                                    <h4>Dimensions</h4>
                                </div>
                                <div className="product__other__txt txt txt--px20 txt--font400 c-secondary">
                                    <p>
                                        Our NFC cards are standard <br />
                                        8.6 x 5.4 x 0.01 cm in size.{" "}
                                    </p>
                                </div>
                            </div>
                            <div className="product__other__item">
                                <div className="product__other__icon">
                                    <div className="icon icon-font" data-icon-id="iconPackage">
                                        <svg viewBox="0 0 65 71" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M32.5 0C34.9877 0 37.4322 0.655644 39.5896 1.90191L57.9056 12.527L57.9067 12.5276C60.0595 13.7812 61.848 15.5808 63.093 17.7472C64.3382 19.914 64.9959 22.3716 65 24.8744V46.1241C64.9958 48.6274 64.3381 51.0855 63.0929 53.2528C61.8478 55.4197 60.0593 57.2199 57.9063 58.4743L57.9054 58.4748L39.5897 69.0966C37.4326 70.3438 34.9879 71 32.5 71C30.0121 71 27.5674 70.3438 25.4103 69.0966L7.09462 58.4748L7.09345 58.4741C4.9406 57.2198 3.15212 55.4196 1.90714 53.2528C0.66204 51.0857 0.00429539 48.628 0 46.125V24.8736C0.00421681 22.3711 0.661938 19.9137 1.90703 17.7472C3.15209 15.5807 4.94147 13.7806 7.09442 12.527L25.4109 1.90165C27.5681 0.655551 30.0125 0 32.5 0ZM55.9054 16.0727L37.5692 5.43898C36.0284 4.54526 34.28 4.07446 32.5 4.07446C30.72 4.07446 28.9716 4.54523 27.4308 5.43898L9.09462 16.0727L9.07736 16.0836C8.56011 16.4121 8.07415 16.7877 7.62561 17.2056L6.62485 18.1379L26.632 29.7412C28.4161 30.7746 30.4398 31.3187 32.5 31.3187C34.5602 31.3187 36.5844 30.7743 38.3685 29.7409L58.3751 18.1379L57.3744 17.2056C56.9258 16.7877 56.4399 16.4121 55.9226 16.0836L55.9054 16.0727ZM9.11088 54.9354L9.1122 54.9361L27.448 65.5727L27.4657 65.582C28.0078 65.8686 28.5756 66.1037 29.1616 66.284L30.4762 66.6884V35.2443L29.6377 35.096C27.8704 34.7835 26.1694 34.1682 24.6091 33.2768L24.6065 33.2754L4.59543 21.6697L4.28876 23.0137C4.15233 23.6117 4.07184 24.221 4.04832 24.8339L4.04758 24.8534L4.04758 46.1206C4.04917 47.9056 4.5173 49.6593 5.40558 51.2061C6.29388 52.7531 7.57139 54.0392 9.11088 54.9354ZM59.5944 51.2061C60.4827 49.6593 60.9508 47.9056 60.9524 46.1206V24.8534L60.9517 24.8339C60.9282 24.221 60.8477 23.6117 60.7112 23.0137L60.4046 21.6697L40.3935 33.2754L40.3909 33.2768C38.8306 34.1682 37.1296 34.7835 35.3623 35.096L34.5238 35.2443V66.6884L35.8384 66.284C36.4244 66.1037 36.9922 65.8687 37.5343 65.582L37.552 65.5727L55.8878 54.9361L55.8891 54.9354C57.4286 54.0392 58.7061 52.7531 59.5944 51.2061Z"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="product__other__title txt txt--px28 txt--font700 c-primary">
                                    <h4>Package</h4>
                                </div>
                                <div className="product__other__txt txt txt--px20 txt--font400 c-secondary">
                                    <p>
                                        Shipping in packages which made from 100% recycled materials.
                                    </p>
                                </div>
                            </div>
                            <div className="product__other__item">
                                <div className="product__other__icon">
                                    <div className="icon icon-font" data-icon-id="iconGeriDonusum">
                                        <svg viewBox="0 0 71 71" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M32.1544 4.90364C31.1311 5.47202 30.2697 6.29178 29.6518 7.28551L25.3573 14.2519C25.0596 14.6697 24.6146 14.9606 24.1108 15.0657C23.5989 15.1725 23.0655 15.0792 22.6206 14.8053C22.1756 14.5313 21.8531 14.0978 21.7189 13.594C21.5868 13.0981 21.647 12.5708 21.8871 12.1176L26.1779 5.15715C27.168 3.5794 28.5432 2.27842 30.1747 1.37633C31.8073 0.473627 33.6429 0 35.5091 0C37.3754 0 39.211 0.473627 40.8436 1.37633C42.4749 2.27837 43.85 3.57923 44.8402 5.15685L44.8424 5.16036L58.9755 28.127L60.7932 18.3917C60.8923 17.8603 61.1987 17.3895 61.6456 17.0832C62.0926 16.7768 62.6433 16.6603 63.1766 16.7594C63.7099 16.8584 64.1815 17.165 64.488 17.611C64.7944 18.057 64.9108 18.6061 64.8118 19.1376L63.2907 27.2495L63.2905 27.2505C62.944 29.1097 61.9582 30.7898 60.5029 32.0006C59.0486 33.2107 57.2167 33.8759 55.3235 33.8814C55.3295 33.8812 55.3191 33.8799 55.2883 33.8759C55.2314 33.8685 55.105 33.8522 54.8849 33.818C54.5854 33.7715 54.1844 33.7043 53.7137 33.6226C52.7735 33.4594 51.5726 33.2414 50.3872 33.0228C49.2025 32.8044 48.036 32.5858 47.1654 32.4219C46.7302 32.3399 46.3691 32.2716 46.1168 32.2238L45.7352 32.1514C45.217 32.0359 44.7644 31.7235 44.4731 31.2807C44.1798 30.8347 44.0733 30.2919 44.1764 29.7686C44.2795 29.2453 44.584 28.7828 45.025 28.4808C45.4636 28.1805 46.0023 28.0628 46.5264 28.1527L55.2488 29.872L41.3506 7.28941L41.3482 7.28551C40.7303 6.29178 39.8689 5.47202 38.8456 4.90364C37.8223 4.33527 36.6708 4.03702 35.5 4.03702C34.3292 4.03702 33.1778 4.33527 32.1544 4.90364Z"></path>
                                            <path d="M66.4022 40.1813L69.3615 44.9808C70.3883 46.644 70.9531 48.5509 70.9972 50.5042C71.0413 52.4574 70.5635 54.3872 69.6127 56.095C68.662 57.8027 67.2727 59.2268 65.5877 60.2205C63.9033 61.2139 61.9842 61.7412 60.0279 61.7483H34.913L40.7034 67.4529L40.7156 67.4641C40.9164 67.6493 41.0779 67.8728 41.1905 68.1213C41.3032 68.3699 41.3647 68.6384 41.3714 68.9111C41.3782 69.1837 41.33 69.455 41.2298 69.7088C41.1296 69.9625 40.9794 70.1937 40.788 70.3886C40.5965 70.5835 40.3678 70.7381 40.1153 70.8431C39.8628 70.9481 39.5916 71.0015 39.318 71C39.0444 70.9984 38.7739 70.9421 38.5226 70.8342C38.2713 70.7263 38.0443 70.5692 37.855 70.3722L37.8447 70.3615L32.7188 65.3336C31.9819 64.6049 31.3984 63.7364 31.0028 62.7793C30.607 61.822 30.4071 60.7953 30.4149 59.7597V59.6577C30.4506 57.6589 31.265 55.7517 32.6849 54.3416L37.8265 49.2279C38.2116 48.8603 38.7257 48.6571 39.2591 48.6625C39.7951 48.6679 40.3072 48.8833 40.6853 49.262C41.0634 49.6406 41.2772 50.1521 41.281 50.6862C41.2849 51.2178 41.0805 51.73 40.7113 52.1135L35.1376 57.6711H60.0259C61.2536 57.6789 62.4607 57.355 63.5195 56.7336C64.577 56.1129 65.4473 55.2184 66.0381 54.1445C66.6488 53.0684 66.9577 51.8477 66.9321 50.6108C66.9064 49.3725 66.5464 48.1643 65.8903 47.1137L65.8882 47.1103L62.932 42.3157L62.9164 42.2932C62.7583 42.0656 62.6483 41.8083 62.5932 41.5371C62.538 41.2658 62.5388 40.9861 62.5955 40.7151C62.6522 40.4441 62.7636 40.1875 62.9229 39.9608C63.0823 39.7341 63.2863 39.5421 63.5226 39.3966C63.7589 39.2512 64.0224 39.1553 64.2972 39.1148C64.5719 39.0744 64.852 39.0904 65.1204 39.1617C65.3888 39.233 65.6397 39.3581 65.8578 39.5294C66.076 39.7007 66.2568 39.9145 66.3894 40.1578L66.4022 40.1813Z"></path>
                                            <path d="M19.0554 21.6821L19.0586 21.6843C19.9486 22.2845 20.7098 23.0559 21.2978 23.9532C21.8858 24.8505 22.2887 25.8557 22.4832 26.9102L24.005 35.026C24.1046 35.5575 23.9887 36.1068 23.6826 36.5533C23.3765 36.9997 22.905 37.3068 22.3717 37.4064C21.8384 37.5061 21.2874 37.39 20.84 37.084C20.3926 36.7781 20.0857 36.3075 19.9861 35.7759L18.154 25.9548L5.12092 47.1103L5.119 47.1133C4.46276 48.1641 4.10272 49.3724 4.07704 50.6108C4.05139 51.8477 4.36033 53.0686 4.97112 54.1447C5.56083 55.2164 6.42877 56.1095 7.48354 56.73C8.53981 57.3514 9.7443 57.6765 10.97 57.6711H20.5306C21.0727 57.6711 21.5924 57.8862 21.9753 58.2687C22.3582 58.6511 22.5731 59.1695 22.5731 59.7097C22.5731 60.25 22.3582 60.7684 21.9753 61.1508C21.5924 61.5332 21.0727 61.7483 20.5306 61.7483H10.9694C9.01329 61.7408 7.09455 61.213 5.41049 60.2195C3.72586 59.2256 2.33696 57.8014 1.38658 56.0938C0.436194 54.3861 -0.0414078 52.4565 0.00281447 50.5035C0.0470368 48.5504 0.612004 46.6435 1.63872 44.9805L14.3724 24.3098L5.70542 26.0138L5.69584 26.0159C5.43025 26.0736 5.1558 26.0777 4.88858 26.0282C4.62135 25.9786 4.36678 25.8763 4.13974 25.7274C3.91271 25.5784 3.71779 25.3858 3.56635 25.1608C3.4149 24.9358 3.30995 24.683 3.25758 24.4172C3.20521 24.1513 3.20646 23.8777 3.26126 23.6124C3.31605 23.347 3.42331 23.0952 3.5768 22.8716C3.7303 22.648 3.92697 22.4572 4.15536 22.3103C4.38376 22.1634 4.63926 22.0634 4.90693 22.0163L4.91678 22.0146L12.9255 20.4386L12.9277 20.4382C13.9807 20.2286 15.0649 20.2306 16.117 20.4442C17.1692 20.6578 18.1681 21.0786 19.0554 21.6821Z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="product__other__title txt txt--px28 txt--font700 c-primary">
                                    <h4>Recycble</h4>
                                </div>
                                <div className="product__other__txt txt txt--px20 txt--font400 c-secondary">
                                    <p>High-polished finish on stainless steel.</p>
                                </div>
                            </div>
                            <div className="product__other__item">
                                <div className="product__other__icon">
                                    <div className="icon icon-font" data-icon-id="iconISO">
                                        <svg viewBox="0 40 65 70" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M28.0759 79.1L24.4557 74.6L22.7848 73.7L20.557 74.9L20 76.4L20.557 78.2L26.4051 85.1L28.9114 86L41.7215 72.2L42 70.7L41.7215 68.9L40.3291 68H38.6582L28.0759 79.1Z"></path>
                                            <path d="M28.0759 79.1L24.4557 74.6L22.7848 73.7L20.557 74.9L20 76.4L20.557 78.2L26.4051 85.1L28.9114 86L41.7215 72.2L42 70.7L41.7215 68.9L40.3291 68H38.6582L28.0759 79.1Z"></path>
                                            <path d="M24.4976 48.278C21.3976 51.2439 20.5659 51.6341 16.1049 52.1024C9.37561 52.8049 7.56098 54.678 6.88049 61.6244C6.42683 66.2293 6.04878 67.0878 3.17561 70.2878C0.604878 73.1756 0 74.4244 0 76.8439C0 79.8098 2.49512 84.4927 5.51951 87.0683C6.42683 87.7707 6.80488 89.3317 6.80488 92.3756C6.80488 96.2 7.10732 96.9805 9.37561 99.322C11.6439 101.663 12.4 101.976 16.1049 101.976C19.0537 101.976 20.5659 102.366 21.2463 103.302C23.5902 106.19 28.278 109 30.7732 109C33.8732 109 35.7634 108.063 39.5439 104.629C41.9634 102.366 42.8707 101.976 46.1976 101.976C49.6 101.976 50.3561 101.663 52.6244 99.322C54.8927 96.9805 55.1951 96.2 55.1951 92.6878C55.1951 89.2537 55.5732 88.3171 57.7659 85.8195C61.0927 81.9171 62 79.9659 62 76.7659C62 74.1902 59.2781 69.3512 56.4805 66.9317C55.5732 66.2293 55.1951 64.6683 55.1951 61.6244C55.1951 57.8 54.8927 57.0195 52.6244 54.678C50.3561 52.3366 49.6 52.0244 45.8951 52.0244C42.9463 52.0244 41.4341 51.6341 40.7537 50.6976C38.2585 47.5756 33.722 45 30.8488 45C28.5049 45 27.2951 45.6244 24.4976 48.278ZM35.2341 52.1024C38.0317 55.2244 41.4341 56.7073 45.5927 56.7073C49.5244 56.7073 50.6585 57.722 50.6585 61.3902C50.6585 65.9171 51.9439 69.1171 55.1951 72.7854C56.8585 74.6585 58.2195 76.5317 58.2195 76.922C58.2195 77.3122 56.7073 79.4195 54.8927 81.6829C51.6415 85.6634 50.6585 88.161 50.6585 92.922C50.6585 96.0439 49.4488 97.2927 46.4244 97.2927C41.8122 97.2927 39.3927 98.3073 35.5366 101.663C33.3439 103.537 31.3024 105.098 30.9244 105.098C30.5463 105.098 28.7317 103.693 26.9171 101.976C23.3634 98.6195 20.2634 97.2927 15.878 97.2927C12.3244 97.2927 11.3415 96.122 11.3415 92.0634C11.3415 87.7707 9.90488 84.2585 6.88049 81.3707C3.78049 78.3268 3.78049 75.6732 6.88049 72.6293C10.1317 69.5073 11.3415 66.6976 11.3415 62.639C11.3415 60.5317 11.7951 58.6585 12.5512 57.9561C13.2317 57.1756 15.0463 56.7073 17.0878 56.7073C21.0195 56.7073 23.7415 55.4585 26.7659 52.1024C29.7146 48.9024 32.2854 48.9024 35.2341 52.1024Z"></path>
                                        </svg>
                                    </div>
                                </div>
                                <div className="product__other__title txt txt--px28 txt--font700 c-primary">
                                    <h4>ISO 27001 Certificate</h4>
                                </div>
                                <div className="product__other__txt txt txt--px20 txt--font400 c-secondary">
                                    <p>
                                        Your personal data privacy is important to us. We secure all digital
                                        assets.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="product__features">
                    <div className="container">
                        <div className="product__features__wrapper">
                            <div className="product__features__left">
                                <div className="txt txt--px48 txt--font400 c-primary">
                                    <h2>
                                        About   <span className="txt--font700">Product</span>
                                    </h2>
                                </div>
                            </div>
                            <div className="product__features__right">
                                <div className="txt txt--px22 txt--font400 c-secondary">
                                    <h3>
                                        <strong>
                                            Metal Golden Digital Business Card with Durable and Prestigious
                                            Representation
                                        </strong>
                                    </h3>
                                    <p>&nbsp;</p>
                                    <p>
                                        Metal golden digital business card, durability and prestige in
                                        one professional solution. Its physical metal structure, long
                                        lasting, combines with digital business card technology.
                                    </p>
                                    <p>&nbsp;</p>
                                    <p>&nbsp;</p>
                                    <p>
                                        NFC business card and QR code business card support enables
                                        fast sharing at events, fairs and corporate meetings. The
                                        question of what is a business card is answered here with both
                                        physical quality and digital flexibility.
                                    </p>
                                    <p>&nbsp;</p>
                                    <p>&nbsp;</p>
                                    <p>
                                        Trowas is an AI-powered digital business card platform developed by DynamicNFC., based in Canada. The metallic gold digital business card is ideal for high-end corporate representation.
                                    </p>
                                    <p>&nbsp;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="product__features">
                    <div className="container">
                        <div className="product__features__wrapper">
                            <div className="txt txt--px22 txt--font400 c-secondary border">
                                <table>
                                    <thead>
                                        <tr>
                                            <th colSpan={2}>
                                                Technical <span className="txt--font700">Features</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>NFC (Near Field Communication) Technology</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>QR Code Technology</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Unlimited Publishing (Hosting), Unlimited Usage Rights</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Apple, Android and Huawei Phones Compatible</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Measurable Usage Statistics</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>200+ Countries Fast and Instant Access</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Different Language Options (Opens according to the phone's language
                                                of the person clicking the link.)
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Corporate Color Selection, Custom Profile Theme Selection</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Team Management Panel (Administrator Control over Team Member Cards)
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Share Button with WhatsApp, SMS, Email and Other Tools
                                                to Instantly Share Your Profile.
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Obtaining Contact Information from People You Contact
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Adding Profile Shortcut Button to Your Phone's Home Screen
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Obtaining Contact Information from People You Contact
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Compliance with Data Privacy Laws (GDPR, KVKK)</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Personal Information (Phone Number, WhatsApp Number,
                                                Title/Position, Email)
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Company Cover Image, Company Logo Addition</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Adding User Profile Picture</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Social Media Links</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Marketplace and E-Commerce Links
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Special Link Areas</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Company and Bank Information (Company Name, Website, Phone,
                                                Address, Invoice Information)
                                            </td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Address Location Route Sharing</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>7/24 Customer Support</td>
                                            <td>
                                                <span className="icon icon-font" data-icon-id="iconTik">
                                                    <svg
                                                        viewBox="0 0 22 18"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                        <path
                                                            d="M8.0759 11.1L4.4557 6.6L2.7848 5.7L0.556999 6.9L0 8.4L0.556999 10.2L6.4051 17.1L8.9114 18L21.7215 4.2L22 2.7L21.7215 0.900002L20.3291 0H18.6582L8.0759 11.1Z"
                                                            style={{ fill: "var(--c-primary)" }}
                                                        />
                                                    </svg>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="howto-work">
                    <div className="container">
                        <div className="howto-work__wrapper">
                            <div className="howto-work__top">
                                <div className="txt txt--px48 txt--font400 c-primary">
                                    <h4>
                                        How <span className="txt--font700">Do We Work?</span>
                                    </h4>
                                </div>
                                <div className="txt txt--px22 txt--font400 c-secondary">
                                    <p>
                                        The shopping process for orders you place from our website
                                        works briefly as follows:
                                    </p>
                                </div>
                            </div>
                            <div className="howto-work__items">
                                <div className="howto-work__item">
                                    <span className="icon icon-font" data-icon-id="iconHowtoSepet">
                                        <svg viewBox="0 0 30 29" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.51458 16.3804L3.44634 16.2769L2.51458 16.3804ZM27.4856 16.3804L26.5538 16.2769L27.4856 16.3804ZM27.8554 13.0522L28.7872 13.1557L27.8554 13.0522ZM2.14477 13.0522L3.07654 12.9486L2.14477 13.0522ZM22.5001 13.4375C23.0179 13.4375 23.4376 13.0178 23.4376 12.5C23.4376 11.9822 23.0179 11.5625 22.5001 11.5625V13.4375ZM7.50009 11.5625C6.98232 11.5625 6.56259 11.9822 6.56259 12.5C6.56259 13.0178 6.98232 13.4375 7.50009 13.4375V11.5625ZM26.9236 12.9486L26.5538 16.2769L28.4174 16.4839L28.7872 13.1557L26.9236 12.9486ZM3.44634 16.2769L3.07654 12.9486L1.21301 13.1557L1.58281 16.4839L3.44634 16.2769ZM15.0001 26.5625C12.2938 26.5625 10.353 26.5607 8.86271 26.3709C7.398 26.1843 6.49423 25.8289 5.80108 25.2085L4.55061 26.6056C5.63721 27.5782 6.96406 28.0192 8.62579 28.2309C10.262 28.4393 12.3434 28.4375 15.0001 28.4375V26.5625ZM1.58281 16.4839C1.8739 19.1037 2.1003 21.1576 2.48715 22.751C2.8803 24.3703 3.46504 25.634 4.55061 26.6056L5.80108 25.2085C5.1069 24.5872 4.65485 23.7321 4.30922 22.3086C3.9573 20.8591 3.74293 18.9462 3.44634 16.2769L1.58281 16.4839ZM26.5538 16.2769C26.2572 18.9462 26.0429 20.8591 25.691 22.3086C25.3453 23.7321 24.8933 24.5872 24.1991 25.2085L25.4496 26.6056C26.5351 25.634 27.1199 24.3703 27.513 22.751C27.8999 21.1576 28.1263 19.1037 28.4174 16.4839L26.5538 16.2769ZM15.0001 28.4375C17.6568 28.4375 19.7382 28.4393 21.3744 28.2309C23.0361 28.0192 24.363 27.5782 25.4496 26.6056L24.1991 25.2085C23.5059 25.8289 22.6022 26.1843 21.1375 26.3709C19.6472 26.5607 17.7064 26.5625 15.0001 26.5625V28.4375ZM22.886 8.4375C24.2175 8.4375 25.1175 8.43966 25.7824 8.53257C26.4208 8.62176 26.68 8.77539 26.8434 8.95794L28.2405 7.70746C27.6586 7.05731 26.8934 6.79459 26.0419 6.67561C25.2169 6.56034 24.1616 6.5625 22.886 6.5625V8.4375ZM28.7872 13.1557C28.928 11.8879 29.0467 10.8392 29.0233 10.0066C28.9991 9.14711 28.8224 8.35761 28.2405 7.70746L26.8434 8.95794C27.0068 9.14048 27.1309 9.41512 27.149 10.0594C27.1679 10.7305 27.0707 11.6252 26.9236 12.9486L28.7872 13.1557ZM7.11419 6.5625C5.83861 6.5625 4.78325 6.56034 3.95828 6.67561C3.10673 6.79459 2.34156 7.05731 1.75965 7.70746L3.15677 8.95794C3.32015 8.77539 3.57941 8.62176 4.21775 8.53257C4.88266 8.43966 5.78265 8.4375 7.11419 8.4375V6.5625ZM3.07654 12.9486C2.92949 11.6252 2.83226 10.7305 2.85117 10.0594C2.86932 9.41512 2.99338 9.14048 3.15677 8.95794L1.75965 7.70746C1.17774 8.35761 1.00113 9.14711 0.976909 10.0066C0.953448 10.8392 1.07214 11.8879 1.21301 13.1557L3.07654 12.9486ZM22.5001 11.5625H7.50009V13.4375H22.5001V11.5625ZM15.0001 2.1875C17.9341 2.1875 20.3126 4.56599 20.3126 7.5H22.1876C22.1876 3.53045 18.9696 0.3125 15.0001 0.3125V2.1875ZM21.2501 8.4375H22.886V6.5625H21.2501V8.4375ZM7.11419 8.4375H8.75009V6.5625H7.11419V8.4375ZM8.75009 8.4375H21.2501V6.5625H8.75009V8.4375ZM15.0001 0.3125C11.0305 0.3125 7.81259 3.53045 7.81259 7.5H9.68759C9.68759 4.56599 12.0661 2.1875 15.0001 2.1875V0.3125Z"></path>
                                        </svg>
                                    </span>
                                    <span className="txt txt--px20 txt--font400">Place Your Order</span>
                                </div>
                                <span className="icon icon-font" data-icon-id="iconArrow">
                                    <svg viewBox="0 0 21 14" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.33333 6.29167C0.850085 6.29167 0.458335 6.68342 0.458334 7.16667C0.458334 7.64991 0.850085 8.04167 1.33333 8.04167L1.33333 6.29167ZM20 8.04167C20.4832 8.04167 20.875 7.64992 20.875 7.16667C20.875 6.68342 20.4832 6.29167 20 6.29167L20 8.04167ZM15.9493 0.71186C15.6061 0.37168 15.052 0.374152 14.7119 0.717381C14.3717 1.06061 14.3742 1.61463 14.7174 1.95481L15.9493 0.71186ZM17.3901 3.37186L16.7742 3.99333L17.3901 3.37186ZM17.3901 10.9615L18.0061 11.5829L18.0061 11.5829L17.3901 10.9615ZM14.7174 12.3785C14.3742 12.7187 14.3717 13.2727 14.7119 13.616C15.052 13.9592 15.6061 13.9617 15.9493 13.6215L14.7174 12.3785ZM19.9768 6.80111L20.8448 6.69048L20.8448 6.69048L19.9768 6.80111ZM19.9768 7.53222L20.8448 7.64286L20.8448 7.64286L19.9768 7.53222ZM1.33333 8.04167L20 8.04167L20 6.29167L1.33333 6.29167L1.33333 8.04167ZM14.7174 1.95481L16.7742 3.99333L18.0061 2.75039L15.9493 0.71186L14.7174 1.95481ZM16.7742 10.34L14.7174 12.3785L15.9493 13.6215L18.0061 11.5829L16.7742 10.34ZM16.7742 3.99333C17.6089 4.82066 18.1815 5.39004 18.569 5.87249C18.9453 6.34113 19.0745 6.64215 19.1088 6.91175L20.8448 6.69048C20.7529 5.96935 20.4088 5.36858 19.9334 4.7767C19.4692 4.19863 18.8116 3.54875 18.0061 2.75039L16.7742 3.99333ZM18.0061 11.5829C18.8116 10.7846 19.4692 10.1347 19.9334 9.55663C20.4088 8.96475 20.7529 8.36399 20.8448 7.64286L19.1088 7.42159C19.0745 7.69118 18.9453 7.9922 18.569 8.46084C18.1815 8.94329 17.6089 9.51267 16.7742 10.34L18.0061 11.5829ZM19.1088 6.91174C19.1304 7.08103 19.1304 7.25231 19.1088 7.42159L20.8448 7.64286C20.8851 7.32666 20.8851 7.00668 20.8448 6.69048L19.1088 6.91174Z"></path>
                                    </svg>
                                </span>
                                <div className="howto-work__item">
                                    <span className="icon icon-font" data-icon-id="iconHowtoOdeme">
                                        <svg viewBox="0 0 28 22" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.91256 20.3188L5.33818 19.4835L4.91256 20.3188ZM2.18121 17.5874L3.01653 17.1618L2.18121 17.5874ZM25.8188 17.5874L24.9835 17.1618L25.8188 17.5874ZM23.0874 20.3188L22.6618 19.4835L23.0874 20.3188ZM23.0874 1.68121L22.6618 2.51653L23.0874 1.68121ZM25.8188 4.41256L26.6541 3.98694L25.8188 4.41256ZM4.91256 1.68121L5.33818 2.51653L4.91256 1.68121ZM2.18121 4.41256L1.34589 3.98694L2.18121 4.41256ZM17.75 18.1875C18.2678 18.1875 18.6875 17.7678 18.6875 17.25C18.6875 16.7322 18.2678 16.3125 17.75 16.3125V18.1875ZM12.75 16.3125C12.2322 16.3125 11.8125 16.7322 11.8125 17.25C11.8125 17.7678 12.2322 18.1875 12.75 18.1875V16.3125ZM9 18.1875C9.51777 18.1875 9.9375 17.7678 9.9375 17.25C9.9375 16.7322 9.51777 16.3125 9 16.3125V18.1875ZM6.5 16.3125C5.98223 16.3125 5.5625 16.7322 5.5625 17.25C5.5625 17.7678 5.98223 18.1875 6.5 18.1875V16.3125ZM1.51381 8.5L0.576481 8.48205L1.51381 8.5ZM26.4862 8.5L27.4235 8.48205V8.48205L26.4862 8.5ZM11.5 1.9375H16.5V0.0625H11.5V1.9375ZM16.5 20.0625H11.5V21.9375H16.5V20.0625ZM11.5 20.0625C9.73437 20.0625 8.46652 20.0618 7.47135 19.9805C6.48713 19.9 5.85246 19.7455 5.33818 19.4835L4.48694 21.1541C5.30961 21.5733 6.21849 21.7593 7.31867 21.8492C8.4079 21.9382 9.76531 21.9375 11.5 21.9375V20.0625ZM0.5625 11C0.5625 12.7347 0.561771 14.0921 0.650765 15.1813C0.740653 16.2815 0.926723 17.1904 1.34589 18.0131L3.01653 17.1618C2.75449 16.6475 2.59995 16.0129 2.51954 15.0286C2.43823 14.0335 2.4375 12.7656 2.4375 11H0.5625ZM5.33818 19.4835C4.33856 18.9741 3.52586 18.1614 3.01653 17.1618L1.34589 18.0131C2.03498 19.3655 3.13453 20.465 4.48694 21.1541L5.33818 19.4835ZM25.5625 11C25.5625 12.7656 25.5618 14.0335 25.4805 15.0286C25.4 16.0129 25.2455 16.6475 24.9835 17.1618L26.6541 18.0131C27.0733 17.1904 27.2593 16.2815 27.3492 15.1813C27.4382 14.0921 27.4375 12.7347 27.4375 11H25.5625ZM16.5 21.9375C18.2347 21.9375 19.5921 21.9382 20.6813 21.8492C21.7815 21.7593 22.6904 21.5733 23.5131 21.1541L22.6618 19.4835C22.1475 19.7455 21.5129 19.9 20.5286 19.9805C19.5335 20.0618 18.2656 20.0625 16.5 20.0625V21.9375ZM24.9835 17.1618C24.4741 18.1614 23.6614 18.9741 22.6618 19.4835L23.5131 21.1541C24.8655 20.465 25.965 19.3655 26.6541 18.0131L24.9835 17.1618ZM16.5 1.9375C18.2656 1.9375 19.5335 1.93823 20.5286 2.01954C21.5129 2.09995 22.1475 2.25449 22.6618 2.51653L23.5131 0.845891C22.6904 0.426723 21.7815 0.240653 20.6813 0.150765C19.5921 0.0617709 18.2347 0.0625 16.5 0.0625V1.9375ZM22.6618 2.51653C23.6614 3.02586 24.4741 3.83856 24.9835 4.83818L26.6541 3.98694C25.965 2.63453 24.8655 1.53498 23.5131 0.845891L22.6618 2.51653ZM11.5 0.0625C9.76531 0.0625 8.4079 0.0617709 7.31867 0.150765C6.21849 0.240653 5.30961 0.426723 4.48694 0.845891L5.33818 2.51653C5.85246 2.25449 6.48713 2.09995 7.47135 2.01954C8.46652 1.93823 9.73437 1.9375 11.5 1.9375V0.0625ZM4.48694 0.845891C3.13453 1.53498 2.03498 2.63453 1.34589 3.98694L3.01653 4.83818C3.52586 3.83856 4.33856 3.02586 5.33818 2.51653L4.48694 0.845891ZM17.75 16.3125H12.75V18.1875H17.75V16.3125ZM9 16.3125H6.5V18.1875H9V16.3125ZM2.4375 11C2.4375 10.0429 2.43754 9.22839 2.45114 8.51795L0.576481 8.48205C0.562464 9.21417 0.5625 10.0483 0.5625 11H2.4375ZM2.45114 8.51795C2.48804 6.59023 2.62906 5.59862 3.01653 4.83818L1.34589 3.98694C0.742424 5.17131 0.613247 6.56172 0.576481 8.48205L2.45114 8.51795ZM26.4862 7.5625H1.51381V9.4375H26.4862V7.5625ZM27.4375 11C27.4375 10.0483 27.4375 9.21417 27.4235 8.48205L25.5489 8.51795C25.5625 9.22839 25.5625 10.0429 25.5625 11H27.4375ZM27.4235 8.48205C27.3868 6.56172 27.2576 5.17131 26.6541 3.98694L24.9835 4.83818C25.3709 5.59862 25.512 6.59023 25.5489 8.51795L27.4235 8.48205Z"></path>
                                        </svg>
                                    </span>
                                    <span className="txt txt--px20 txt--font400">Pay</span>
                                </div>
                                <span className="icon icon-font" data-icon-id="iconArrow">
                                    <svg viewBox="0 0 21 14" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.33333 6.29167C0.850085 6.29167 0.458335 6.68342 0.458334 7.16667C0.458334 7.64991 0.850085 8.04167 1.33333 8.04167L1.33333 6.29167ZM20 8.04167C20.4832 8.04167 20.875 7.64992 20.875 7.16667C20.875 6.68342 20.4832 6.29167 20 6.29167L20 8.04167ZM15.9493 0.71186C15.6061 0.37168 15.052 0.374152 14.7119 0.717381C14.3717 1.06061 14.3742 1.61463 14.7174 1.95481L15.9493 0.71186ZM17.3901 3.37186L16.7742 3.99333L17.3901 3.37186ZM17.3901 10.9615L18.0061 11.5829L18.0061 11.5829L17.3901 10.9615ZM14.7174 12.3785C14.3742 12.7187 14.3717 13.2727 14.7119 13.616C15.052 13.9592 15.6061 13.9617 15.9493 13.6215L14.7174 12.3785ZM19.9768 6.80111L20.8448 6.69048L20.8448 6.69048L19.9768 6.80111ZM19.9768 7.53222L20.8448 7.64286L20.8448 7.64286L19.9768 7.53222ZM1.33333 8.04167L20 8.04167L20 6.29167L1.33333 6.29167L1.33333 8.04167ZM14.7174 1.95481L16.7742 3.99333L18.0061 2.75039L15.9493 0.71186L14.7174 1.95481ZM16.7742 10.34L14.7174 12.3785L15.9493 13.6215L18.0061 11.5829L16.7742 10.34ZM16.7742 3.99333C17.6089 4.82066 18.1815 5.39004 18.569 5.87249C18.9453 6.34113 19.0745 6.64215 19.1088 6.91175L20.8448 6.69048C20.7529 5.96935 20.4088 5.36858 19.9334 4.7767C19.4692 4.19863 18.8116 3.54875 18.0061 2.75039L16.7742 3.99333ZM18.0061 11.5829C18.8116 10.7846 19.4692 10.1347 19.9334 9.55663C20.4088 8.96475 20.7529 8.36399 20.8448 7.64286L19.1088 7.42159C19.0745 7.69118 18.9453 7.9922 18.569 8.46084C18.1815 8.94329 17.6089 9.51267 16.7742 10.34L18.0061 11.5829ZM19.1088 6.91174C19.1304 7.08103 19.1304 7.25231 19.1088 7.42159L20.8448 7.64286C20.8851 7.32666 20.8851 7.00668 20.8448 6.69048L19.1088 6.91174Z"></path>
                                    </svg>
                                </span>
                                <div className="howto-work__item">
                                    <span className="icon icon-font" data-icon-id="iconHowtoCheck">
                                        <svg viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M14 2.4375C7.61421 2.4375 2.4375 7.61421 2.4375 14C2.4375 20.3858 7.61421 25.5625 14 25.5625C20.3858 25.5625 25.5625 20.3858 25.5625 14C25.5625 7.61421 20.3858 2.4375 14 2.4375ZM0.5625 14C0.5625 6.57867 6.57867 0.5625 14 0.5625C21.4213 0.5625 27.4375 6.57867 27.4375 14C27.4375 21.4213 21.4213 27.4375 14 27.4375C6.57867 27.4375 0.5625 21.4213 0.5625 14ZM20.8753 9.55153C21.2611 9.8969 21.2938 10.4896 20.9485 10.8753L16.6906 15.6311C15.8958 16.519 15.2328 17.2595 14.6271 17.7687C13.9863 18.3073 13.2951 18.6875 12.4375 18.6875C11.5799 18.6875 10.8887 18.3073 10.2479 17.7687C9.64218 17.2595 8.97923 16.519 8.18442 15.6312L7.05153 14.3658C6.70617 13.98 6.73891 13.3874 7.12466 13.042C7.51041 12.6966 8.1031 12.7294 8.44847 13.1151L9.53493 14.3286C10.3883 15.2818 10.963 15.9203 11.4544 16.3333C11.9224 16.7267 12.1973 16.8125 12.4375 16.8125C12.6777 16.8125 12.9526 16.7267 13.4206 16.3333C13.912 15.9203 14.4867 15.2818 15.3401 14.3286L19.5515 9.62466C19.8969 9.23891 20.4896 9.20617 20.8753 9.55153Z"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span className="txt txt--px20 txt--font400">Print Approval</span>
                                </div>
                                <span className="icon icon-font" data-icon-id="iconArrow">
                                    <svg viewBox="0 0 21 14" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.33333 6.29167C0.850085 6.29167 0.458335 6.68342 0.458334 7.16667C0.458334 7.64991 0.850085 8.04167 1.33333 8.04167L1.33333 6.29167ZM20 8.04167C20.4832 8.04167 20.875 7.64992 20.875 7.16667C20.875 6.68342 20.4832 6.29167 20 6.29167L20 8.04167ZM15.9493 0.71186C15.6061 0.37168 15.052 0.374152 14.7119 0.717381C14.3717 1.06061 14.3742 1.61463 14.7174 1.95481L15.9493 0.71186ZM17.3901 3.37186L16.7742 3.99333L17.3901 3.37186ZM17.3901 10.9615L18.0061 11.5829L18.0061 11.5829L17.3901 10.9615ZM14.7174 12.3785C14.3742 12.7187 14.3717 13.2727 14.7119 13.616C15.052 13.9592 15.6061 13.9617 15.9493 13.6215L14.7174 12.3785ZM19.9768 6.80111L20.8448 6.69048L20.8448 6.69048L19.9768 6.80111ZM19.9768 7.53222L20.8448 7.64286L20.8448 7.64286L19.9768 7.53222ZM1.33333 8.04167L20 8.04167L20 6.29167L1.33333 6.29167L1.33333 8.04167ZM14.7174 1.95481L16.7742 3.99333L18.0061 2.75039L15.9493 0.71186L14.7174 1.95481ZM16.7742 10.34L14.7174 12.3785L15.9493 13.6215L18.0061 11.5829L16.7742 10.34ZM16.7742 3.99333C17.6089 4.82066 18.1815 5.39004 18.569 5.87249C18.9453 6.34113 19.0745 6.64215 19.1088 6.91175L20.8448 6.69048C20.7529 5.96935 20.4088 5.36858 19.9334 4.7767C19.4692 4.19863 18.8116 3.54875 18.0061 2.75039L16.7742 3.99333ZM18.0061 11.5829C18.8116 10.7846 19.4692 10.1347 19.9334 9.55663C20.4088 8.96475 20.7529 8.36399 20.8448 7.64286L19.1088 7.42159C19.0745 7.69118 18.9453 7.9922 18.569 8.46084C18.1815 8.94329 17.6089 9.51267 16.7742 10.34L18.0061 11.5829ZM19.1088 6.91174C19.1304 7.08103 19.1304 7.25231 19.1088 7.42159L20.8448 7.64286C20.8851 7.32666 20.8851 7.00668 20.8448 6.69048L19.1088 6.91174Z"></path>
                                    </svg>
                                </span>
                                <div className="howto-work__item">
                                    <span className="icon icon-font" data-icon-id="iconHowtoIsgunu">
                                        <svg viewBox="0 0 26 28" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4.32634 25.3064L4.87739 24.5479L4.32634 25.3064ZM2.94364 23.9237L3.7021 23.3726L2.94364 23.9237ZM23.0564 23.9237L22.2979 23.3726L23.0564 23.9237ZM21.6737 25.3064L22.2247 26.0648L21.6737 25.3064ZM21.6737 5.19364L22.2247 4.43519L21.6737 5.19364ZM23.0564 6.57634L22.2979 7.12739L23.0564 6.57634ZM4.32634 5.19364L4.87739 5.9521L4.32634 5.19364ZM2.94364 6.57634L3.7021 7.12739L2.94364 6.57634ZM22.0223 19.0769L21.8756 18.151L22.0223 19.0769ZM16.8269 24.2723L15.901 24.1256L16.8269 24.2723ZM15.8125 5.25C15.8125 5.76777 16.2322 6.1875 16.75 6.1875C17.2678 6.1875 17.6875 5.76777 17.6875 5.25H15.8125ZM17.6875 1.5C17.6875 0.982233 17.2678 0.5625 16.75 0.5625C16.2322 0.5625 15.8125 0.982233 15.8125 1.5H17.6875ZM8.3125 5.25C8.3125 5.76777 8.73223 6.1875 9.25 6.1875C9.76777 6.1875 10.1875 5.76777 10.1875 5.25H8.3125ZM10.1875 1.5C10.1875 0.982233 9.76777 0.5625 9.25 0.5625C8.73223 0.5625 8.3125 0.982233 8.3125 1.5H10.1875ZM24.2138 19L25.1508 19.0321L24.2138 19ZM16.75 26.4638L16.7821 27.4008L16.75 26.4638ZM13 25.5625C10.6355 25.5625 8.93749 25.5612 7.62256 25.4187C6.32517 25.2782 5.5124 25.0093 4.87739 24.5479L3.77529 26.0648C4.7832 26.7971 5.96367 27.125 7.42059 27.2828C8.85997 27.4388 10.6773 27.4375 13 27.4375V25.5625ZM0.8125 15.25C0.8125 17.5727 0.811213 19.39 0.96716 20.8294C1.12501 22.2863 1.4529 23.4668 2.18519 24.4747L3.7021 23.3726C3.24074 22.7376 2.97181 21.9248 2.83125 20.6274C2.68879 19.3125 2.6875 17.6145 2.6875 15.25H0.8125ZM4.87739 24.5479C4.42639 24.2202 4.02977 23.8236 3.7021 23.3726L2.18519 24.4747C2.62851 25.0849 3.16511 25.6215 3.77529 26.0648L4.87739 24.5479ZM22.2979 23.3726C21.9702 23.8236 21.5736 24.2202 21.1226 24.5479L22.2247 26.0648C22.8349 25.6215 23.3715 25.0849 23.8148 24.4747L22.2979 23.3726ZM25.1875 15.25C25.1875 12.9273 25.1888 11.11 25.0328 9.67059C24.875 8.21367 24.5471 7.0332 23.8148 6.02529L22.2979 7.12739C22.7593 7.7624 23.0282 8.57517 23.1687 9.87256C23.3112 11.1875 23.3125 12.8855 23.3125 15.25H25.1875ZM21.1226 5.9521C21.5736 6.27977 21.9702 6.67639 22.2979 7.12739L23.8148 6.02529C23.3715 5.41511 22.8349 4.87851 22.2247 4.43519L21.1226 5.9521ZM2.6875 15.25C2.6875 12.8855 2.68879 11.1875 2.83125 9.87256C2.97181 8.57517 3.24074 7.7624 3.7021 7.12739L2.18519 6.02529C1.4529 7.0332 1.12501 8.21367 0.96716 9.67059C0.811213 11.11 0.8125 12.9273 0.8125 15.25H2.6875ZM3.77529 4.43519C3.16511 4.87851 2.62851 5.41511 2.18519 6.02529L3.7021 7.12739C4.02977 6.67639 4.42639 6.27977 4.87739 5.9521L3.77529 4.43519ZM21.8756 18.151C18.8001 18.6381 16.3881 21.0501 15.901 24.1256L17.7529 24.4189C18.1129 22.1458 19.8958 20.3629 22.1689 20.0029L21.8756 18.151ZM10.1875 5.25V4.03616H8.3125V5.25H10.1875ZM10.1875 4.03616V1.5H8.3125V4.03616H10.1875ZM13 3.0625C11.544 3.0625 10.2928 3.06238 9.2179 3.09921L9.2821 4.97311C10.3181 4.93762 11.5337 4.9375 13 4.9375V3.0625ZM9.2179 3.09921C6.87609 3.17944 5.15487 3.43287 3.77529 4.43519L4.87739 5.9521C5.75933 5.31133 6.96344 5.05255 9.2821 4.97311L9.2179 3.09921ZM17.6875 5.25V4.03616H15.8125V5.25H17.6875ZM17.6875 4.03616V1.5H15.8125V4.03616H17.6875ZM13 4.9375C14.4663 4.9375 15.6819 4.93762 16.7179 4.97311L16.7821 3.09921C15.7072 3.06238 14.456 3.0625 13 3.0625V4.9375ZM16.7179 4.97311C19.0366 5.05255 20.2407 5.31133 21.1226 5.9521L22.2247 4.43519C20.8451 3.43287 19.1239 3.17944 16.7821 3.09921L16.7179 4.97311ZM24.2138 18.0625C23.111 18.0625 22.4473 18.0604 21.8756 18.151L22.1689 20.0029C22.5588 19.9412 23.0423 19.9375 24.2139 19.9375L24.2138 18.0625ZM23.3125 15.25C23.3125 16.7163 23.3124 17.9319 23.2769 18.9679L25.1508 19.0321C25.1876 17.9572 25.1875 16.706 25.1875 15.25H23.3125ZM23.2769 18.9679C23.1975 21.2866 22.9387 22.4907 22.2979 23.3726L23.8148 24.4747C24.8171 23.0951 25.0706 21.3739 25.1508 19.0321L23.2769 18.9679ZM17.6875 26.4638C17.6875 25.2923 17.6912 24.8088 17.7529 24.4189L15.901 24.1256C15.8104 24.6973 15.8125 25.361 15.8125 26.4638L17.6875 26.4638ZM13 27.4375C14.456 27.4375 15.7072 27.4376 16.7821 27.4008L16.7179 25.5269C15.6819 25.5624 14.4663 25.5625 13 25.5625V27.4375ZM16.7821 27.4008C19.1239 27.3206 20.8451 27.0671 22.2247 26.0648L21.1226 24.5479C20.2407 25.1887 19.0366 25.4474 16.7179 25.5269L16.7821 27.4008Z"></path>
                                            <path d="M8 10.25C8 10.9404 7.44036 11.5 6.75 11.5C6.05964 11.5 5.5 10.9404 5.5 10.25C5.5 9.55964 6.05964 9 6.75 9C7.44036 9 8 9.55964 8 10.25Z"></path>
                                            <path d="M8 15.25C8 15.9404 7.44036 16.5 6.75 16.5C6.05964 16.5 5.5 15.9404 5.5 15.25C5.5 14.5596 6.05964 14 6.75 14C7.44036 14 8 14.5596 8 15.25Z"></path>
                                            <path d="M14.25 10.25C14.25 10.9404 13.6904 11.5 13 11.5C12.3096 11.5 11.75 10.9404 11.75 10.25C11.75 9.55964 12.3096 9 13 9C13.6904 9 14.25 9.55964 14.25 10.25Z"></path>
                                            <path d="M14.25 15.25C14.25 15.9404 13.6904 16.5 13 16.5C12.3096 16.5 11.75 15.9404 11.75 15.25C11.75 14.5596 12.3096 14 13 14C13.6904 14 14.25 14.5596 14.25 15.25Z"></path>
                                            <path d="M14.25 20.25C14.25 20.9404 13.6904 21.5 13 21.5C12.3096 21.5 11.75 20.9404 11.75 20.25C11.75 19.5596 12.3096 19 13 19C13.6904 19 14.25 19.5596 14.25 20.25Z"></path>
                                            <path d="M20.5 10.25C20.5 10.9404 19.9404 11.5 19.25 11.5C18.5596 11.5 18 10.9404 18 10.25C18 9.55964 18.5596 9 19.25 9C19.9404 9 20.5 9.55964 20.5 10.25Z"></path>
                                            <path d="M20.5 15.25C20.5 15.9404 19.9404 16.5 19.25 16.5C18.5596 16.5 18 15.9404 18 15.25C18 14.5596 18.5596 14 19.25 14C19.9404 14 20.5 14.5596 20.5 15.25Z"></path>
                                            <path d="M8 20.25C8 20.9404 7.44036 21.5 6.75 21.5C6.05964 21.5 5.5 20.9404 5.5 20.25C5.5 19.5596 6.05964 19 6.75 19C7.44036 19 8 19.5596 8 20.25Z"></path>
                                        </svg>
                                    </span>
                                    <span className="txt txt--px20 txt--font400">1-3 Business day</span>
                                </div>
                                <span className="icon icon-font" data-icon-id="iconArrow">
                                    <svg viewBox="0 0 21 14" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.33333 6.29167C0.850085 6.29167 0.458335 6.68342 0.458334 7.16667C0.458334 7.64991 0.850085 8.04167 1.33333 8.04167L1.33333 6.29167ZM20 8.04167C20.4832 8.04167 20.875 7.64992 20.875 7.16667C20.875 6.68342 20.4832 6.29167 20 6.29167L20 8.04167ZM15.9493 0.71186C15.6061 0.37168 15.052 0.374152 14.7119 0.717381C14.3717 1.06061 14.3742 1.61463 14.7174 1.95481L15.9493 0.71186ZM17.3901 3.37186L16.7742 3.99333L17.3901 3.37186ZM17.3901 10.9615L18.0061 11.5829L18.0061 11.5829L17.3901 10.9615ZM14.7174 12.3785C14.3742 12.7187 14.3717 13.2727 14.7119 13.616C15.052 13.9592 15.6061 13.9617 15.9493 13.6215L14.7174 12.3785ZM19.9768 6.80111L20.8448 6.69048L20.8448 6.69048L19.9768 6.80111ZM19.9768 7.53222L20.8448 7.64286L20.8448 7.64286L19.9768 7.53222ZM1.33333 8.04167L20 8.04167L20 6.29167L1.33333 6.29167L1.33333 8.04167ZM14.7174 1.95481L16.7742 3.99333L18.0061 2.75039L15.9493 0.71186L14.7174 1.95481ZM16.7742 10.34L14.7174 12.3785L15.9493 13.6215L18.0061 11.5829L16.7742 10.34ZM16.7742 3.99333C17.6089 4.82066 18.1815 5.39004 18.569 5.87249C18.9453 6.34113 19.0745 6.64215 19.1088 6.91175L20.8448 6.69048C20.7529 5.96935 20.4088 5.36858 19.9334 4.7767C19.4692 4.19863 18.8116 3.54875 18.0061 2.75039L16.7742 3.99333ZM18.0061 11.5829C18.8116 10.7846 19.4692 10.1347 19.9334 9.55663C20.4088 8.96475 20.7529 8.36399 20.8448 7.64286L19.1088 7.42159C19.0745 7.69118 18.9453 7.9922 18.569 8.46084C18.1815 8.94329 17.6089 9.51267 16.7742 10.34L18.0061 11.5829ZM19.1088 6.91174C19.1304 7.08103 19.1304 7.25231 19.1088 7.42159L20.8448 7.64286C20.8851 7.32666 20.8851 7.00668 20.8448 6.69048L19.1088 6.91174Z"></path>
                                    </svg>
                                </span>
                                <div className="howto-work__item">
                                    <span className="icon icon-font" data-icon-id="iconHowtoBaski">
                                        <svg viewBox="0 0 43 21" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M42.9133 17.7356C42.6378 18.4202 42.1841 18.8335 41.3901 18.8294C41.2524 18.8294 41.0539 19.0401 40.9769 19.198C40.3409 20.5025 39.1539 21.1183 37.7401 20.8185C36.8407 20.6281 36.2493 20.0366 35.8847 19.2305C35.7429 18.9145 35.5728 18.8051 35.2406 18.8051C31.2381 18.8132 27.2356 18.8132 23.2332 18.8051C22.9131 18.8051 22.7511 18.9104 22.6215 19.2062C22.1434 20.3161 21.2644 20.9036 20.0652 20.8954C18.8661 20.8873 17.9992 20.2797 17.5252 19.1737C17.3996 18.8821 17.2335 18.8051 16.9459 18.8091C16.0344 18.8213 15.1229 18.8172 14.2074 18.8132C13.2473 18.8091 12.6842 18.319 12.5626 17.371C12.5383 17.1968 12.5424 17.0186 12.5424 16.8444C12.5424 12.2626 12.5262 7.67679 12.5586 3.09502C12.5626 2.47521 12.7368 1.83514 12.9556 1.24773C13.2027 0.579303 13.8306 0.26332 14.4666 0C19.7533 0 25.04 0 30.3266 0C31.7728 0.530691 32.263 1.64879 32.2509 3.08692C32.2468 3.78776 32.2671 4.49264 32.2428 5.19348C32.2306 5.60264 32.3603 5.76063 32.7897 5.75253C33.924 5.72822 35.0623 5.77683 36.1926 5.73227C36.9501 5.70391 37.497 5.97939 37.9831 6.53844C39.2795 8.03328 40.6244 9.48762 41.9248 10.9784C42.2975 11.4038 42.5892 11.9021 42.9174 12.3679C42.9133 14.1545 42.9133 15.945 42.9133 17.7356ZM22.427 1.1343C19.9923 1.1343 17.5576 1.1343 15.1229 1.1343C14.2925 1.1343 13.8509 1.51105 13.7253 2.33342C13.6929 2.55218 13.6969 2.77904 13.6969 3.00185C13.6969 5.94293 13.6969 8.87996 13.6969 11.821C13.6969 13.5306 13.6969 15.2401 13.6969 16.9497C13.6969 17.6384 13.7739 17.7113 14.4788 17.7113C15.2971 17.7113 16.1114 17.7032 16.9297 17.7154C17.2092 17.7194 17.3551 17.6141 17.4563 17.3427C17.9425 16.0585 18.8418 15.4022 20.0774 15.4022C21.317 15.4022 22.2447 16.0666 22.7106 17.3265C22.82 17.6222 22.978 17.7154 23.2737 17.7154C25.7246 17.7073 28.1755 17.7073 30.6264 17.7154C30.9869 17.7154 31.1044 17.5736 31.0963 17.2292C31.0801 16.5122 31.0923 15.7911 31.0923 15.0741C31.0923 14.3651 31.0923 14.3611 30.3671 14.3611C26.4416 14.3611 22.5202 14.3611 18.5947 14.357C18.3111 14.357 17.9992 14.3611 17.748 14.2557C17.5738 14.1828 17.3672 13.9154 17.3794 13.7453C17.3915 13.5671 17.6143 13.3564 17.7966 13.2511C17.9465 13.166 18.1693 13.2106 18.3638 13.2106C22.3987 13.2106 26.4376 13.2025 30.4725 13.2187C30.9505 13.2187 31.1125 13.089 31.1085 12.5988C31.0842 10.7313 31.1004 8.8597 31.1004 6.99216C31.1004 5.57023 31.1085 4.1483 31.0963 2.72637C31.0882 1.57587 30.6304 1.13025 29.5002 1.13025C27.1344 1.1343 24.7807 1.1343 22.427 1.1343ZM37.4079 7.67679C37.1162 7.21497 36.9177 6.88278 36.4316 6.88683C35.2001 6.89898 33.9685 6.89493 32.733 6.88683C32.3927 6.88278 32.2387 7.00431 32.2428 7.3608C32.2509 10.6665 32.2509 13.9722 32.2428 17.2778C32.2428 17.61 32.3765 17.7275 32.7005 17.7235C33.531 17.7113 34.3655 17.7073 35.196 17.7275C35.5241 17.7356 35.6781 17.6262 35.7794 17.3102C36.0103 16.5811 36.4761 16.0139 37.177 15.6898C38.761 14.9525 40.4867 15.6939 41.0498 17.367C41.147 17.6505 41.2807 17.8207 41.5481 17.6708C41.6696 17.6019 41.7425 17.3548 41.7425 17.1847C41.7587 15.9693 41.7506 14.7581 41.7506 13.5427C41.7506 12.8541 41.7466 12.8541 41.0579 12.8541C39.2511 12.8541 37.4403 12.8622 35.6335 12.85C34.6491 12.8419 34.163 12.3396 34.1508 11.3633C34.1468 10.7232 34.1508 10.0872 34.1508 9.44711C34.1508 8.15077 34.6005 7.70109 35.9171 7.68894C36.3789 7.67274 36.8367 7.67679 37.4079 7.67679ZM41.0215 11.6347C40.1586 10.6786 39.3808 9.8117 38.5908 8.95693C38.5098 8.8678 38.3315 8.8354 38.1979 8.83135C37.3795 8.81919 36.5653 8.83134 35.747 8.82324C35.4391 8.81919 35.3094 8.95288 35.3135 9.25266C35.3216 9.89273 35.3297 10.5328 35.3094 11.1688C35.2973 11.5699 35.4674 11.6955 35.8523 11.6914C37.4079 11.6793 38.9595 11.6874 40.5151 11.6833C40.6325 11.6914 40.7581 11.663 41.0215 11.6347ZM20.0693 19.753C21.0172 19.7571 21.7343 19.0644 21.7302 18.1488C21.7262 17.2495 20.9727 16.5041 20.0774 16.5081C19.1983 16.5122 18.4245 17.294 18.4327 18.1691C18.4367 19.0401 19.1699 19.749 20.0693 19.753ZM38.368 19.753C39.3403 19.7611 40.0127 19.1211 40.0249 18.165C40.037 17.2414 39.3281 16.5122 38.4126 16.5041C37.5011 16.496 36.7759 17.2211 36.7719 18.1407C36.7678 19.0644 37.4444 19.7449 38.368 19.753Z"></path>
                                            <path d="M5.37198 6.01585C3.88119 6.01585 2.39444 6.01585 0.903645 6.01585C0.729449 6.01585 0.518793 6.05231 0.385107 5.97129C0.214962 5.86596 0.00835736 5.66746 0.000255206 5.49731C-0.00784695 5.33122 0.178503 5.10436 0.340546 4.99903C0.482333 4.90585 0.709194 4.92611 0.899594 4.92611C3.87714 4.92206 6.85873 4.92206 9.83627 4.92206C9.90109 4.92206 9.9659 4.91801 10.0267 4.92206C10.5047 4.94231 10.7964 5.16107 10.7599 5.49731C10.7113 5.92267 10.4034 6.0199 10.0307 6.0199C8.47916 6.01585 6.9276 6.01585 5.37198 6.01585Z"></path>
                                            <path d="M6.21866 9.35393C5.01954 9.35393 3.82042 9.35799 2.6213 9.34988C2.44711 9.34988 2.23645 9.37014 2.11087 9.28507C1.94477 9.17569 1.76652 8.97313 1.74627 8.79489C1.73006 8.64094 1.89616 8.40193 2.04605 8.31686C2.2243 8.21558 2.47546 8.20343 2.69422 8.20343C5.06005 8.19533 7.42588 8.19938 9.79171 8.19938C9.84032 8.19938 9.88893 8.19938 9.93754 8.19938C10.4682 8.21963 10.7761 8.44244 10.7721 8.79894C10.768 9.15543 10.4763 9.34988 9.91324 9.34988C8.67766 9.35799 7.45018 9.35393 6.21866 9.35393Z"></path>
                                            <path d="M7.20712 12.6394C6.26322 12.6394 5.31932 12.6394 4.37542 12.6394C4.01082 12.6394 3.68673 12.5624 3.64622 12.1249C3.61382 11.7765 3.88929 11.5456 4.36732 11.5456C6.25512 11.5375 8.14292 11.5375 10.0307 11.5456C10.5047 11.5456 10.8004 11.7805 10.764 12.1168C10.7194 12.5421 10.4115 12.6434 10.0388 12.6434C9.09492 12.6353 8.15102 12.6394 7.20712 12.6394Z"></path>
                                        </svg>
                                    </span>
                                    <span className="txt txt--px20 txt--font400">Shipping</span>
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

        </>
    );
}

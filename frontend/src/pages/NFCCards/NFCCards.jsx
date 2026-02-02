import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import NFCCardsAccordion from '../../components/Accordions/NFCCardsAccordion';

function NFCCards() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };


    const faqItems = [
        {
            title: "How long does it take for a card to arrive?",
            content: `Once your design has been reviewed, confirmed and approved, we send this off to print. It will take roughly 5-8 business days for our team to print it, encode it and ship it to your door.
      `
        },
        {
            title: "Does Blinq require a paid subscription?",
            content: `No, you can get Blinq NFC Cards without paying for a subscription. However, a lot of our customers choose to <a href="https://blinq.me/pricing" data-wf-native-id-path="b035dbeb-f871-bcb7-dadc-4f871b682eba" data-wf-ao-click-engagement-tracking="true" data-wf-element-id="b035dbeb-f871-bcb7-dadc-4f871b682eba">upgrade to a premium subscription</a> to access more digital business cards and a range of features like having their logo in their QR code. `
        },
        {
            title: "Does the person I’m sharing my card with also need to have the Blinq app?",
            content: `No, the other person doesn’t need to have the app downloaded.
      `
        },
        {
            title: "How do I design a custom card?",
            content: `After you have purchased your custom Blinq card we will send you card template files in SVG and PNG. You can then import these templates into design software such as Photoshop, Illustrator or Canva and add your custom design. Cards will arrive 5-8 business days after your custom design is confirmed. We've written guides on <a href="https://blinq.me/blog/nfc-business-card-adobe-photoshop" data-wf-native-id-path="8fdb1f74-cadc-15dd-83b7-327c19f2e2cd" data-wf-ao-click-engagement-tracking="true" data-wf-element-id="8fdb1f74-cadc-15dd-83b7-327c19f2e2cd">designing cards in Photoshop</a> and <a href="https://blinq.me/blog/nfc-business-card-adobe-illustrator" data-wf-native-id-path="1b9ddd0b-9310-0b27-dd23-586b8183f7d0" data-wf-ao-click-engagement-tracking="true" data-wf-element-id="1b9ddd0b-9310-0b27-dd23-586b8183f7d0">designing cards in Illustrator</a>.<br><br>Or if you are a Blinq Business or Blinq Premium customer, you are able to request design help from our internal design team. We normally have 2 rounds of revision to help ensure you are happy with your cards before we send them to print!`
        },
        {
            title: "How do you manufacture Blinq NFC cards?",
            content: `We print Blinq NFC cards onto an elegant plastic canvas using high quality UV laser printers for a slick finish. We then encode the cards with the information you supply us from your Blinq Profile.`
        },
        {
            title: "Do you produce metal cards?",
            content: `We don’t currently do metal cards. We found that metal cards sometimes scratched phone screen when they were tapped against them.`
        },
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
                                        style={{ color: "white !important" }}
                                    >
                                        Home
                                    </div>
                                </div>
                            </Link>
                            <Link to="/enterprise" className="nav-dropdown desktop-only w-dropdown">
                                <div className="nav-link dropdown w-dropdown-toggle">
                                    <div
                                        className="dropdown-text"
                                        style={{ color: "white !important" }}
                                    >
                                        Enterpirse
                                    </div>
                                </div>
                            </Link>
                            <Link to="/nfc-cards" className="nav-dropdown desktop-only w-dropdown" >
                                <div className="nav-link dropdown w-dropdown-toggle">
                                    <div
                                        className="dropdown-text"
                                        style={{ color: "white !important" }}
                                    >
                                        NFC Cards
                                    </div>
                                </div>
                            </Link>
                        </nav>
                        <div className="navbar-cta-wrapper">
                            {/* <Link to="/create-card" className="button light white analytics w-button">
                                Create digital card
                            </Link> */}
                            {isAuthenticated && isAuthenticated() ? (
                              <button 
                                onClick={handleLogout} 
                                className="button light white analytics w-button" 
                                style={{marginLeft: '10px'}}
                              >
                                Logout
                              </button>
                            ) : (
                              <Link to="/login" className="button light white analytics w-button" style={{marginLeft: '10px'}}>
                                Login
                              </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div class="anti-overflow">
                <div className="video-bg-wrapper">
                    <div className="nfc-video-bg w-background-video w-background-video-atom">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                                backgroundImage:
                                    "url(https://cdn.prod.website-files.com/6166951705f504088afd3b37/616d7d42699bd6068cb76fb5_nfc-cards-hero-video-poster-00001.jpg)",
                            }}
                        >
                            <source src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899aade2821786_nfc-cards-hero-video-transcode.mp4" />
                            <source src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899aade2821786_nfc-cards-hero-video-transcode.webm" />
                        </video>
                    </div>

                    <div className="video-overlay"></div>

                    <div className="section hero nfc">
                        <div className="container width-50">
                            <div className="hero-wrapper">
                                <h1 className="heading-style-h1 is-white">
                                    NFC Business Cards <br />
                                    by DynamicNFC
                                </h1>
                                <p className="text-block paragraph-large white centre">
                                    Share your contact details with a single tap.
                                </p>
                                <Link
                                    to="/order-card"
                                    className="button on-black analytics w-button"
                                >
                                    Order your card
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cards Section */}
                <div className="section cards">
                    <div className="container cards">
                        <div className="wrapper">
                            <div className="section-header-centered">
                                <h2>Our NFC Card Range</h2>
                            </div>

                            <div className="w-layout-grid nfc_range-grid-3">
                                {/* Card 1 */}
                                <div className="nfc_product-card">
                                    <div className="top_content">
                                        <div className="card-top-float">
                                            {/* <div className="price-text">$14</div>
                                            <div className="shipping">+ shipping</div> */}

                                            <div className="card-flip-wrapper">
                                                <div className="card-flip-content">
                                                    <div className="card-front"></div>
                                                    <div className="card-back"></div>
                                                </div>
                                            </div>

                                            <div className="mobile-card-flip-indicator">
                                                <div className="card-flip-indicator current">Front</div>
                                                <div className="card-flip-indicator">Back</div>
                                            </div>
                                        </div>

                                        <div className="card-text">
                                            <h3 className="nfc_product_h3">DynamicNFC Essential</h3>
                                            <h4 className="nfc_product_subheading">
                                                The last business card you’ll ever need
                                            </h4>
                                            <p className="nfc_product_p">
                                                Our quickest card to process and ship. A DynamicNFC card that
                                                lets you make new connections with just a single tap.
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        to="/order-card"
                                        className="button-22 black-outlined analytics w-button"
                                    >
                                        Order your card
                                    </Link>
                                </div>

                                {/* Card 2 */}
                                <div className="nfc_product-card">
                                    <div className="top_content">
                                        <div className="card-top-float">
                                            {/* <div className="price-text">$40</div>
                                            <div className="shipping">+ shipping</div> */}

                                            <div className="card-flip-wrapper _2">
                                                <div className="card-flip-content infinite_black">
                                                    <div className="card-front infinite_black"></div>
                                                    <div className="card-back infinite_black"></div>
                                                </div>
                                                <div className="card-flip-content infinite_white">
                                                    <div className="card-front infinite_white"></div>
                                                    <div className="card-back infinite_white"></div>
                                                </div>
                                            </div>

                                            <div className="mobile-card-flip-indicator">
                                                <div className="card-flip-indicator current">Front</div>
                                                <div className="card-flip-indicator">Back</div>
                                            </div>

                                            <div className="infinite_colour-selector">
                                                <div className="colour-selector-wrap">
                                                    <div className="black-select-5"></div>
                                                    <div className="white-select"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="nfc_product_h3">DynamicNFC Infinite</h3>
                                            <h4 className="nfc_product_subheading">
                                                Personalize your card and make an impression
                                            </h4>
                                            <p className="nfc_product_p">
                                                Your name, your logo and job title on a sleek and stylish
                                                NFC Card. Available in both black and white.
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to="/order-card"
                                        className="button-22 black-outlined analytics w-button"
                                    >
                                        Customize your card
                                    </Link>
                                </div>

                                {/* Card 3 */}
                                <div className="nfc_product-card _3">
                                    <div className="top_content">
                                        <div className="card-top-float">
                                            {/* <div className="price-text">$60</div>
                                            <div className="shipping">+ shipping</div> */}
                                            <img
                                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6379910b359e1d642a881a76_custom-cards-cycle.gif"
                                                alt="A series of DynamicNFC custom cards"
                                                className="custom_gif"
                                            />
                                        </div>

                                        <div>
                                            <h3 className="nfc_product_h3">DynamicNFC Custom</h3>
                                            <h4 className="nfc_product_subheading">Your brand, no limits</h4>
                                            <p className="nfc_product_p">
                                                A tappable NFC card, anyway you like it. We send you the
                                                template and you use design software to make your dream
                                                card. We print it, encode it and ship it.
                                            </p>
                                        </div>
                                    </div>

                                    <Link
                                        to="/order-card"
                                        className="button-22 black-outlined analytics w-button"
                                    >
                                        Customize your card
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logos */}
                <div className="logo-section nfc">
                    <div className="container-3 w-container">
                        <p className="headding-small">Loved by industry leaders</p>

                        <div className="w-layout-grid grid">
                            {[
                                "6359fee1fa5260647d9fbdc7_Exp-logo.webp",
                                "6359fee1c66f9d9af13cfc05_Remax-logo.webp",
                                "6359fee1befa0c75e76b12a6_CoStar-logo.webp",
                                "6359fee16c1c8e67dbc00e49_Google-logo.webp",
                                "6359fee104fcf68e07b2ca17_Airwallex-logo.webp",
                                "6359fee172a1556b4edc54f4_Uber-logo.webp",
                                "636c54a1a4dc6a1ddb0703d3_salesforce-logo-white-300x210.avif",
                                "636c54a13952ab2becd0945c_SG-innovate.webp",
                                "62be776225bdaf314458354c_5.webp",
                                "617ac0d059899a6abd8217c7_TESLA-w.svg",
                            ].map((logo, i) => (
                                <div className="logo-container" key={i}>
                                    <img
                                        src={`https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/${logo}`}
                                        alt=""
                                        className="client-logo-img"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="benefits_section">
                    <div className="container">
                        <div className="wrapper">
                            <div className="section-header-centered nfc">
                                <h2>Benefits of an NFC Business Card</h2>
                            </div>
                        </div>

                        <div className="benefits-content-wrapper">
                            <div className="left-column">
                                <div className="mouseover-card">
                                    <div className="card-image coloured _3d"></div>
                                    <div className="highlight lighter"></div>
                                </div>

                                <Link
                                    to="/order-card"
                                    className="button on-black analytics w-button"
                                >
                                    Order your card
                                </Link>
                            </div>

                            <div className="w-layout-grid grid-2">
                                <div className="benfits_grid-cell">
                                    <h3 className="benefits_h3">Share your details instantly</h3>
                                    <p>DynamicNFC NFC cards are the fastest way to share your contact details on the go.</p>
                                </div>

                                <div className="benfits_grid-cell">
                                    <h3 className="benefits_h3">Stop reprinting business cards</h3>
                                    <p>Edit your contact details anytime.</p>
                                </div>

                                <div className="benfits_grid-cell">
                                    <h3 className="benefits_h3">Be memorable</h3>
                                    <p>A business card exchange that’s bound to impress.</p>
                                </div>

                                <div className="benfits_grid-cell">
                                    <h3 className="benefits_h3">Eco-friendly</h3>
                                    <p>Cut down on your carbon footprint.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="steps_section">
                    <h2 className="section-heading max-900">
                        How do I create and design a DynamicNFC NFC business card?
                    </h2>

                    <div className="steps-container">
                        <div className="w-layout-grid nfc_steps_grid">
                            {/* Step 1 */}
                            <div className="steps-cell">
                                <div className="top-content">
                                    <div className="step-indicator">Step 1</div>
                                    <h3 className="steps-h3">
                                        Purchase your <br /> DynamicNFC Card
                                    </h3>
                                    <p className="grey-p">
                                        Choose your ideal card. Look out for our emails about setting
                                        up your profile!
                                    </p>
                                </div>

                                <div className="steps_img_wrapper">
                                    <img
                                        src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/63797f23e86a455a1b3b9978_Step_1_img.webp"
                                        alt=""
                                    />
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="steps-cell">
                                <div className="top-content">
                                    <div className="step-indicator">Step 2</div>
                                    <h3 className="steps-h3">
                                        Set up a <br /> DynamicNFC Profile
                                    </h3>
                                    <p className="grey-p">
                                        Create your DynamicNFC profile. Add contact details, links and
                                        more.
                                    </p>
                                </div>

                                <div className="steps_img_wrapper">
                                    <img
                                        src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/637ff405788cfbcea43bff21_Step_2_Img_V2.webp"
                                        alt=""
                                    />
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="steps-cell">
                                <div className="top-content">
                                    <div className="step-indicator">Step 3</div>
                                    <h3 className="steps-h3">Receive your card & start tapping</h3>
                                    <p className="grey-p">
                                        Your card will be ready to use as soon as it arrives.
                                    </p>
                                </div>

                                <div className="steps_img_wrapper">
                                    <img
                                        src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/637db063c03d737ccd901875_robert-smith_card-tap-mockup_crop.webp"
                                        alt=""
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/order-card"
                        className="button on-black analytics w-button"
                    >
                        Order your card
                    </Link>
                </div>

                <div className="section">
                    <div className="team-cta-grid">
                        <h3 className="team-h3">Want cards for your team?</h3>

                        <div className="cell">
                            <p className="teams-p">
                                We offer bulk discounts for large orders. We also give business customers a dashboard to
                                manage all your cards and reassign them if employees leave.
                            </p>
                        </div>
                    </div>
                </div>


                <NFCCardsAccordion items={faqItems} />

                <section className="section cta dark">
                    <img
                        src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/617ac0d059899a3e4e821749_ellipses-light.svg"
                        alt=""
                        className="cta-bg-ellipses"
                    />

                    <div className="cta-bg-gradient" />

                    <div className="container width-50">
                        <div className="cta-wrapper dark">
                            <h2 className="white">Ready when you are</h2>

                            <div className="cta-text-btn dark">
                                <p className="subheading">
                                    DynamicNFC is trusted by thousands of users to share their professional identity every day.
                                </p>

                                <Link
                                    to="/order-card"
                                    className="button on-black"
                                >
                                    Order your card
                                </Link>
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

            </div>
        </>
    )
}

export default NFCCards
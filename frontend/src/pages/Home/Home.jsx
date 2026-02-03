import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import Accordion from "../../components/Accordions/HomeAccordion.jsx"

function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const faqItems = [
    {
      title: "How do I create a digital business card?",
      content: `   Creating your DynamicNFC digital business card takes less than a minute. Start by <a href="#">
                                                                    <strong>creating your card</strong>
                                                                </a>, or by downloading the app ( <a href="#">
                                                                    <strong>iOS</strong>
                                                                </a>/ <a href="#">
                                                                    <strong>Android</strong>
                                                                </a>). You&#x27;ll be guided through the card creation process, where you can add your contact details, a profile photo, and customize your card with your company logo. Once done, you&#x27;ll be ready to start sharing straight away.
                                                            `
    },
    {
      title: "Is DynamicNFC free to use?",
      content: `  Yes! DynamicNFC is free for everyone. You’ll get access to digital business cards, virtual backgrounds, and dynamic email signatures. With <a href="#">
                                                                    <strong>DynamicNFC Premium</strong>
                                                                </a>, you unlock added customization and export options, which are free to trial for 7 days.
                                                            `
    },
    {
      title: "How do I share my DynamicNFC card with someone who doesn't have the app?",
      content: `If the recipient doesn’t have the DynamicNFC app, your card will open in their web browser. They can easily save your details and share theirs back with you, making it easy and convenient to reconnect.`
    },
    {
      title: "How do I share a digital business card?",
      content: `    Sharing your digital business card is super simple. You can have recipients scan the QR code from your DynamicNFC app, or share it via text, email, <a href="#">
                                                                    <strong>Widgets</strong>
                                                                </a>, <a href="#">
                                                                    <strong>Apple Wallet</strong>
                                                                </a>, or even from your <a href="#">
                                                                    <strong>Apple Watch</strong>
                                                                </a>. It’s instant and convenient—perfect for sharing in person or online.
                                                            `
    },
    {
      title: "What’s the difference between a digital business card and a traditional business card?",
      content: `A DynamicNFC digital business card is like a traditional business card, but made for modern networking! No more printing costs, cards getting lost, or outdated details. It’s always on your phone, ready to share, and  can capture the details of the person you're meeting making it easy to follow-up—plus, it’s eco-friendly and completely customizable to match your business.`
    },
    {
      title: "What are the benefits of using a digital business card?",
      content: `  <strong>Share your contact details easily: </strong>A <a href="solutions/digital-business-card.html">
                                                                    <strong>digital business card</strong>
                                                                </a> is the quickest and easiest way to share your professional identity. <br />‍ <br />‍ <strong>Your card is always with you:</strong> Whether you prefer to share using the app, from your Apple Wallet, your smart watch or home screen widgets, it will be with you wherever you and your device goes, no need to carry paper cards anymore. <br />‍ <br />‍ <strong>Works every time</strong>: Those who receive your card don’t need the DynamicNFC app to get your contact details. <br />‍ <br />‍ <strong>Always stay up-to-date: </strong>If you change your contact information on your QR code business card, those who have your card will see your updated information.
                                                            `
    },
  ];

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
                    style={{ color: "white !important" }}
                  >
                   <p  style={{color:"white"}}>Home</p>
                  </div>
                </div>
              </Link>
              <Link to="/enterprise" className="nav-dropdown desktop-only w-dropdown">
                <div className="nav-link dropdown w-dropdown-toggle">
                  <div
                    className="dropdown-text"
                    style={{ color: "white !important" }}
                  >
                  <p  style={{color:"white"}}>Enterprise</p> 
                  </div>
                </div>
              </Link>
              <Link to="/nfc-cards" className="nav-dropdown desktop-only w-dropdown" >
                <div className="nav-link dropdown w-dropdown-toggle">
                  <div
                    className="dropdown-text"
                    style={{ color: "white !important" }}
                  >
                   <p  style={{color:"white"}}> NFC Cards</p>
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
      <div className="page-wrapper">
        <div className="main-wrapper">
          <div className="section_home-hero">
            <div className="home-hero_image hide-mobile-landscape w-background-video w-background-video-atom">
              <img src="assets/images/1.png" alt="Hero Background" style={{
                width: "100%",
                height: "inherit",
                opacity: 0.8
              }} />
            </div>
            <div className="home-hero_image hide-desktop w-background-video w-background-video-atom">
              <img src="assets/images/1.png" alt="Hero Background" style={{
                width: "100%",
                height: "inherit",
                opacity: 0.8
              }} />
            </div>
            <div className="home-hero_comp">
              <div className="padding-global" style={{ textAlign: "end" }}>
                <div className="container-large">
                  <div className="home-hero-inner">
                    <div className="home-hero_text-comp ">
                      <div className="home-hero_heading-wrap">
                        <h1 className="heading-style-h1 is-white left-mob" style={{ fontSize: "5rem" }}>
                          Your business card
                          <span className="break-span">just got an upgrade</span>
                        </h1>
                      </div>
                      <div className="home-hero_text-wrap">
                        <div className="text-size-medium text-color-mid-grey left-mob is-white-text">
                          The easiest way to share who you are and never lose a
                          contact again.
                        </div>
                      </div>
                    </div>
                    <div className="home-hero_button-comp" style={{ placeContent: "flex-end" }}>
                      <Link to="/create-card"
                        className="button analytics w-inline-block"
                      >
                        <div className="text-size-intermediate text-color-white btn">
                          Create digital card
                        </div>
                      </Link>
                      <Link to="/enterprise"
                        className="button is-white w-inline-block"
                      >
                        <div className="text-size-intermediate text-color-brown">
                          For teams
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="home-hero_ab-color" />
          </div>
          <div className="home-main-section-wrap">
            <div className="section_business padding-bottom div-block-146">
              <div className="padding-global padding-section-medium">
                <div className="container-large">
                  <div className="business_comp">
                    {/* First Row */}
                    <div className="business_first-row">
                      <div className="business_first-wrap">
                        <div className="business_first-item-left">
                          <h3 className="heading-style-h6">Create your card in seconds</h3>
                          <div className="text-size-medium text-color-mildblack">
                            Personalize your own digital business cards with your headshot, logo and slick design templates. New job title? New logo? No problem. Update your card instantly in the DynamicNFC mobile app.
                          </div>
                          <div className="cta-button">
                            <Link to="/create-card" className="button analytics w-inline-block">
                              <div className="text-size-intermediate text-color-white btn">
                                Create digital card
                              </div>
                            </Link>
                          </div>
                        </div>

                        <div className="business-video-wrapper">
                          <div id="bg-video" className="business-video w-background-video w-background-video-atom">
                            <video
                              id="video1"
                              autoPlay
                              loop
                              muted
                              playsInline
                              poster="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68119c652d9a6285f4bb784b_01%20New%20Create%20a%20card%20(2)-poster-00001.jpg"
                              style={{ width: "100%", height: "auto" }}
                            >
                              <source
                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9%2F68119c652d9a6285f4bb784b_01%20New%20Create%20a%20card%20(2)-transcode.mp4"
                                type="video/mp4"
                              />
                              <source
                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9%2F68119c652d9a6285f4bb784b_01%20New%20Create%20a%20card%20(2)-transcode.webm"
                                type="video/webm"
                              />
                            </video>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Second Component */}
                    <div className="business_second-comp">
                      <div className="business_second-wrap">
                        <div className="business_second-item-right">
                          <div className="business-video-wrapper">
                            <div id="bg-video1" className="business-video w-background-video w-background-video-atom">
                              <video
                                id="video2"
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819c6e4fb03a69a96142815_02%20Share%20a%20card%20(6)-poster-00001.jpg"
                                style={{ width: "100%", height: "auto" }}
                              >
                                <source
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9%2F6819c6e4fb03a69a96142815_02%20Share%20a%20card%20(6)-transcode.mp4"
                                  type="video/mp4"
                                />
                                <source
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9%2F6819c6e4fb03a69a96142815_02%20Share%20a%20card%20(6)-transcode.mp4"
                                  type="video/webm"
                                />
                              </video>
                            </div>
                          </div>
                        </div>

                        <div className="business_second-item-left">
                          <h3 className="heading-style-h6">Share your card with anyone, any way</h3>
                          <div className="text-size-medium text-color-mildblack">
                            Scan. Tap. Done. QR, NFC, or link - your details land instantly even if they don't have the app.
                          </div>
                          <Link to="/create-card" className="button analytics w-inline-block">
                            <div className="text-size-intermediate text-color-white btn">Create digital card</div>
                          </Link>
                        </div>
                      </div>

                      {/* Third Wrap */}
                      <div className="business_third-wrap">
                        <div className="business_second-item-left">
                          <h3 className="heading-style-h6">Never forget a face, or a moment</h3>
                          <div className="text-size-medium text-color-mildblack">
                            DynamicNFC keeps track of who you met and when. Add context to your contacts so you always have an edge.
                          </div>
                          <Link to="/create-card" className="button analytics w-inline-block">
                            <div className="text-size-intermediate text-color-white btn">Create digital card</div>
                          </Link>
                        </div>

                        <div className="business_second-item-right">
                          <div className="business-video-wrapper">
                            <div id="bg-video2" className="business-video w-background-video w-background-video-atom">
                              <video
                                id="video3"
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812055f32564309c51cfbc9_03%20Edit%20contact-FINAL-poster-00001.jpg"
                                style={{ width: "100%", height: "auto" }}
                              >
                                <source
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9%2F6812055f32564309c51cfbc9_03%20Edit%20contact-FINAL-transcode.mp4"
                                  type="video/mp4"
                                />
                                <source
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9%2F6812055f32564309c51cfbc9_03%20Edit%20contact-FINAL-transcode.webm"
                                  type="video/webm"
                                />
                              </video>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="section_home-card">
              <div className="padding-global">
                <div className="container-large">
                  <div className="padding-section-large is-home-card">
                    <div className="home-card_list">
                      <div className="home-card_comp">
                        <div className="home-card_item-left">
                          <h5 className="heading-style-h5">
                            Share your card in seconds.
                          </h5>
                          <div className="text-size-medium">
                            Scan. Tap. Done. QR, NFC, or link - your details land
                            instantly.
                          </div>
                          <Link to="/create-card" className="button analytics w-inline-block">
                            <div className="text-size-regular text-color-white">
                              Create digital card
                            </div>
                          </Link>
                        </div>
                        <div
                          id="w-node-_32ec2917-a778-c45c-94ac-dd6caa861d1d-c00da0d4"
                          className="home-card_item-right"
                        >
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e34_Frame 1948758285.webp"
                            loading="lazy"
                            sizes="100vw"
                            srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e34_Frame%201948758285-p-500.webp 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e34_Frame%201948758285-p-800.webp 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e34_Frame%201948758285.webp 924w"
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
                            sizes="100vw"
                            srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e2e_Frame%201948758285%20(1)-p-500.webp 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e2e_Frame%201948758285%20(1)-p-800.webp 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e918897f1eea79df2e2e_Frame%201948758285%20(1).webp 924w"
                            alt="a DynamicNFC card with the email being updated"
                            className="home-card_image"
                          />
                        </div>
                        <div className="home-card_item-left">
                          <h5 className="heading-style-h5">
                            Works everywhere. Looks sharp doing it.
                          </h5>
                          <div className="text-size-medium">
                            iOS, Android, desktop, browser - your card shows up
                            polished, every time. No app needed on their end.
                          </div>
                          <Link to="/create-card" className="button analytics w-inline-block">
                            <div className="text-size-regular text-color-white">
                              Create digital card
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div className="home-card_comp">
                        <div className="home-card_item-left">
                          <h5 className="heading-style-h5">
                            Never forget a face - or a moment.
                          </h5>
                          <div className="text-size-medium">
                            DynamicNFC keeps track of who you met and when.
                          </div>
                          <Link to="/create-card" className="button analytics w-inline-block">
                            <div className="text-size-regular text-color-white">
                              Create digital card
                            </div>
                          </Link>
                        </div>
                        <div
                          id="w-node-_32ec2917-a778-c45c-94ac-dd6caa861d33-c00da0d4"
                          className="home-card_item-right"
                        >
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e917b529434acc5fc998_Frame 1948758285 (2).webp"
                            loading="lazy"
                            sizes="100vw"
                            srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e917b529434acc5fc998_Frame%201948758285%20(2)-p-500.webp 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e917b529434acc5fc998_Frame%201948758285%20(2)-p-800.webp 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/67f4e917b529434acc5fc998_Frame%201948758285%20(2).webp 924w"
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
            <div className="section_home-DynamicNFC-card">
              <div className="padding-global">
                <div className="container-large">
                  <div className="DynamicNFC-card_comp">
                    <div className="css w-embed"></div>
                    <div className="DynamicNFC-card_item-comp ratio">
                      <img
                        src="../cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9b94c6f71010ddb4c68_Digital-business-card-01.png"
                        loading="lazy"
                        alt=""
                        sizes="100vw"
                        srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9b94c6f71010ddb4c68_Digital-business-card-01-p-500.png 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9b94c6f71010ddb4c68_Digital-business-card-01.png 548w"
                        className="blinq-card_item-image is-1"
                      />
                      <img
                        src="../cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9abe6e46b3c7e1b84da_Digital-business-card-02.png"
                        loading="lazy"
                        alt=""
                        sizes="100vw"
                        srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9abe6e46b3c7e1b84da_Digital-business-card-02-p-500.png 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9abe6e46b3c7e1b84da_Digital-business-card-02.png 548w"
                        className="blinq-card_item-image is-2"
                      />
                      <img
                        src="../cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9984c6f71010ddb1752_Digital-business-card-03.png"
                        loading="lazy"
                        alt=""
                        sizes="100vw"
                        srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9984c6f71010ddb1752_Digital-business-card-03-p-500.png 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9984c6f71010ddb1752_Digital-business-card-03.png 548w"
                        className="blinq-card_item-image is-3"
                      />
                      <img
                        src="../cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9c776902c5c3e06f527_Digital-business-card-04.png"
                        loading="lazy"
                        alt=""
                        sizes="100vw"
                        srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9c776902c5c3e06f527_Digital-business-card-04-p-500.png 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9c776902c5c3e06f527_Digital-business-card-04.png 548w"
                        className="blinq-card_item-image is-4"
                      />
                      <img
                        src="../cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9dc09839a6c5d8b9163_Digital-business-card-05.png"
                        loading="lazy"
                        alt=""
                        sizes="100vw"
                        srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9dc09839a6c5d8b9163_Digital-business-card-05-p-500.png 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6819b9dc09839a6c5d8b9163_Digital-business-card-05.png 548w"
                        className="blinq-card_item-image is-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section_home-team">
              <div className="padding-global">
                <div className="container-large">
                  <div className="padding-section-large mobile-bottom-none">
                    <div className="home-team_comp">
                      <div className="home-team_text-comp mobile-less-gap">
                        <h2 className="heading-style-h5">
                          Why teams love DynamicNFC
                        </h2>
                      </div>
                      <div className="home-masonary-list">
                        <div className="home-masonary__item-1">
                          <div
                            id="w-node-d08f3b4c-0381-3ef2-3fd8-09f367f06c54-67f06c54"
                            className="home-team_item w-variant-140ffb9b-389f-f285-c4af-dd45500cc3b8"
                          >
                            <div className="block-wall__info">
                              <h3 className="block-wall__heading">
                                Every card, always on brand
                              </h3>
                              <div className="block_wall--text">
                                Lock in your logo, colors, and messaging - every
                                team member, every time. Brand consistency, built
                                in.
                              </div>
                            </div>
                            <div className="home-team_image-wrap-new">
                              <img
                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680efff5b95cb2233b11557a_Every card always on brand.avif"
                                loading="lazy"
                                alt="Example DynamicNFC digital business card "
                                sizes="100vw"
                                srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680efff5b95cb2233b11557a_Every%20card%20always%20on%20brand-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680efff5b95cb2233b11557a_Every%20card%20always%20on%20brand-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680efff5b95cb2233b11557a_Every%20card%20always%20on%20brand-p-1080.avif 1080w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/680efff5b95cb2233b11557a_Every%20card%20always%20on%20brand.avif 1400w"
                                className="home-team_image-new w-variant-b465e801-45c9-1d8e-75d9-00c77169f7b2"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="home-masonary__item-2">
                          <div
                            id="w-node-d08f3b4c-0381-3ef2-3fd8-09f367f06c54-67f06c54"
                            className="home-team_item w-variant-b2bee1e0-98dd-c4b1-8977-a919fe0c6c4b"
                          >
                            <div className="block-wall__info w-variant-b2bee1e0-98dd-c4b1-8977-a919fe0c6c4b">
                              <h3 className="block-wall__heading">
                                Sync with your CRM in seconds
                              </h3>
                              <div className="block_wall--text">
                                Create new leads and centralize your contacts in one
                                place. DynamicNFC allows you to sync your contact
                                data with your chosen CRM, helping your team close
                                deals faster.
                              </div>
                            </div>
                            <div className="home-team_image-wrap-new w-variant-b2bee1e0-98dd-c4b1-8977-a919fe0c6c4b">
                              <img
                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b79fd35772f828e696a6_Business cards that are as dynamic as you are.avif"
                                loading="lazy"
                                alt="Example DynamicNFC digital business card with supported icons next to it"
                                sizes="100vw"
                                srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b79fd35772f828e696a6_Business%20cards%20that%20are%20as%20dynamic%20as%20you%20are-p-500.png 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b79fd35772f828e696a6_Business%20cards%20that%20are%20as%20dynamic%20as%20you%20are-p-800.png 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b79fd35772f828e696a6_Business%20cards%20that%20are%20as%20dynamic%20as%20you%20are-p-1080.png 1080w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b79fd35772f828e696a6_Business%20cards%20that%20are%20as%20dynamic%20as%20you%20are-p-1600.png 1600w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b79fd35772f828e696a6_Business%20cards%20that%20are%20as%20dynamic%20as%20you%20are-p-2000.png 2000w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b79fd35772f828e696a6_Business%20cards%20that%20are%20as%20dynamic%20as%20you%20are-p-2600.png 2600w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b79fd35772f828e696a6_Business%20cards%20that%20are%20as%20dynamic%20as%20you%20are.avif 2800w"
                                className="home-team_image-new"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="home-masonary__item-3">
                          <div
                            id="w-node-d08f3b4c-0381-3ef2-3fd8-09f367f06c54-67f06c54"
                            className="home-team_item w-variant-f9e0426f-dba0-b6a4-1b5c-abbf803c5550"
                          >
                            <div className="block-wall__info">
                              <h3 className="block-wall__heading">
                                Centralized management with robust admin controls
                                <br />
                              </h3>
                              <div className="block_wall--text">
                                DynamicNFC's admin dashboard enables user management
                                at scale. Create, edit and assign cards in bulk.
                                Assign roles and permissions based on team function.
                                Complete control over how your team shows up in the
                                world.
                              </div>
                            </div>
                            <div className="home-team_image-wrap-new w-variant-f9e0426f-dba0-b6a4-1b5c-abbf803c5550">
                              <img
                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b72b343df1c6a4b1ca4d_Centralised management with robust admin controls.avif"
                                loading="lazy"
                                alt="Example DynamicNFC digital business card explaining centralised management"
                                sizes="100vw"
                                srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b72b343df1c6a4b1ca4d_Centralised%20management%20with%20robust%20admin%20controls-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b72b343df1c6a4b1ca4d_Centralised%20management%20with%20robust%20admin%20controls-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b72b343df1c6a4b1ca4d_Centralised%20management%20with%20robust%20admin%20controls-p-1080.png 1080w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b72b343df1c6a4b1ca4d_Centralised%20management%20with%20robust%20admin%20controls-p-1600.png 1600w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b72b343df1c6a4b1ca4d_Centralised%20management%20with%20robust%20admin%20controls-p-2000.png 2000w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b72b343df1c6a4b1ca4d_Centralised%20management%20with%20robust%20admin%20controls-p-2600.png 2600w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811b72b343df1c6a4b1ca4d_Centralised%20management%20with%20robust%20admin%20controls.avif 2800w"
                                className="home-team_image-new"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="home-masonary__item-4">
                          <div
                            id="w-node-d08f3b4c-0381-3ef2-3fd8-09f367f06c54-67f06c54"
                            className="home-team_item w-variant-c40767af-41b2-fb2b-a993-86d667256128"
                          >
                            <div className="block-wall__info">
                              <h3 className="block-wall__heading">
                                Built to scale with your team
                              </h3>
                              <div className="block_wall--text">
                                Onboard new employees in minutes and only pay for
                                what you need. DynamicNFC grows with your business.
                              </div>
                            </div>
                            <div className="home-team_image-wrap-new w-variant-c40767af-41b2-fb2b-a993-86d667256128">
                              <img
                                src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6818094448cbfee086dbc66a_Want to see DynamicNFC in action_-2.avif"
                                loading="lazy"
                                alt="Example DynamicNFC digital business card on top of the DynamicNFC dashboard"
                                sizes="100vw"
                                srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6818094448cbfee086dbc66a_Want%20to%20see%20Blinq%20in%20action_-2-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6818094448cbfee086dbc66a_Want%20to%20see%20Blinq%20in%20action_-2-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6818094448cbfee086dbc66a_Want%20to%20see%20Blinq%20in%20action_-2-p-1080.avif 1080w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6818094448cbfee086dbc66a_Want%20to%20see%20Blinq%20in%20action_-2-p-1600.avif 1600w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6818094448cbfee086dbc66a_Want%20to%20see%20Blinq%20in%20action_-2.avif 2800w"
                                className="home-team_image-new"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section_home-built">
              <div className="padding-global">
                <div className="container-large">
                  <div className="home-built_comp">
                    <div className="home-built_text-comp u-relative z-index-1">
                      <h2 className="heading-style-h5">
                        Built for enterprise. Secure from day one.
                      </h2>
                      <div className="text-size-medium">
                        Centrally managed. Role-based. Fully brand-aligned.
                        DynamicNFC is secure, scalable, and designed to meet
                        enterprise standards without slowing you down.
                      </div>
                    </div>
                    <div className="home-built_card-comp">
                      <div className="home-built_card-wrap-01">
                        <img
                          src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f08e783498a0e9dae7_cardUseCase-1.avif"
                          loading="lazy"
                          alt=""
                          sizes="100vw"
                          srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f08e783498a0e9dae7_cardUseCase-1-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f08e783498a0e9dae7_cardUseCase-1-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f08e783498a0e9dae7_cardUseCase-1.avif 1116w"
                          className="home-built_card-image"
                        />
                      </div>
                      <div className="home-built_card-middle-comp">
                        <div className="home-built_card-wrap-02">
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f02f13168e1bfa1293_cardUseCase.avif"
                            loading="lazy"
                            alt=""
                            sizes="100vw"
                            srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f02f13168e1bfa1293_cardUseCase-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f02f13168e1bfa1293_cardUseCase-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f02f13168e1bfa1293_cardUseCase.avif 1116w"
                            className="home-built_card-image"
                          />
                        </div>
                        <div className="home-built_card-wrap-03">
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f02f2823e0567bccd0_cardUseCase-2.avif"
                            loading="lazy"
                            alt=""
                            sizes="100vw"
                            srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f02f2823e0567bccd0_cardUseCase-2-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f02f2823e0567bccd0_cardUseCase-2.avif 1116w"
                            className="home-built_card-image"
                          />
                        </div>
                        <div className="home-built_card-wrap-04">
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f12f13168e1bfa1320_cardUseCase-3.avif"
                            loading="lazy"
                            alt=""
                            sizes="(max-width: 1116px) 100vw, 1116px"
                            srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f12f13168e1bfa1320_cardUseCase-3-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f12f13168e1bfa1320_cardUseCase-3-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f12f13168e1bfa1320_cardUseCase-3.avif 1116w"
                            className="home-built_card-image"
                          />
                        </div>
                      </div>
                      <div className="home-built_card-wrap-05">
                        <img
                          src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f01965f5e7cf71f22d_cardUseCase-4.avif"
                          loading="lazy"
                          alt=""
                          sizes="(max-width: 1116px) 100vw, 1116px"
                          srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f01965f5e7cf71f22d_cardUseCase-4-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f01965f5e7cf71f22d_cardUseCase-4-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/681836f01965f5e7cf71f22d_cardUseCase-4.avif 1116w"
                          className="home-built_card-image"
                        />
                      </div>
                    </div>
                    <div className="home-built_image-wrap" />
                  </div>
                </div>
              </div>
            </div>
            <div className="section_home-scan">
              <div className="padding-global">
                <div className="container-large">
                  <div className="padding-section-large">
                    <div className="home-scan_comp">
                      <div className="home-scan_text-comp mob-less">
                        <div className="scan-heading-subtext-wrap">
                          <h2 className="heading-style-h5">
                            Scan It. Tap It. Link It.
                          </h2>
                          <div className="text-size-medium">
                            One account. So many ways to share.
                          </div>
                        </div>
                        <div className="swiper-pagination-buttons hide-tablet">
                          <div className="swiper-button-wrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              viewBox="0 0 56 56"
                              fill="none"
                              className="swiper-btn-prev"
                            >
                              <path
                                d="M44.334 28H11.6673"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M25.666 14L11.666 28L25.666 42"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div className="swiper-button-wrap">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="100%"
                              viewBox="0 0 56 56"
                              fill="none"
                              className="swiper-btn-next"
                            >
                              <path
                                d="M11.666 28H44.3327"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M30.334 14L44.334 28L30.334 42"
                                stroke="currentColor"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="home-scan_second-row">
                        <div className="swiper is-city">
                          <div className="swiper-wrapper is-city">
                            <div className="swiper-slide is-city">
                              <div className="css w-embed"></div>
                              <div className="home-scan_item is-1">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811c271c9585f180ea4a7e0_Share via QR code.avif"
                                  alt="A DynamicNFC Card and QR code"
                                  sizes="100vw"
                                  srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811c271c9585f180ea4a7e0_Share%20via%20QR%20code-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811c271c9585f180ea4a7e0_Share%20via%20QR%20code-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811c271c9585f180ea4a7e0_Share%20via%20QR%20code-p-1080.avif 1080w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811c271c9585f180ea4a7e0_Share%20via%20QR%20code-p-1600.avif 1600w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811c271c9585f180ea4a7e0_Share%20via%20QR%20code-p-2000.avif 2000w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6811c271c9585f180ea4a7e0_Share%20via%20QR%20code.avif 2160w"
                                  className="home-scan_image enterprise"
                                />
                                <div className="home-scan_heading-comp">
                                  <h3 className="heading-style-h6 swiper-sml">
                                    QR in App
                                  </h3>
                                  <div className="text-size-regular line-height-1">
                                    No clutter. No friction. Open the DynamicNFC app
                                    and share in seconds.
                                  </div>
                                  <Link
                                    to="/enterprise"
                                    className="business-second_button w-inline-block"
                                  >
                                    <div className="business-second_button-content">
                                      <div className="text-size-intermediate is-font-14 white-space">
                                        Learn more
                                      </div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100%"
                                        viewBox="0 0 24 25"
                                        fill="none"
                                        className="arrow-button-arrow"
                                      >
                                        <path
                                          d="M5 12.5H19"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M13 6.5L19 12.5L13 18.5"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div className="arrow-button-line" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                            <div className="swiper-slide is-city">
                              <div className="css w-embed"></div>
                              <div className="home-scan_item is-1 w-variant-12b7aecf-527c-17e8-1b32-3feecdc5f6b0">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6807c285c2ed03098a1f2251_NFC_card.avif"
                                  alt=""
                                  sizes="(max-width: 1080px) 100vw, 1080px"
                                  srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6807c285c2ed03098a1f2251_NFC_card-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6807c285c2ed03098a1f2251_NFC_card-p-800.avif 800w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6807c285c2ed03098a1f2251_NFC_card.avif 1080w"
                                  className="home-scan_image enterprise"
                                />
                                <div className="home-scan_heading-comp">
                                  <h3 className="heading-style-h6 swiper-sml">
                                    NFC Cards
                                  </h3>
                                  <div className="text-size-regular line-height-1">
                                    Link your account to a DynamicNFC NFC card that
                                    looks and feels premium.
                                  </div>
                                  <Link
                                    to="/nfc-cards"
                                    className="business-second_button w-inline-block"
                                  >
                                    <div className="business-second_button-content">
                                      <div className="text-size-intermediate is-font-14 white-space">
                                        Learn more
                                      </div>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="100%"
                                        viewBox="0 0 24 25"
                                        fill="none"
                                        className="arrow-button-arrow"
                                      >
                                        <path
                                          d="M5 12.5H19"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M13 6.5L19 12.5L13 18.5"
                                          stroke="currentColor"
                                          strokeWidth={2}
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <div className="arrow-button-line" />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="swiper-pagination-buttons hide-desk">
                        <div className="swiper-button-wrap">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            viewBox="0 0 56 56"
                            fill="none"
                            className="swiper-btn-prev"
                          >
                            <path
                              d="M44.334 28H11.6673"
                              stroke="currentColor"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M25.666 14L11.666 28L25.666 42"
                              stroke="currentColor"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <div className="swiper-button-wrap">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            viewBox="0 0 56 56"
                            fill="none"
                            className="swiper-btn-next"
                          >
                            <path
                              d="M11.666 28H44.3327"
                              stroke="currentColor"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M30.334 14L44.334 28L30.334 42"
                              stroke="currentColor"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section_home-name">
              <div className="home-scan-bg is-grey" />
              <div className="home-scan-bg is-white" />
              <div className="padding-global">
                <div className="container-large">
                  <div className="padding-section-large">
                    <div className="home-name_comp swip">
                      <div className="home-name_text-comp centered">
                        <h2 className="heading-style-h5">
                          DynamicNFC cards for every occasion
                        </h2>
                        <div className="text-size-medium">
                          DynamicNFC helps you make the best first impression.
                        </div>
                        <div>
                          <Link to="/create-card"
                            className="button analytics w-inline-block"
                          >
                            <div className="text-size-intermediate text-color-white btn">
                              Create digital card
                            </div>
                          </Link>
                        </div>
                      </div>
                      <div className="home-name_second-comp-tab">
                        <img
                          src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6807f421a4489b64a3afe3a4_Frame 2147226499 (1).avif"
                          loading="lazy"
                          sizes="100vw"
                          srcSet="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6807f421a4489b64a3afe3a4_Frame%202147226499%20(1)-p-500.avif 500w, https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6807f421a4489b64a3afe3a4_Frame%202147226499%20(1).avif 772w"
                          alt=""
                        />
                      </div>
                      <div className="home-name_second-comp hide-tablet">
                        <div
                          id="w-node-_1f6eb7fe-fe5b-be01-2903-571bd3481666-d3481657"
                          className="home-name_item-left"
                        >
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d62cf1e758d6645fb3d_Frame 2147226477.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image"
                          />
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d62c66687434a3d6a5e_Frame 2147226468.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image two"
                          />
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d6215f73f735b59ebed_Frame 2147226466.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image three"
                          />
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d6241d31769797e8cb0_Frame 2147226476.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image four"
                          />
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d628e86bb6812450ddc_Frame 2147226469.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image five"
                          />
                        </div>
                        <div
                          id="w-node-_1f6eb7fe-fe5b-be01-2903-571bd348166c-d3481657"
                          className="home-name_item-centre"
                        >
                          <div className="swiper is-photos w-dyn-list">
                            <div
                              role="list"
                              className="swiper-wrapper is-photos w-dyn-items"
                            >
                              <div
                                role="listitem"
                                className="swiper-slide is-photos w-dyn-item"
                              >
                                <img
                                  src="https://cdn.prod.website-files.com/617ac0d059899a69fd8216ec/67fe2f01e1618ec83361cdef_Card.webp"
                                  loading="lazy"
                                  alt=""
                                  className="home-name_image"
                                />
                              </div>
                              <div
                                role="listitem"
                                className="swiper-slide is-photos w-dyn-item"
                              >
                                <img
                                  src="https://cdn.prod.website-files.com/617ac0d059899a69fd8216ec/67fe2ef6c9719a9867d5578c_Card (1).webp"
                                  loading="lazy"
                                  alt=""
                                  className="home-name_image"
                                />
                              </div>
                              <div
                                role="listitem"
                                className="swiper-slide is-photos w-dyn-item"
                              >
                                <img
                                  src="../cdn.prod.website-files.com/617ac0d059899a69fd8216ec/68182ae6e8a9844055eb7b03_card-2.png"
                                  loading="lazy"
                                  alt=""
                                  sizes="100vw"
                                  srcSet="https://cdn.prod.website-files.com/617ac0d059899a69fd8216ec/68182ae6e8a9844055eb7b03_card-2-p-500.png 500w, https://cdn.prod.website-files.com/617ac0d059899a69fd8216ec/68182ae6e8a9844055eb7b03_card-2-p-800.png 800w, https://cdn.prod.website-files.com/617ac0d059899a69fd8216ec/68182ae6e8a9844055eb7b03_card-2-p-1080.png 1080w, https://cdn.prod.website-files.com/617ac0d059899a69fd8216ec/68182ae6e8a9844055eb7b03_card-2.png 1116w"
                                  className="home-name_image"
                                />
                              </div>
                              <div
                                role="listitem"
                                className="swiper-slide is-photos w-dyn-item"
                              >
                                <img
                                  src="https://cdn.prod.website-files.com/617ac0d059899a69fd8216ec/67fe2ed56a4b96be0af15254_Card (3).webp"
                                  loading="lazy"
                                  alt=""
                                  className="home-name_image"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          id="w-node-_1f6eb7fe-fe5b-be01-2903-571bd3481674-d3481657"
                          className="home-name_item-right"
                        >
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d62628df4f4d79f5751_Frame 2147226470.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image six"
                          />
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d62dc4ee14f9959d3b4_Frame 2147226472-1.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image seven"
                          />
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d623b72ab5b51d5842e_Frame 2147226472.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image eight"
                          />
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d620f8de0d527d64d99_Frame 2147226471.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image nine"
                          />
                          <img
                            src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68038d62ced31cba5c8e0527_Frame 2147226475.avif"
                            loading="lazy"
                            alt=""
                            className="user-profile-image ten"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="section_home-want">
              <div className="home-scan-bg" />
              <div className="home-scan-bg is-pink" />
              <div className="padding-global">
                <div className="container-large">
                  <div className="padding-section-large DynamicNFC-team">
                    <div className="home-want_comp">
                      <div className="home-want_item-left">
                        <div className="home-want_text-comp">
                          <h2 className="heading-style-h5">
                            Want DynamicNFC for your team?
                          </h2>
                          <div className="text-size-medium">
                            DynamicNFC makes it effortless to roll out digital cards
                            across your org. Stay on-brand and sync with your
                            systems - without the paper trail.
                          </div>
                        </div>
                        {/*  <div className="home-want_text-second-row">
                          <div className="text-size-medium text-color-mildblack">
                            Loved by industry leaders
                          </div>
                          <div className="logo2_list-wrapper pink">
                            <div className="logo2_list first">
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aa7c756c4d34c6d1c0ca_citibank.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aa8b448768be5e7c52e0_eagles.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aa9f34414e69c0638e24_exp realty.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aab3d041d62488eaf9c0_oceaneering.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aab3ee4b6f9c3ce602ab_pacers.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aab4f194ea39c1e4e05e_remax.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aab33b6dac019251c11c_uber.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812b212191979e1d7fde065_Untitled design (7).avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812b43cfcbcb90950dfd44d_Untitled design (8).avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                            </div>
                            <div className="logo2_list first">
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aa7c756c4d34c6d1c0ca_citibank.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aa8b448768be5e7c52e0_eagles.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aa9f34414e69c0638e24_exp realty.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aab3d041d62488eaf9c0_oceaneering.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aab3ee4b6f9c3ce602ab_pacers.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aab4f194ea39c1e4e05e_remax.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812aab33b6dac019251c11c_uber.avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812b212191979e1d7fde065_Untitled design (7).avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                              <div className="logo2_wrapper-2">
                                <img
                                  loading="lazy"
                                  src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/6812b43cfcbcb90950dfd44d_Untitled design (8).avif"
                                  alt=""
                                  className="logo2_logo-image"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="shade-pink-logos right" />
                          <div className="shade-pink-logos" />
                        </div> */}
                      </div>
                      <div className="home-team-video-wrapper">
                        <div
                          id="bg-video3"
                          className="home-team-video w-background-video w-background-video-atom"
                        >
                          <video
                            id="video4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/68120460370f08cb56e02658_04%20Stacks-Final-poster-00001.jpg"
                            style={{ width: "100%", height: "auto" }}
                          >
                            <source
                              src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9%2F68120460370f08cb56e02658_04%20Stacks-Final-transcode.mp4"
                              type="video/mp4"
                            />
                            <source
                              src="https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9%2F68120460370f08cb56e02658_04%20Stacks-Final-transcode.webm"
                              type="video/webm"
                            />
                          </video>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="home-want_cap" />
            </div>
            <Accordion items={faqItems} />
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
      <div className="custom-code w-embed"></div>
    </>

  )
}

export default Home
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from './User';
import QRCodeDisplay from '../../components/QRCodeDisplay/QRCodeDisplay';

function loadCssOnce(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

function Card() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = new URLSearchParams(window.location.search);
    const hashId = params.get('hashId');

    // Load CSS files
    useEffect(() => {
        loadCssOnce("/assets/css/card-page.css");
    }, []);

    // Generate QR URL for this card
    const cardUrl = `${window.location.origin}/card/?hashId=${encodeURIComponent(hashId || '')}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(cardUrl)}`;

    useEffect(() => {
        if (!hashId) return;

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/users/${hashId}`);
                if (!response.ok) throw new Error(`Error: ${response.status}`);
                const data = await response.json();
                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [hashId]);

    function downloadVCard(user) {
        const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${user.name}
ORG:${user.companyName}
TITLE:${user.jobTitle}
TEL;TYPE=WORK,VOICE:${user.phone}
EMAIL:${user.email}
ADR;TYPE=WORK:${user.address}
PHOTO;ENCODING=BASE64;TYPE=JPEG:${user.profilePicture.replace(/^data:image\/\w+;base64,/, '')}
END:VCARD
  `;

        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${user.name}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found</div>;

    return (
        <>
            <style>
                {`
                    .card-page-container {
                        display: flex;
                        flex-direction: row;
                        min-height: 100vh;
                        width: 100%;
                    }
                    .card-qr-section {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 24px;
                    }
                    .card-details-section {
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    @media (max-width: 768px) {
                        .card-page-container {
                            flex-direction: column-reverse;
                        }
                        .card-qr-section {
                            padding: 16px;
                        }
                    }
                `}
            </style>
            <div className="card-page-container" style={{ background: user.backgroundColor === '#FFFFFF' ? '#fcd6d5' : user.backgroundColor, position: 'relative' }}>
                <Link
                    to="/"
                    className="button analytics w-inline-block"
                    style={{ textDecoration: 'none', position: 'absolute', top: 16, left: 16, zIndex: 10 }}
                >
                    <div className="text-size-intermediate text-color-white btn">
                        Home
                    </div>
                </Link>
                <Link
                    to="/dashboard"
                    className="button analytics w-inline-block"
                    style={{ textDecoration: 'none', position: 'absolute', top: 16, left: 130, zIndex: 10 }}
                >
                    <div className="text-size-intermediate text-color-white btn">
                        Dashboard
                    </div>
                </Link>
                <div className="card-qr-section">
                    <QRCodeDisplay
                        qrUrl={qrUrl}
                        hashId={hashId}
                        successMessage="Scan to view this card"
                    />
                </div>
                <div className="card-details-section">
                    <div id="bg-card-bg">
                        <div
                            className="_1mwbo3a0 _1mwbo3a1"
                            style={{
                                '--tnkigl2c': '58,74,248',
                                '--tnkigl2d': '58,74,248, 0.14',
                                '--tnkigl2f': '255,255,255',
                                '--tnkigl2e': '#fff',
                                '--tnkigl2g': 'CardCustomFont, var(--tnkigl0)',
                                'min-height': '100%',
                                'padding': 'var(--tnkiglt)',
                                'display': 'flex',
                                'align-items': 'center',
                                'justify-content': 'center',
                                'flex-direction': 'column',
                                'gap': 'var(--tnkiglt)',
                                'flex-shrink': '0',
                                'width': '100%',
                            }}
                        >
                            <div className="_15zfejk0 _15zfejk1">
                                <header className="CardHeader_card-header__mOiLv"
                                    data-card-layout="1C"
                                    data-has-floating-images="false"
                                    data-image-type="cover">
                                    <div className="CardHeader_banner-image-container__6g0Pz">
                                        <img src={user.coverPhoto || "/assets/images/empty-cover-photo.5e4f5f6e.png"} alt="Cover" className="CardHeader_banner-image__2KOX9" />
                                    </div>
                                    <div className="CardHeader_left-picture__v05WN">
                                        <img src={user.profilePicture || "/assets/images/empty-profile-photo.5e4f5f6e.png"} alt="Profile" className="CardHeader_left-picture-img__yFgFE" />
                                    </div>
                                    <div className="CardHeader_right-picture__uGU1E">
                                        <img src={user.companyLogo || "/assets/images/empty-company-logo.5e4f5f6e.png"} alt="Logo" className="CardHeader_right-picture-img__L0u2u" />
                                    </div>
                                </header>
                                <div className="_4p4yt30">
                                    <div className="_4p4yt33">
                                        <div className="_4p4yt31">{user.name}</div>
                                    </div>
                                    <div className="_4p4yt32">{user.jobTitle}</div>
                                    <div className="_4p4yt32">{user.department}</div>
                                    <div className="_4p4yt32">{user.companyName}</div>
                                </div>
                                <ul className="ttlgl00">
                                    <li>
                                        <a className="_8oxuwz0" href={"tel:" + user.phone} rel="noreferrer" target="_blank">
                                            <div className="_11mr3km1">
                                                <svg data-prefix="fas" data-icon="phone" className="svg-inline--fa fa-phone _11mr3km0" role="img" viewBox="0 0 512 512" aria-hidden="true">
                                                    <path fill="white" d="M160.2 25C152.3 6.1 131.7-3.9 112.1 1.4l-5.5 1.5c-64.6 17.6-119.8 80.2-103.7 156.4 37.1 175 174.8 312.7 349.8 349.8 76.3 16.2 138.8-39.1 156.4-103.7l1.5-5.5c5.4-19.7-4.7-40.3-23.5-48.1l-97.3-40.5c-16.5-6.9-35.6-2.1-47 11.8l-38.6 47.2C233.9 335.4 177.3 277 144.8 205.3L189 169.3c13.9-11.3 18.6-30.4 11.8-47L160.2 25z"></path>
                                                </svg>
                                            </div>
                                            <div className="_8oxuwz1">
                                                <div className="_8oxuwz2" data-type="phoneNumber" style={{ textTransform: "capitalize" }}>{user.phone}</div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="_8oxuwz0" href={"mailto:" + user.email} rel="noreferrer" target="_blank">
                                            <div className="_11mr3km1">
                                                <svg data-prefix="fas" data-icon="envelope" className="svg-inline--fa fa-envelope _11mr3km0" role="img" viewBox="0 0 512 512" aria-hidden="true">
                                                    <path fill="white" d="M48 64c-26.5 0-48 21.5-48 48 0 15.1 7.1 29.3 19.2 38.4l208 156c17.1 12.8 40.5 12.8 57.6 0l208-156c12.1-9.1 19.2-23.3 19.2-38.4 0-26.5-21.5-48-48-48L48 64zM0 196L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-188-198.4 148.8c-34.1 25.6-81.1 25.6-115.2 0L0 196z"></path>
                                                </svg>
                                            </div>
                                            <div className="_8oxuwz1">
                                                <div className="_8oxuwz2" data-type="email">{user.email}</div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <a className="_8oxuwz0" href={user.companyUrl} rel="noreferrer" target="_blank">
                                            <div className="_11mr3km1">
                                                <svg aria-hidden="true" class="svg-inline--fa fa-link fa-w-16 " data-icon="link" data-prefix="far" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z" fill="white"></path></svg>
                                            </div>
                                            <div className="_8oxuwz1">
                                                <div className="_8oxuwz2" data-type="email">{user.companyUrl}</div>
                                            </div>
                                        </a>
                                    </li>
                                    {user.socialLinks.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                className="_8oxuwz0"
                                                href={link.link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <div className="_11mr3km1">
                                                    {/* İkonu platforma göre gösterebiliriz */}
                                                    {link.platform === "facebook" && (
                                                        <svg aria-hidden="true" class="svg-inline--fa fa-facebook " data-icon="facebook" data-prefix="fab" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" fill="white"></path></svg>
                                                    )}
                                                    {link.platform === "instagram" && (
                                                        <svg aria-hidden="true" class="svg-inline--fa fa-instagram " data-icon="instagram" data-prefix="fab" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" fill="white"></path></svg>
                                                    )}
                                                    {link.platform === "linkedin" && (
                                                        <svg aria-hidden="true" class="svg-inline--fa fa-linkedin-in " data-icon="linkedin-in" data-prefix="fab" focusable="false" role="img" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" fill="white"></path></svg>
                                                    )}
                                                    {link.platform === "twitter" && (
                                                        <svg aria-hidden="true" class="svg-inline--fa fa-x-twitter " data-icon="x-twitter" data-prefix="fab" focusable="false" role="img" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" fill="white"></path></svg>
                                                    )}
                                                    {link.platform === "youtube" && (
                                                        <svg aria-hidden="true" class="svg-inline--fa fa-youtube " data-icon="youtube" data-prefix="fab" focusable="false" role="img" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z" fill="white"></path></svg>
                                                    )}
                                                    {link.platform === "other" && (
                                                        <svg data-prefix="far" data-icon="link" role="img" viewBox="0 0 512 512" aria-hidden="true" class="svg-inline--fa fa-link fa-w-16 " focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="white" d="M314.222 197.78c51.091 51.091 54.377 132.287 9.75 187.16-6.242 7.73-2.784 3.865-84.94 86.02-54.696 54.696-143.266 54.745-197.99 0-54.711-54.69-54.734-143.255 0-197.99 32.773-32.773 51.835-51.899 63.409-63.457 7.463-7.452 20.331-2.354 20.486 8.192a173.31 173.31 0 0 0 4.746 37.828c.966 4.029-.272 8.269-3.202 11.198L80.632 312.57c-32.755 32.775-32.887 85.892 0 118.8 32.775 32.755 85.892 32.887 118.8 0l75.19-75.2c32.718-32.725 32.777-86.013 0-118.79a83.722 83.722 0 0 0-22.814-16.229c-4.623-2.233-7.182-7.25-6.561-12.346 1.356-11.122 6.296-21.885 14.815-30.405l4.375-4.375c3.625-3.626 9.177-4.594 13.76-2.294 12.999 6.524 25.187 15.211 36.025 26.049zM470.958 41.04c-54.724-54.745-143.294-54.696-197.99 0-82.156 82.156-78.698 78.29-84.94 86.02-44.627 54.873-41.341 136.069 9.75 187.16 10.838 10.838 23.026 19.525 36.025 26.049 4.582 2.3 10.134 1.331 13.76-2.294l4.375-4.375c8.52-8.519 13.459-19.283 14.815-30.405.621-5.096-1.938-10.113-6.561-12.346a83.706 83.706 0 0 1-22.814-16.229c-32.777-32.777-32.718-86.065 0-118.79l75.19-75.2c32.908-32.887 86.025-32.755 118.8 0 32.887 32.908 32.755 86.025 0 118.8l-45.848 45.84c-2.93 2.929-4.168 7.169-3.202 11.198a173.31 173.31 0 0 1 4.746 37.828c.155 10.546 13.023 15.644 20.486 8.192 11.574-11.558 30.636-30.684 63.409-63.457 54.733-54.735 54.71-143.3-.001-197.991z"></path></svg>
                                                    )}
                                                </div>
                                                <div className="_8oxuwz1">
                                                    <div className="_8oxuwz2" data-type="url" style={{ textTransform: "capitalize" }}>
                                                        {link.link}
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <div className="_1b2pq070">
                                    <button onClick={() => downloadVCard(user)}
                                        className="_1b2pq072">
                                        <span>Save Contact</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card


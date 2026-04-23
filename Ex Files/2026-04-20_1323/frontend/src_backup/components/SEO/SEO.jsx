import { Helmet } from 'react-helmet-async';

const DEFAULT = {
  title: 'DynamicNFC — Sales Velocity Engine',
  description: 'Transform NFC cards into private buyer portals with behavioral intelligence for real estate & automotive.',
  image: 'https://dynamicnfc.ca/og-image.png',
};

export default function SEO({ title, description, path = '' }) {
  const t = title ? `${title} | DynamicNFC` : DEFAULT.title;
  const d = description || DEFAULT.description;
  const url = `https://dynamicnfc.ca${path}`;

  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT.image} />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
    </Helmet>
  );
}

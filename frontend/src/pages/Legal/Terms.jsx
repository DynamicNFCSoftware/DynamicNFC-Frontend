import React from 'react';
import { useLanguage } from '../../i18n';
import SEO from '../../components/SEO/SEO';

const TR = {
  en: {
    title: 'Terms of Service',
    seoDesc: 'DynamicNFC Terms of Service',
    updated: 'Last updated: October 2026',
    sections: [
      { heading: '1. Acceptance of Terms', body: 'By accessing and using the DynamicNFC platform ("Service"), operated by NFC Software Systems Inc., you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.' },
      { heading: '2. Service Description', body: 'DynamicNFC provides digital NFC card creation, management, analytics, and related enterprise tools. We reserve the right to modify, suspend, or discontinue any part of the Service at any time.' },
      { heading: '3. User Accounts', body: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information and promptly update it if it changes. You are responsible for all activity under your account.' },
      { heading: '4. Acceptable Use', body: 'You agree not to use the Service for any unlawful purpose, to transmit harmful content, or to interfere with the operation of the Service. We reserve the right to terminate accounts that violate these terms.' },
      { heading: '5. Intellectual Property', body: 'All content, trademarks, and technology within the Service are the property of DynamicNFC or its licensors. You retain ownership of content you upload but grant us a license to use it for providing the Service.' },
      { heading: '6. Limitation of Liability', body: 'The Service is provided "as is" without warranties of any kind. DynamicNFC shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.' },
      { heading: '7. Contact', body: 'For questions about these Terms, contact us at info@dynamicnfc.help.' },
    ],
  },
  it: {
    title: 'Termini di servizio',
    seoDesc: 'Termini di servizio di DynamicNFC',
    updated: 'Ultimo aggiornamento: ottobre 2026',
    sections: [
      { heading: '1. Accettazione dei termini', body: 'Accedendo alla piattaforma DynamicNFC ("Servizio"), gestita da NFC Software Systems Inc., e utilizzandola, accetti di essere vincolato dai presenti Termini di servizio. Se non sei d\'accordo, non utilizzare il Servizio.' },
      { heading: '2. Descrizione del servizio', body: 'DynamicNFC fornisce la creazione e la gestione di card NFC digitali, analisi e strumenti aziendali correlati. Ci riserviamo il diritto di modificare, sospendere o interrompere qualsiasi parte del Servizio in qualsiasi momento.' },
      { heading: '3. Account utente', body: 'Sei responsabile del mantenimento della riservatezza delle credenziali del tuo account. Devi fornire informazioni accurate e aggiornarle tempestivamente in caso di variazioni. Sei responsabile di tutte le attività svolte tramite il tuo account.' },
      { heading: '4. Uso consentito', body: 'Accetti di non utilizzare il Servizio per scopi illeciti, di non trasmettere contenuti dannosi e di non interferire con il funzionamento del Servizio. Ci riserviamo il diritto di chiudere gli account che violano i presenti termini.' },
      { heading: '5. Proprietà intellettuale', body: 'Tutti i contenuti, i marchi e la tecnologia all\'interno del Servizio sono di proprietà di DynamicNFC o dei suoi licenzianti. Mantieni la proprietà dei contenuti che carichi, ma ci concedi una licenza per utilizzarli al fine di fornire il Servizio.' },
      { heading: '6. Limitazione di responsabilità', body: 'Il Servizio è fornito "così com\'è", senza garanzie di alcun tipo. DynamicNFC non sarà responsabile per eventuali danni indiretti, incidentali o consequenziali derivanti dal tuo utilizzo del Servizio.' },
      { heading: '7. Contatti', body: 'Per domande sui presenti Termini, contattaci all\'indirizzo info@dynamicnfc.help.' },
    ],
  },
  fr: {
    title: 'Conditions d\'utilisation',
    seoDesc: 'Conditions d\'utilisation de DynamicNFC',
    updated: 'Dernière mise à jour : octobre 2026',
    sections: [
      { heading: '1. Acceptation des conditions', body: 'En accédant à la plateforme DynamicNFC (le « Service »), exploitée par NFC Software Systems Inc., et en l\'utilisant, vous acceptez d\'être lié par les présentes Conditions d\'utilisation. Si vous n\'êtes pas d\'accord, n\'utilisez pas le Service.' },
      { heading: '2. Description du service', body: 'DynamicNFC fournit la création et la gestion de cartes NFC numériques, des analyses et des outils d\'entreprise connexes. Nous nous réservons le droit de modifier, de suspendre ou d\'interrompre toute partie du Service à tout moment.' },
      { heading: '3. Comptes d\'utilisateur', body: 'Vous êtes responsable de préserver la confidentialité des identifiants de votre compte. Vous devez fournir des renseignements exacts et les mettre à jour rapidement s\'ils changent. Vous êtes responsable de toute activité effectuée sous votre compte.' },
      { heading: '4. Utilisation acceptable', body: 'Vous acceptez de ne pas utiliser le Service à des fins illégales, de ne pas transmettre de contenu préjudiciable et de ne pas nuire au fonctionnement du Service. Nous nous réservons le droit de résilier les comptes qui enfreignent les présentes conditions.' },
      { heading: '5. Propriété intellectuelle', body: 'L\'ensemble du contenu, des marques de commerce et de la technologie du Service sont la propriété de DynamicNFC ou de ses concédants de licence. Vous conservez la propriété du contenu que vous téléversez, mais vous nous accordez une licence pour l\'utiliser afin de fournir le Service.' },
      { heading: '6. Limitation de responsabilité', body: 'Le Service est fourni « tel quel », sans garantie d\'aucune sorte. DynamicNFC ne saurait être tenue responsable de tout dommage indirect, accessoire ou consécutif découlant de votre utilisation du Service.' },
      { heading: '7. Contact', body: 'Pour toute question concernant les présentes Conditions, communiquez avec nous à info@dynamicnfc.help.' },
    ],
  },
  es: {
    title: 'Términos de servicio',
    seoDesc: 'Términos de servicio de DynamicNFC',
    updated: 'Última actualización: octubre de 2026',
    sections: [
      { heading: '1. Aceptación de los términos', body: 'Al acceder y usar la plataforma DynamicNFC (el "Servicio"), operada por NFC Software Systems Inc., aceptas quedar obligado por estos Términos de servicio. Si no estás de acuerdo, no uses el Servicio.' },
      { heading: '2. Descripción del servicio', body: 'DynamicNFC ofrece creación y gestión de tarjetas NFC digitales, analíticas y herramientas empresariales relacionadas. Nos reservamos el derecho de modificar, suspender o descontinuar cualquier parte del Servicio en cualquier momento.' },
      { heading: '3. Cuentas de usuario', body: 'Eres responsable de mantener la confidencialidad de las credenciales de tu cuenta. Debes proporcionar información precisa y actualizarla sin demora si cambia. Eres responsable de toda la actividad realizada en tu cuenta.' },
      { heading: '4. Uso aceptable', body: 'Aceptas no usar el Servicio para ningún fin ilícito, no transmitir contenido dañino y no interferir con el funcionamiento del Servicio. Nos reservamos el derecho de cancelar las cuentas que infrinjan estos términos.' },
      { heading: '5. Propiedad intelectual', body: 'Todo el contenido, las marcas y la tecnología dentro del Servicio son propiedad de DynamicNFC o de sus licenciantes. Conservas la propiedad del contenido que subes, pero nos otorgas una licencia para usarlo con el fin de prestar el Servicio.' },
      { heading: '6. Limitación de responsabilidad', body: 'El Servicio se proporciona "tal cual", sin garantías de ningún tipo. DynamicNFC no será responsable de ningún daño indirecto, incidental o consecuente que surja de tu uso del Servicio.' },
      { heading: '7. Contacto', body: 'Si tienes preguntas sobre estos Términos, contáctanos en info@dynamicnfc.help.' },
    ],
  },
  ar: {
    title: 'شروط الخدمة',
    seoDesc: 'شروط الخدمة لـ DynamicNFC',
    updated: 'آخر تحديث: أكتوبر ٢٠٢٦',
    sections: [
      { heading: '١. قبول الشروط', body: 'بالوصول إلى منصة DynamicNFC التي تشغّلها شركة NFC Software Systems Inc. واستخدامها ("الخدمة")، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق، لا تستخدم الخدمة.' },
      { heading: '٢. وصف الخدمة', body: 'توفر DynamicNFC إنشاء بطاقات NFC الرقمية وإدارتها والتحليلات وأدوات المؤسسات ذات الصلة. نحتفظ بالحق في تعديل أو تعليق أو إيقاف أي جزء من الخدمة في أي وقت.' },
      { heading: '٣. حسابات المستخدمين', body: 'أنت مسؤول عن الحفاظ على سرية بيانات اعتماد حسابك. يجب تقديم معلومات دقيقة وتحديثها فوراً عند التغيير. أنت مسؤول عن جميع الأنشطة تحت حسابك.' },
      { heading: '٤. الاستخدام المقبول', body: 'توافق على عدم استخدام الخدمة لأي غرض غير قانوني أو نقل محتوى ضار أو التدخل في تشغيل الخدمة. نحتفظ بالحق في إنهاء الحسابات التي تنتهك هذه الشروط.' },
      { heading: '٥. الملكية الفكرية', body: 'جميع المحتوى والعلامات التجارية والتكنولوجيا داخل الخدمة هي ملك لـ DynamicNFC أو مرخصيها. تحتفظ بملكية المحتوى الذي تحمّله ولكنك تمنحنا ترخيصاً لاستخدامه لتقديم الخدمة.' },
      { heading: '٦. تحديد المسؤولية', body: 'يتم تقديم الخدمة "كما هي" بدون ضمانات من أي نوع. لا تتحمل DynamicNFC أي مسؤولية عن أي أضرار غير مباشرة أو عرضية أو تبعية ناشئة عن استخدامك للخدمة.' },
      { heading: '٧. الاتصال', body: 'للأسئلة حول هذه الشروط، تواصل معنا على info@dynamicnfc.help.' },
    ],
  },
};

const Terms = () => {
  const { lang } = useLanguage();
  const isRTL = lang === 'ar';
  const t = TR[lang] || TR.en;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem', color: 'var(--text)' }}>
      <SEO title={t.title} description={t.seoDesc} path="/terms" />
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '.5rem' }}>{t.title}</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '.9rem' }}>{t.updated}</p>
      {t.sections.map((s, i) => (
        <section key={i} style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '.4rem' }}>{s.heading}</h2>
          <p style={{ lineHeight: 1.7, color: 'var(--text2)' }}>{s.body}</p>
        </section>
      ))}
    </div>
  );
};

export default Terms;

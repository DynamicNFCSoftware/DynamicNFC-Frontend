import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../i18n";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import SEO from "../../components/SEO/SEO";
import "./MyCard.css";

const UI = {
  en: {
    pageTitle: "My Business Card",
    backToDashboard: "← Back to Dashboard",
    showTour: "Show the tour",
    emptyTitle: "Your digital business card — included with your plan.",
    createCard: "Create card",
    preview: "Preview",
    edit: "Edit",
    delete: "Delete",
    share: "Share",
    copied: "Copied!",
    qr: "QR",
    scans: "scans",
    untitled: "Untitled card",
    holder: "Card holder",
    other: "Other cards",
    createAnother: "Create another card",
    digital: "Digital profile",
    digitalSub: "Share it with a link or a QR code.",
    physical: "Physical NFC card",
    physicalSub: "A card you can hand over.",
    deleteAsk: "Delete this card?",
    deleteFail: "Delete failed.",
    shareText: "Check out my digital business card",
    copyHint: "Copy this link:",
    qrSub: "Scan to view my digital card",
    shareLink: "Share link",
    copyLink: "Copy link",
    powered: "Powered by DynamicNFC",
    close: "Close",
    cancel: "Cancel",
    loadFail: "Could not load your cards.",
    fallbackName: "My card",
  },
  it: {
    pageTitle: "Il mio biglietto",
    backToDashboard: "← Torna alla Dashboard",
    showTour: "Mostra il tour",
    emptyTitle: "Il tuo biglietto da visita digitale — incluso nel piano.",
    createCard: "Crea biglietto",
    preview: "Anteprima",
    edit: "Modifica",
    delete: "Elimina",
    share: "Condividi",
    copied: "Copiato!",
    qr: "Codice QR",
    scans: "scansioni",
    untitled: "Biglietto senza nome",
    holder: "Titolare",
    other: "Altri biglietti",
    createAnother: "Crea un altro biglietto",
    digital: "Profilo digitale",
    digitalSub: "Condividilo con un collegamento o un codice QR.",
    physical: "Carta NFC fisica",
    physicalSub: "Una carta da consegnare di persona.",
    deleteAsk: "Eliminare questo biglietto?",
    deleteFail: "Eliminazione non riuscita.",
    shareText: "Guarda il mio biglietto da visita digitale",
    copyHint: "Copia questo collegamento:",
    qrSub: "Scansiona per vedere il mio biglietto digitale",
    shareLink: "Condividi collegamento",
    copyLink: "Copia collegamento",
    powered: "Offerto da DynamicNFC",
    close: "Chiudi",
    cancel: "Annulla",
    loadFail: "Impossibile caricare i biglietti.",
    fallbackName: "Il mio biglietto",
  },
  fr: {
    pageTitle: "Ma carte",
    backToDashboard: "← Retour au tableau de bord",
    showTour: "Revoir la visite guidée",
    emptyTitle: "Votre carte de visite numérique — incluse dans votre forfait.",
    createCard: "Créer la carte",
    preview: "Aperçu",
    edit: "Modifier",
    delete: "Supprimer",
    share: "Partager",
    copied: "Copié !",
    qr: "Code QR",
    scans: "lectures",
    untitled: "Carte sans nom",
    holder: "Titulaire",
    other: "Autres cartes",
    createAnother: "Créer une autre carte",
    digital: "Profil numérique",
    digitalSub: "Partagez-la par un lien ou un code QR.",
    physical: "Carte NFC physique",
    physicalSub: "Une carte à remettre en main propre.",
    deleteAsk: "Supprimer cette carte ?",
    deleteFail: "La suppression a échoué.",
    shareText: "Voici ma carte de visite numérique",
    copyHint: "Copiez ce lien :",
    qrSub: "Scannez pour voir ma carte numérique",
    shareLink: "Partager le lien",
    copyLink: "Copier le lien",
    powered: "Propulsé par DynamicNFC",
    close: "Fermer",
    cancel: "Annuler",
    loadFail: "Impossible de charger vos cartes.",
    fallbackName: "Ma carte",
  },
  es: {
    pageTitle: "Mi tarjeta",
    backToDashboard: "← Volver al panel",
    showTour: "Ver la guía otra vez",
    emptyTitle: "Tu tarjeta de visita digital — incluida en tu plan.",
    createCard: "Crear tarjeta",
    preview: "Vista previa",
    edit: "Editar",
    delete: "Eliminar",
    share: "Compartir",
    copied: "¡Copiado!",
    qr: "Código QR",
    scans: "escaneos",
    untitled: "Tarjeta sin nombre",
    holder: "Titular",
    other: "Otras tarjetas",
    createAnother: "Crear otra tarjeta",
    digital: "Perfil digital",
    digitalSub: "Compártela con un enlace o un código QR.",
    physical: "Tarjeta NFC física",
    physicalSub: "Una tarjeta para entregar en persona.",
    deleteAsk: "¿Eliminar esta tarjeta?",
    deleteFail: "No se pudo eliminar.",
    shareText: "Mira mi tarjeta de visita digital",
    copyHint: "Copia este enlace:",
    qrSub: "Escanea para ver mi tarjeta digital",
    shareLink: "Compartir enlace",
    copyLink: "Copiar enlace",
    powered: "Con la tecnología de DynamicNFC",
    close: "Cerrar",
    cancel: "Cancelar",
    loadFail: "No se pudieron cargar tus tarjetas.",
    fallbackName: "Mi tarjeta",
  },
};

function ConfirmBox({ title, onCancel, onConfirm, confirmLabel, cancelLabel, busy }) {
  return (
    <div className="mc-confirm-backdrop" onClick={() => !busy && onCancel()}>
      <div className="mc-confirm" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="mc-confirm-title">{title}</div>
        <div className="mc-confirm-actions">
          <button type="button" className="mc-confirm-btn mc-confirm-btn--ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button type="button" className="mc-confirm-btn mc-confirm-btn--primary" onClick={onConfirm} disabled={busy}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyCard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ui = useMemo(() => ({ ...UI.en, ...(UI[lang] || {}) }), [lang]);
  const [cards, setCards] = useState([]);
  const [ready, setReady] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [qrCardId, setQrCardId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const uid = user?.uid || user?.accountId;
    if (!user || !uid) {
      setReady(true);
      return undefined;
    }
    const q = query(collection(db, "cards"), where("userId", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      setCards(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setReady(true);
    }, () => {
      setReady(true);
      setToast({ kind: "error", text: ui.loadFail });
    });
    return () => unsub();
  }, [user, ui.loadFail]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const primaryCard = cards[0] || null;
  const otherCards = cards.slice(1);
  const cardUrl = (id) => `${window.location.origin}/card/?hashId=${id}`;

  const showCopied = () => setToast({ kind: "success", text: ui.copied });

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showCopied();
    } catch {
      setToast({ kind: "info", text: `${ui.copyHint} ${url}` });
    }
  };

  const handleShare = async (id) => {
    const url = cardUrl(id);
    const card = cards.find((c) => c.id === id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card?.name || ui.fallbackName} - DynamicNFC`,
          text: ui.shareText,
          url,
        });
        return;
      } catch (e) {
        if (e.name === "AbortError") return;
      }
    }
    await copyLink(url);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      setDeleting(pendingDelete);
      await deleteDoc(doc(db, "cards", pendingDelete));
      setPendingDelete(null);
    } catch {
      setToast({ kind: "error", text: ui.deleteFail });
    } finally {
      setDeleting(null);
    }
  };

  const accentStyle = (card, prop) => (card?.accentColor ? { [prop]: card.accentColor } : undefined);

  const qrCard = cards.find((c) => c.id === qrCardId);

  return (
    <main className="mc-page">
      <SEO title={ui.pageTitle} path="/my-card" />
      <div className="mc-container">
        <div className="mc-top">
          <Link to="/unified" className="mc-back">{ui.backToDashboard}</Link>
          <button type="button" className="mc-tour" onClick={() => window.dispatchEvent(new Event('dnfc:show-tour'))}>
            {ui.showTour}
          </button>
        </div>
        <h1 className="mc-title">{ui.pageTitle}</h1>

        {ready && cards.length === 0 && (
          <div className="mc-empty">
            <p className="mc-empty-title">{ui.emptyTitle}</p>
            <button type="button" className="mc-btn mc-btn--primary" onClick={() => navigate("/create-card")}>
              {ui.createCard}
            </button>
          </div>
        )}

        {ready && primaryCard && (
          <>
            <article className="mc-card mc-hero">
              <div
                className="mc-cover"
                style={primaryCard.images?.cover ? { backgroundImage: `url(${primaryCard.images.cover})` } : undefined}
              >
                <div className="mc-scans">
                  {primaryCard.scans || 0} {ui.scans}
                </div>
              </div>
              <div className="mc-info">
                <div className="mc-avatar" style={accentStyle(primaryCard, "borderColor")}>
                  {primaryCard.images?.profile
                    ? <img src={primaryCard.images.profile} alt="" />
                    : <span>{(primaryCard.name || ui.fallbackName).charAt(0)}</span>}
                </div>
                {primaryCard.images?.company && (
                  <img className="mc-company" src={primaryCard.images.company} alt="" />
                )}
                <h2 className="mc-name">{primaryCard.name || ui.untitled}</h2>
                <div className="mc-role" style={accentStyle(primaryCard, "color")}>{primaryCard.title || ui.holder}</div>
                {primaryCard.company && <div className="mc-company-name">{primaryCard.company}</div>}
              </div>
              <div className="mc-actions">
                <Link className="mc-btn mc-btn--ghost" to={`/card/?hashId=${primaryCard.id}`} target="_blank" rel="noreferrer">
                  {ui.preview}
                </Link>
                <button type="button" className="mc-btn mc-btn--ghost" onClick={() => navigate(`/edit-card?hashId=${primaryCard.id}`)}>
                  {ui.edit}
                </button>
                <button type="button" className="mc-btn mc-btn--ghost" onClick={() => handleShare(primaryCard.id)}>
                  {ui.share}
                </button>
                <button type="button" className="mc-btn mc-btn--ghost" onClick={() => setQrCardId(primaryCard.id)}>
                  {ui.qr}
                </button>
                <button type="button" className="mc-btn mc-btn--danger" onClick={() => setPendingDelete(primaryCard.id)} disabled={deleting === primaryCard.id}>
                  {ui.delete}
                </button>
              </div>
            </article>

            {otherCards.length > 0 && (
              <section className="mc-section">
                <h3 className="mc-heading">{ui.other} ({otherCards.length})</h3>
                <div className="mc-grid">
                  {otherCards.map((card) => (
                    <article className="mc-card mc-other" key={card.id}>
                      <div
                        className="mc-other-cover"
                        style={card.images?.cover ? { backgroundImage: `url(${card.images.cover})` } : accentStyle(card, "backgroundColor")}
                      />
                      <div className="mc-other-body">
                        <div className="mc-name">{card.name || ui.untitled}</div>
                        <div className="mc-role" style={accentStyle(card, "color")}>{card.title || ui.holder}</div>
                        <div className="mc-meta">{card.scans || 0} {ui.scans}</div>
                      </div>
                      <div className="mc-actions">
                        <button type="button" className="mc-btn mc-btn--ghost" onClick={() => setQrCardId(card.id)}>{ui.qr}</button>
                        <button type="button" className="mc-btn mc-btn--ghost" onClick={() => handleShare(card.id)}>{ui.share}</button>
                        <button type="button" className="mc-btn mc-btn--ghost" onClick={() => navigate(`/edit-card?hashId=${card.id}`)}>{ui.edit}</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="mc-section">
              <h3 className="mc-heading">{ui.createAnother}</h3>
              <div className="mc-grid">
                <button type="button" className="mc-card mc-create" onClick={() => navigate("/create-card")}>
                  <strong>{ui.digital}</strong>
                  <span>{ui.digitalSub}</span>
                </button>
                <button type="button" className="mc-card mc-create" onClick={() => navigate("/create-physical-card")}>
                  <strong>{ui.physical}</strong>
                  <span>{ui.physicalSub}</span>
                </button>
              </div>
            </section>
          </>
        )}
      </div>

      {toast && (
        <div className={`mc-toast mc-toast--${toast.kind}`} role="status">{toast.text}</div>
      )}

      {pendingDelete && (
        <ConfirmBox
          title={ui.deleteAsk}
          confirmLabel={ui.delete}
          cancelLabel={ui.cancel}
          busy={deleting === pendingDelete}
          onCancel={() => setPendingDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {qrCardId && (
        <div className="mc-qr-backdrop" onClick={() => setQrCardId(null)}>
          <div className="mc-qr" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={ui.qr}>
            <button type="button" className="mc-btn mc-btn--ghost mc-qr-close" onClick={() => setQrCardId(null)} aria-label={ui.close}>
              {ui.close}
            </button>
            <div className="mc-name">{qrCard?.name || ui.fallbackName}</div>
            <div className="mc-meta">{ui.qrSub}</div>
            <img
              className="mc-qr-img"
              alt={ui.qr}
              src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(cardUrl(qrCardId))}&color=1a1a1f&bgcolor=ffffff&margin=8`}
            />
            <div className="mc-url">{cardUrl(qrCardId)}</div>
            <div className="mc-actions">
              <button type="button" className="mc-btn mc-btn--primary" onClick={() => handleShare(qrCardId)}>{ui.shareLink}</button>
              <button type="button" className="mc-btn mc-btn--ghost" onClick={() => copyLink(cardUrl(qrCardId))}>{ui.copyLink}</button>
            </div>
            <div className="mc-meta">{ui.powered}</div>
          </div>
        </div>
      )}
    </main>
  );
}

import React, { useState } from "react";
import { AUDIENCES, CHANNELS, OBJECTIVES, buildDefaultCampaignName } from "./campaignUtils";

const toDateInput = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value.slice(0, 10);
  if (value?.toDate) return value.toDate().toISOString().slice(0, 10);
  if (value?.seconds) return new Date(value.seconds * 1000).toISOString().slice(0, 10);
  return "";
};

export default function AddCampaignModal({
  tx,
  onClose,
  onSave,
  initialValues = null,
  mode = "create",
  submitLabel,
}) {
  const isEditMode = mode === "edit";
  const [name, setName] = useState(initialValues?.name || buildDefaultCampaignName());
  const [client, setClient] = useState(initialValues?.client || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [objective, setObjective] = useState(initialValues?.objective || "");
  const [targetAudience, setTargetAudience] = useState(initialValues?.targetAudience || "");
  const [channel, setChannel] = useState(Array.isArray(initialValues?.channel) ? initialValues.channel : []);
  const [budget, setBudget] = useState(String(initialValues?.budget ?? 0));
  const [spent, setSpent] = useState(String(initialValues?.spent ?? 0));
  const [startDate, setStartDate] = useState(toDateInput(initialValues?.startDate));
  const [endDate, setEndDate] = useState(toDateInput(initialValues?.endDate));
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const toggleChannel = (ch) => {
    setChannel((prev) => (prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]));
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length < 3 || trimmed.length > 80) {
      setError(tx.nameRequired);
      return;
    }
    setBusy(true);
    try {
      await onSave({
        name: trimmed,
        client: client.trim(),
        description: description.trim(),
        objective,
        targetAudience,
        channel,
        budget: parseInt(budget, 10) || 0,
        spent: parseInt(spent, 10) || 0,
        startDate: startDate || null,
        endDate: endDate || null,
        ...(!isEditMode ? { status: "draft", source: "manual" } : {}),
      });
      onClose();
    } catch (err) {
      setError(err.message || tx.createFailed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ud-cmp-drawer-backdrop" onClick={onClose}>
      <div className="ud-cmp-modal ud-cmp-modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="ud-cmp-modal__title">{isEditMode ? tx.editCampaign : tx.addCampaign}</div>

        <div className="ud-cmp-modal__row">
          <div className="ud-cmp-modal__field ud-cmp-modal__field--grow">
            <label className="ud-cmp-modal__label">{tx.campaignName}</label>
            <input
              className="ud-cmp-input"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder={tx.campaignNamePlaceholder}
              maxLength={80}
              autoFocus
            />
          </div>
          <div className="ud-cmp-modal__field">
            <label className="ud-cmp-modal__label">{tx.clientLabel}</label>
            <input
              className="ud-cmp-input"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder={tx.clientPlaceholder}
            />
          </div>
        </div>

        <label className="ud-cmp-modal__label">{tx.descriptionLabel}</label>
        <textarea
          className="ud-cmp-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value.slice(0, 500))}
          placeholder={tx.descriptionPlaceholder}
          rows={3}
          maxLength={500}
        />
        <div className="ud-cmp-char-count">{description.length}/500</div>

        <div className="ud-cmp-modal__row">
          <div className="ud-cmp-modal__field">
            <label className="ud-cmp-modal__label">{tx.objectiveLabel}</label>
            <select className="ud-cmp-select" value={objective} onChange={(e) => setObjective(e.target.value)}>
              <option value="">{tx.objectivePlaceholder}</option>
              {OBJECTIVES.map((o) => (
                <option key={o} value={o}>{tx[`obj_${o}`] || o}</option>
              ))}
            </select>
          </div>
          <div className="ud-cmp-modal__field">
            <label className="ud-cmp-modal__label">{tx.audienceLabel}</label>
            <select className="ud-cmp-select" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)}>
              <option value="">{tx.audiencePlaceholder}</option>
              {AUDIENCES.map((a) => (
                <option key={a} value={a}>{tx[`aud_${a}`] || a}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="ud-cmp-modal__label">{tx.channelLabel}</label>
        <div className="ud-cmp-checkbox-group">
          {CHANNELS.map((ch) => (
            <label key={ch} className={`ud-cmp-checkbox-item${channel.includes(ch) ? " ud-cmp-checkbox-item--checked" : ""}`}>
              <input
                type="checkbox"
                checked={channel.includes(ch)}
                onChange={() => toggleChannel(ch)}
              />
              <span>{tx[`ch_${ch}`] || ch}</span>
            </label>
          ))}
        </div>

        <div className="ud-cmp-modal__row">
          <div className="ud-cmp-modal__field">
            <label className="ud-cmp-modal__label">{tx.budgetLabel}</label>
            <input
              className="ud-cmp-input"
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder={tx.budgetPlaceholder}
            />
          </div>
          {isEditMode && (
            <div className="ud-cmp-modal__field">
              <label className="ud-cmp-modal__label">{tx.spentLabel}</label>
              <input
                className="ud-cmp-input"
                type="number"
                min={0}
                value={spent}
                onChange={(e) => setSpent(e.target.value)}
                placeholder="0"
              />
            </div>
          )}
        </div>

        <div className="ud-cmp-modal__row">
          <div className="ud-cmp-modal__field">
            <label className="ud-cmp-modal__label">{tx.startDateLabel}</label>
            <input
              className="ud-cmp-date-input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="ud-cmp-modal__field">
            <label className="ud-cmp-modal__label">{tx.endDateLabel}</label>
            <input
              className="ud-cmp-date-input"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {error && <div className="ud-cmp-error">{error}</div>}

        <div className="ud-cmp-modal__actions">
          <button className="ud-cmp-btn ud-cmp-btn--ghost" onClick={onClose} disabled={busy}>
            {tx.cancel}
          </button>
          <button className="ud-cmp-btn ud-cmp-btn--primary" onClick={handleSave} disabled={busy}>
            {busy ? (tx.save || "Save") : submitLabel || (isEditMode ? tx.saveChanges : tx.create)}
          </button>
        </div>
      </div>
    </div>
  );
}
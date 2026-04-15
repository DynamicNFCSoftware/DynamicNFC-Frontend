import React, { useState } from "react";
import { AUDIENCES, CHANNELS, OBJECTIVES, buildDefaultCampaignName } from "./campaignUtils";

export default function AddCampaignModal({ tx, onClose, onSave }) {
  const [name, setName] = useState(buildDefaultCampaignName());
  const [client, setClient] = useState("");
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [channel, setChannel] = useState([]);
  const [budget, setBudget] = useState("0");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
        startDate: startDate || null,
        endDate: endDate || null,
        status: "draft",
        source: "manual",
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
        <div className="ud-cmp-modal__title">{tx.addCampaign}</div>

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
              min={startDate || undefined}
            />
          </div>
        </div>

        {!!error && <div className="ud-cmp-error">{error}</div>}

        <div className="ud-cmp-modal__actions">
          <button className="ud-cmp-btn ud-cmp-btn--ghost" onClick={onClose} disabled={busy}>{tx.cancel}</button>
          <button className="ud-cmp-btn ud-cmp-btn--primary" onClick={handleSave} disabled={busy}>{tx.create}</button>
        </div>
      </div>
    </div>
  );
}
# Five-Minute Proof — Seedance 2.0 clip prompts (9 clips)

Goal: cinematic **background clips** for the 5 tutorial steps. All words, names, scores, dates and labels are added
later by code on top of the video (5 languages, every region). So the clips must contain **no text and no faces**.

## Settings for every clip
- Mode: Text-to-Video, or Reference mode when a reference image is listed.
- Duration **8 s** · aspect **16:9** · **1080p** (we compress to 720p later) · no audio.
- The tutorial frame is wider than 16:9 (2:1): keep the important action in the **middle 80 % of the height**.
- Each clip must **loop cleanly**: the last second calms to a near-still frame that matches the first frame.
- Add this line at the end of every prompt (negative / constraints):
  `No text, no letters, no numbers, no logos, no watermarks, no human faces. Hands only if people appear. No camera shake.`

## Look (paste once at the top of each prompt, or as style reference)
`Quiet luxury, editorial product film. Deep navy (#0a1322), charcoal (#1a1a1f), warm champagne-gold light (#e9d5a8),
cream (#faf8f5), small accents of crimson red (#e63946) and steel blue (#457b9d). Soft shadows, shallow depth of field,
slow controlled camera, 35 mm lens look, subtle gold dust particles.`

## Reference images to upload (up to 9 allowed)
1. Premium Box + card render — screenshot Step 1 of the current tutorial (navy box, black metal card), crop to the box.
2. The black metal VIP Access Key card alone (front), if you have a photo or mock-up.
3. Optional mood: one photo each of a Lake Como villa terrace, a supercar showroom, a Portofino marina (for 2a/2b/2c and 5a/5b/5c).
In Reference mode write e.g. "Image 1 sets the look of the box and card."

---

## Clip 1 — Identity (all sectors) · file `step1-identity.mp4`
Leave the **right third** calm and dark (the name plate is overlaid there).
```
A navy linen presentation box rests on a dark stone surface under a single warm spotlight. The lid lifts slowly; warm
champagne light spills out with fine gold dust. A brushed black metal card with a thin gold holographic stripe rises from
the silk lining and tilts slightly toward camera. A hand holding a dark smartphone enters from the left and lightly touches
the phone to the card. At the moment of contact, two soft concentric rings of light pulse outward from the card. A thin
line of light travels from the card to the right side of the frame and fades into the darkness. Slow push-in, then hold.
```

## Clip 2 — Track (3 variants) · leave the **right half** calm (pipeline rows are overlaid there)
**2a Real estate** · `step2-track-realestate.mp4`
```
Close-up of a hand scrolling a smartphone showing an elegant abstract architectural floor plan drawn in thin light lines.
The fingertip taps three times; with each tap a small glowing particle (blue, then gold, then red) lifts off the screen
and travels along a smooth curved light path to the right side of the frame, where it settles into a soft horizontal
glowing slot. Background: blurred evening view of a lake villa terrace. Slow lateral dolly to the right.
```
**2b Automotive** · `step2-track-auto.mp4`
```
Close-up of a hand on a smartphone showing a minimal wireframe silhouette of a luxury sports car rotating slowly in light
lines. Three taps; each releases a small glowing particle (blue, gold, red) that flies along a curved light path to the
right side of the frame and settles into a soft horizontal glowing slot. Background: dark premium car showroom, polished
floor reflections, blurred. Slow lateral dolly to the right.
```
**2c Yacht** · `step2-track-yacht.mp4`
```
Close-up of a hand on a smartphone showing a minimal wireframe side profile of a motor yacht in thin light lines. Three
taps; each releases a small glowing particle (blue, gold, red) that flies along a curved light path to the right side
of the frame and settles into a soft horizontal glowing slot. Background: blurred Mediterranean marina at golden hour,
water reflections. Slow lateral dolly to the right.
```

## Clip 3 — Score (all sectors) · `step3-score.mp4`
Keep the **centre** clear (the ranked list is overlaid there).
```
Abstract data sculpture in a dark space: three thin vertical glass bars stand side by side on a reflective navy floor.
Small light particles stream in from the left and flow into the first bar, which fills with warm crimson-red light and
rises above the other two; the second bar glows soft gold at medium height, the third stays dim steel blue. A gentle
shockwave of light passes once when the first bar overtakes the others. Slow orbit of 15 degrees, then hold.
```

## Clip 4 — Alert (all sectors) · `step4-alert.mp4`
Leave the **right half** of the phone screen area plain (the alert card is overlaid on it).
```
A dark smartphone lies face-up on a polished marble desk in a calm, dim executive office at dusk. The screen wakes with a
soft warm glow and a gentle crimson pulse at its top edge; a single ring of light ripples once across the desk surface.
A hand enters and picks the phone up, turning the screen toward camera (screen shows only soft abstract light, no
interface details). Shallow depth of field, slow push-in.
```

## Clip 5 — Close (3 variants) · leave the **upper centre** calm (booking confirmation is overlaid there)
**5a Real estate · private viewing** · `step5-close-realestate.mp4`
```
Golden-hour light in the entrance of a luxury penthouse with floor-to-ceiling windows over a lake. One hand passes a
slim brass key with a leather tag to another hand; both hands only, elegant sleeves. A soft burst of fine gold dust
drifts upward. Camera slowly tilts up to the bright view and holds.
```
**5b Automotive · test drive** · `step5-close-auto.mp4`
```
A premium car showroom at dusk. A hand places a sleek car key fob on a dark leather tray; another hand picks it up.
Behind, softly out of focus, the headlights of a luxury sports car turn on with a gentle sweep. A soft burst of fine gold
dust drifts upward. Slow push-in, then hold.
```
**5c Yacht · sea trial** · `step5-close-yacht.mp4`
```
Golden hour on a Mediterranean marina. The teak passerelle of a large motor yacht lowers slowly onto the quay; a gloved
crew hand gestures welcome (hand only). Water sparkles, a soft burst of fine gold dust drifts upward. Slow crane up
revealing the bow, then hold.
```

---

## After generating
- Pick the best take of each. Check: no letters anywhere (also on screens and signs), no faces, clean loop.
- Export MP4 (H.264). Name the files exactly as above and put them in
  `frontend/src/components/UnifiedDashboard/FiveMinuteProof/media/`. Also export one still frame per clip
  (the most representative moment) as `<same-name>.jpg` — used as poster and for reduced-motion users.
- Target size: under 2 MB per clip after compression (Cursor will compress if needed).

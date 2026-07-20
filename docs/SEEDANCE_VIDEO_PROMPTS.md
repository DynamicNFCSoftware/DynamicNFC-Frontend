# DynamicNFC Web Tanıtım Videosu — Seedance 2.0 Prompt Paketi
2026-07-14 · Kullanım: Text-to-Video · 1080p (final 4K) · 16:9 · 10s/klip · With Audio

## Strateji (önce oku)

AI video modelleri **okunabilir arayüz metni ve logo üretemez** — dashboard/portal ekranlarını Seedance'e çizdirmeye çalışma, bulanık ve uydurma UI çıkar. Doğru formül:

- **Seedance** → sinematik hikaye katmanı (kutu, kart, tap anı, ışık, atmosfer)
- **Gerçek ekran kaydı** → portal + Unified Dashboard (zaten canlı ve etkileyici)
- **Post** (CapCut/Premiere) → klipleri birleştir, gerçek logo + altyazı + CTA bindir

Önerilen kurgu (45–55s toplam):
`Klip 1 (10s) → Ekran kaydı: portal (8s) → Klip 2 (10s) → Ekran kaydı: dashboard + Sales Trigger (8s) → Klip 3 (10s) → Logo end-card (4s)`

Her prompt bağımsız çalışır; aynı stil bloğunu içerir ki klipler tutarlı görünsün. Batch=2 üret, iyi çıkanı seç.

---

## KLİP 1 — "The Private Invitation" (kutu + kart reveal)

```
Cinematic luxury product film, 10 seconds. A matte charcoal-black premium gift box sits on a dark walnut table in a dimly lit penthouse lounge at dusk, city lights bokeh through floor-to-ceiling windows behind. Elegant male hands with a subtle wristwatch slowly lift the lid. Inside, nested in deep navy silk, lies a single sleek metal business card with a brushed silver finish and a faint embossed wave symbol, glowing with a soft cool blue edge light (#457b9d). Slow push-in macro shot as the card is lifted and catches the light. Warm amber room light contrasts with the cool blue glow of the card. Shallow depth of field, anamorphic lens flare, 35mm film grain, ultra-realistic, high-end commercial advertising style like a luxury watch commercial. No text, no logos, no faces shown clearly. Audio: soft cinematic ambient pad, a single deep piano note when the lid opens, quiet room tone.
```

**Kurguda üstüne bindir:** "Your next buyer already has a name." + küçük DynamicNFC logo.

---

## KLİP 2 — "The Tap" (kimlik anı — ürünün kalbi)

```
Cinematic close-up, 10 seconds. In an elegant real estate sales gallery with warm marble and brass details, a well-dressed man's hand holds a sleek metal NFC card and taps it gently against the top edge of a smartphone. At the exact moment of contact, a soft pulse of blue light (#457b9d) ripples outward from the contact point in slow motion, like a ring of light traveling across the phone. The phone screen illuminates with an abstract elegant glow of navy and gold light — screen content intentionally soft-focus and abstract, not readable. Camera orbits slowly around the moment of the tap, 120fps slow-motion feel, shallow depth of field, luxury tech commercial aesthetic, dark editorial tones with gold accent highlights, ultra-realistic skin and metal textures. No readable text, no logos. Audio: rising subtle whoosh into a soft crystalline chime exactly at the tap moment, then warm ambient resolve.
```

**Kurguda üstüne bindir:** "One tap. The ultimate opt-in." → ardından GERÇEK portal ekran kaydına kes (Khalid/Marc portalı, mobil çerçeve içinde).

---

## KLİP 3 — "The Sales Floor" (istihbarat + kapanış)

```
Cinematic sequence, 10 seconds. A confident sales executive in a tailored navy suit stands in a modern penthouse sales office at golden hour, holding a tablet, looking at it with a calm knowing smile. Behind her, out-of-focus, a large wall screen glows with abstract data visualization light in deep blue and warm red tones (#457b9d and #e63946) — charts intentionally abstract and unreadable. She looks up from the tablet toward the door as a silhouetted VIP client walks in, and she steps forward extending her hand in greeting. Slow dolly-in, warm golden-hour light through large windows, dark luxury editorial grade, shallow depth of field, high-end corporate brand film style, ultra-realistic. No readable text or logos. Audio: warm cinematic swell building to a confident resolve, soft footsteps, gentle office ambience.
```

**Kurguda üstüne bindir:** "Your team knows exactly when to call — and why." → GERÇEK Unified Dashboard ekran kaydı (Sales Trigger yanması) → end-card.

---

## Alternatif: Tek klip "Hero Loop" (site üstü sessiz arka plan videosu)

Ana sayfa hero'suna koyacaksan ses/anlatım yok, kusursuz loop:

```
Seamless looping cinematic macro shot, 10 seconds. A sleek brushed-metal business card with a subtle embossed wave symbol slowly rotates floating in a dark charcoal void. Soft blue light waves (#457b9d) pulse rhythmically outward from the card edge like NFC signal rings, dissolving into fine particles of warm gold dust that drift upward. Deep navy background with faint bokeh, dramatic rim lighting, ultra-realistic metal reflections, luxury product cinematography, anamorphic, film grain. Loop-friendly: end state matches start state. No text, no logos, no hands. Audio: none needed.
```

---

## Voiceover metni (post'ta eklenecek — Seedance'e verme)

TR pazarına değil web'e: EN ana, AR altyazı. ~50s tempo:

> "Every developer has the same blind spot: anonymous traffic. (beat)
> DynamicNFC replaces it with a name. A selected prospect receives a private invitation — a VIP Access Key. (beat)
> One tap opens an experience built only for them. And every signal — every floor plan, every price request — reaches your team in real time. (beat)
> No guesswork. No cold calls. Just the right conversation, at the right moment. (beat)
> DynamicNFC. Your next buyer already has a name."

## Teknik notlar

- **Ayarlar:** 1080p ile prompt'u test et, beğendiğin varyantı 4K'da yeniden üret. Duration 10s. Aspect 16:9 (Instagram versiyonu için aynı prompt'u 9:16 ile tekrar koştur — kadrajı "vertical composition" ekleyerek).
- **Yüz tutarlılığı:** Klip 2 ve 3'te aynı oyuncu görünmesin diye dert etme — farklı kişiler olması sorun değil (müşteri + satışçı). Aynı kişi gerekirse Multi Reference sekmesine geç ve Klip 2'den bir kare ver.
- **Marka rengi asla değişmesin:** Prompt'lardaki #457b9d / #e63946 sabit — Seedance hex'i yaklaşık algılar, çıktıda mavi "elektrik mavisi"ne kayarsa prompt'a "muted steel blue, not neon" ekle.
- **Fake metric yok:** Videoda hiçbir yerde %47, 3.2× gibi rakam kullanma — overlay metinleri yukarıdaki qualitative dille sınırlı.
- **Ekran kayıtları:** Portal kaydını telefon mockup çerçevesinde (CleanShot/CapCut device frame), dashboard kaydını hafif perspektifli göster. Kayıttan önce region'ı hedef pazara çevir — USA pitch sayfası için James Mitchell/USD görünmeli.
```

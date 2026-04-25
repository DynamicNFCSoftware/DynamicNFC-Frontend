\# Napkin Runbook



\## Curation Rules

\- Re-prioritize on every read.

\- Keep recurring, high-value notes only.

\- Max 10 items per category.

\- Each item includes date + "Do instead".



\## Execution \& Validation (Highest Priority)

1\. \*\*\[2026-04-23] Tenant mode değişikliklerinden sonra her iki modu da test et\*\*

&#x20;  Do instead: `/unified` route'unda önce tenant=true, sonra tenant=false ile manuel tıkla; Firestore'da yanlış collection'a yazılmadığını doğrula.



2\. \*\*\[2026-04-23] Firestore rules deploy etmeden önce emulator'da test et\*\*

&#x20;  Do instead: `firebase emulators:start --only firestore` çalıştır, kural değişikliğini orada denedikten sonra production'a deploy et.



\## Shell \& Command Reliability

1\. \*\*\[2026-04-23] Firebase deploy'da her zaman --only flag kullan\*\*

&#x20;  Do instead: `firebase deploy --only hosting` veya `--only functions:cleanupTenants` yaz, çıplak `firebase deploy` ASLA çalıştırma (tüm servisleri aynı anda deploy eder, prod'u bozabilir).



\## Domain Behavior Guardrails

1\. \*\*\[2026-04-23] Tenant isolation: tenant mode'dayken global collection'lara yazma\*\*

&#x20;  Do instead: Her Firestore write'ı önce `if (tenantId) { tenants/{tenantId}/... } else { ... }` pattern'i ile gate'le.



2\. \*\*\[2026-04-23] Brand renkleri hardcode etme\*\*

&#x20;  Do instead: `#00D4FF` yerine `var(--dnfc-electric-cyan)` kullan, CSS Module'lerde token'ları tokens.css'ten import et.



3\. \*\*\[2026-04-23] CSS'te logical properties kullan (RTL için)\*\*

&#x20;  Do instead: `margin-left` yerine `margin-inline-start`, `padding-right` yerine `padding-inline-end`. Türkçe LTR ama ileride Arapça destek eklersek bozulmasın.



\## User Directives

1\. \*\*\[2026-04-23] Beginner coder, solo — sessizce refactor etme\*\*

&#x20;  Do instead: Büyük değişiklik önermeden önce ne yapacağını açıkla, onay bekle. Kod örneklerini yorumla birlikte ver.



2\. \*\*\[2026-04-23] İletişim: İngilizce + Türkçe karışık OK\*\*

&#x20;  Do instead: Kullanıcı Türkçe sorarsa Türkçe cevapla, kod yorumları İngilizce kalsın.



3\. \*\*\[2026-04-23] Tech stack sabit\*\*

&#x20;  Do instead: React + JSX (TypeScript YOK), CSS Modules, Firebase/Firestore. Yeni dependency önerme, mevcut stack'te çöz.


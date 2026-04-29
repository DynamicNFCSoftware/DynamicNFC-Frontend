# Schema Audit — cards vs smartcards
Tarih: bugün
Durum: read-only inceleme tamamlandı, eylem alınmadı

## Bulgular
1. cards ve smartcards arasında foreign key yok
2. NFC tap akışı sadece smartcards üzerinden, cards'a değmiyor
3. assignedTo "isim fallback" olarak kullanılıyor, kimlik anahtarı değil
4. buildVipProfiles içinde personId||cardId eşlemesi kırılgan
5. CardRedirect.jsx'te yorum-kod uyumsuzluğu var (behaviors vs taps)

## Açık sorular
- Production'da cards collection'ında gerçek müşteri verisi var mı?
- Tap eden ziyaretçi profile mı yönlendirilmeli, external URL'e mi?
- B2B 100 kart senaryosunda ideal akış nasıl olmalı?

## Olası çözüm yolları (henüz seçilmedi)
- A) Bağ ekle (smartcards.cardId foreign key)
- B) Sorumluluk netleştir, mevcut ayrımı koru
- C) İki collection'ı birleştir

## Sıradaki adım
Yukarıdaki açık sorulara karar verildiğinde refactor planı yazılacak.

## Strategic Decisions — Pending

Tarih: 2026-04-25
Durum: hafta sonu düşünülecek, karar bekleniyor

### Üretim verisi durumu (read-only kontrol sonucu)
- cards: 8 doküman
- smartcards: 4 doküman
- Yorum: production trafiği yok denecek kadar az, refactor maliyeti şu an çok düşük
- Not: İki Firebase project var (madde 0'a bakınız)

### Hafta sonu cevaplanacak sorular
0. İki Firebase projesi var, hangisi gerçek production?
   - dynamicnfc-prod-68b4e (şu an aktif, 8 cards + 4 smartcards)
   - neat-element-489504-k1 (displayName: DynamicNFC-Production, henüz bakılmadı)
   - Bu hafta sonu netleştir: hangisi canlı, hangisi terkedilmiş/eski?
   - Eğer neat-element'te ciddi veri varsa, schema audit'i o projede de tekrarla
1. Tap eden ziyaretçi ne görmeli?
   - Seçenek A: External URL'e basit redirect (LinkedIn, kişisel site)
   - Seçenek B: Zengin profil sayfası (Linktree benzeri profesyonel)
   - Seçenek C: Hibrit (kullanıcı seçer)
   Bu ürün kararı, schema kararından önce gelir.

2. B2B akışı nasıl olmalı?
   - Şirket 100 kart sipariş ediyor → her biri farklı çalışana atanıyor
   - Çalışan profili nerede yaşıyor (cards'ta mı, başka yerde mi)?
   - Şirket sahipliği nasıl modelleniyor?
   - Kart ↔ çalışan bağı kim/nasıl kuruyor?
   - Bulk reassignment akışı nasıl çalışmalı?

3. Sıfırdan başlasan nasıl tasarlardın?
   - Şu an 12 doküman var, mevcut yapıya bağlı kalma zorunluluğu yok
   - Temiz bir tasarım hayal et, sonra mevcut yapıyla karşılaştır

### Karar verildikten sonra yapılacaklar (henüz yapma)
- Refactor planı yaz (hangi yol seçildiyse adım adım)
- Migration script yaz (12 doküman için)
- Test akışı (CardRedirect, AdminCards, TapAnalytics)
- Yorum-kod tutarsızlıklarını temizle (CardRedirect.jsx behaviors vs taps)

### Bir sonraki Claude oturumunda nereden devam edilecek
Yukarıdaki 3 soruya verilen cevaplarla gel. Önce 0 numaralı 
sorudan başla (hangi Firebase projesi gerçek prod). Sonra 1-2-3 
sorularına cevaplarınla refactor stratejisini belirleyelim.

-- HashId güncelleme script'i
-- Bu script mevcut kullanıcıların hashId'lerini yeni HashIdUtil konfigürasyonu ile güncelleyecek

-- Önce mevcut hashId'leri görelim
SELECT id, hash_id, name FROM users WHERE hash_id IS NOT NULL;

-- Yeni hashId'leri hesaplamak için ID'leri kullanan bir başvuru tablosu:
-- ID 1 -> LzaOyn (test edildi ve çalışıyor)
-- ID 22 -> wzpaG8 (test edildi ve çalışıyor)

-- HashId güncelleme (bu ID'ler örnek, gerçek ID'lere göre ayarlanmalı)
-- UPDATE users SET hash_id = 'LzaOyn' WHERE id = 1;
-- UPDATE users SET hash_id = 'wzpaG8' WHERE id = 22;

-- Diğer kullanıcılar için de benzer şekilde güncellenecek
-- Bu işlem backend tarafında programatik olarak yapılmalı
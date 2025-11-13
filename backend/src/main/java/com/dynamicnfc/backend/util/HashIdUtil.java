package com.dynamicnfc.backend.util;

import org.hashids.Hashids;
import org.springframework.stereotype.Component;

@Component
public class HashIdUtil {
    
    // Salt değerini değiştirin - production'da environment variable kullanın
    private static final String SALT = "DynamicNFC-Secret-Salt-2024";
    private static final int MIN_HASH_LENGTH = 6;
    
    private final Hashids hashids;
    
    public HashIdUtil() {
        this.hashids = new Hashids(SALT, MIN_HASH_LENGTH);
    }
    
    /**
     * Long ID'yi HashId string'e çevirir
     * @param id Veritabanı ID'si
     * @return HashId string (örn: "jR3kMn")
     */
    public String encode(Long id) {
        if (id == null) return null;
        return hashids.encode(id);
    }
    
    /**
     * HashId string'ini Long ID'ye çevirir
     * @param hashId HashId string
     * @return Veritabanı ID'si
     */
    public Long decode(String hashId) {
        if (hashId == null || hashId.trim().isEmpty()) return null;
        long[] decoded = hashids.decode(hashId);
        return decoded.length > 0 ? decoded[0] : null;
    }
    
    /**
     * HashId'nin geçerli olup olmadığını kontrol eder
     * @param hashId Kontrol edilecek HashId
     * @return Geçerli ise true
     */
    public boolean isValid(String hashId) {
        return decode(hashId) != null;
    }
}
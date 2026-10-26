// utils/umkmImage.js — pool foto per kategori, deterministic pick
// Dipakai di AiMatchSchool (Sekolah→UMKM) & AiMatchUmkm (UMKM→Event)

export const UMKM_IMAGE_POOL = {
  Makanan: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  ],
  Minuman: [
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80",
    "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  ],
  Kerajinan: [
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80",
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80",
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
  ],
  Aksesoris: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80",
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
  ],
};

export const EVENT_IMAGE_POOL = {
  Makanan: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
  ],
  Minuman: [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
    "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80",
    "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80",
  ],
  Kerajinan: [
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80",
    "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
  ],
  Aksesoris: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
    "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&q=80",
  ],
  Fashion: [
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",
  ],
};

function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

// ============================================================
// Keyword → specific Unsplash photo (relevan ke nama judul)
// Di-check duluan sebelum fallback pool kategori
// ============================================================
const KEYWORD_IMAGES = {
  // Minuman
  kopi:    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80",
  teh:     "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80",
  latte:   "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
  matcha:  "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&q=80",

  // Makanan
  soto:    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",
  nasi:    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
  geprek:  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
  sate:    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
  bakso:   "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
  burger:  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  pizza:   "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80",

  // Kerajinan
  batik:   "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80",
  keramik: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80",
  rajut:   "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=400&q=80",
  anyam:   "https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=400&q=80",

  // Aksesoris / Perhiasan
  bros:    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
  kalung:  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&q=80",
  gelang:  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80",
  cincin:  "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80",
  hijab:   "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80",

  // Fashion
  sneakers: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  tas:     "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
  Sepatu:  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
  Sepatu:  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",

  // Event / Bazaar
  bazar:   "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",
  "market day": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
  kuliner: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
  budaya:  "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&q=80",
  expo:    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=80",
  karya:   "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
};

/**
 * Cek nama/judul → cek keyword → return image spesifik.
 * Kalau ga ada match, return null (nanti fallback pool).
 */
function getImageByKeyword(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  for (const [kw, url] of Object.entries(KEYWORD_IMAGES)) {
    if (lower.includes(kw)) return url;
  }
  return null;
}

// prioritas: logo (upload UMKM) -> pool kategori -> fallback Makanan
export function getUmkmImage(umkm) {
  if (!umkm) return UMKM_IMAGE_POOL.Makanan[0];
  if (umkm.logo) return umkm.logo;
  // Cek keyword dulu
  const byKw = getImageByKeyword(umkm.business_name || umkm.name || "");
  if (byKw) return byKw;
  const pool = UMKM_IMAGE_POOL[umkm.category] || UMKM_IMAGE_POOL.Makanan;
  const key = `${umkm.business_name || ""}#${umkm.umkm_id ?? umkm.id ?? ""}`;
  const idx = hashStr(key) % pool.length;
  return pool[idx];
}

// Event: deterministic pick by category + event_id/slug/name
export function getEventImage(event) {
  if (!event) return EVENT_IMAGE_POOL.Makanan[0];
  const name = event.name || "";
  // Cek keyword dulu
  const byKw = getImageByKeyword(name);
  if (byKw) return byKw;
  // event bisa punya categories array atau category string
  const cat = event.category || (event.categories && event.categories[0]) || "Makanan";
  const pool = EVENT_IMAGE_POOL[cat] || EVENT_IMAGE_POOL.Makanan;
  const key = `${name}#${event.event_id ?? event.id ?? event.slug ?? ""}`;
  const idx = hashStr(key) % pool.length;
  return pool[idx];
}

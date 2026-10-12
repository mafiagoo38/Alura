/* =========================================================
   Alura - صور منتجات حقيقية احترافية (Unsplash)
   - بتتجاب مرة واحدة لكل منتج وتتخزن في المتصفح (Cache) عشان
     الموقع يبقى سريع ومايستهلكش من حد الطلبات المجاني بتاع Unsplash.
   - لو مفيش مفتاح Unsplash متظبط، أو الطلب فشل، الموقع يفضل
     شكله محترم برضو (الأيقونة بالتدرج اللوني) من غير أي كسر.
   ========================================================= */

const PHOTO_CACHE_KEY = 'aluraPhotoCache';
const __photoInFlight = new Set();

function unsplashReady() {
    return typeof UNSPLASH_ACCESS_KEY === 'string' && UNSPLASH_ACCESS_KEY.length > 10 && UNSPLASH_ACCESS_KEY.indexOf('PASTE_') !== 0;
}

function getPhotoCache() { return lsGet(PHOTO_CACHE_KEY, {}); }
function cachePhotoUrl(pid, url) {
    const cache = getPhotoCache();
    cache[pid] = url;
    lsSet(PHOTO_CACHE_KEY, cache);
}

/* استعلام بحث إنجليزي احترافي حسب نوع المنتج */
function unsplashQueryFor(p) {
    const kw = (p.photoKeyword || 'fashion product').replace(/-/g, ' ');
    return kw + ' product studio photography';
}

async function ensurePhotoFetched(p) {
    if (!unsplashReady()) return;
    const cache = getPhotoCache();
    if (cache[p.id]) return; // متخزنة بالفعل
    if (__photoInFlight.has(p.id)) return; // في نطاق التحميل بالفعل
    __photoInFlight.add(p.id);

    try {
        const query = encodeURIComponent(unsplashQueryFor(p));
        const url = `https://api.unsplash.com/photos/random?query=${query}&orientation=squarish&content_filter=high&client_id=${UNSPLASH_ACCESS_KEY}`;
        const res = await fetch(url);
        if (!res.ok) { __photoInFlight.delete(p.id); return; }
        const data = await res.json();
        const photoUrl = data && data.urls && (data.urls.small || data.urls.regular);
        if (photoUrl) {
            cachePhotoUrl(p.id, photoUrl);
            applyPhotoToDOM(p.id, photoUrl);
        }
    } catch (e) {
        // فشل صامت - الأيقونة تفضل ظاهرة
    } finally {
        __photoInFlight.delete(p.id);
    }
}

/* تحديث كل الأماكن اللي المنتج ده ظاهر فيها في نفس الصفحة (كارت، تفاصيل، سلة...) */
function applyPhotoToDOM(pid, photoUrl) {
    const wraps = document.querySelectorAll('[data-photo-pid="' + pid + '"]');
    wraps.forEach(function (wrap) {
        if (wrap.classList.contains('has-photo')) return;
        const p = aluraFindProduct(pid);
        wrap.innerHTML = '<img src="' + photoUrl + '" alt="" loading="lazy" class="au-fade" onerror="aluraImgFallback(this)">' +
            '<i class="bi ' + (p ? p.icon : '') + ' img-fallback-icon" style="display:none;"></i>';
        wrap.classList.add('has-photo');
    });
}

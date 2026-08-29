/* =========================================================
   Alura - طبقة الاتصال بالـ Backend (Google Apps Script)
   كل الدوال هنا "آمنة" - لو السيرفر مش متظبط أو مفيش نت،
   بترجع فشل بهدوء والموقع يفضل شغال محليًا (localStorage) عادي.
   ========================================================= */

function backendReady() {
    return typeof GAS_URL === 'string' && GAS_URL.indexOf('http') === 0;
}

async function gsCall(action, payload) {
    if (!backendReady()) return { ok: false, offline: true };
    try {
        const res = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify(Object.assign({ action }, payload || {}))
        });
        if (!res.ok) return { ok: false, offline: true };
        return await res.json();
    } catch (e) {
        return { ok: false, offline: true };
    }
}

/* مزامنة بيانات المستخدم (سلة / مفضلة / عناوين / كروت / تفضيلات) - بتتبعت بعد فترة صغيرة من آخر تغيير */
let __syncTimer = null;
function scheduleUserDataSync() {
    if (!backendReady()) return;
    const user = getCurrentUser();
    if (!user) return;
    clearTimeout(__syncTimer);
    __syncTimer = setTimeout(function () {
        gsCall('saveUserData', {
            email: user.email,
            cart: getCart(),
            wishlist: getWishlist(),
            addresses: getAddresses(),
            cards: getCards(),
            prefs: lsGet(PREFS_KEY, {})
        });
    }, 900);
}

/* سحب بيانات المستخدم من السيرفر ودمجها محليًا (بعد تسجيل الدخول) */
async function hydrateUserDataFromServer(email) {
    if (!backendReady()) return;
    const res = await gsCall('getUserData', { email });
    if (res && res.ok && res.data) {
        if (Array.isArray(res.data.cart) && res.data.cart.length) lsSet(CART_KEY, res.data.cart);
        if (Array.isArray(res.data.wishlist) && res.data.wishlist.length) lsSet(WISHLIST_KEY, res.data.wishlist);
        if (Array.isArray(res.data.addresses) && res.data.addresses.length) lsSet(ADDR_KEY, res.data.addresses);
        if (Array.isArray(res.data.cards) && res.data.cards.length) lsSet(CARDS_KEY, res.data.cards);
        if (res.data.prefs && Object.keys(res.data.prefs).length) lsSet(PREFS_KEY, res.data.prefs);
        updateBadges();
    }
    const ordersRes = await gsCall('getOrders', { email });
    if (ordersRes && ordersRes.ok && Array.isArray(ordersRes.orders)) {
        // ادمج طلبات السيرفر مع أي طلبات محلية (بدون تكرار)
        const local = getOrders();
        const merged = ordersRes.orders.slice();
        local.forEach(o => { if (!merged.find(m => m.id === o.id)) merged.push(o); });
        merged.sort((a, b) => new Date(b.date) - new Date(a.date));
        saveOrders(merged);
    }
}

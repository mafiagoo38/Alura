/* =========================================================
   Alura - المنطق العام المشترك بين كل صفحات الموقع
   ========================================================= */

const USERS_KEY = 'aluraUsers';
const SESSION_KEY = 'aluraCurrentUser';
const GATE_SESSION_KEY = 'aluraGateSeen';
const CART_KEY = 'aluraCart';
const WISHLIST_KEY = 'aluraWishlist';
const ORDERS_KEY = 'aluraOrders';
const ADDR_KEY = 'aluraAddresses';
const CARDS_KEY = 'aluraCards';
const PREFS_KEY = 'aluraPrefs';
const LANG_KEY = 'aluraLang';

let currentLang = localStorage.getItem(LANG_KEY) || 'ar';

/* ---------- أدوات تخزين عامة ---------- */
function lsGet(key, fallback) {
    try {
        const v = JSON.parse(localStorage.getItem(key));
        return v === null || v === undefined ? fallback : v;
    } catch (e) { return fallback; }
}
function lsSet(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

/* ---------- المستخدمين والدخول ---------- */
function getUsers() { return lsGet(USERS_KEY, []); }
function saveUsers(users) { lsSet(USERS_KEY, users); }
function findUserByEmail(email) { return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()); }
function getCurrentUser() {
    const email = localStorage.getItem(SESSION_KEY);
    return email ? findUserByEmail(email) : null;
}

function hashPass(pass) {
    let hash = 0;
    for (let i = 0; i < pass.length; i++) { hash = (hash << 5) - hash + pass.charCodeAt(i); hash |= 0; }
    return 'h' + hash.toString(36) + pass.length;
}

function showToast(message, type) {
    type = type || 'success';
    const toastEl = document.getElementById('mainToast');
    if (!toastEl) { return; }
    const body = document.getElementById('mainToastBody');
    toastEl.classList.remove('bg-success', 'bg-danger');
    toastEl.classList.add(type === 'success' ? 'bg-success' : 'bg-danger');
    body.innerText = message;
    new bootstrap.Toast(toastEl, { delay: 2600 }).show();
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPassword').value;
    const errorBox = document.getElementById('registerError');
    const submitBtn = e.target.querySelector('button[type=submit]');
    errorBox.style.display = 'none';

    if (findUserByEmail(email)) {
        errorBox.innerText = t('errEmailUsed');
        errorBox.style.display = 'block';
        return;
    }

    if (submitBtn) submitBtn.disabled = true;
    const passHash = hashPass(pass);

    // نحاول نسجل على السيرفر (Google Sheet) الأول لو متظبط
    const serverRes = await gsCall('register', { name, email, passHash });
    if (serverRes && serverRes.ok === false && serverRes.error === 'exists') {
        if (submitBtn) submitBtn.disabled = false;
        errorBox.innerText = t('errEmailUsed');
        errorBox.style.display = 'block';
        return;
    }

    const users = getUsers();
    const newUser = { id: 'u_' + Date.now(), name, email, passHash, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    if (submitBtn) submitBtn.disabled = false;

    showToast(t('welcomeUser').replace('{name}', name), 'success');
    document.getElementById('registerForm').reset();

    const modalEl = document.getElementById('authModal');
    const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
    modal.hide();

    checkLoginStatus();
    closeWelcomeGate();
    if (typeof onAuthChanged === 'function') onAuthChanged();
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;
    const errorBox = document.getElementById('loginError');
    const submitBtn = e.target.querySelector('button[type=submit]');
    errorBox.style.display = 'none';
    const passHash = hashPass(pass);

    let user = findUserByEmail(email);

    // لو الحساب مش موجود في المتصفح ده (مثلاً اتسجل من جهاز تاني)، نسأل السيرفر
    if (!user || user.passHash !== passHash) {
        if (submitBtn) submitBtn.disabled = true;
        const serverRes = await gsCall('login', { email, passHash });
        if (submitBtn) submitBtn.disabled = false;
        if (serverRes && serverRes.ok && serverRes.user) {
            const users = getUsers();
            const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
            const localCopy = { id: serverRes.user.id, name: serverRes.user.name, email: serverRes.user.email, passHash, phone: serverRes.user.phone, country: serverRes.user.country, createdAt: serverRes.user.createdAt };
            if (idx > -1) users[idx] = localCopy; else users.push(localCopy);
            saveUsers(users);
            user = localCopy;
        }
    }

    if (user && user.passHash === passHash) {
        localStorage.setItem(SESSION_KEY, user.email);
        const modalEl = document.getElementById('authModal');
        const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        modal.hide();
        document.getElementById('loginForm').reset();
        showToast(t('welcomeBack').replace('{name}', user.name), 'success');
        checkLoginStatus();
        closeWelcomeGate();
        await hydrateUserDataFromServer(user.email);
        if (typeof onAuthChanged === 'function') onAuthChanged();
    } else {
        errorBox.innerText = t('errBadLogin');
        errorBox.style.display = 'block';
    }
}

function checkLoginStatus() {
    const user = getCurrentUser();
    const loggedInElements = document.querySelectorAll('.logged-in-only');
    const loggedOutElements = document.querySelectorAll('.logged-out-only');
    if (user) {
        const nameEl = document.getElementById('user-name-display');
        if (nameEl) nameEl.innerText = user.name;
        loggedInElements.forEach(el => el.style.display = 'block');
        loggedOutElements.forEach(el => el.style.display = 'none');
    } else {
        loggedInElements.forEach(el => el.style.display = 'none');
        loggedOutElements.forEach(el => el.style.display = 'block');
    }
}

function logout() {
    localStorage.removeItem(SESSION_KEY);
    checkLoginStatus();
    showToast(t('loggedOut'), 'success');
    if (typeof onAuthChanged === 'function') onAuthChanged();
}

function openLoginModal(tab) {
    const modalEl = document.getElementById('authModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    const tabTrigger = document.getElementById(tab === 'register' ? 'register-tab' : 'login-tab');
    if (tabTrigger) new bootstrap.Tab(tabTrigger).show();
}

/* ---------- بوابة الترحيب ---------- */
function initWelcomeGate() {
    const gate = document.getElementById('welcomeGate');
    if (!gate) return;
    const alreadyLoggedIn = !!localStorage.getItem(SESSION_KEY);
    const alreadySeen = sessionStorage.getItem(GATE_SESSION_KEY);
    if (alreadyLoggedIn || alreadySeen) {
        gate.style.display = 'none';
    } else {
        gate.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}
function closeWelcomeGate() {
    sessionStorage.setItem(GATE_SESSION_KEY, 'true');
    const gate = document.getElementById('welcomeGate');
    if (!gate) return;
    gate.style.display = 'none';
    document.body.style.overflow = '';
}
function continueAsGuest() {
    closeWelcomeGate();
    showToast(t('guestMsg'), 'success');
}
function openGateAuth(tab) {
    closeWelcomeGate();
    openLoginModal(tab);
}

/* ---------- السلة ---------- */
function getCart() { return lsGet(CART_KEY, []); }
function saveCart(cart) { lsSet(CART_KEY, cart); updateBadges(); scheduleUserDataSync(); }

function addToCart(id, qty) {
    qty = qty || 1;
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) item.qty += qty; else cart.push({ id, qty });
    saveCart(cart);
    const p = aluraFindProduct(id);
    showToast(t('addedToCart').replace('{name}', p ? (currentLang === 'ar' ? p.name_ar : p.name_en) : ''), 'success');
}

function removeFromCart(id) {
    const cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    if (typeof renderCartPage === 'function') renderCartPage();
}

function setCartQty(id, qty) {
    let cart = getCart();
    if (qty <= 0) { cart = cart.filter(i => i.id !== id); }
    else { const item = cart.find(i => i.id === id); if (item) item.qty = qty; }
    saveCart(cart);
    if (typeof renderCartPage === 'function') renderCartPage();
}

function cartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }
function cartTotal() {
    return getCart().reduce((s, i) => { const p = aluraFindProduct(i.id); return s + (p ? p.price * i.qty : 0); }, 0);
}

/* ---------- المفضلة ---------- */
function getWishlist() { return lsGet(WISHLIST_KEY, []); }
function saveWishlist(list) { lsSet(WISHLIST_KEY, list); updateBadges(); scheduleUserDataSync(); }
function isWishlisted(id) { return getWishlist().includes(id); }
function toggleWishlist(id) {
    let list = getWishlist();
    if (list.includes(id)) { list = list.filter(x => x !== id); showToast(t('removedFromWishlist'), 'success'); }
    else { list.push(id); showToast(t('addedToWishlist'), 'success'); }
    saveWishlist(list);
    if (typeof renderWishlistPage === 'function') renderWishlistPage();
    if (typeof refreshWishlistIcons === 'function') refreshWishlistIcons();
}

/* ---------- العناوين ---------- */
function getAddresses() { return lsGet(ADDR_KEY, []); }
function saveAddresses(list) { lsSet(ADDR_KEY, list); scheduleUserDataSync(); }
function addAddress(addr) { const list = getAddresses(); addr.id = 'a_' + Date.now(); list.push(addr); saveAddresses(list); return addr; }
function deleteAddress(id) { saveAddresses(getAddresses().filter(a => a.id !== id)); }

/* ---------- الكروت المحفوظة ---------- */
function getCards() { return lsGet(CARDS_KEY, []); }
function saveCards(list) { lsSet(CARDS_KEY, list); scheduleUserDataSync(); }
function addCard(card) { const list = getCards(); card.id = 'c_' + Date.now(); list.push(card); saveCards(list); return card; }
function deleteCard(id) { saveCards(getCards().filter(c => c.id !== id)); }

/* ---------- الطلبات ---------- */
function getOrders() { return lsGet(ORDERS_KEY, []); }
function saveOrders(list) { lsSet(ORDERS_KEY, list); }
function createOrder(order) {
    const list = getOrders();
    order.id = 'ORD-' + Date.now().toString().slice(-6);
    order.date = new Date().toISOString();
    order.status = 'قيد التجهيز';
    list.unshift(order);
    saveOrders(list);
    const user = getCurrentUser();
    if (user) gsCall('createOrder', { email: user.email, order: order });
    return order;
}
function requestReturn(orderId) {
    const list = getOrders();
    const order = list.find(o => o.id === orderId);
    if (order) {
        order.status = 'طلب استرجاع قيد المراجعة';
        saveOrders(list);
        const user = getCurrentUser();
        if (user) gsCall('requestReturn', { email: user.email, orderId: orderId });
    }
}

/* ---------- شارات الأيقونات في الناف بار ---------- */
function updateBadges() {
    document.querySelectorAll('.cart-badge').forEach(b => {
        const n = cartCount();
        b.innerText = n;
        b.style.display = n > 0 ? 'flex' : 'none';
    });
    document.querySelectorAll('.wishlist-badge').forEach(b => {
        const n = getWishlist().length;
        b.innerText = n;
        b.style.display = n > 0 ? 'flex' : 'none';
    });
}

/* ---------- تنسيق السعر ---------- */
function fmtPrice(n) {
    return n.toLocaleString(currentLang === 'ar' ? 'ar-EG' : 'en-US') + (currentLang === 'ar' ? ' ج.م' : ' EGP');
}
function pName(p) { return currentLang === 'ar' ? p.name_ar : p.name_en; }

function aluraImgFallback(imgEl) {
    imgEl.style.display = 'none';
    const wrap = imgEl.parentElement;
    if (wrap) wrap.classList.remove('has-photo');
    const icon = wrap ? wrap.querySelector('.img-fallback-icon') : null;
    if (icon) icon.style.display = '';
}

/* لو الصورة متخزنة بالفعل (Cache) أو متحطة يدويًا (p.img) بترجع الـ markup جاهز،
   ولو لسه مفيش صورة، بترجع الأيقونة وتبدأ تجيب صورة حقيقية في الخلفية (Unsplash) */
function productPhotoMarkup(p) {
    const cache = (typeof getPhotoCache === 'function') ? getPhotoCache() : {};
    const cached = p.img || cache[p.id];
    if (cached) {
        return {
            hasPhoto: true,
            html: `<img src="${cached}" alt="${pName(p)}" loading="lazy" onerror="aluraImgFallback(this)"><i class="bi ${p.icon} img-fallback-icon" style="display:none;"></i>`
        };
    }
    if (typeof ensurePhotoFetched === 'function') ensurePhotoFetched(p);
    return { hasPhoto: false, html: `<i class="bi ${p.icon}"></i>` };
}

function pIconWrap(p, big) {
    const res = productPhotoMarkup(p);
    return `<div class="prod-img-ph ${res.hasPhoto ? 'has-photo' : ''} ${big ? 'prod-img-ph-lg' : ''}" data-photo-pid="${p.id}">${res.html}</div>`;
}

/* ---------- بطاقة منتج قابلة لإعادة الاستخدام ---------- */
function productCardHTML(p) {
    const wished = isWishlisted(p.id);
    const hasOld = !!p.oldPrice;
    return `
    <div class="col-6 col-md-4 col-lg-3">
        <div class="card product-card h-100 border-0 shadow-sm">
            ${hasOld ? `<span class="badge sale-badge">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
            <button class="wish-btn ${wished ? 'active' : ''}" onclick="toggleWishlist('${p.id}')" title="${t('wishlist')}">
                <i class="bi ${wished ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </button>
            <a href="product.html?id=${p.id}" class="text-decoration-none text-dark">
                ${pIconWrap(p)}
                <div class="p-3 pb-2">
                    <div class="product-brand mb-1">${p.brand}</div>
                    <div class="fw-bold mb-2 product-name">${pName(p)}</div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="fw-bold text-success">${fmtPrice(p.price)}</span>
                        ${hasOld ? `<span class="text-muted text-decoration-line-through small">${fmtPrice(p.oldPrice)}</span>` : ''}
                    </div>
                </div>
            </a>
            <div class="px-3 pb-3">
                <button class="btn btn-alura w-100 btn-sm fw-bold" onclick="addToCart('${p.id}',1)">
                    <i class="bi bi-bag-plus me-1"></i>${t('addToCart')}
                </button>
            </div>
        </div>
    </div>`;
}

function refreshWishlistIcons() {
    document.querySelectorAll('.wish-btn').forEach(btn => {
        // handled via full re-render in most pages
    });
}

/* ---------- تعدد اللغات ---------- */
const translations = {
    ar: {
        brand: "Alura", search: "ابحث عن منتجات...",
        heroBadge: "تشكيلة صيف 2026", heroTitle: "تسوّق بثقة مع Alura",
        heroDesc: "اكتشف أحدث التشكيلات والعروض الحصرية بجودة تليق بك.", heroBtn: "تصفح العروض",
        trustShipping: "شحن سريع لكل المحافظات", trustSecure: "دفع آمن 100%",
        trustReturn: "إرجاع سهل خلال 14 يوم", trustSupport: "دعم عملاء على مدار الساعة",
        shopByCategory: "تسوق حسب القسم", makeup: "الميك أب", accessories: "اكسسوارات",
        skincare: "العناية بالبشرة", shoes: "أحذية رياضية", pants: "بناطيل", skirts: "تنانير", more: "كل الأقسام",
        loginText: "تسجيل الدخول", registerText: "حساب جديد", email: "البريد الإلكتروني",
        password: "كلمة المرور", name: "الاسم", loginBtn: "دخول", registerBtn: "إنشاء حساب",
        profile: "الملف الشخصي", orders: "طلباتي", logout: "تسجيل الخروج", langBtn: "English",
        gateTitle: "أهلاً بك في Alura", gateSubtitle: "وجهتك الأولى للتسوق الأونلاين المميز",
        gateSignin: "تسجيل الدخول", gateSignup: "إنشاء حساب جديد", gateGuest: "المتابعة كزائر",
        footerAbout: "Alura وجهتك الموثوقة للتسوق الأونلاين، نقدم منتجات عالية الجودة بأسعار تنافسية وتجربة تسوق استثنائية.",
        footerShop: "تسوق", footerSupport: "الدعم", footerFaq: "الأسئلة الشائعة",
        footerShipping: "الشحن والتوصيل", footerContact: "تواصل معنا", footerFollow: "تابعنا",
        footerRights: "جميع الحقوق محفوظة.",
        errEmailUsed: "هذا البريد الإلكتروني مسجل بالفعل، جرّب تسجيل الدخول.",
        errBadLogin: "البريد الإلكتروني أو كلمة المرور غير صحيحة!",
        welcomeUser: "مرحبًا بك في Alura يا {name}!", welcomeBack: "أهلاً بعودتك، {name}!",
        loggedOut: "تم تسجيل الخروج بنجاح", guestMsg: "أنت تتصفح الآن كزائر",
        addedToCart: "تمت إضافة {name} إلى السلة", addedToWishlist: "تمت الإضافة إلى المفضلة",
        removedFromWishlist: "تم الحذف من المفضلة", wishlist: "أضف للمفضلة", addToCart: "أضف للسلة",
        allCategories: "كل الأقسام", shopByDept: "تسوق حسب القسم الرئيسي",
        subcats: "الأقسام الفرعية", specialOffers: "عروض خاصة", viewAll: "عرض الكل",
        cartTitle: "سلة التسوق", cartEmpty: "سلتك فارغة حالياً", startShopping: "ابدأ التسوق",
        product: "المنتج", price: "السعر", qty: "الكمية", total: "الإجمالي", checkout: "إتمام الشراء",
        wishlistTitle: "المفضلة", wishlistEmpty: "لا توجد منتجات في المفضلة بعد",
        checkoutTitle: "إتمام الطلب", shippingAddress: "عنوان الشحن", paymentMethod: "طريقة الدفع",
        cod: "الدفع عند الاستلام", cardPay: "بطاقة ائتمان/خصم", wallet: "محفظة إلكترونية",
        confirmOrder: "تأكيد الطلب", orderSuccess: "تم استلام طلبك بنجاح!", orderNum: "رقم الطلب",
        backToShop: "الرجوع للتسوق", myOrders: "طلباتي", noAddress: "لا يوجد عنوان محفوظ، أضف عنوان جديد أولاً",
        addAddress: "إضافة عنوان جديد", addressLabel: "اسم العنوان (مثال: المنزل)", addressDetails: "تفاصيل العنوان الكامل",
        save: "حفظ", cancel: "إلغاء", cartTotalMustBePositive: "السلة فارغة، أضف منتجات أولاً",
        profileTitle: "الملف الشخصي", loginRequired: "سجّل الدخول لعرض بياناتك", loginNow: "تسجيل الدخول",
        personalInfo: "بيانات المستخدم", mobileConfirm: "تأكيد رقم الموبايل", myOrdersSection: "الطلبات",
        favoritesSection: "المفضلة", addressesSection: "العناوين", cardsSection: "إدارة الكروت",
        returnsSection: "المرتجعات والاسترجاع", langCountrySection: "اللغة والبلد", prefsSection: "التفضيلات الإضافية",
        noOrders: "لا توجد طلبات بعد", requestReturnBtn: "طلب استرجاع", returnRequested: "تم إرسال طلب الاسترجاع",
        deleteBtn: "حذف", editSaved: "تم الحفظ بنجاح", phoneConfirmed: "تم تأكيد رقم الموبايل بنجاح",
        enterPhone: "أدخل رقم الموبايل", confirmBtn: "تأكيد", noAddressesYet: "لا توجد عناوين محفوظة",
        noCardsYet: "لا توجد بطاقات محفوظة", addCardBtn: "إضافة بطاقة جديدة", cardHolder: "اسم حامل البطاقة",
        last4: "آخر 4 أرقام من البطاقة", country: "البلد", preferredLang: "اللغة المفضلة", notifications: "تفعيل الإشعارات",
        emailUpdates: "تفعيل تحديثات البريد الإلكتروني", logoutBtn: "تسجيل الخروج", searchResults: "نتائج البحث عن",
        noResults: "لا توجد نتائج مطابقة", filterAll: "الكل", offersTitle: "العروض المميزة",
        offersSubtitle: "دليل التسوق والعروض الحصرية", brandForLess: "براندات بسعر أقل",
        brandForLessDesc: "منتجات ومستلزمات من ماركات عالمية ومشهورة بأسعار مخفضة وتنافسية جداً (عروض / Outlet)."
    },
    en: {
        brand: "Alura", search: "Search products...",
        heroBadge: "Summer 2026 Collection", heroTitle: "Shop with Confidence at Alura",
        heroDesc: "Discover the latest collections and exclusive offers, crafted for you.", heroBtn: "Browse Offers",
        trustShipping: "Fast shipping nationwide", trustSecure: "100% Secure Payment",
        trustReturn: "Easy 14-day returns", trustSupport: "24/7 Customer Support",
        shopByCategory: "Shop By Category", makeup: "Makeup", accessories: "Accessories",
        skincare: "Skincare", shoes: "Sports Shoes", pants: "Pants", skirts: "Skirts", more: "All Categories",
        loginText: "Login", registerText: "Sign Up", email: "Email Address",
        password: "Password", name: "Full Name", loginBtn: "Login", registerBtn: "Create Account",
        profile: "Profile", orders: "My Orders", logout: "Logout", langBtn: "عربي",
        gateTitle: "Welcome to Alura", gateSubtitle: "Your first destination for premium online shopping",
        gateSignin: "Sign In", gateSignup: "Create New Account", gateGuest: "Continue as Guest",
        footerAbout: "Alura is your trusted online shopping destination, offering high-quality products at competitive prices and an exceptional shopping experience.",
        footerShop: "Shop", footerSupport: "Support", footerFaq: "FAQ",
        footerShipping: "Shipping & Delivery", footerContact: "Contact Us", footerFollow: "Follow Us",
        footerRights: "All rights reserved.",
        errEmailUsed: "This email is already registered. Try logging in.",
        errBadLogin: "Invalid email or password!",
        welcomeUser: "Welcome to Alura, {name}!", welcomeBack: "Welcome back, {name}!",
        loggedOut: "Logged out successfully", guestMsg: "Browsing as a guest",
        addedToCart: "{name} added to cart", addedToWishlist: "Added to wishlist",
        removedFromWishlist: "Removed from wishlist", wishlist: "Add to wishlist", addToCart: "Add to Cart",
        allCategories: "All Categories", shopByDept: "Shop by Department",
        subcats: "Subcategories", specialOffers: "Special Offers", viewAll: "View All",
        cartTitle: "Shopping Cart", cartEmpty: "Your cart is empty", startShopping: "Start Shopping",
        product: "Product", price: "Price", qty: "Qty", total: "Total", checkout: "Checkout",
        wishlistTitle: "Wishlist", wishlistEmpty: "No items in your wishlist yet",
        checkoutTitle: "Checkout", shippingAddress: "Shipping Address", paymentMethod: "Payment Method",
        cod: "Cash on Delivery", cardPay: "Credit/Debit Card", wallet: "E-Wallet",
        confirmOrder: "Confirm Order", orderSuccess: "Your order has been placed!", orderNum: "Order Number",
        backToShop: "Back to Shop", myOrders: "My Orders", noAddress: "No saved address, add one first",
        addAddress: "Add New Address", addressLabel: "Address label (e.g. Home)", addressDetails: "Full address details",
        save: "Save", cancel: "Cancel", cartTotalMustBePositive: "Cart is empty, add products first",
        profileTitle: "Profile", loginRequired: "Log in to view your profile", loginNow: "Login Now",
        personalInfo: "Account Info", mobileConfirm: "Confirm Mobile Number", myOrdersSection: "Orders",
        favoritesSection: "Favorites", addressesSection: "Addresses", cardsSection: "Manage Cards",
        returnsSection: "Returns & Refunds", langCountrySection: "Language & Country", prefsSection: "Additional Preferences",
        noOrders: "No orders yet", requestReturnBtn: "Request Return", returnRequested: "Return request sent",
        deleteBtn: "Delete", editSaved: "Saved successfully", phoneConfirmed: "Mobile number confirmed",
        enterPhone: "Enter mobile number", confirmBtn: "Confirm", noAddressesYet: "No saved addresses",
        noCardsYet: "No saved cards", addCardBtn: "Add New Card", cardHolder: "Cardholder Name",
        last4: "Last 4 digits", country: "Country", preferredLang: "Preferred Language", notifications: "Enable Notifications",
        emailUpdates: "Enable Email Updates", logoutBtn: "Logout", searchResults: "Search results for",
        noResults: "No matching results", filterAll: "All", offersTitle: "Featured Offers",
        offersSubtitle: "Your shopping guide & exclusive deals", brandForLess: "Brand For Less",
        brandForLessDesc: "Products from global, well-known brands at heavily discounted, competitive prices (Outlet)."
    }
};

function t(key) { return (translations[currentLang] && translations[currentLang][key]) || key; }

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem(LANG_KEY, currentLang);
    applyLanguage(currentLang);
    if (typeof onLanguageChanged === 'function') onLanguageChanged();
}

function applyLanguage(lang) {
    currentLang = lang;
    const langData = translations[currentLang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) el.innerText = langData[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (langData[key]) el.setAttribute('placeholder', langData[key]);
    });

    const htmlTag = document.getElementById('html-tag');
    const bsLink = document.getElementById('bootstrap-css');
    const langBtn = document.getElementById('lang-toggle');

    if (currentLang === 'en') {
        htmlTag.setAttribute('dir', 'ltr'); htmlTag.setAttribute('lang', 'en');
        bsLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    } else {
        htmlTag.setAttribute('dir', 'rtl'); htmlTag.setAttribute('lang', 'ar');
        bsLink.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css";
    }
    if (langBtn) langBtn.innerText = langData.langBtn;
}

/* ---------- البحث من شريط التنقل ---------- */
function handleNavSearch(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('search-input');
    const q = input ? input.value.trim() : '';
    if (q.length === 0) return false;
    window.location.href = 'products.html?search=' + encodeURIComponent(q);
    return false;
}

/* ---------- تهيئة عامة تعمل في كل الصفحات ---------- */
document.addEventListener("DOMContentLoaded", function () {
    applyLanguage(currentLang);
    checkLoginStatus();
    initWelcomeGate();
    updateBadges();
    if (typeof initPage === 'function') initPage();

    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        const onScroll = function () {
            navbar.classList.toggle('is-scrolled', window.scrollY > 8);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
});

/* =========================================================
   Alura - منطق عرض المحتوى الخاص بكل صفحة (Page Renderers)
   يعتمد على data.js و app.js
   ========================================================= */

function initPage() {
    const page = document.body.dataset.page;
    const map = {
        home: initHomePage,
        categories: initCategoriesPage,
        landing: initCategoryLandingPage,
        products: initProductsPage,
        product: initProductDetailPage,
        offers: initOffersPage,
        cart: initCartPage,
        checkout: initCheckoutPage,
        wishlist: initWishlistPage,
        profile: initProfilePage
    };
    if (map[page]) map[page]();
}

function onLanguageChanged() {
    const page = document.body.dataset.page;
    if (['landing', 'products', 'product', 'offers', 'cart', 'checkout', 'wishlist', 'profile', 'categories'].includes(page)) {
        initPage();
    }
}
function onAuthChanged() {
    if (document.body.dataset.page === 'profile') initProfilePage();
}

/* ================= الصفحة الرئيسية ================= */
function initHomePage() {
    // العروض المميزة (Preview) في الصفحة الرئيسية
    const wrap = document.getElementById('home-offers');
    if (wrap) {
        const sale = ALURA_PRODUCTS.filter(p => p.oldPrice).slice(0, 4);
        wrap.innerHTML = sale.map(productCardHTML).join('');
    }
}

/* ================= صفحة كل الأقسام ================= */
function initCategoriesPage() {
    const wrap = document.getElementById('categories-grid');
    if (!wrap) return;
    wrap.innerHTML = ALURA_CATEGORIES.map(c => `
        <div class="col-6 col-md-4">
            <a href="${categoryHref(c.key)}" class="card border bg-white shadow-sm p-4 hover-card h-100 text-center">
                <div class="cat-icon-wrap"><i class="bi ${c.icon}"></i></div>
                <h5 class="fw-bold m-0">${currentLang === 'ar' ? c.name_ar : c.name_en}</h5>
                <p class="small text-muted mt-2 mb-0">${currentLang === 'ar' ? c.desc_ar : c.desc_en}</p>
            </a>
        </div>
    `).join('');
}

function categoryHref(key) {
    if (['men', 'women', 'kids', 'bfl'].includes(key)) return key + '.html';
    return 'products.html?cat=' + key;
}

/* ================= صفحات هبوط الأقسام (رجال/نساء/أطفال/براندات بسعر أقل) ================= */
function initCategoryLandingPage() {
    const catKey = document.body.dataset.cat;
    const cat = ALURA_CATEGORIES.find(c => c.key === catKey);
    const subs = ALURA_SUBCATS[catKey] || [];

    const titleEl = document.getElementById('landing-title');
    const descEl = document.getElementById('landing-desc');
    if (titleEl && cat) titleEl.innerText = currentLang === 'ar' ? cat.name_ar : cat.name_en;
    if (descEl && cat) descEl.innerText = currentLang === 'ar' ? cat.desc_ar : cat.desc_en;

    const subWrap = document.getElementById('subcats-wrap');
    if (subWrap) {
        subWrap.innerHTML = subs.map(s => `
            <div class="col-md-6">
                <a href="products.html?cat=${catKey}&sub=${s.key}" class="subcat-row">
                    <div class="d-flex align-items-center gap-3">
                        <div class="subcat-icon"><i class="bi ${s.icon}"></i></div>
                        <span class="fw-bold fs-6">${currentLang === 'ar' ? s.name_ar : s.name_en}</span>
                    </div>
                    <i class="bi ${currentLang === 'ar' ? 'bi-chevron-left' : 'bi-chevron-right'} chev"></i>
                </a>
            </div>
        `).join('');
    }

    const offersWrap = document.getElementById('landing-offers');
    if (offersWrap) {
        const sale = ALURA_PRODUCTS.filter(p => p.cat === catKey && p.oldPrice).slice(0, 4);
        if (sale.length) {
            offersWrap.innerHTML = sale.map(productCardHTML).join('');
            const offersSection = document.getElementById('landing-offers-section');
            if (offersSection) offersSection.style.display = 'block';
        }
    }
}

/* ================= صفحة قائمة المنتجات ================= */
function initProductsPage() {
    renderProductsPage();
    const searchForm = document.getElementById('products-search-form');
    if (searchForm) searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const q = document.getElementById('products-search-input').value.trim();
        const params = new URLSearchParams(window.location.search);
        if (q) params.set('search', q); else params.delete('search');
        params.delete('cat'); params.delete('sub');
        window.location.href = 'products.html?' + params.toString();
    });
}

function renderProductsPage() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    const sub = params.get('sub');
    const search = params.get('search');

    let list = ALURA_PRODUCTS.slice();
    let titleText = t('allCategories');

    if (search) {
        const q = search.toLowerCase();
        list = list.filter(p => p.name_ar.toLowerCase().includes(q) || p.name_en.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
        titleText = t('searchResults') + ' "' + search + '"';
    } else if (cat) {
        list = list.filter(p => p.cat === cat);
        titleText = aluraCategoryName(cat, currentLang);
        if (sub) {
            list = list.filter(p => p.sub === sub);
            titleText += ' - ' + aluraSubName(cat, sub, currentLang);
        }
    } else {
        titleText = t('allCategories');
    }

    const titleEl = document.getElementById('products-title');
    if (titleEl) titleEl.innerText = titleText;

    const countEl = document.getElementById('products-count');
    if (countEl) countEl.innerText = list.length;

    // فلاتر الأقسام الفرعية (تظهر فقط لو محدد قسم رئيسي)
    const pillsWrap = document.getElementById('sub-pills');
    if (pillsWrap) {
        if (cat && ALURA_SUBCATS[cat]) {
            const subs = ALURA_SUBCATS[cat];
            let html = `<button class="filter-pill ${!sub ? 'active' : ''}" onclick="goProducts('${cat}', null)">${t('filterAll')}</button>`;
            html += subs.map(s => `<button class="filter-pill ${sub === s.key ? 'active' : ''}" onclick="goProducts('${cat}', '${s.key}')">${currentLang === 'ar' ? s.name_ar : s.name_en}</button>`).join('');
            pillsWrap.innerHTML = html;
            pillsWrap.style.display = 'flex';
        } else {
            pillsWrap.style.display = 'none';
        }
    }

    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('products-empty');
    if (grid) {
        if (list.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            grid.innerHTML = list.map(productCardHTML).join('');
        }
    }
}

function goProducts(cat, sub) {
    let url = 'products.html?cat=' + cat;
    if (sub) url += '&sub=' + sub;
    window.location.href = url;
}

/* ================= صفحة تفاصيل المنتج ================= */
function initProductDetailPage() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const p = aluraFindProduct(id);
    const wrap = document.getElementById('product-detail-wrap');
    if (!p) {
        if (wrap) wrap.innerHTML = `<div class="empty-state"><i class="bi bi-exclamation-circle"></i><h5>${currentLang === 'ar' ? 'المنتج غير موجود' : 'Product not found'}</h5><a href="products.html" class="btn btn-alura mt-2">${t('backToShop')}</a></div>`;
        return;
    }

    document.title = pName(p) + ' | Alura';
    const bc = document.getElementById('breadcrumb-cat');
    if (bc) bc.innerHTML = `<a href="${categoryHref(p.cat)}">${aluraCategoryName(p.cat, currentLang)}</a>`;
    const bcName = document.getElementById('breadcrumb-name');
    if (bcName) bcName.innerText = pName(p);

    const wished = isWishlisted(p.id);
    const sizesHTML = p.sizes.length ? `
        <div class="mb-3">
            <div class="fw-bold mb-2">${currentLang === 'ar' ? 'المقاس' : 'Size'}:</div>
            <div class="d-flex flex-wrap gap-2" id="size-chips">
                ${p.sizes.map((s, i) => `<button type="button" class="chip-select ${i === 0 ? 'active' : ''}" onclick="selectChip(this,'size-chips')">${s}</button>`).join('')}
            </div>
        </div>` : '';
    const colorsHTML = p.colors.length ? `
        <div class="mb-3">
            <div class="fw-bold mb-2">${currentLang === 'ar' ? 'اللون' : 'Color'}:</div>
            <div class="d-flex flex-wrap gap-2" id="color-chips">
                ${p.colors.map((c, i) => `<button type="button" class="chip-select ${i === 0 ? 'active' : ''}" onclick="selectChip(this,'color-chips')">${c}</button>`).join('')}
            </div>
        </div>` : '';

    wrap.innerHTML = `
        <div class="col-md-5">
            <div class="position-relative">
                ${p.oldPrice ? `<span class="badge sale-badge">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>` : ''}
                <button class="wish-btn ${wished ? 'active' : ''}" onclick="toggleWishlist('${p.id}'); initProductDetailPage();">
                    <i class="bi ${wished ? 'bi-heart-fill' : 'bi-heart'}"></i>
                </button>
                ${pIconWrap(p, true)}
            </div>
        </div>
        <div class="col-md-7">
            <div class="text-muted mb-1">${p.brand}</div>
            <h2 class="fw-bold brand-font mb-3">${pName(p)}</h2>
            <div class="d-flex align-items-center gap-3 mb-4">
                <span class="fs-3 fw-bold text-success">${fmtPrice(p.price)}</span>
                ${p.oldPrice ? `<span class="fs-5 text-muted text-decoration-line-through">${fmtPrice(p.oldPrice)}</span>` : ''}
            </div>
            ${sizesHTML}
            ${colorsHTML}
            <div class="d-flex gap-2 mt-4">
                <button class="btn btn-alura btn-lg px-4 fw-bold" onclick="addToCart('${p.id}',1)"><i class="bi bi-bag-plus me-2"></i>${t('addToCart')}</button>
                <a href="cart.html" class="btn btn-outline-alura btn-lg px-4 fw-bold">${currentLang === 'ar' ? 'عرض السلة' : 'View Cart'}</a>
            </div>
            <hr class="my-4">
            <div class="small text-muted">
                <div class="mb-1"><i class="bi bi-truck me-1"></i> ${t('trustShipping')}</div>
                <div class="mb-1"><i class="bi bi-arrow-repeat me-1"></i> ${t('trustReturn')}</div>
                <div><i class="bi bi-shield-check me-1"></i> ${t('trustSecure')}</div>
            </div>
        </div>
    `;

    const similarWrap = document.getElementById('similar-products');
    if (similarWrap) {
        const similar = ALURA_PRODUCTS.filter(x => x.cat === p.cat && x.sub === p.sub && x.id !== p.id).slice(0, 4);
        similarWrap.innerHTML = similar.map(productCardHTML).join('');
    }
}

function selectChip(el, groupId) {
    document.querySelectorAll('#' + groupId + ' .chip-select').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
}

/* ================= صفحة العروض المميزة ================= */
function initOffersPage() {
    renderOffersPage();
}
function renderOffersPage(activeType) {
    const all = ALURA_PRODUCTS.filter(p => p.oldPrice);
    const list = activeType ? all.filter(p => p.type === activeType) : all;

    const pillsWrap = document.getElementById('offers-pills');
    if (pillsWrap) {
        let html = `<button class="filter-pill ${!activeType ? 'active' : ''}" onclick="renderOffersPage(null)">${t('filterAll')}</button>`;
        html += ALURA_TYPES.map(ty => `<button class="filter-pill ${activeType === ty.key ? 'active' : ''}" onclick="renderOffersPage('${ty.key}')">${currentLang === 'ar' ? ty.name_ar : ty.name_en}</button>`).join('');
        pillsWrap.innerHTML = html;
    }

    const grid = document.getElementById('offers-grid');
    const emptyState = document.getElementById('offers-empty');
    if (grid) {
        if (list.length === 0) {
            grid.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
        } else {
            if (emptyState) emptyState.style.display = 'none';
            grid.innerHTML = list.map(productCardHTML).join('');
        }
    }
}

/* ================= صفحة السلة ================= */
function initCartPage() { renderCartPage(); }
function renderCartPage() {
    const cart = getCart();
    const wrap = document.getElementById('cart-items-wrap');
    const emptyState = document.getElementById('cart-empty');
    const summary = document.getElementById('cart-summary');

    if (cart.length === 0) {
        if (wrap) wrap.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        if (summary) summary.style.display = 'none';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';
    if (summary) summary.style.display = 'block';

    if (wrap) {
        wrap.innerHTML = cart.map(item => {
            const p = aluraFindProduct(item.id);
            if (!p) return '';
            return `
            <div class="cart-item-row p-3 mb-3 d-flex align-items-center gap-3 flex-wrap">
                <div style="width:80px;height:80px;flex-shrink:0;" class="prod-img-ph rounded-3"><i class="bi ${p.icon}" style="font-size:1.8rem;"></i></div>
                <div class="flex-grow-1">
                    <div class="small text-muted">${p.brand}</div>
                    <a href="product.html?id=${p.id}" class="fw-bold text-dark text-decoration-none">${pName(p)}</a>
                    <div class="fw-bold text-success mt-1">${fmtPrice(p.price)}</div>
                </div>
                <div class="qty-control">
                    <button onclick="setCartQty('${p.id}', ${item.qty - 1})"><i class="bi bi-dash"></i></button>
                    <span class="fw-bold" style="min-width:24px;text-align:center;">${item.qty}</span>
                    <button onclick="setCartQty('${p.id}', ${item.qty + 1})"><i class="bi bi-plus"></i></button>
                </div>
                <div class="fw-bold" style="min-width:100px;text-align:center;">${fmtPrice(p.price * item.qty)}</div>
                <button class="icon-btn" style="background:#fdeef1;color:#e0245e;" onclick="removeFromCart('${p.id}')"><i class="bi bi-trash"></i></button>
            </div>`;
        }).join('');
    }

    const totalEl = document.getElementById('cart-total');
    if (totalEl) totalEl.innerText = fmtPrice(cartTotal());
    const countEl = document.getElementById('cart-count-label');
    if (countEl) countEl.innerText = cartCount();
}

/* ================= صفحة إتمام الطلب ================= */
function initCheckoutPage() { renderCheckoutPage(); }
function renderCheckoutPage() {
    const cart = getCart();
    if (cart.length === 0) {
        const wrap = document.getElementById('checkout-wrap');
        if (wrap) wrap.innerHTML = `<div class="empty-state"><i class="bi bi-bag-x"></i><h5>${t('cartEmpty')}</h5><a href="products.html" class="btn btn-alura mt-2">${t('startShopping')}</a></div>`;
        return;
    }

    const summaryEl = document.getElementById('checkout-summary');
    if (summaryEl) {
        summaryEl.innerHTML = cart.map(item => {
            const p = aluraFindProduct(item.id);
            if (!p) return '';
            return `<div class="list-row"><span>${pName(p)} × ${item.qty}</span><span class="fw-bold">${fmtPrice(p.price * item.qty)}</span></div>`;
        }).join('') + `<div class="list-row"><span class="fw-bold fs-5">${t('total')}</span><span class="fw-bold fs-5 text-success">${fmtPrice(cartTotal())}</span></div>`;
    }

    renderAddressOptions();
}

function renderAddressOptions() {
    const addrWrap = document.getElementById('address-options');
    if (!addrWrap) return;
    const list = getAddresses();
    if (list.length === 0) {
        addrWrap.innerHTML = `<p class="text-muted small mb-2">${t('noAddress')}</p>`;
    } else {
        addrWrap.innerHTML = list.map((a, i) => `
            <label class="d-flex align-items-start gap-2 p-3 mb-2 rounded-3 border" style="cursor:pointer;">
                <input type="radio" name="checkoutAddr" value="${a.id}" ${i === 0 ? 'checked' : ''} class="mt-1">
                <span><strong>${a.label}</strong><br><span class="text-muted small">${a.details}</span></span>
            </label>
        `).join('');
    }
}

function checkoutAddNewAddress(e) {
    e.preventDefault();
    const label = document.getElementById('newAddrLabel').value.trim();
    const details = document.getElementById('newAddrDetails').value.trim();
    if (!label || !details) return;
    addAddress({ label, details });
    document.getElementById('newAddressForm').reset();
    const collapseEl = document.getElementById('newAddressCollapse');
    if (collapseEl && window.bootstrap) { const c = bootstrap.Collapse.getInstance(collapseEl) || new bootstrap.Collapse(collapseEl); c.hide(); }
    renderAddressOptions();
    showToast(t('editSaved'), 'success');
}

function confirmCheckout(e) {
    e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) { showToast(t('cartTotalMustBePositive'), 'danger'); return; }

    const addrList = getAddresses();
    const selectedAddrEl = document.querySelector('input[name="checkoutAddr"]:checked');
    if (addrList.length > 0 && !selectedAddrEl) { showToast(t('noAddress'), 'danger'); return; }
    const selectedAddr = selectedAddrEl ? addrList.find(a => a.id === selectedAddrEl.value) : null;

    const paymentEl = document.querySelector('input[name="checkoutPayment"]:checked');
    const payment = paymentEl ? paymentEl.value : 'cod';

    const items = cart.map(i => { const p = aluraFindProduct(i.id); return { id: i.id, name: p ? p.name_ar : i.id, qty: i.qty, price: p ? p.price : 0 }; });
    const order = createOrder({ items, total: cartTotal(), address: selectedAddr, payment });

    saveCart([]);

    const wrap = document.getElementById('checkout-wrap');
    if (wrap) {
        wrap.innerHTML = `
        <div class="col-12">
            <div class="empty-state">
                <i class="bi bi-check-circle-fill" style="color:#1fae5c;"></i>
                <h4 class="fw-bold mb-2">${t('orderSuccess')}</h4>
                <p class="text-muted">${t('orderNum')}: <strong>${order.id}</strong></p>
                <div class="d-flex gap-2 justify-content-center mt-3">
                    <a href="profile.html#orders" class="btn btn-outline-alura fw-bold">${t('myOrders')}</a>
                    <a href="index.html" class="btn btn-alura fw-bold">${t('backToShop')}</a>
                </div>
            </div>
        </div>`;
    }
}

/* ================= صفحة المفضلة ================= */
function initWishlistPage() { renderWishlistPage(); }
function renderWishlistPage() {
    const ids = getWishlist();
    const grid = document.getElementById('wishlist-grid');
    const emptyState = document.getElementById('wishlist-empty');
    if (!grid) return;
    if (ids.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    if (emptyState) emptyState.style.display = 'none';
    const list = ids.map(id => aluraFindProduct(id)).filter(Boolean);
    grid.innerHTML = list.map(productCardHTML).join('');
}

/* ================= صفحة الملف الشخصي ================= */
function initProfilePage() {
    const user = getCurrentUser();
    const guestWrap = document.getElementById('profile-guest');
    const contentWrap = document.getElementById('profile-content');
    if (!user) {
        if (guestWrap) guestWrap.style.display = 'block';
        if (contentWrap) contentWrap.style.display = 'none';
        return;
    }
    if (guestWrap) guestWrap.style.display = 'none';
    if (contentWrap) contentWrap.style.display = 'flex';

    document.getElementById('profileName').value = user.name;
    document.getElementById('profileEmail').value = user.email;
    document.getElementById('profileDisplayName').innerText = user.name;
    document.getElementById('profileDisplayEmail').innerText = user.email;

    const savedPhone = user.phone;
    const phoneStatus = document.getElementById('phoneStatus');
    if (savedPhone) {
        document.getElementById('profilePhone').value = savedPhone;
        if (phoneStatus) phoneStatus.innerHTML = `<span class="badge bg-success">${currentLang === 'ar' ? 'مؤكد' : 'Verified'}</span>`;
    } else if (phoneStatus) {
        phoneStatus.innerHTML = `<span class="badge bg-secondary">${currentLang === 'ar' ? 'غير مؤكد' : 'Not Verified'}</span>`;
    }

    renderOrdersSection();
    renderProfileAddresses();
    renderProfileCards();
    renderReturnsSection();

    const prefs = lsGet(PREFS_KEY, { notifications: true, emailUpdates: false, country: 'مصر' });
    const notif = document.getElementById('prefNotifications');
    const email = document.getElementById('prefEmailUpdates');
    const country = document.getElementById('prefCountry');
    if (notif) notif.checked = !!prefs.notifications;
    if (email) email.checked = !!prefs.emailUpdates;
    if (country) country.value = prefs.country || 'مصر';

    const wishCountEl = document.getElementById('profileWishCount');
    if (wishCountEl) wishCountEl.innerText = getWishlist().length;
}

function saveProfileInfo(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;
    const name = document.getElementById('profileName').value.trim();
    const users = getUsers();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx > -1) { users[idx].name = name; saveUsers(users); }
    showToast(t('editSaved'), 'success');
    checkLoginStatus();
    initProfilePage();
}

function confirmPhone(e) {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;
    const phone = document.getElementById('profilePhone').value.trim();
    if (!phone) return;
    const users = getUsers();
    const idx = users.findIndex(u => u.email === user.email);
    if (idx > -1) { users[idx].phone = phone; saveUsers(users); }
    showToast(t('phoneConfirmed'), 'success');
    initProfilePage();
}

function renderOrdersSection() {
    const wrap = document.getElementById('ordersList');
    if (!wrap) return;
    const orders = getOrders();
    if (orders.length === 0) {
        wrap.innerHTML = `<div class="empty-state py-4"><i class="bi bi-bag"></i><p class="text-muted mb-0">${t('noOrders')}</p></div>`;
        return;
    }
    wrap.innerHTML = orders.map(o => `
        <div class="list-row align-items-start">
            <div>
                <div class="fw-bold">${o.id} <span class="badge bg-light text-dark border ms-1">${o.status}</span></div>
                <div class="small text-muted">${new Date(o.date).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-US')} • ${o.items.length} ${currentLang === 'ar' ? 'منتج' : 'items'}</div>
            </div>
            <div class="text-end">
                <div class="fw-bold text-success mb-1">${fmtPrice(o.total)}</div>
                ${o.status !== 'طلب استرجاع قيد المراجعة' ? `<button class="btn btn-sm btn-outline-alura" onclick="requestReturn('${o.id}'); renderOrdersSection(); showToast(t('returnRequested'),'success');">${t('requestReturnBtn')}</button>` : ''}
            </div>
        </div>
    `).join('');
}

function renderReturnsSection() {
    const wrap = document.getElementById('returnsList');
    if (!wrap) return;
    const orders = getOrders().filter(o => o.status === 'طلب استرجاع قيد المراجعة');
    if (orders.length === 0) {
        wrap.innerHTML = `<div class="empty-state py-4"><i class="bi bi-arrow-repeat"></i><p class="text-muted mb-0">${currentLang === 'ar' ? 'لا توجد طلبات استرجاع حالياً' : 'No return requests'}</p></div>`;
        return;
    }
    wrap.innerHTML = orders.map(o => `
        <div class="list-row">
            <span>${o.id}</span>
            <span class="badge bg-warning text-dark">${o.status}</span>
        </div>`).join('');
}

function renderProfileAddresses() {
    const wrap = document.getElementById('addressesList');
    if (!wrap) return;
    const list = getAddresses();
    if (list.length === 0) {
        wrap.innerHTML = `<p class="text-muted small mb-0">${t('noAddressesYet')}</p>`;
        return;
    }
    wrap.innerHTML = list.map(a => `
        <div class="list-row">
            <span><strong>${a.label}</strong><br><span class="text-muted small">${a.details}</span></span>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteAddress('${a.id}'); renderProfileAddresses(); showToast(t('editSaved'),'success');">${t('deleteBtn')}</button>
        </div>
    `).join('');
}

function addProfileAddress(e) {
    e.preventDefault();
    const label = document.getElementById('profAddrLabel').value.trim();
    const details = document.getElementById('profAddrDetails').value.trim();
    if (!label || !details) return;
    addAddress({ label, details });
    e.target.reset();
    renderProfileAddresses();
    showToast(t('editSaved'), 'success');
}

function renderProfileCards() {
    const wrap = document.getElementById('cardsList');
    if (!wrap) return;
    const list = getCards();
    if (list.length === 0) {
        wrap.innerHTML = `<p class="text-muted small mb-0">${t('noCardsYet')}</p>`;
        return;
    }
    wrap.innerHTML = list.map(c => `
        <div class="list-row">
            <span><i class="bi bi-credit-card-2-front me-2"></i>${c.holder} — •••• ${c.last4}</span>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteCard('${c.id}'); renderProfileCards(); showToast(t('editSaved'),'success');">${t('deleteBtn')}</button>
        </div>
    `).join('');
}

function addProfileCard(e) {
    e.preventDefault();
    const holder = document.getElementById('cardHolder').value.trim();
    const last4 = document.getElementById('cardLast4').value.trim();
    if (!holder || last4.length !== 4) return;
    addCard({ holder, last4 });
    e.target.reset();
    renderProfileCards();
    showToast(t('editSaved'), 'success');
}

function savePrefs() {
    const prefs = {
        notifications: document.getElementById('prefNotifications').checked,
        emailUpdates: document.getElementById('prefEmailUpdates').checked,
        country: document.getElementById('prefCountry').value
    };
    lsSet(PREFS_KEY, prefs);
    showToast(t('editSaved'), 'success');
}

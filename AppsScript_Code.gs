/**
 * Alura - Backend بسيط باستخدام Google Apps Script + Google Sheets
 * ------------------------------------------------------------
 * الملف ده مش بيتحط جوا مجلد الموقع - بيتحط في مشروع Google Apps Script
 * مربوط بالـ Google Sheet بتاعك. اتبع خطوات التركيب في ملف SETUP_GOOGLE_SHEET.md
 */

const USERS_SHEET = "Users";
const ORDERS_SHEET = "Orders";
const USERDATA_SHEET = "UserData";

function getSheet(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function usersSheet() { return getSheet(USERS_SHEET, ["id", "name", "email", "passHash", "phone", "country", "createdAt"]); }
function ordersSheet() { return getSheet(ORDERS_SHEET, ["id", "userEmail", "itemsJSON", "total", "addressJSON", "payment", "status", "date"]); }
function userDataSheet() { return getSheet(USERDATA_SHEET, ["email", "cartJSON", "wishlistJSON", "addressesJSON", "cardsJSON", "prefsJSON", "updatedAt"]); }

function sheetToObjects(sheet) {
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0];
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const obj = {};
    headers.forEach((h, idx) => obj[h] = values[i][idx]);
    obj.__row = i + 1; // رقم الصف الفعلي في الشيت (1-indexed + header)
    rows.push(obj);
  }
  return rows;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function safeParseJSON(str, fallback) {
  try { return JSON.parse(str); } catch (e) { return fallback; }
}

/* ================= الإجراءات ================= */

function actionRegister(p) {
  const users = sheetToObjects(usersSheet());
  const exists = users.find(u => String(u.email).toLowerCase() === String(p.email).toLowerCase());
  if (exists) return { ok: false, error: "exists" };

  const id = "u_" + new Date().getTime();
  const createdAt = new Date().toISOString();
  usersSheet().appendRow([id, p.name, p.email, p.passHash, p.phone || "", p.country || "مصر", createdAt]);

  return { ok: true, user: { id, name: p.name, email: p.email, phone: p.phone || "", country: p.country || "مصر", createdAt } };
}

function actionLogin(p) {
  const users = sheetToObjects(usersSheet());
  const user = users.find(u => String(u.email).toLowerCase() === String(p.email).toLowerCase() && String(u.passHash) === String(p.passHash));
  if (!user) return { ok: false, error: "invalid" };
  return { ok: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, country: user.country, createdAt: user.createdAt } };
}

function actionUpdateProfile(p) {
  const sheet = usersSheet();
  const users = sheetToObjects(sheet);
  const user = users.find(u => String(u.email).toLowerCase() === String(p.email).toLowerCase());
  if (!user) return { ok: false, error: "notfound" };
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (p.name !== undefined) sheet.getRange(user.__row, headers.indexOf("name") + 1).setValue(p.name);
  if (p.phone !== undefined) sheet.getRange(user.__row, headers.indexOf("phone") + 1).setValue(p.phone);
  if (p.country !== undefined) sheet.getRange(user.__row, headers.indexOf("country") + 1).setValue(p.country);
  return { ok: true };
}

function actionGetUserData(p) {
  const rows = sheetToObjects(userDataSheet());
  const row = rows.find(r => String(r.email).toLowerCase() === String(p.email).toLowerCase());
  if (!row) {
    return { ok: true, data: { cart: [], wishlist: [], addresses: [], cards: [], prefs: {} } };
  }
  return {
    ok: true,
    data: {
      cart: safeParseJSON(row.cartJSON, []),
      wishlist: safeParseJSON(row.wishlistJSON, []),
      addresses: safeParseJSON(row.addressesJSON, []),
      cards: safeParseJSON(row.cardsJSON, []),
      prefs: safeParseJSON(row.prefsJSON, {})
    }
  };
}

function actionSaveUserData(p) {
  const sheet = userDataSheet();
  const rows = sheetToObjects(sheet);
  const existing = rows.find(r => String(r.email).toLowerCase() === String(p.email).toLowerCase());
  const now = new Date().toISOString();
  const values = [
    p.email,
    JSON.stringify(p.cart || []),
    JSON.stringify(p.wishlist || []),
    JSON.stringify(p.addresses || []),
    JSON.stringify(p.cards || []),
    JSON.stringify(p.prefs || {}),
    now
  ];
  if (existing) {
    sheet.getRange(existing.__row, 1, 1, values.length).setValues([values]);
  } else {
    sheet.appendRow(values);
  }
  return { ok: true };
}

function actionCreateOrder(p) {
  const order = p.order;
  ordersSheet().appendRow([
    order.id,
    p.email,
    JSON.stringify(order.items || []),
    order.total || 0,
    JSON.stringify(order.address || null),
    order.payment || "cod",
    order.status || "قيد التجهيز",
    order.date || new Date().toISOString()
  ]);
  return { ok: true, order };
}

function actionGetOrders(p) {
  const rows = sheetToObjects(ordersSheet());
  const mine = rows.filter(r => String(r.userEmail).toLowerCase() === String(p.email).toLowerCase());
  mine.sort((a, b) => new Date(b.date) - new Date(a.date));
  const orders = mine.map(r => ({
    id: r.id,
    items: safeParseJSON(r.itemsJSON, []),
    total: r.total,
    address: safeParseJSON(r.addressJSON, null),
    payment: r.payment,
    status: r.status,
    date: r.date
  }));
  return { ok: true, orders };
}

function actionRequestReturn(p) {
  const sheet = ordersSheet();
  const rows = sheetToObjects(sheet);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = rows.find(r => r.id === p.orderId && String(r.userEmail).toLowerCase() === String(p.email).toLowerCase());
  if (!row) return { ok: false, error: "notfound" };
  sheet.getRange(row.__row, headers.indexOf("status") + 1).setValue("طلب استرجاع قيد المراجعة");
  return { ok: true };
}

/* ================= نقاط الدخول ================= */

function handle(p) {
  try {
    switch (p.action) {
      case "ping": return { ok: true, pong: true };
      case "register": return actionRegister(p);
      case "login": return actionLogin(p);
      case "updateProfile": return actionUpdateProfile(p);
      case "getUserData": return actionGetUserData(p);
      case "saveUserData": return actionSaveUserData(p);
      case "createOrder": return actionCreateOrder(p);
      case "getOrders": return actionGetOrders(p);
      case "requestReturn": return actionRequestReturn(p);
      default: return { ok: false, error: "unknown_action" };
    }
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

function doPost(e) {
  const p = safeParseJSON(e.postData.contents, {});
  return jsonOut(handle(p));
}

function doGet(e) {
  const p = e.parameter || {};
  if (!p.action) p.action = "ping";
  return jsonOut(handle(p));
}

/* =========================================================
   Alura - قاعدة بيانات المنتجات والأقسام (بيانات تجريبية لمشروع التخرج)
   ========================================================= */

const ALURA_CATEGORIES = [
    { key: "men", name_ar: "الرجال", name_en: "Men", icon: "bi-person-standing", desc_ar: "كل ما يخص الرجالة: ملابس، أحذية، إكسسوارات وأكتر", desc_en: "Everything for men: clothes, shoes, accessories & more" },
    { key: "women", name_ar: "النساء", name_en: "Women", icon: "bi-person-standing-dress", desc_ar: "أحدث صيحات الموضة النسائية بكل تفاصيلها", desc_en: "The latest women's fashion trends" },
    { key: "kids", name_ar: "الأطفال", name_en: "Kids", icon: "bi-emoji-smile", desc_ar: "ملابس وألعاب للأولاد والبنات", desc_en: "Clothes & toys for boys and girls" },
    { key: "bfl", name_ar: "براندات بسعر أقل", name_en: "Brand For Less", icon: "bi-tags-fill", desc_ar: "منتجات ماركات عالمية بأسعار مخفضة جداً", desc_en: "Global brands at unbeatable prices" },
    { key: "home", name_ar: "أدوات منزلية", name_en: "Home Goods", icon: "bi-house-heart-fill", desc_ar: "كل احتياجات بيتك في مكان واحد", desc_en: "Everything your home needs" },
    { key: "stationery", name_ar: "أدوات مكتبية", name_en: "Stationery", icon: "bi-pencil-fill", desc_ar: "أدوات مدرسية ومكتبية بجودة عالية", desc_en: "High quality school & office supplies" }
];

/* الأقسام الفرعية لكل قسم رئيسي */
const ALURA_SUBCATS = {
    men: [
        { key: "clothing", name_ar: "الملابس", name_en: "Clothing", icon: "bi-bag-fill" },
        { key: "shoes", name_ar: "الأحذية", name_en: "Shoes", icon: "bi-bag-check-fill" },
        { key: "accessories", name_ar: "الإكسسوارات", name_en: "Accessories", icon: "bi-watch" },
        { key: "personalcare", name_ar: "العناية الشخصية", name_en: "Personal Care", icon: "bi-droplet-fill" },
        { key: "bags", name_ar: "الحقائب", name_en: "Bags", icon: "bi-backpack2-fill" }
    ],
    women: [
        { key: "clothing", name_ar: "الملابس النسائية", name_en: "Women's Clothing", icon: "bi-bag-heart-fill" },
        { key: "bagsshoes", name_ar: "الشنط والأحذية", name_en: "Bags & Shoes", icon: "bi-handbag-fill" },
        { key: "accessories", name_ar: "الإكسسوارات", name_en: "Accessories", icon: "bi-gem" },
        { key: "personalcare", name_ar: "العناية الشخصية", name_en: "Personal Care", icon: "bi-droplet-fill" },
        { key: "makeup", name_ar: "الميك أب والمكياج", name_en: "Makeup", icon: "bi-palette-fill" }
    ],
    kids: [
        { key: "boys", name_ar: "قسم الأولاد", name_en: "Boys", icon: "bi-joystick" },
        { key: "girls", name_ar: "قسم البنات", name_en: "Girls", icon: "bi-gift-fill" },
        { key: "toys", name_ar: "ألعاب الأطفال", name_en: "Toys", icon: "bi-controller" }
    ],
    bfl: [
        { key: "clothing", name_ar: "قسم الملابس", name_en: "Clothing", icon: "bi-bag-fill" },
        { key: "beauty", name_ar: "مستحضرات التجميل", name_en: "Beauty", icon: "bi-palette-fill" },
        { key: "toys", name_ar: "قسم الألعاب", name_en: "Toys", icon: "bi-controller" },
        { key: "stationery", name_ar: "الأدوات المكتبية", name_en: "Stationery", icon: "bi-pencil-fill" }
    ]
};

/* أنواع عامة تُستخدم في فلترة صفحة العروض بغض النظر عن القسم الرئيسي */
const ALURA_TYPES = [
    { key: "clothing", name_ar: "ملابس", name_en: "Clothing" },
    { key: "shoesbags", name_ar: "شنط وأحذية", name_en: "Bags & Shoes" },
    { key: "accessories", name_ar: "إكسسوارات", name_en: "Accessories" },
    { key: "personalcare", name_ar: "عناية شخصية", name_en: "Personal Care" },
    { key: "makeup", name_ar: "ميك أب", name_en: "Makeup" },
    { key: "toys", name_ar: "ألعاب", name_en: "Toys" },
    { key: "stationery", name_ar: "أدوات مكتبية", name_en: "Stationery" },
    { key: "home", name_ar: "أدوات منزلية", name_en: "Home" }
];

/* المنتجات - id, name, brand, price, oldPrice(اختياري), cat, sub, type, sizes[], colors[], icon */
const ALURA_PRODUCTS = [
    // ===== رجال - ملابس =====
    { id:"p1", name_ar:"تيشيرت بيسك ساده قطن", name_en:"Basic Plain Cotton T-Shirt", brand:"Dynactno", price:244, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أبيض","أسود"], icon:"bi-bag-fill" },
    { id:"p2", name_ar:"تيشيرت نص كم خضر رجالي", name_en:"Green Half Sleeve T-Shirt", brand:"Nylon", price:365, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أخضر"], icon:"bi-bag-fill" },
    { id:"p3", name_ar:"قميص كلاسيك رجالي كحلي", name_en:"Classic Navy Shirt", brand:"Basic", price:229, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["كحلي"], icon:"bi-bag-fill" },
    { id:"p4", name_ar:"بنطلون رياضي مطبوع صيفي عادي", name_en:"Printed Summer Sport Pants", brand:"LC Waikiki", price:999, cat:"men", sub:"clothing", type:"clothing", sizes:["XS","S","M","L","XL"], colors:["رمادي غامق"], icon:"bi-bag-fill" },
    { id:"p5", name_ar:"تيشيرت بولو رياضي مطرز للرجال", name_en:"Embroidered Sport Polo", brand:"LC Waikiki", price:799, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["إكرو"], icon:"bi-bag-fill" },
    { id:"p6", name_ar:"قميص كتان بأكمام قصيرة وأزرار", name_en:"Short Sleeve Linen Shirt", brand:"Pull & Bear", price:2290, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL","XXL"], colors:["أسود","بيج","أزرق باهت","أبيض فاتح"], icon:"bi-bag-fill" },
    { id:"p7", name_ar:"قميص مريح مزيج الكتان", name_en:"Relaxed Linen Blend Shirt", brand:"American Eagle", price:3800, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["بيج"], icon:"bi-bag-fill" },
    { id:"p8", name_ar:"قميص كتان 100% عادية", name_en:"100% Linen Regular Shirt", brand:"Concrete", price:3999, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أبيض"], icon:"bi-bag-fill" },
    { id:"p9", name_ar:"قميص كلاسيك بقصة ضيقة", name_en:"Slim Fit Classic Shirt", brand:"Tie House", price:2795, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أزرق"], icon:"bi-bag-fill" },
    { id:"p10", name_ar:"قميص رجالي من الكتان 100%", name_en:"100% Linen Men's Shirt", brand:"Zara", price:2900, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["بيج"], icon:"bi-bag-fill" },
    { id:"p11", name_ar:"قميص قطن بولو ممزوج", name_en:"Cotton Blend Polo Shirt", brand:"Defacto", price:1499, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["كحلي"], icon:"bi-bag-fill" },
    { id:"p12", name_ar:"قميص رجالي بقصة ضيقة", name_en:"Slim Fit Men's Shirt", brand:"LC Waikiki", price:1499, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أبيض"], icon:"bi-bag-fill" },
    { id:"p13", name_ar:"تيشيرت بقصة سليم فيت", name_en:"Slim Fit T-Shirt", brand:"Zara", price:850, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL","XXL"], colors:["أبيض","أسود","كحلي","رمادي"], icon:"bi-bag-fill" },
    { id:"p14", name_ar:"تيشيرت رقبة عادية", name_en:"Regular Crew Neck T-Shirt", brand:"Tie House", price:1390, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أسود"], icon:"bi-bag-fill" },
    { id:"p15", name_ar:"تيشيرت Boxy Destination", name_en:"Boxy Destination T-Shirt", brand:"American Eagle", price:1200, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["رمادي"], icon:"bi-bag-fill" },
    { id:"p16", name_ar:"تيشيرت بولو قماش خفيف", name_en:"Light Fabric Polo T-Shirt", brand:"Defacto", price:799, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أبيض"], icon:"bi-bag-fill" },
    { id:"p17", name_ar:"تيشيرت بأكمام قصيرة ونشاط", name_en:"Short Sleeve Active T-Shirt", brand:"Pull & Bear", price:1490, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أزرق"], icon:"bi-bag-fill" },
    { id:"p18", name_ar:"تيشيرت بياقة بولو مضلع", name_en:"Ribbed Polo Collar T-Shirt", brand:"LC Waikiki", price:499, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أخضر"], icon:"bi-bag-fill" },
    { id:"p19", name_ar:"بنطلون كتان 100% بقصة مريحة", name_en:"100% Linen Relaxed Pants", brand:"Zara", price:3500, cat:"men", sub:"clothing", type:"clothing", sizes:["38","40","42","44","46"], colors:["بيج","أبيض","كحلي","أسود"], icon:"bi-bag-fill" },
    { id:"p20", name_ar:"بنطلون تشينو بقصة ضيقة", name_en:"Slim Fit Chino Pants", brand:"Concrete", price:2499, cat:"men", sub:"clothing", type:"clothing", sizes:["38","40","42","44"], colors:["بيج"], icon:"bi-bag-fill" },
    { id:"p21", name_ar:"بنطلون جينز فضفاض خفيف الوزن", name_en:"Lightweight Loose Jeans", brand:"American Eagle", price:3900, cat:"men", sub:"clothing", type:"clothing", sizes:["38","40","42","44"], colors:["أزرق"], icon:"bi-bag-fill" },
    { id:"p22", name_ar:"بنطلون جوجر مريح قصة عادية", name_en:"Regular Fit Jogger Pants", brand:"Defacto", price:1699, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أسود"], icon:"bi-bag-fill" },
    { id:"p23", name_ar:"بنطلون رياضي جوجر Relaxed", name_en:"Relaxed Jogger Sport Pants", brand:"Zara", price:2590, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL","XXL"], colors:["أسود","رمادي","بيج"], icon:"bi-bag-fill" },
    { id:"p24", name_ar:"شورت برمودا رياضي واسع", name_en:"Wide Sport Bermuda Shorts", brand:"Pull & Bear", price:1990, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أسود"], icon:"bi-bag-fill" },
    { id:"p25", name_ar:"بنطلون رياضي كتان 100%", name_en:"100% Linen Sport Pants", brand:"Pull & Bear", price:2990, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["بيج"], icon:"bi-bag-fill" },
    { id:"p26", name_ar:"شورت رياضي سليم فيت", name_en:"Slim Fit Sport Shorts", brand:"Defacto", price:799, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أسود"], icon:"bi-bag-fill" },
    { id:"p27", name_ar:"تيشيرت تدريب مريح خامة خفيفة", name_en:"Light Training T-Shirt", brand:"Zara", price:1690, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["رمادي"], icon:"bi-bag-fill" },
    { id:"p28", name_ar:"تيشيرت رياضي أمريكان", name_en:"American Sport T-Shirt", brand:"American Eagle", price:2600, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أزرق"], icon:"bi-bag-fill" },
    { id:"p29", name_ar:"تيشيرت رياضي بياقة دائرية", name_en:"Round Neck Sport T-Shirt", brand:"LC Waikiki", price:350, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أبيض"], icon:"bi-bag-fill" },
    { id:"p30", name_ar:"شورت سباحة طويل سريع الجفاف", name_en:"Quick Dry Long Swim Shorts", brand:"Concrete", price:2999, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["كحلي"], icon:"bi-bag-fill" },
    { id:"p31", name_ar:"شورت جوجر خامة ثقيلة للجيم", name_en:"Heavyweight Gym Jogger Shorts", brand:"Zara", price:2290, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أسود"], icon:"bi-bag-fill" },
    { id:"p32", name_ar:"بليزر عادية كتان فاخر 100%", name_en:"Premium Linen Blazer", brand:"Concrete", price:21999, cat:"men", sub:"clothing", type:"clothing", sizes:["46","48","50","52","54","56"], colors:["أوف وايت"], icon:"bi-bag-fill" },
    { id:"p33", name_ar:"جاكيت رجالي كلاسيك", name_en:"Classic Men's Jacket", brand:"Zara", price:4950, cat:"men", sub:"clothing", type:"clothing", sizes:["48","50","52"], colors:["أسود"], icon:"bi-bag-fill" },
    { id:"p34", name_ar:"بنطلون كلاسيك رجالي", name_en:"Classic Men's Trousers", brand:"Tie House", price:1990, cat:"men", sub:"clothing", type:"clothing", sizes:["46","48","50"], colors:["كحلي"], icon:"bi-bag-fill" },
    { id:"p35", name_ar:"بدلة رجالي بقصة أنيقة", name_en:"Elegant Fit Men's Suit", brand:"Tie House", price:3990, cat:"men", sub:"clothing", type:"clothing", sizes:["48","50","52"], colors:["أسود"], icon:"bi-bag-fill" },
    { id:"p36", name_ar:"شورتات فرنسية بثلاثة خطوط", name_en:"French Three-Stripe Shorts", brand:"Adidas", price:763, cat:"men", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أسود"], icon:"bi-bag-fill" },
    // رجال - أحذية
    { id:"p37", name_ar:"حذاء رياضي ناعم", name_en:"Soft Sport Sneakers", brand:"Alura Sport", price:349, oldPrice:1100, cat:"men", sub:"shoes", type:"shoesbags", sizes:["40","41","42","43","44"], colors:["أسود"], icon:"bi-bag-check-fill" },
    { id:"p38", name_ar:"حذاء كاجوال كلاسيك", name_en:"Classic Casual Shoes", brand:"Zara", price:2450, cat:"men", sub:"shoes", type:"shoesbags", sizes:["40","41","42","43"], colors:["بني"], icon:"bi-bag-check-fill" },
    { id:"p39", name_ar:"حذاء رياضي جري خفيف", name_en:"Lightweight Running Shoes", brand:"Nike", price:3200, cat:"men", sub:"shoes", type:"shoesbags", sizes:["40","41","42","43","44"], colors:["أبيض"], icon:"bi-bag-check-fill" },
    // رجال - إكسسوارات
    { id:"p40", name_ar:"ساعة رجالي أنيقة", name_en:"Elegant Men's Watch", brand:"Fossil", price:519, oldPrice:799, cat:"men", sub:"accessories", type:"accessories", sizes:[], colors:["أسود"], icon:"bi-watch" },
    { id:"p41", name_ar:"حزام جلد طبيعي", name_en:"Genuine Leather Belt", brand:"Zara", price:890, cat:"men", sub:"accessories", type:"accessories", sizes:[], colors:["بني"], icon:"bi-watch" },
    { id:"p42", name_ar:"نظارة شمسية كلاسيك", name_en:"Classic Sunglasses", brand:"Alura Eyewear", price:1250, cat:"men", sub:"accessories", type:"accessories", sizes:[], colors:["أسود"], icon:"bi-watch" },
    // رجال - عناية شخصية
    { id:"p43", name_ar:"عطر رجالي 100 مل", name_en:"Men's Perfume 100ml", brand:"Alura Man", price:850, cat:"men", sub:"personalcare", type:"personalcare", sizes:[], colors:[], icon:"bi-droplet-fill" },
    { id:"p44", name_ar:"مزيل عرق رجالي", name_en:"Men's Deodorant", brand:"Nivea Men", price:120, cat:"men", sub:"personalcare", type:"personalcare", sizes:[], colors:[], icon:"bi-droplet-fill" },
    // رجال - حقائب
    { id:"p45", name_ar:"حقيبة ظهر رجالي", name_en:"Men's Backpack", brand:"Defacto", price:1100, cat:"men", sub:"bags", type:"shoesbags", sizes:[], colors:["أسود"], icon:"bi-backpack2-fill" },
    { id:"p46", name_ar:"حقيبة لاب توب", name_en:"Laptop Bag", brand:"American Eagle", price:1650, cat:"men", sub:"bags", type:"shoesbags", sizes:[], colors:["كحلي"], icon:"bi-backpack2-fill" },

    // ===== نساء - ملابس =====
    { id:"p47", name_ar:"فستان ميني مطرز", name_en:"Embroidered Mini Dress", brand:"American Eagle", price:2660, oldPrice:3800, cat:"women", sub:"clothing", type:"clothing", sizes:["S","M","L"], colors:["أحمر"], icon:"bi-bag-heart-fill" },
    { id:"p48", name_ar:"بلوزة كتان بجمال", name_en:"Beautiful Linen Blouse", brand:"LC Waikiki", price:499, oldPrice:899, cat:"women", sub:"clothing", type:"clothing", sizes:["S","M","L"], colors:["أبيض"], icon:"bi-bag-heart-fill" },
    { id:"p49", name_ar:"جيبة بقصة A", name_en:"A-Line Skirt", brand:"Defacto", price:599, oldPrice:1299, cat:"women", sub:"clothing", type:"clothing", sizes:["S","M","L"], colors:["أسود"], icon:"bi-bag-heart-fill" },
    { id:"p50", name_ar:"هودي مطرز برباط", name_en:"Embroidered Drawstring Hoodie", brand:"Pull & Bear", price:999, oldPrice:2200, cat:"women", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["رمادي"], icon:"bi-bag-heart-fill" },
    { id:"p51", name_ar:"قميص ناعم مخطط أوفرلايز", name_en:"Soft Striped Oversized Shirt", brand:"LC Waikiki", price:699, cat:"women", sub:"clothing", type:"clothing", sizes:["S","M","L"], colors:["أزرق"], icon:"bi-bag-heart-fill" },
    { id:"p52", name_ar:"فستان سهرة أنيق", name_en:"Elegant Evening Dress", brand:"Zara", price:4200, cat:"women", sub:"clothing", type:"clothing", sizes:["S","M","L"], colors:["أسود"], icon:"bi-bag-heart-fill" },
    { id:"p53", name_ar:"بلوزة حرير كلاسيك", name_en:"Classic Silk Blouse", brand:"Zara", price:1750, cat:"women", sub:"clothing", type:"clothing", sizes:["S","M","L"], colors:["كريمي"], icon:"bi-bag-heart-fill" },
    { id:"p54", name_ar:"بنطلون قماش نسائي واسع", name_en:"Wide Leg Fabric Pants", brand:"Concrete", price:1590, cat:"women", sub:"clothing", type:"clothing", sizes:["S","M","L"], colors:["بيج"], icon:"bi-bag-heart-fill" },
    // نساء - شنط وأحذية
    { id:"p55", name_ar:"حقيبة يد أنيقة", name_en:"Elegant Handbag", brand:"Guess", price:359, oldPrice:999, cat:"women", sub:"bagsshoes", type:"shoesbags", sizes:[], colors:["بيج"], icon:"bi-handbag-fill" },
    { id:"p56", name_ar:"حذاء كعب كلاسيك", name_en:"Classic Heels", brand:"American Eagle", price:1450, cat:"women", sub:"bagsshoes", type:"shoesbags", sizes:["36","37","38","39"], colors:["أسود"], icon:"bi-handbag-fill" },
    { id:"p57", name_ar:"حقيبة كتف جلد", name_en:"Leather Shoulder Bag", brand:"Zara", price:2100, cat:"women", sub:"bagsshoes", type:"shoesbags", sizes:[], colors:["بني"], icon:"bi-handbag-fill" },
    { id:"p58", name_ar:"صندل صيفي مريح", name_en:"Comfy Summer Sandals", brand:"LC Waikiki", price:650, cat:"women", sub:"bagsshoes", type:"shoesbags", sizes:["36","37","38","39"], colors:["ذهبي"], icon:"bi-handbag-fill" },
    // نساء - إكسسوارات
    { id:"p59", name_ar:"ساعة أنيقة نسائي", name_en:"Elegant Women's Watch", brand:"Fossil", price:519, oldPrice:799, cat:"women", sub:"accessories", type:"accessories", sizes:[], colors:["ذهبي"], icon:"bi-gem" },
    { id:"p60", name_ar:"طقم إكسسوار فضي", name_en:"Silver Accessory Set", brand:"Alura Jewelry", price:990, cat:"women", sub:"accessories", type:"accessories", sizes:[], colors:["فضي"], icon:"bi-gem" },
    { id:"p61", name_ar:"وشاح حرير", name_en:"Silk Scarf", brand:"Zara", price:550, cat:"women", sub:"accessories", type:"accessories", sizes:[], colors:["متعدد"], icon:"bi-gem" },
    // نساء - عناية شخصية
    { id:"p62", name_ar:"كريم عناية بالبشرة", name_en:"Skin Care Cream", brand:"L'Oréal", price:480, cat:"women", sub:"personalcare", type:"personalcare", sizes:[], colors:[], icon:"bi-droplet-fill" },
    { id:"p63", name_ar:"شامبو للشعر الجاف", name_en:"Dry Hair Shampoo", brand:"Nivea", price:220, cat:"women", sub:"personalcare", type:"personalcare", sizes:[], colors:[], icon:"bi-droplet-fill" },
    // نساء - ميك أب
    { id:"p64", name_ar:"منتجات ميك أب متكاملة", name_en:"Complete Makeup Set", brand:"Maybelline", price:674, cat:"women", sub:"makeup", type:"makeup", sizes:[], colors:[], icon:"bi-palette-fill" },
    { id:"p65", name_ar:"روج مطفي طويل الثبات", name_en:"Long-Lasting Matte Lipstick", brand:"L'Oréal", price:350, cat:"women", sub:"makeup", type:"makeup", sizes:[], colors:["أحمر"], icon:"bi-palette-fill" },
    { id:"p66", name_ar:"كونسيلر مصحح العيوب", name_en:"Flaw Correcting Concealer", brand:"Maybelline", price:300, oldPrice:500, cat:"women", sub:"makeup", type:"makeup", sizes:[], colors:[], icon:"bi-palette-fill" },

    // ===== أطفال =====
    { id:"p67", name_ar:"تيشيرت أولادي كاجوال", name_en:"Casual Boys T-Shirt", brand:"Defacto Kids", price:250, cat:"kids", sub:"boys", type:"clothing", sizes:["4-5","6-7","8-9"], colors:["أزرق"], icon:"bi-joystick" },
    { id:"p68", name_ar:"بنطلون جينز أولادي", name_en:"Boys Denim Jeans", brand:"LC Waikiki Kids", price:420, cat:"kids", sub:"boys", type:"clothing", sizes:["4-5","6-7","8-9"], colors:["أزرق"], icon:"bi-joystick" },
    { id:"p69", name_ar:"حذاء رياضي أولادي", name_en:"Boys Sport Shoes", brand:"Nike Kids", price:890, cat:"kids", sub:"boys", type:"shoesbags", sizes:["30","31","32","33"], colors:["أسود"], icon:"bi-joystick" },
    { id:"p70", name_ar:"فستان بناتي كاجوال", name_en:"Casual Girls Dress", brand:"Zara Kids", price:380, cat:"kids", sub:"girls", type:"clothing", sizes:["4-5","6-7","8-9"], colors:["وردي"], icon:"bi-gift-fill" },
    { id:"p71", name_ar:"طقم بناتي قطن", name_en:"Girls Cotton Set", brand:"LC Waikiki Kids", price:350, cat:"kids", sub:"girls", type:"clothing", sizes:["4-5","6-7","8-9"], colors:["بنفسجي"], icon:"bi-gift-fill" },
    { id:"p72", name_ar:"حذاء باليه بناتي", name_en:"Girls Ballet Flats", brand:"Defacto Kids", price:410, cat:"kids", sub:"girls", type:"shoesbags", sizes:["28","29","30"], colors:["وردي"], icon:"bi-gift-fill" },
    { id:"p73", name_ar:"مجموعة ليجو تعليمية", name_en:"Educational Lego Set", brand:"Lego", price:1200, cat:"kids", sub:"toys", type:"toys", sizes:[], colors:[], icon:"bi-controller" },
    { id:"p74", name_ar:"دمية ديزني", name_en:"Disney Doll", brand:"Disney", price:450, cat:"kids", sub:"toys", type:"toys", sizes:[], colors:[], icon:"bi-controller" },
    { id:"p75", name_ar:"لعبة تركيب Hasbro", name_en:"Hasbro Building Toy", brand:"Hasbro", price:650, cat:"kids", sub:"toys", type:"toys", sizes:[], colors:[], icon:"bi-controller" },

    // ===== براندات بسعر أقل =====
    { id:"p76", name_ar:"قميص كتان أوت لت", name_en:"Linen Shirt Outlet", brand:"Zara Outlet", price:899, oldPrice:2900, cat:"bfl", sub:"clothing", type:"clothing", sizes:["S","M","L","XL"], colors:["أبيض"], icon:"bi-tags-fill" },
    { id:"p77", name_ar:"مجموعة مستحضرات تجميل أوت لت", name_en:"Beauty Set Outlet", brand:"Maybelline Outlet", price:399, oldPrice:750, cat:"bfl", sub:"beauty", type:"makeup", sizes:[], colors:[], icon:"bi-tags-fill" },
    { id:"p78", name_ar:"لعبة أطفال أوت لت", name_en:"Kids Toy Outlet", brand:"Hasbro Outlet", price:499, oldPrice:900, cat:"bfl", sub:"toys", type:"toys", sizes:[], colors:[], icon:"bi-tags-fill" },
    { id:"p79", name_ar:"مجموعة أدوات مكتبية راقية", name_en:"Premium Stationery Set", brand:"Parker", price:650, oldPrice:1100, cat:"bfl", sub:"stationery", type:"stationery", sizes:[], colors:[], icon:"bi-tags-fill" },

    // ===== أدوات منزلية =====
    { id:"p80", name_ar:"طقم أدوات مطبخ", name_en:"Kitchen Tools Set", brand:"Home Basics", price:750, cat:"home", sub:"general", type:"home", sizes:[], colors:[], icon:"bi-house-heart-fill" },
    { id:"p81", name_ar:"مفرش سرير قطن", name_en:"Cotton Bed Sheet Set", brand:"Home Basics", price:550, cat:"home", sub:"general", type:"home", sizes:[], colors:["أبيض"], icon:"bi-house-heart-fill" },
    { id:"p82", name_ar:"شمعة معطرة ديكور", name_en:"Decorative Scented Candle", brand:"Home Basics", price:180, cat:"home", sub:"general", type:"home", sizes:[], colors:[], icon:"bi-house-heart-fill" },

    // ===== أدوات مكتبية =====
    { id:"p83", name_ar:"أقلام رصاص فاخرة (طقم)", name_en:"Premium Pencil Set", brand:"Faber-Castell", price:220, cat:"stationery", sub:"general", type:"stationery", sizes:[], colors:[], icon:"bi-pencil-fill" },
    { id:"p84", name_ar:"شنطة مدرسية", name_en:"School Backpack", brand:"Alura Kids", price:650, cat:"stationery", sub:"general", type:"stationery", sizes:[], colors:["أزرق"], icon:"bi-pencil-fill" },
    { id:"p85", name_ar:"دفتر ملاحظات جلد", name_en:"Leather Notebook", brand:"Parker", price:300, cat:"stationery", sub:"general", type:"stationery", sizes:[], colors:["بني"], icon:"bi-pencil-fill" }
];

function aluraFindProduct(id) {
    return ALURA_PRODUCTS.find(p => p.id === id);
}

function aluraCategoryName(key, lang) {
    const c = ALURA_CATEGORIES.find(c => c.key === key);
    if (!c) return key;
    return lang === 'ar' ? c.name_ar : c.name_en;
}

function aluraSubName(cat, sub, lang) {
    const list = ALURA_SUBCATS[cat] || [];
    const s = list.find(s => s.key === sub);
    if (!s) return sub;
    return lang === 'ar' ? s.name_ar : s.name_en;
}

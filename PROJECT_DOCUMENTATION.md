# 🏛️ دليل مشروع معرض السيد الجزار للسيراميك والبورسلين (Showroom Project Documentation)

هذا المستند يحتوي على كافة **الروابط المباشرة، المفاتيح السرية، بيانات الدخول، وأوامر التشغيل الخاصة بالمعرض**.

---

## 🌐 1. الروابط المباشرة للمشروع (Production URLs)

| الوصف | الرابط المباشر |
| :--- | :--- |
| 🚀 **الموقع الحي المباشر (Production Site)** | [https://ceramic-showroom.vercel.app](https://ceramic-showroom.vercel.app) |
| 💻 **مستودع الكود على GitHub** | [https://github.com/seif-elmuselmani/ceramic-showroom.git](https://github.com/seif-elmuselmani/ceramic-showroom.git) |
| 🔑 **لوحة تحكم الأدمن (Admin Login)** | [https://ceramic-showroom.vercel.app/?manage=true](https://ceramic-showroom.vercel.app/?manage=true) |

---

## 🔑 2. المفاتيح السرية وروابط التصدير المباشرة للمالك (Owner Secret Endpoints)

- **مفتاح السر الخاص بالمالك (Secret Owner Key):**
  `Elgazar_VIP_Owner_8899_Secure`

- **روابط التحميل المباشرة بنقرة واحدة (تحدث البيانات حياً 24/7):**

1. 📊 **تحميل كشف إكسيل Mined CSV المحدث (شامل الألوان ووحدة القياس وأنواع الغطاء والصور):**
   [https://ceramic-showroom.vercel.app/api/owner/export-csv?secret=Elgazar_VIP_Owner_8899_Secure](https://ceramic-showroom.vercel.app/api/owner/export-csv?secret=Elgazar_VIP_Owner_8899_Secure)

2. 📦 **تحميل جميع صور المنتجات في ملف ZIP بنقرة واحدة:**
   [https://ceramic-showroom.vercel.app/api/owner/download-images-zip?secret=Elgazar_VIP_Owner_8899_Secure](https://ceramic-showroom.vercel.app/api/owner/download-images-zip?secret=Elgazar_VIP_Owner_8899_Secure)

3. 🖼️ **معرض الصور المباشر (Media Gallery Archive):**
   [https://ceramic-showroom.vercel.app/api/owner/export-media-archive?secret=Elgazar_VIP_Owner_8899_Secure](https://ceramic-showroom.vercel.app/api/owner/export-media-archive?secret=Elgazar_VIP_Owner_8899_Secure)

4. 💾 **النسخة الاحتياطية الشاملة (Full JSON Backup):**
   [https://ceramic-showroom.vercel.app/api/owner/export-json?secret=Elgazar_VIP_Owner_8899_Secure](https://ceramic-showroom.vercel.app/api/owner/export-json?secret=Elgazar_VIP_Owner_8899_Secure)

5. 🌱 **إعادة زرع البيانات التجريبية على السيرفر السحابي:**
   [https://ceramic-showroom.vercel.app/api/owner/seed-test-data?secret=Elgazar_VIP_Owner_8899_Secure](https://ceramic-showroom.vercel.app/api/owner/seed-test-data?secret=Elgazar_VIP_Owner_8899_Secure)

---

## 🔐 3. بيانات لوحة التحكم والتسجيل (Admin Credentials)

- **اسم المستخدم الافتراضي:** `admin`
- **كلمة المرور الافتراضية:** `admin123`
- **مفتاح المشفر في البيئة:** `JWT_SECRET=ceramic_admin_super_secret_key_2026`

---

## 📍 4. بيانات فروع المعرض وعناوين الاتصال

- **اسم المعرض:** السيد الجزار للسيراميك والبورسلين
- **رقم الهاتف والواتساب الرئيسي:** `01001366499` (`201001366499`)
- **الفرع الأول:** بنها - مدخل بنها القبلي - برج العطار
- **الفرع الثاني:** بنها - برج السنهوي - بجوار كوبري الشموت
- **ساعات العمل:** يومياً من 10:00 صباحاً حتى 11:30 مساءً

---

## 💻 5. تشغيل المشروع محلياً (Local Development Commands)

### تشغيل سيرفر البيانات (Backend):
```bash
cd server
node server.js
# يشتغل على http://localhost:5000
```

### تشغيل واجهة المستخدم (Frontend):
```bash
cd client
npm run dev
# يشتغل على http://localhost:3000
```

### تجربة الـ Build للإنتاج:
```bash
cd client
npm run build
```

---

## 🏗️ 6. الهيكلية المعمارية وتفاصيل الكود (Architecture Overview)

1. **`server/server.js`**: خادم Express المحتوي على مسارات البيانات، تصدير CSV و ZIP، حماية لوحة التحكم JWT، والتحقق من المفتاح السري للمالك.
2. **`server/db.js`**: طبقة التعامل مع قواعد البيانات (تستخدم MongoDB Atlas أو التخزين المحلي في `data.json` تلقائياً).
3. **`client/src/App.jsx`**: التطبيق الرئيسي المزود بشرائح التنقل، والشارة الملكية العائمة للواتساب (`floating-whatsapp-luxury`).
4. **`client/src/styles/App.css`**: نظام التصميم الملكي 7 نجوم للـ Glassmorphism، الخطوط الذهبية، والكروت.
5. **`client/src/components/TileCalculatorModal.jsx`**: حاسبة السيراميك والكراتين الذكية وتوليد رسائل الواتساب الديناميكية.

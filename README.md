# تطبيق طالب (Talib) — رفيق مدارسة متون العلم الشرعي

تطبيق أندرويد شخصي يعمل **بدون إنترنت بالكامل (Offline-First)**، مبني على منهج التدرج العلمي في طلب العلم الشرعي، بواجهة عربية أصيلة تدعم RTL وثيمات هادئة فاخرة مريحة للقراءة الليلية.

---

## 1. كيفية التشغيل محلياً (How to Run)

```bash
# تثبيت الحزم
npm install

# تشغيل خادم التطوير السريع
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

---

## 2. كيفية بناء تطبيق الأندرويد (How to Build Android APK)

يتطلب البناء المحلي وجود Java JDK 17 و Android SDK:

```bash
# 1. بناء ملفات الواجهة
npm run build

# 2. مزامنة ملفات الويب مع مشروع الأندرويد
npx cap sync android

# 3. بناء ملف الـ APK (Debug)
cd android
./gradlew assembleDebug
# على نظام Windows:
# gradlew.bat assembleDebug
```
الملف الناتج سيكون في المسار:
`android/app/build/outputs/apk/debug/app-debug.apk`

> **ملاحظة:** تم تضمين سير عمل جاهز لـ GitHub Actions في المسار `.github/workflows/build-apk.yml` يقوم ببناء الـ APK تلقائياً ورفعه كملف للتحميل المباشر.

---

## 3. كيفية إضافة أو ربط كتاب جديد (How to Add a Book)

1. **عبر التطبيق مباشرة:**
   * افتح أي كتاب من شاشة "المسار".
   * اضغط على زر **"إرفاق PDF"** لربط نسختك الخاصة من ملفات هاتفك.
2. **عبر سكربت الجلب الرسمي (`scripts/fetch_books.py`):**
   * فحص الرابط والتأكد من حجمه:
     ```bash
     python scripts/fetch_books.py check "<PDF_URL>"
     ```
   * تحميل وتسجيل الكتاب بعد الموافقة:
     ```bash
     python scripts/fetch_books.py download <BOOK_ID> "<PDF_URL>" --approved
     ```

---

## 4. النسخ الاحتياطي ومزامنة التقدم (How to Backup Progress)

* ادخل إلى شاشة **الإعدادات (Settings)**.
* اضغط على **"نسخ البيانات"** لحفظها في الحافظة أو **"تنزيل ملف JSON"** لحفظ نسخة على جهازك.
* لاسترجاع التقدم في أي وقت أو على جهاز آخر: الصق البيانات في مربع الاسترجاع واضغط **"استرجاع البيانات الآن"**.

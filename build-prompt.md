# Task: Build "Talib" — an Arabic RTL Android app (APK) for guided Islamic book study

You are building a personal, offline-first Android reading app. Owner: Mohamed (Egyptian, reads Arabic). Read this whole spec before writing code, then confirm your plan in 10 lines before starting.

## 1. Stack (use this, don't switch)
- Capacitor + React + Vite + TypeScript + Tailwind. Target: Android APK (debug-signed is fine, release-signed optional).
- PDF reading: pdf.js rendered inside the app (continuous scroll, pinch zoom, remembers last page).
- Storage: PDFs in app private storage (Capacitor Filesystem). Progress/settings in SQLite or IndexedDB. Fully offline after books are bundled/downloaded.
- UI language: Arabic, RTL everywhere. Fonts: chosen in the design proposal (section 2), then bundled locally (no CDN at runtime).

## 2. Design — YOU propose it, I approve (do this BEFORE any code)
The look is the most important part: it must feel premium and calm, never like a generic template. I'm not picking colors or fonts myself — use your design taste and any image/asset/theme tools you have.

**Direction (starting point only):** dark, calm, luxurious, with a warm accent (my instinct is black + gold, but you may suggest better). Reading comfort at night is a priority.

**Step A — Design proposal.** Give me 3 distinct theme options. For each one:
- Name + one-line mood description.
- Full palette with hex codes (background, surface/cards, primary accent, secondary accent, text, muted text, success/progress color) and contrast notes for night reading.
- Arabic font pairing: one for headings and one for body/reader text, from free/open-licensed fonts (e.g. Amiri, Noto Naskh Arabic, Cairo, Tajawal, IBM Plex Sans Arabic, Reem Kufi, Scheherazade New — or better ones you know). Say why each fits, and confirm they render Arabic diacritics (tashkeel) well.
- Visual language: card style, corner radius, shadows/glow, icon style, progress ring/bar style, motion style.
- Imagery: a subtle Islamic geometric pattern (give a concrete generation plan: SVG pattern or generated image), app icon concept, splash screen concept, and optional header/illustration art. Generate real preview images or mockups of Home, Path and Reader screens if you can.
- Reader themes: pure dark, sepia, and one more of your choice.

**Step B — I pick** one option (or mix parts). Do not start building until I answer.

**Step C — Implement** the chosen design as a small design system (CSS variables/Tailwind tokens, fonts bundled locally, reusable components) and apply it everywhere.

**Always:** one consistent icon set (lucide or similar), generous spacing, smooth transitions, light haptics on key actions, no default Material-blue, no clutter.

## 3. Screens
1. **Home**: greeting, overall journey progress (ring), "Continue reading" card (last book + page), streak badge, today's status.
2. **Path (المسار)**: the 3 levels + extras as a vertical roadmap. Each level = a card with its books, per-level % and lock state (see rules). Tapping a book opens its detail.
3. **Book detail**: title, author, level, category (عقيدة/فقه/حديث/تفسير/سيرة/إصلاح القلوب), progress %, page count, buttons: Read / Download / Mark finished.
4. **Reader**: pdf.js viewer, saves page position automatically.
5. **Progress**: per-book %, per-level %, total journey %, streak calendar (days read), simple weekly chart.
6. **Settings**: theme (dark/sepia), font size for UI, manage storage (list books with sizes, delete a book's file), export/import progress as JSON.

## 4. Progress & streak logic
- Per book: current page / total pages → %. Finished when user marks it or reaches last page.
- Per level: average of its books. Overall: weighted by pages.
- Streak: a day counts if the user read at least 1 page or 5 minutes. Show current + longest streak.
- Soft unlock: Level 2 suggested after Level 1 is ≥80% done, etc. Never hard-block; show a gentle note ("يفضّل تخلّص المستوى الأول الأول") and allow override.

## 5. Content structure (seed data, in `books.json`)
Level 1 (4 short books): الأصول الثلاثة، القواعد الأربعة، نواقض الإسلام، الأربعون النووية
Level 2: كتاب التوحيد، شروط الصلاة وأركانها وواجباتها، الكبائر (الذهبي)، رياض الصالحين
Level 3: كشف الشبهات، العقيدة الواسطية، أصول السنة (أحمد بن حنبل)، منهج السالكين (السعدي)، صفة صلاة النبي (الألباني)، مقدمة في أصول التفسير (ابن تيمية)، اللؤلؤ والمرجان فيما اتفق عليه الشيخان
Extras (separate "إضافات" section, any order):
- تفسير: ملخص تفسير السعدي (or مختصر ابن كثير)، تحفة الأطفال (تجويد)
- سيرة وتاريخ: الرحيق المختوم، قصص الأنبياء (ابن كثير)، سير الخلفاء الأربعة (موسى العازمي)، حقبة من التاريخ (عثمان الخميس)
- إصلاح القلوب: الفوائد، مدارج السالكين، الداء والدواء (ابن القيم)
- Later/optional: القواعد المثلى في أسماء الله الحسنى (ابن عثيمين)

Each entry: id, title_ar, author_ar, level, category, order, pdf_filename (nullable), source_url (nullable), size_bytes (nullable), pages (nullable).
Books without a PDF yet show a "غير محمّل" state with a Download/Attach button. Also allow the user to attach a PDF manually from the phone's files for any book.

## 6. Book acquisition pipeline (dev-time script, NOT automatic)
Create `scripts/fetch_books.py` (or a documented manual workflow) that finds and downloads PDFs for the books above. **Strict rules — follow exactly:**
1. **Never download anything before showing me a candidate table and getting my explicit approval.** The table must have: book, candidate URL, site, file size (get it via HTTP HEAD / Content-Length, or say "unknown"), page count if known, and why you picked it.
2. Work **one book at a time**, in level order. Do not batch-download the library.
3. Prefer free, legitimate distribution sources (official scholar/foundation sites, IslamHouse, archive.org, well-known free libraries). Skip shady/ad-heavy/login-walled sites. If a book looks commercially restricted, tell me instead of downloading.
4. Prefer text-based, clean PDFs over scanned ones. If several editions exist, pick the **smallest readable one** with proper Arabic text, and list the alternatives.
5. **Size policy:** warn me for anything over 15 MB; refuse anything over 50 MB unless I approve it specifically. Show a running total of storage used vs. a 500 MB total budget.
6. After download, verify it: starts with `%PDF`, opens with pdf.js/pypdf, page count is sane, no duplicate of an already-downloaded book (hash check). Delete failed/duplicate files immediately.
7. Do not modify, re-encode, or watermark the PDFs. Save as `assets/books/<id>.pdf` and update `books.json` (pdf_filename, size_bytes, pages, source_url).
8. Keep a `SOURCES.md` log: book → URL → date → size → hash.
9. If you can't find a good source, say so and move on; don't guess or fabricate links.

## 7. Build & deliver
- Provide exact commands to produce the APK (`npm i`, `npm run build`, `npx cap sync android`, Gradle assemble) and a GitHub Actions workflow that builds and uploads the APK as an artifact.
- App name "طالب" (Talib), custom adaptive icon (gold geometric motif on black), splash screen in the same style.
- Keep the APK reasonable: bundle only the small Level 1 books by default; the rest can be added via the in-app "attach PDF" button or included at build time if I approve.
- Write a short README: how to run, how to build, how to add a book, how to back up progress.

## 8. Working style
- Order: (1) design proposal and my approval, (2) design system + Home + Path + Book detail with seed data (no PDFs), show me, (3) Reader, (4) Progress, (5) acquisition pipeline.
- Ask me before adding any feature not listed here. Keep code clean and commented where non-obvious.

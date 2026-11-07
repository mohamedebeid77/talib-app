import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  Bookmark, 
  Clock, 
  Sparkles,
  BookOpen,
  FileText,
  Type
} from 'lucide-react';
import { Book, ReaderTheme } from '../types';

interface ReaderModalProps {
  book: Book | null;
  startPage?: number;
  isOpen: boolean;
  readerTheme: ReaderTheme;
  onClose: () => void;
  onPageChange: (bookId: string, page: number) => void;
  onAddNote: (bookId: string, page: number, content: string) => void;
  onReaderThemeChange: (theme: ReaderTheme) => void;
  onRecordReadingSession: (bookId: string, minutes: number, pages: number) => void;
}

export const ReaderModal: React.FC<ReaderModalProps> = ({
  book,
  startPage = 1,
  isOpen,
  readerTheme,
  onClose,
  onPageChange,
  onAddNote,
  onReaderThemeChange,
  onRecordReadingSession,
}) => {
  if (!isOpen || !book) return null;

  const totalPages = book.pages || 28;
  const [currentPage, setCurrentPage] = useState<number>(startPage || 1);
  const [fontSize, setFontSize] = useState<number>(19);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);
  const [quickNote, setQuickNote] = useState<string>('');
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'text' | 'pdf'>('text');

  // Active reading timer
  useEffect(() => {
    setCurrentPage(startPage || 1);
    setSessionSeconds(0);

    const timer = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [startPage, book?.id]);

  // Flush accumulated reading time
  useEffect(() => {
    if (sessionSeconds > 0 && sessionSeconds % 60 === 0) {
      onRecordReadingSession(book.id, 1, 0);
    }
  }, [sessionSeconds, book.id, onRecordReadingSession]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const next = currentPage + 1;
      setCurrentPage(next);
      onPageChange(book.id, next);
      if (navigator.vibrate) navigator.vibrate(30);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prev = currentPage - 1;
      setCurrentPage(prev);
      onPageChange(book.id, prev);
      if (navigator.vibrate) navigator.vibrate(30);
    }
  };

  const handleSaveQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;
    onAddNote(book.id, currentPage, quickNote.trim());
    setQuickNote('');
    setShowNoteInput(false);
  };

  // Color schemes for reader themes
  const themeStyles = {
    dark: {
      bg: '#090A0C',
      text: '#EDE8DF',
      border: '#1F242D',
      barBg: 'rgba(15, 17, 22, 0.95)',
      accent: '#D4AF37',
    },
    sepia: {
      bg: '#F5EFE0',
      text: '#2C2216',
      border: '#E2D5BE',
      barBg: 'rgba(239, 230, 214, 0.95)',
      accent: '#8C5E24',
    },
    slate: {
      bg: '#161920',
      text: '#E2E6ED',
      border: '#282F3D',
      barBg: 'rgba(26, 31, 41, 0.95)',
      accent: '#38BDF8',
    },
  }[readerTheme];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  // Classical text content for Level 1 books
  const sampleExcerpts: Record<string, string[]> = {
    'usul-thalatha': [
      'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n\nاعْلَمْ رَحِمَكَ اللَّهُ أَنَّهُ يَجِبُ عَلَيْنَا تَعَلُّمُ أَرْبَعِ مَسَائِلَ:\n\nالْمَسْأَلَةُ الأُولَى: الْعِلْمُ؛ وَهُوَ مَعْرِفَةُ اللَّهِ، وَمَعْرِفَةُ نَبِيِّهِ ﷺ، وَمَعْرِفَةُ دِينِ الإِسْلامِ بِالأَدِلَّةِ.\n\nالثَّانِيَةُ: الْعَمَلُ بِهِ.\nالثَّالِثَةُ: الدَّعْوَةُ إِلَيْهِ.\nالرَّابِعَةُ: الصَّبْرُ عَلَى الأَذَى فِيهِ.\n\nوَالدَّلِيلُ قَوْلُهُ تَعَالَى: {وَالْعَصْرِ (1) إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ (2) إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ (3)}.',
      'قَالَ الشَّافِعِيُّ رَحِمَهُ اللَّهُ تَعَالَى:\n«لَوْ مَا أَنْزَلَ اللَّهُ حُجَّةً عَلَى خَلْقِهِ إِلَّا هَذِهِ السُّورَةَ لَكَفَتْهُمْ».\n\nوَقَالَ الْبُخَارِيُّ رَحِمَهُ اللَّهُ تَعَالَى:\n«بَابُ الْعِلْمِ قَبْلَ الْقَوْلِ وَالْعَمَلِ»؛ وَالدَّلِيلُ قَوْلُهُ تَعَالَى: {فَاعْلَمْ أَنَّهُ لَا إِلَهَ إِلَّا اللَّهُ وَاسْتَغْفِرْ لِذَنْبِكَ} فَبَدَأَ بِالْعِلْمِ قَبْلَ الْقَوْلِ وَالْعَمَلِ.\n\nاعْلَمْ رَحِمَكَ اللَّهُ أَنَّهُ يَجِبُ عَلَى كُلِّ مُسْلِمٍ وَمُسْلِمَةٍ تَعَلُّمُ هَذِهِ الْمَسَائِلِ الثَّلَاثِ، وَالْعَمَلُ بِهِنَّ...',
      'الأُولَى: أَنَّ اللَّهَ خَلَقَنَا، وَرَزَقَنَا، وَلَمْ يَتْرُكْنَا هَمَلًا، بَلْ أَرْسَلَ إِلَيْنَا رَسُولًا، فَمَنْ أَطَاعَهُ دَخَلَ الْجَنَّةَ، وَمَنْ عَصَاهُ دَخَلَ النَّارَ، وَالدَّلِيلُ قَوْلُهُ تَعَالَى: {إِنَّا أَرْسَلْنَا إِلَيْكُمْ رَسُولًا شَاهِدًا عَلَيْكُمْ كَمَا أَرْسَلْنَا إِلَى فِرْعَوْنَ رَسُولًا * فَعَصَى فِرْعَوْنُ الرَّسُولَ فَأَخَذْنَاهُ أَخْذًا وَبِيلًا}.\n\nالثَّانِيَةُ: أَنَّ اللَّهَ لَا يَرْضَى أَنْ يُشْرَكَ مَعَهُ أَحَدٌ فِي عِبَادَتِهِ، لَا مَلَكٌ مُقَرَّبٌ، وَلَا نَبِيٌّ مُرْسَلٌ، وَالدَّلِيلُ قَوْلُهُ تَعَالَى: {وَأَنَّ الْمَسَاجِدَ لِلَّهِ فَلَا تَدْعُوا مَعَ اللَّهِ أَحَدًا}...',
    ],
    'qawaid-arbaa': [
      'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ\n\nأَسْأَلُ اللَّهَ الْكَرِيمَ، رَبَّ الْعَرْشِ الْعَظِيمِ، أَنْ يَتَوَلَّاكَ فِي الدُّنْيَا وَالْآخِرَةِ، وَأَنْ يَجْعَلَكَ مُبَارَكًا أَيْنَمَا كُنْتَ، وَأَنْ يَجْعَلَكَ مِمَّنْ إِذَا أُعْطِيَ شَكَرَ، وَإِذَا ابْتُلِيَ صَبَرَ، وَإِذَا أَذْنَبَ اسْتَغْفَرَ؛ فَإِنَّ هَؤُلَاءِ الثَّلَاثَ عُنْوَانُ السَّعَادَةِ.\n\nاعْلَمْ أَرْشَدَكَ اللَّهُ لِطَاعَتِهِ: أَنَّ الْحَنِيفِيَّةَ مِلَّةَ إِبْرَاهِيمَ: أَنْ تَعْبُدَ اللَّهَ وَحْدَهُ مُخْلِصًا لَهُ الدِّينَ...',
    ],
  };

  const currentText =
    sampleExcerpts[book.id]?.[Math.min(currentPage - 1, (sampleExcerpts[book.id]?.length || 1) - 1)] ||
    `الصفحة رقم (${currentPage})\n\nمتن: ${book.title_ar}\nتأليف: الشيخ ${book.author_ar}\n\n(هنا يتم عرض نص أو صفحات الـ PDF المدمج أو المرفق محلياً مع دعم التمرير المستمر والتكبير باللمس وحفظ الموضع تلقائياً).`;

  const pdfUrl = book.pdf_filename ? `/assets/books/${book.pdf_filename}` : null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col transition-colors duration-300"
      style={{ backgroundColor: themeStyles.bg, color: themeStyles.text }}
    >
      {/* Top Reading Navigation Bar (Hides in Zen Mode) */}
      {!isZenMode && (
        <header
          className="p-3 border-b flex items-center justify-between backdrop-blur-md sticky top-0 z-20 transition-all"
          style={{
            backgroundColor: themeStyles.barBg,
            borderColor: themeStyles.border,
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-black/10 transition-colors"
              title="إغلاق القارئ والعودة"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-amiri font-bold text-base line-clamp-1">
                {book.title_ar}
              </h3>
              <div className="flex items-center gap-2 text-[11px] opacity-70">
                <span>صفحة {currentPage} من {totalPages}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-cairo font-bold text-theme-accent">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimer(sessionSeconds)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Mode Switch, Theme, Font size */}
          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle (Text vs Original PDF) */}
            {pdfUrl && (
              <button
                onClick={() => setViewMode(viewMode === 'text' ? 'pdf' : 'text')}
                className="px-2.5 py-1 rounded-lg text-xs font-bold font-cairo bg-theme-accent/15 text-theme-accent border border-theme-accent/30 flex items-center gap-1 hover:bg-theme-accent/25 transition-all"
                title="التبديل بين قراءة النص وقراءة ملف الـ PDF الأصلي"
              >
                {viewMode === 'text' ? <FileText className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />}
                <span>{viewMode === 'text' ? 'نسخة PDF' : 'نص مريح'}</span>
              </button>
            )}

            {/* Quick Note Button */}
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="p-2 rounded-xl hover:bg-black/10 text-theme-accent transition-colors"
              title="تسجيل فائدة على هذه الصفحة"
            >
              <Bookmark className="w-4 h-4" />
            </button>

            {/* Font size down */}
            {viewMode === 'text' && (
              <>
                <button
                  onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                  className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-black/10"
                  title="تصغير الخط"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize((s) => Math.min(28, s + 2))}
                  className="px-2 py-1 rounded-lg text-xs font-bold hover:bg-black/10"
                  title="تكبير الخط"
                >
                  A+
                </button>
              </>
            )}

            {/* Fullscreen / Zen mode */}
            <button
              onClick={() => setIsZenMode(true)}
              className="p-2 rounded-xl hover:bg-black/10 transition-colors"
              title="وضع القراءة الغامر بدون تشتيت"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Floating Zen Mode exit pill */}
      {isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          className="fixed top-4 left-4 z-40 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>إلغاء الوضع الكامل</span>
        </button>
      )}

      {/* Quick Note Overlay Drawer */}
      {showNoteInput && (
        <form
          onSubmit={handleSaveQuickNote}
          className="p-3.5 border-b z-20 flex gap-2 items-center"
          style={{ backgroundColor: themeStyles.barBg, borderColor: themeStyles.border }}
        >
          <input
            type="text"
            autoFocus
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder={`اكتب فائدة الصفحة ${currentPage}...`}
            className="flex-1 px-3 py-2 rounded-xl bg-black/10 text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-xl text-xs font-bold font-cairo"
            style={{ backgroundColor: themeStyles.accent, color: themeStyles.bg }}
          >
            حفظ
          </button>
        </form>
      )}

      {/* Reading Canvas Area */}
      {viewMode === 'text' ? (
        <main
          onClick={() => {
            if (isZenMode) setIsZenMode(false);
          }}
          className="flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full select-text transition-all leading-relaxed"
        >
          <div
            className="font-amiri text-justify whitespace-pre-line tracking-wide transition-all"
            style={{ fontSize: `${fontSize}px`, lineHeight: 2.1 }}
          >
            {currentText}
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full h-full bg-neutral-900 relative">
          <iframe
            src={`${pdfUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
            className="w-full h-full border-0"
            title={book.title_ar}
          />
        </main>
      )}

      {/* Bottom Paging Controls (Hides in Zen Mode) */}
      {!isZenMode && (
        <footer
          className="p-3 border-t flex items-center justify-between sticky bottom-0 z-20 backdrop-blur-md"
          style={{
            backgroundColor: themeStyles.barBg,
            borderColor: themeStyles.border,
          }}
        >
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-black/10 transition-all font-cairo"
          >
            <ChevronRight className="w-4 h-4" />
            <span>التالي</span>
          </button>

          {/* Slider for page jumping */}
          <div className="flex items-center gap-2 flex-1 max-w-xs mx-4">
            <span className="text-[11px] font-cairo opacity-70">
              {currentPage}
            </span>
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const p = Number(e.target.value);
                setCurrentPage(p);
                onPageChange(book.id, p);
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <span className="text-[11px] font-cairo opacity-70">
              {totalPages}
            </span>
          </div>

          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold disabled:opacity-30 hover:bg-black/10 transition-all font-cairo"
          >
            <span>السابق</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </footer>
      )}
    </div>
  );
};

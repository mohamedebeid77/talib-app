import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  Bookmark, 
  Clock, 
  FileText,
  Type,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { Book, ReaderTheme } from '../types';
import { getPageContent } from '../data/bookExcerpts';
import { PdfCanvasViewer } from '../components/PdfCanvasViewer';

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
  onRecordReadingSession,
}) => {
  if (!isOpen || !book) return null;

  const totalPages = book.pages || 30;
  const [currentPage, setCurrentPage] = useState<number>(startPage || 1);
  const [fontSize, setFontSize] = useState<number>(20);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [showNoteInput, setShowNoteInput] = useState<boolean>(false);
  const [quickNote, setQuickNote] = useState<string>('');
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  // Default to PDF if available, otherwise text
  const [viewMode, setViewMode] = useState<'text' | 'pdf'>('text');
  const [pageTurnAnimation, setPageTurnAnimation] = useState<boolean>(false);

  // Sync state when book opens
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

  // Record 1 minute of active reading every 60 seconds
  useEffect(() => {
    if (sessionSeconds > 0 && sessionSeconds % 60 === 0) {
      onRecordReadingSession(book.id, 1, 0);
    }
  }, [sessionSeconds, book.id, onRecordReadingSession]);

  const triggerPageFeedback = (newPage: number) => {
    setCurrentPage(newPage);
    onPageChange(book.id, newPage);
    setPageTurnAnimation(true);
    setTimeout(() => setPageTurnAnimation(false), 300);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      triggerPageFeedback(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      triggerPageFeedback(currentPage - 1);
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
      barBg: 'rgba(15, 17, 22, 0.96)',
      accent: '#D4AF37',
    },
    sepia: {
      bg: '#F5EFE0',
      text: '#2C2216',
      border: '#E2D5BE',
      barBg: 'rgba(239, 230, 214, 0.96)',
      accent: '#8C5E24',
    },
    slate: {
      bg: '#161920',
      text: '#E2E6ED',
      border: '#282F3D',
      barBg: 'rgba(26, 31, 41, 0.96)',
      accent: '#38BDF8',
    },
  }[readerTheme];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${String(s).padStart(2, '0')}`;
  };

  // Resolve content for current page
  const pageContent = getPageContent(
    book.id,
    book.title_ar,
    book.author_ar,
    currentPage,
    totalPages
  );

  const pdfUrl = book.pdf_filename ? `/assets/books/${book.pdf_filename}` : null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col transition-colors duration-300 select-none"
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
              <div className="flex items-center gap-2 text-[11px] opacity-75">
                <span className="font-cairo font-bold text-theme-accent">
                  صفحة {currentPage} من {totalPages}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-cairo text-theme-muted">
                  <Clock className="w-3 h-3 text-theme-accent" />
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
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold font-cairo bg-theme-accent/15 text-theme-accent border border-theme-accent/30 flex items-center gap-1 hover:bg-theme-accent/25 transition-all"
                title={viewMode === 'text' ? 'التبديل إلى نسخة PDF الأصلية المصورة' : 'التبديل إلى القراءة النصية المشكولة المريحة'}
              >
                {viewMode === 'text' ? <FileText className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />}
                <span>{viewMode === 'text' ? 'نسخة PDF' : 'نص مشكول'}</span>
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

            {/* Font size controls (in Text mode) */}
            {viewMode === 'text' && (
              <div className="flex items-center bg-black/10 rounded-lg p-0.5">
                <button
                  onClick={() => setFontSize((s) => Math.max(14, s - 2))}
                  className="px-2 py-1 text-xs font-bold hover:bg-black/15 rounded"
                  title="تصغير الخط"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize((s) => Math.min(30, s + 2))}
                  className="px-2 py-1 text-xs font-bold hover:bg-black/15 rounded"
                  title="تكبير الخط"
                >
                  A+
                </button>
              </div>
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
          className="fixed top-4 left-4 z-40 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-white text-xs flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          <span>إلغاء وضع ملء الشاشة</span>
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
          className={`flex-1 overflow-y-auto px-6 py-8 max-w-2xl mx-auto w-full select-text transition-opacity duration-200 leading-relaxed ${
            pageTurnAnimation ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'
          }`}
        >
          {/* Chapter header */}
          <div className="mb-6 pb-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-cairo font-bold px-2.5 py-1 rounded-md bg-theme-accent/15 text-theme-accent">
              {pageContent.title}
            </span>
            <span className="text-xs font-cairo text-theme-muted">
              صفحة {currentPage} / {totalPages}
            </span>
          </div>

          {/* Book Text */}
          <div
            className="font-amiri text-justify whitespace-pre-line tracking-wide transition-all"
            style={{ fontSize: `${fontSize}px`, lineHeight: 2.2 }}
          >
            {pageContent.text}
          </div>
        </main>
      ) : (
        <main className="flex-1 w-full h-full bg-neutral-900 relative flex flex-col overflow-hidden">
          {pdfUrl ? (
            <PdfCanvasViewer
              url={pdfUrl}
              pageNumber={currentPage}
            />
          ) : (
            <div className="m-auto text-center p-6 text-theme-muted font-cairo">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>ملف الـ PDF غير متوفر لهذا الكتاب</p>
            </div>
          )}
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
          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold disabled:opacity-30 bg-theme-accent text-theme-bg shadow-sm hover:opacity-90 active:scale-95 transition-all font-cairo"
          >
            <ChevronRight className="w-4 h-4" />
            <span>التالي ({Math.min(totalPages, currentPage + 1)})</span>
          </button>

          {/* Slider for page jumping */}
          <div className="flex items-center gap-2 flex-1 max-w-xs mx-3">
            <span className="text-[11px] font-cairo font-bold text-theme-accent">
              {currentPage}
            </span>
            <input
              type="range"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const p = Number(e.target.value);
                triggerPageFeedback(p);
              }}
              className="w-full accent-amber-500 cursor-pointer h-1.5 rounded-lg bg-white/20"
            />
            <span className="text-[11px] font-cairo text-theme-muted">
              {totalPages}
            </span>
          </div>

          {/* Prev Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-xs font-bold disabled:opacity-30 border border-theme-border hover:bg-black/10 active:scale-95 transition-all font-cairo text-theme-text"
          >
            <span>السابق</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </footer>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Paperclip, 
  Share2, 
  FileText, 
  Plus, 
  Trash2,
  Clock,
  Sparkles,
  Hourglass
} from 'lucide-react';
import { Book, BookProgress, UserNote } from '../types';
import { calculateEstimatedTime } from '../utils/streakUtils';

interface BookDetailModalProps {
  book: Book | null;
  progress: BookProgress | undefined;
  notes: UserNote[];
  isOpen: boolean;
  onClose: () => void;
  onStartReading: (book: Book, startPage?: number) => void;
  onMarkFinished: (bookId: string) => void;
  onAttachPdf: (bookId: string, filename: string, size: number, pages: number) => void;
  onAddNote: (bookId: string, page: number, content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  progress,
  notes,
  isOpen,
  onClose,
  onStartReading,
  onMarkFinished,
  onAttachPdf,
  onAddNote,
  onDeleteNote,
}) => {
  if (!isOpen || !book) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'notes'>('info');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNotePage, setNewNotePage] = useState<number>(progress?.current_page || 1);
  const [attachMessage, setAttachMessage] = useState<string | null>(null);

  const currentPage = progress?.current_page || 0;
  const totalPages = progress?.total_pages || book.pages || 30;
  const isFinished = progress?.is_finished || false;
  const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
  const remainingPages = Math.max(0, totalPages - currentPage);

  // Real estimated reading time calculation
  const estTime = calculateEstimatedTime(remainingPages, 2);

  const bookNotes = notes.filter((n) => n.book_id === book.id);

  const handleSimulatePdfAttach = () => {
    const simulatedFilename = `${book.id}.pdf`;
    const simulatedSize = (book.pages || 30) * 45000;
    onAttachPdf(book.id, simulatedFilename, simulatedSize, book.pages || 30);
    setAttachMessage('تم ربط ملف PDF بنجاح من الذاكرة المحلية!');
    setTimeout(() => setAttachMessage(null), 3000);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    onAddNote(book.id, newNotePage, newNoteContent.trim());
    setNewNoteContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full sm:max-w-lg bg-theme-surface border-t sm:border border-theme-border rounded-t-3xl sm:rounded-3xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-6 duration-200"
      >
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-theme-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-theme-accentMuted text-theme-accent">
              {book.category}
            </span>
            <span className="text-xs text-theme-muted">
              {book.level_name?.split(':')[0] || `المستوى ${book.level}`}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-text transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Header Info */}
          <div className="space-y-1.5 text-center sm:text-right">
            <h3 className="text-2xl font-amiri font-bold text-theme-text leading-tight">
              {book.title_ar}
            </h3>
            <p className="text-sm font-medium text-theme-accent">
              المؤلف: {book.author_ar}
            </p>
          </div>

          {/* Description */}
          {book.description_ar && (
            <div className="p-3.5 rounded-2xl bg-theme-bg/60 border border-theme-border/60 text-xs leading-relaxed text-theme-muted font-normal">
              {book.description_ar}
            </div>
          )}

          {/* Progress Card + Estimated Reading Time */}
          <div className="p-4 rounded-2xl bg-theme-surfaceHover border border-theme-border space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-theme-muted">حالة الإنجاز والمدارسة</span>
              <span className="font-bold text-theme-accent font-cairo">
                {isFinished ? 'مكتمل بحمد الله ✓' : `${percentage}% (صفحة ${currentPage} من ${totalPages})`}
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-theme-border/60 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-l from-theme-accent to-theme-accentHover transition-all duration-500"
                style={{ width: `${Math.max(4, percentage)}%` }}
              />
            </div>

            {/* Estimated Reading Time Banner */}
            <div className="pt-2 border-t border-theme-border/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-theme-muted">
                <Clock className="w-3.5 h-3.5 text-theme-accent" />
                <span>المدة المتوقعة للختم:</span>
              </div>
              <span className="font-cairo font-bold text-theme-text bg-theme-bg px-2 py-0.5 rounded-md border border-theme-border/60">
                {isFinished ? 'تم الختم بحمد الله' : estTime.formatted}
              </span>
            </div>
          </div>

          {/* Status of PDF file */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-theme-bg/40 border border-theme-border text-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-theme-muted" />
              <span>
                {book.pdf_filename ? (
                  <span className="text-emerald-500 font-medium">
                    الملف جاهز محلياً ({book.pdf_filename})
                  </span>
                ) : (
                  <span className="text-amber-500/90 font-medium">
                    الكتاب غير محمّل حالياً (يمكن قراءته أو إرفاق نسختك)
                  </span>
                )}
              </span>
            </div>

            <button
              onClick={handleSimulatePdfAttach}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-theme-surface border border-theme-border text-xs font-bold text-theme-text hover:text-theme-accent transition-all"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>إرفاق PDF</span>
            </button>
          </div>

          {attachMessage && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 text-center font-medium">
              {attachMessage}
            </div>
          )}

          {/* Tabs: Info vs Notes */}
          <div className="border-b border-theme-border flex gap-4 text-sm font-bold">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === 'info'
                  ? 'border-theme-accent text-theme-accent'
                  : 'border-transparent text-theme-muted'
              }`}
            >
              الخيارات والإجراءات
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'notes'
                  ? 'border-theme-accent text-theme-accent'
                  : 'border-transparent text-theme-muted'
              }`}
            >
              <span>فوائد وحواشي الطالب</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-theme-accentMuted text-theme-accent">
                {bookNotes.length}
              </span>
            </button>
          </div>

          {/* Tab 1: Info / Actions */}
          {activeTab === 'info' && (
            <div className="space-y-3 pt-1">
              <button
                onClick={() => onStartReading(book, currentPage || 1)}
                className="w-full py-3.5 px-4 rounded-2xl bg-theme-accent hover:bg-theme-accentHover text-theme-bg font-cairo font-bold text-sm flex items-center justify-center gap-2 shadow-glow-gold transition-all active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {currentPage > 0 && !isFinished
                    ? `متابعة القراءة (من صفحة ${currentPage})`
                    : 'ابدأ القراءة الآن'}
                </span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => onMarkFinished(book.id)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold font-cairo flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                    isFinished
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                      : 'bg-theme-surface border-theme-border text-theme-text hover:border-theme-accent/40'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFinished ? 'الكتاب مكتمل ✓' : 'تحديد كمكتمل'}</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: book.title_ar,
                        text: `أدرس حالياً كتاب "${book.title_ar}" للشيخ ${book.author_ar} عبر تطبيق طالب.`,
                      });
                    }
                  }}
                  className="p-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-muted hover:text-theme-text transition-colors"
                  title="مشاركة المتن"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Marginal Notes / فوائد الطالب */}
          {activeTab === 'notes' && (
            <div className="space-y-4 pt-1">
              {/* Add Note Form */}
              <form onSubmit={handleSaveNote} className="space-y-2 p-3 rounded-2xl bg-theme-bg/60 border border-theme-border">
                <div className="flex items-center justify-between text-xs text-theme-muted">
                  <span className="font-bold text-theme-text flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-theme-accent" />
                    <span>تسجيل فائدة أو تعليق</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <span>رقم الصفحة:</span>
                    <input
                      type="number"
                      min={1}
                      max={totalPages}
                      value={newNotePage}
                      onChange={(e) => setNewNotePage(Number(e.target.value))}
                      className="w-14 px-2 py-0.5 rounded bg-theme-surface border border-theme-border text-center text-xs font-cairo text-theme-text font-bold"
                    />
                  </div>
                </div>

                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="اكتب الفائدة أو شرح الشيخ هنا..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-text placeholder:text-theme-muted/60 focus:outline-none focus:border-theme-accent"
                />

                <button
                  type="submit"
                  disabled={!newNoteContent.trim()}
                  className="w-full py-2 rounded-xl bg-theme-accent/20 hover:bg-theme-accent/30 text-theme-accent disabled:opacity-40 text-xs font-bold font-cairo flex items-center justify-center gap-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>حفظ الفائدة في دفتر الكتاب</span>
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto">
                {bookNotes.length === 0 ? (
                  <p className="text-center text-xs text-theme-muted py-6">
                    لا توجد فوائد مسجلة لهذا الكتاب بعد. سجل فوائدك أثناء المدارسة!
                  </p>
                ) : (
                  bookNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-theme-surfaceHover border border-theme-border/60 text-xs space-y-1 relative group"
                    >
                      <div className="flex items-center justify-between text-[11px] text-theme-accent font-bold">
                        <span>صفحة {note.page_number}</span>
                        <button
                          onClick={() => onDeleteNote(note.id)}
                          className="text-theme-muted hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="font-amiri text-sm text-theme-text leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

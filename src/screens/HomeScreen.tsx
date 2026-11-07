import React from 'react';
import { BookOpen, CheckCircle2, ChevronLeft, Clock, Flame, ArrowUpRight, Hourglass } from 'lucide-react';
import { Book, BookProgress, UserStats } from '../types';
import { ProgressRing } from '../components/ProgressRing';
import { calculateEstimatedTime } from '../utils/streakUtils';

interface HomeScreenProps {
  books: Book[];
  progress: Record<string, BookProgress>;
  stats: UserStats;
  overallProgress: number;
  onOpenBook: (book: Book) => void;
  onNavigateToPath: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  books,
  progress,
  stats,
  overallProgress,
  onOpenBook,
  onNavigateToPath,
}) => {
  // Find currently active book or fallback to the first book
  const activeBook =
    books.find((b) => b.id === stats.active_book_id) ||
    books.find((b) => progress[b.id] && !progress[b.id].is_finished) ||
    books[0];

  const activeProgress = activeBook ? progress[activeBook.id] : undefined;
  const currentPage = activeProgress ? activeProgress.current_page : 0;
  const totalPages = activeProgress ? activeProgress.total_pages : activeBook?.pages || 30;
  const bookPercentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
  const remainingPages = Math.max(0, totalPages - currentPage);
  const estTime = calculateEstimatedTime(remainingPages, 2);

  // Count finished books
  const finishedBooksCount = Object.values(progress).filter((p) => p.is_finished).length;

  // Next up book in Level 1
  const nextBook = books.find((b) => b.level === 1 && (!progress[b.id] || !progress[b.id].is_finished) && b.id !== activeBook?.id);

  // Real daily goal status: read at least 1 page or at least 5 minutes
  const dailyGoalReached = stats.pages_read_today >= 1 || stats.minutes_read_today >= 5;

  return (
    <div className="space-y-6 pb-24">
      {/* Overall Journey Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-theme-surface border border-theme-border/80 p-5 sm:p-6 shadow-subtle">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-theme-accent/15 text-theme-accent">
              خطة المنهج الشرعي
            </span>
            <h2 className="text-xl sm:text-2xl font-cairo font-bold text-theme-text leading-tight">
              رحلة التدرج في المتون
            </h2>
            <p className="text-xs sm:text-sm text-theme-muted font-normal leading-relaxed">
              أنجزت حتى الآن {finishedBooksCount} من أصل {books.filter((b) => b.level <= 3).length} متناً أساسياً في المسار.
            </p>
            <button
              onClick={onNavigateToPath}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-accent hover:underline pt-1.5"
            >
              <span>استعراض خريطة المسار</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-shrink-0">
            <ProgressRing progress={overallProgress} size={110} strokeWidth={9} sublabel="إنجاز كلي" />
          </div>
        </div>
      </div>

      {/* Continue Reading Card */}
      {activeBook && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-cairo font-bold text-theme-text flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-theme-accent" />
              <span>تابع القراءة الآن</span>
            </h3>
            <span className="text-[11px] text-theme-muted font-medium">آخر كتاب فُتح</span>
          </div>

          <div
            onClick={() => onOpenBook(activeBook)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-theme-surface to-theme-surfaceHover border border-theme-border p-5 sm:p-6 transition-all duration-200 hover:border-theme-accent/40 active:scale-[0.99] shadow-sm"
          >
            {/* Background book texture hint */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-theme-accent/5 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-theme-accentMuted text-theme-accent">
                    {activeBook.category}
                  </span>
                  <span className="text-xs text-theme-muted font-medium">
                    {activeBook.level_name?.split(':')[0] || `المستوى ${activeBook.level}`}
                  </span>
                </div>

                <h4 className="text-xl sm:text-2xl font-amiri font-bold text-theme-text group-hover:text-theme-accent transition-colors pt-0.5">
                  {activeBook.title_ar}
                </h4>
                <p className="text-xs sm:text-sm text-theme-muted font-medium">
                  تأليف: {activeBook.author_ar}
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-theme-surface border border-theme-border text-theme-muted group-hover:text-theme-accent group-hover:border-theme-accent/30 transition-all shrink-0">
                <ChevronLeft className="w-5 h-5" />
              </div>
            </div>

            {/* Reading progress bar */}
            <div className="mt-5 pt-4 border-t border-theme-border/70">
              <div className="flex items-center justify-between text-xs mb-2.5 font-medium">
                <span className="text-theme-muted">
                  الصفحة {currentPage} من {totalPages}
                </span>
                <span className="font-bold text-theme-accent font-cairo text-sm">
                  {bookPercentage}%
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-theme-bg/80 border border-theme-border/50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-l from-theme-accent to-theme-accentHover transition-all duration-500"
                  style={{ width: `${Math.max(5, bookPercentage)}%` }}
                />
              </div>

              {/* Estimated Time Badge */}
              <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-theme-border/40 text-xs">
                <div className="flex items-center gap-1.5 text-theme-accent">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium text-theme-muted">المتبقي لختم المتن:</span>
                </div>
                <span className="font-cairo font-bold text-theme-text bg-theme-bg px-2.5 py-1 rounded-lg border border-theme-border/50 text-[11px]">
                  {estTime.formatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Streak & Status Card */}
      <div className="rounded-2xl bg-theme-surface border border-theme-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h4 className="text-xs font-cairo font-bold text-theme-text">
                ورد القراءة والمواظبة لليوم
              </h4>
              <p className="text-[11px] text-theme-muted">
                {dailyGoalReached
                  ? 'أحسنت! حققت الورد اليومي واستمر الـ Streak'
                  : 'اقرأ صفحة واحدة أو 5 دقائق لاحتساب اليوم وتثبيت الـ Streak'}
              </p>
            </div>
          </div>

          {dailyGoalReached ? (
            <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>مكتمل</span>
            </div>
          ) : (
            <span className="text-[11px] text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full font-medium">
              قيد الإنجاز
            </span>
          )}
        </div>

        {/* Micro stats grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-theme-border/50 text-center">
          <div className="p-2 rounded-xl bg-theme-bg/60">
            <div className="flex items-center justify-center gap-1 text-[11px] text-theme-muted mb-0.5">
              <Clock className="w-3 h-3" />
              <span>اليوم</span>
            </div>
            <span className="text-sm font-bold font-cairo text-theme-text">
              {stats.minutes_read_today} دقيقة
            </span>
          </div>

          <div className="p-2 rounded-xl bg-theme-bg/60">
            <div className="flex items-center justify-center gap-1 text-[11px] text-theme-muted mb-0.5">
              <BookOpen className="w-3 h-3" />
              <span>الصفحات</span>
            </div>
            <span className="text-sm font-bold font-cairo text-theme-text">
              {stats.pages_read_today} صفحة
            </span>
          </div>

          <div className="p-2 rounded-xl bg-theme-bg/60">
            <div className="flex items-center justify-center gap-1 text-[11px] text-theme-muted mb-0.5">
              <Flame className="w-3 h-3 text-amber-500" />
              <span>أطول تتابع</span>
            </div>
            <span className="text-sm font-bold font-cairo text-theme-text">
              {stats.longest_streak} أيام
            </span>
          </div>
        </div>
      </div>

      {/* Next Recommended Book */}
      {nextBook && (
        <div className="space-y-2">
          <h3 className="text-sm font-cairo font-bold text-theme-text px-1">
            المتن التالي في المستوى
          </h3>
          <div
            onClick={() => onOpenBook(nextBook)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-theme-surface/70 hover:bg-theme-surface border border-theme-border cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-theme-border/40 flex items-center justify-center font-bold font-cairo text-theme-muted text-xs">
                {nextBook.order}
              </div>
              <div>
                <h5 className="font-amiri font-bold text-base text-theme-text">
                  {nextBook.title_ar}
                </h5>
                <span className="text-[11px] text-theme-muted">
                  {nextBook.author_ar} • {nextBook.pages} صفحة
                </span>
              </div>
            </div>
            <ChevronLeft className="w-4 h-4 text-theme-muted" />
          </div>
        </div>
      )}
    </div>
  );
};

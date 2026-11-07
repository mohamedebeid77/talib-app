import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  Lock, 
  Unlock,
  Layers
} from 'lucide-react';
import { Book, BookProgress } from '../types';

interface PathScreenProps {
  books: Book[];
  progress: Record<string, BookProgress>;
  getLevelProgress: (level: number) => number;
  onOpenBook: (book: Book) => void;
}

export const PathScreen: React.FC<PathScreenProps> = ({
  books,
  progress,
  getLevelProgress,
  onOpenBook,
}) => {
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
  });

  const [extrasCategoryFilter, setExtrasCategoryFilter] = useState<string>('all');

  const toggleLevel = (lvl: number) => {
    setExpandedLevels((prev) => ({ ...prev, [lvl]: !prev[lvl] }));
  };

  const level1Progress = getLevelProgress(1);
  const level2Progress = getLevelProgress(2);
  const level3Progress = getLevelProgress(3);

  const levelsConfig = [
    {
      level: 1,
      title: 'المستوى الأول',
      subtitle: 'التأسيس والبدايات في العقيدة والحديث',
      progress: level1Progress,
      isSoftLocked: false,
      note: null,
      color: 'from-amber-500/20 to-transparent',
    },
    {
      level: 2,
      title: 'المستوى الثاني',
      subtitle: 'الرسوخ والبناء وتفصيل الأحكام',
      progress: level2Progress,
      isSoftLocked: level1Progress < 80,
      note: 'يفضّل إتمام 80% من المستوى الأول أولاً لتثبيت الأصول',
      color: 'from-blue-500/20 to-transparent',
    },
    {
      level: 3,
      title: 'المستوى الثالث',
      subtitle: 'التمكين والتوسع والرد على الشبهات',
      progress: level3Progress,
      isSoftLocked: level2Progress < 80,
      note: 'يفضّل إتمام المستوى الثاني لرسوخ القواعد الفقهية والعقدية',
      color: 'from-emerald-500/20 to-transparent',
    },
    {
      level: 4,
      title: 'قسم الإضافات',
      subtitle: 'كتب إثرائية في التفسير والسيرة وإصلاح القلوب',
      progress: getLevelProgress(4),
      isSoftLocked: false,
      note: 'مطالعة حرة ومفتوحة بالتوازي مع مسار المتون',
      color: 'from-purple-500/20 to-transparent',
    },
  ];

  const extrasCategories = ['all', 'تفسير', 'سيرة وتاريخ', 'إصلاح القلوب', 'تجويد'];

  return (
    <div className="space-y-6 pb-24">
      {/* Page Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-cairo font-bold text-theme-text flex items-center gap-2">
          <Layers className="w-5 h-5 text-theme-accent" />
          <span>المسار العلمي المتدرج</span>
        </h2>
        <p className="text-xs text-theme-muted leading-relaxed">
          منهج مدروس في طلب العلم الشرعي مبني على التدرج من صغار العلم قبل كباره.
        </p>
      </div>

      {/* Vertical Roadmap */}
      <div className="space-y-4 relative">
        {levelsConfig.map((lvl) => {
          const isExpanded = expandedLevels[lvl.level];
          let levelBooks = books.filter((b) => b.level === lvl.level);

          if (lvl.level === 4 && extrasCategoryFilter !== 'all') {
            levelBooks = levelBooks.filter((b) => b.category === extrasCategoryFilter);
          }

          const completedCount = levelBooks.filter(
            (b) => progress[b.id] && progress[b.id].is_finished
          ).length;

          return (
            <div
              key={lvl.level}
              className="rounded-2xl bg-theme-surface border border-theme-border/80 overflow-hidden shadow-sm transition-all"
            >
              {/* Level Header / Accordion trigger */}
              <div
                onClick={() => toggleLevel(lvl.level)}
                className={`p-4 cursor-pointer select-none bg-gradient-to-l ${lvl.color} flex items-center justify-between gap-3`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-cairo font-bold text-base text-theme-text">
                      {lvl.title}
                    </span>
                    {lvl.isSoftLocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-500/90 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>موصى بالانتظار</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-full">
                        <Unlock className="w-3 h-3" />
                        <span>متاح للدراسة</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-theme-muted">{lvl.subtitle}</p>

                  {/* Level progress bar */}
                  <div className="flex items-center gap-2 pt-1.5">
                    <div className="flex-1 h-1.5 rounded-full bg-theme-border/60 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-theme-accent transition-all duration-500"
                        style={{ width: `${lvl.progress}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-bold font-cairo text-theme-accent">
                      {lvl.progress}%
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-theme-surface/80 border border-theme-border/50 text-theme-muted">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>

              {/* Soft Lock Warning Banner */}
              {lvl.isSoftLocked && lvl.note && (
                <div className="px-4 py-2.5 bg-amber-500/10 border-t border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-400">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{lvl.note}</span>
                </div>
              )}

              {/* Extras Category Filter Chips */}
              {lvl.level === 4 && isExpanded && (
                <div className="px-4 py-3 border-b border-theme-border/50 flex gap-1.5 overflow-x-auto scrollbar-none">
                  {extrasCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExtrasCategoryFilter(cat);
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-cairo transition-all whitespace-nowrap ${
                        extrasCategoryFilter === cat
                          ? 'bg-theme-accent text-theme-bg font-bold'
                          : 'bg-theme-bg border border-theme-border text-theme-muted hover:text-theme-text'
                      }`}
                    >
                      {cat === 'all' ? 'جميع الإضافات' : cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Books List inside Level */}
              {isExpanded && (
                <div className="p-3 space-y-2 divide-y divide-theme-border/40">
                  {levelBooks.map((book) => {
                    const p = progress[book.id];
                    const isFinished = p?.is_finished;
                    const currentPage = p?.current_page || 0;
                    const totalPages = p?.total_pages || book.pages || 50;
                    const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

                    return (
                      <div
                        key={book.id}
                        onClick={() => onOpenBook(book)}
                        className="pt-2.5 first:pt-0 group flex items-center justify-between p-2 rounded-xl hover:bg-theme-surfaceHover cursor-pointer transition-all active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Order / Status indicator */}
                          <div className="flex-shrink-0">
                            {isFinished ? (
                              <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                              </div>
                            ) : currentPage > 0 ? (
                              <div className="w-8 h-8 rounded-full bg-theme-accent/15 text-theme-accent font-bold font-cairo text-xs flex items-center justify-center border border-theme-accent/30">
                                {percentage}%
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-theme-border/40 text-theme-muted font-bold font-cairo text-xs flex items-center justify-center">
                                {book.order}
                              </div>
                            )}
                          </div>

                          {/* Book Details */}
                          <div className="flex-1 min-w-0 pr-1">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-theme-bg border border-theme-border text-theme-muted">
                                {book.category}
                              </span>
                              {book.pages && (
                                <span className="text-[10px] text-theme-muted">
                                  {book.pages} صفحة
                                </span>
                              )}
                            </div>
                            <h4 className="font-amiri font-bold text-base text-theme-text truncate group-hover:text-theme-accent transition-colors">
                              {book.title_ar}
                            </h4>
                            <p className="text-xs text-theme-muted truncate">
                              {book.author_ar}
                            </p>
                          </div>
                        </div>

                        {/* Action badge */}
                        <div className="flex-shrink-0 mr-2">
                          {isFinished ? (
                            <span className="text-[11px] font-bold text-emerald-500">
                              مكتمل
                            </span>
                          ) : currentPage > 0 ? (
                            <span className="text-[11px] font-bold text-theme-accent">
                              صفحة {currentPage}
                            </span>
                          ) : (
                            <span className="text-[11px] text-theme-muted group-hover:text-theme-text">
                              ابدأ الآن
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

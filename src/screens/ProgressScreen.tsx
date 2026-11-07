import React from 'react';
import { Flame, CheckCircle2, Trophy, Calendar, Clock, BookOpen } from 'lucide-react';
import { Book, BookProgress, UserStats } from '../types';
import { ProgressRing } from '../components/ProgressRing';

interface ProgressScreenProps {
  books: Book[];
  progress: Record<string, BookProgress>;
  stats: UserStats;
  overallProgress: number;
  getLevelProgress: (level: number) => number;
}

export const ProgressScreen: React.FC<ProgressScreenProps> = ({
  books,
  progress,
  stats,
  overallProgress,
  getLevelProgress,
}) => {
  const finishedBooks = books.filter((b) => progress[b.id]?.is_finished);
  const coreBooks = books.filter((b) => b.level <= 3);

  // Past 7 days dummy data for weekly chart
  const weekDays = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const weekMinutes = [15, 20, 0, 10, 25, 18, stats.minutes_read_today];
  const maxMinute = Math.max(...weekMinutes, 30);

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-cairo font-bold text-theme-text flex items-center gap-2">
          <Trophy className="w-5 h-5 text-theme-accent" />
          <span>سجل الإنجاز والمواظبة</span>
        </h2>
        <p className="text-xs text-theme-muted">
          إحصائيات دقيقة لمسيرتك في طلب العلم ومتابعة الورد اليومي.
        </p>
      </div>

      {/* Main KPI Card */}
      <div className="p-5 rounded-3xl bg-theme-surface border border-theme-border flex items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs text-theme-muted font-medium">الرحلة الكلية</span>
          <h3 className="text-2xl font-cairo font-bold text-theme-text">
            {overallProgress}% <span className="text-sm font-normal text-theme-muted">منجز</span>
          </h3>
          <p className="text-xs text-theme-muted">
            أتممت {finishedBooks.length} من {coreBooks.length} كتاباً أساسياً.
          </p>
        </div>
        <ProgressRing progress={overallProgress} size={95} strokeWidth={8} sublabel="إجمالي" />
      </div>

      {/* Streak & Consistency */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
            <Flame className="w-4 h-4 fill-amber-500" />
            <span>المواظبة الحالية</span>
          </div>
          <p className="text-2xl font-cairo font-bold text-theme-text">
            {stats.streak_days} <span className="text-xs font-normal text-theme-muted">أيام متتالية</span>
          </p>
          <span className="text-[10px] text-theme-muted">ورد مستمر دون انقطاع</span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-theme-accent font-bold">
            <Trophy className="w-4 h-4" />
            <span>أطول سلسلة</span>
          </div>
          <p className="text-2xl font-cairo font-bold text-theme-text">
            {stats.longest_streak} <span className="text-xs font-normal text-theme-muted">أيام</span>
          </p>
          <span className="text-[10px] text-theme-muted">أعلى إنجاز مسجل لك</span>
        </div>
      </div>

      {/* Weekly Reading Chart */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-cairo font-bold text-theme-text flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-theme-accent" />
            <span>دقائق القراءة خلال الأسبوع</span>
          </h4>
          <span className="text-[11px] text-theme-muted">
            المجموع: {weekMinutes.reduce((a, b) => a + b, 0)} دقيقة
          </span>
        </div>

        {/* Bar Chart */}
        <div className="pt-4 pb-2 flex items-end justify-between gap-2 h-36">
          {weekMinutes.map((mins, idx) => {
            const heightPercent = Math.round((mins / maxMinute) * 100);
            const isToday = idx === weekMinutes.length - 1;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-cairo text-theme-muted">
                  {mins > 0 ? `${mins}د` : '-'}
                </span>
                <div className="w-full max-w-[24px] bg-theme-bg rounded-t-md h-full flex items-end overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ${
                      isToday
                        ? 'bg-theme-accent'
                        : mins > 0
                        ? 'bg-theme-accent/40'
                        : 'bg-transparent'
                    }`}
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                  />
                </div>
                <span className={`text-[10px] font-cairo ${isToday ? 'font-bold text-theme-accent' : 'text-theme-muted'}`}>
                  {weekDays[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level by Level Breakdown */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-3">
        <h4 className="text-xs font-cairo font-bold text-theme-text">
          تقدم المستويات
        </h4>

        {[1, 2, 3].map((lvl) => {
          const p = getLevelProgress(lvl);
          return (
            <div key={lvl} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-theme-text font-medium">
                  {lvl === 1 ? 'المستوى الأول (التأسيس)' : lvl === 2 ? 'المستوى الثاني (الرسوخ)' : 'المستوى الثالث (التمكين)'}
                </span>
                <span className="font-cairo font-bold text-theme-accent">
                  {p}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-theme-border/60 overflow-hidden">
                <div
                  className="h-full rounded-full bg-theme-accent transition-all duration-500"
                  style={{ width: `${p}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

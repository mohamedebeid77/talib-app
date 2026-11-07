import React from 'react';
import { Flame, Moon, Sparkles, BookOpen } from 'lucide-react';
import { AppTheme, UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  theme: AppTheme;
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ stats, theme, onThemeToggle }) => {
  // Hijri / Gregorian date estimation
  const today = new Date();
  const dateStr = today.toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="relative pt-safe pb-3.5 px-5 bg-theme-surface/85 border-b border-theme-border/70 backdrop-blur-md sticky top-0 z-30 transition-all shadow-sm">
      {/* Subtle Islamic Motif Background Overlay */}
      <div 
        className="absolute inset-0 opacity-[var(--bg-pattern-opacity)] bg-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/assets/talib-texture-${theme}.jpg')`,
          backgroundSize: '300px',
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        {/* Right side: Greeting & Date */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-theme-muted font-medium mb-1">
            <Sparkles className="w-3.5 h-3.5 text-theme-accent" />
            <span>{dateStr}</span>
          </div>
          <h1 className="text-xl font-cairo font-bold text-theme-text flex items-center gap-2">
            <span>السلام عليكم يا طالب العلم</span>
          </h1>
        </div>

        {/* Left side: Streak Badge & Theme Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Streak pill */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-theme-surface border border-theme-border shadow-sm"
            title={`المواظبة: ${stats.streak_days} أيام متتالية`}
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="font-cairo font-bold text-xs text-theme-text">
              {stats.streak_days}
            </span>
            <span className="text-[10px] text-theme-muted">يوم</span>
          </div>

          {/* Theme Quick Switcher */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl bg-theme-surface hover:bg-theme-surfaceHover border border-theme-border text-theme-accent transition-colors active:scale-95"
            title="تبديل الثيم البصري"
            aria-label="تبديل الثيم"
          >
            {theme === 'midnight' && <Moon className="w-4 h-4" />}
            {theme === 'emerald' && <Sparkles className="w-4 h-4" />}
            {theme === 'parchment' && <BookOpen className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};

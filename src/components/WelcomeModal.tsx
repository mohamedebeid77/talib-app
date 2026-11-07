import React from 'react';
import { BookOpen, Sparkles, Flame, CheckCircle2, Heart, ArrowLeft } from 'lucide-react';
import { AppTheme, UserStats } from '../types';

interface WelcomeModalProps {
  isOpen: boolean;
  theme: AppTheme;
  stats: UserStats;
  overallProgress: number;
  onEnterApp: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  theme,
  stats,
  overallProgress,
  onEnterApp,
}) => {
  if (!isOpen) return null;

  // Time-aware Arabic greeting
  const hour = new Date().getHours();
  const isMorning = hour >= 4 && hour < 14;
  const timeGreeting = isMorning 
    ? 'صَبَاحٌ مُبَارَكٌ بِعَوْنِ اللَّهِ وَتَوْفِيقِهِ' 
    : 'مَسَاءٌ مُبَارَكٌ تَمْلَؤُهُ السَّكِينَةُ وَالْبَرَكَةُ';

  const todayStr = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      {/* Background motif */}
      <div 
        className="absolute inset-0 opacity-[0.05] bg-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/assets/talib-texture-${theme}.jpg')`,
          backgroundSize: '280px',
        }}
      />

      <div className="relative w-full max-w-sm rounded-3xl bg-theme-surface border border-theme-border/90 p-6 shadow-2xl text-center overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-44 bg-theme-accent/15 rounded-full blur-3xl pointer-events-none" />

        {/* App Icon */}
        <div className="relative mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-theme-surface to-theme-border/60 border border-theme-accent/30 p-2 shadow-lg mb-3 flex items-center justify-center">
          <img 
            src={`/assets/talib-icon-${theme}.jpg`} 
            alt="شعار طالب" 
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <BookOpen className="w-8 h-8 text-theme-accent absolute" />
        </div>

        {/* Basmala (برسم المصحف الشريف) */}
        <p className="font-amiri text-xl text-theme-accent font-bold tracking-wide mb-1 leading-relaxed">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        {/* Date & Time Greeting */}
        <span className="inline-block text-[11px] text-theme-muted font-medium mb-1">
          {todayStr}
        </span>
        <h2 className="text-lg font-cairo font-bold text-theme-text mb-3">
          {timeGreeting}
        </h2>

        {/* Hadith / Spiritual Quote Card (موثق باللفظ الصحيح من صحيح مسلم) */}
        <div className="rounded-2xl bg-theme-bg/85 border border-theme-border/70 p-4 mb-3.5 text-right">
          <div className="flex items-center gap-1.5 text-xs text-theme-accent font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بِشَارَةٌ لِطَالِبِ الْعِلْمِ الشَّرْعِيِّ</span>
          </div>
          <p className="font-amiri text-base leading-relaxed text-theme-text font-medium mb-1.5">
            «وَمَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا، سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ»
          </p>
          <span className="block text-[10px] text-theme-muted font-cairo font-normal">
            [رواه مسلم في صحيحه، رقم 2699]
          </span>
        </div>

        {/* Prophetic Supplication (الدعاء المأثور لطلب العلم النافع) */}
        <div className="flex items-start gap-2 bg-theme-accentMuted/30 border border-theme-accent/20 rounded-xl p-3 mb-4 text-right">
          <Heart className="w-4 h-4 text-theme-accent shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-amiri text-xs font-bold text-theme-accent leading-relaxed">
              «اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا»
            </p>
            <span className="text-[10px] text-theme-muted block font-cairo">
              [أخرجه الإمام ابن ماجه، وصححه الألباني]
            </span>
          </div>
        </div>

        {/* Mini stats preview */}
        <div className="grid grid-cols-2 gap-2 mb-4.5">
          <div className="p-2.5 rounded-xl bg-theme-bg/60 border border-theme-border/50 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-theme-muted mb-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>المواظبة</span>
            </div>
            <span className="text-sm font-bold font-cairo text-theme-text">
              {stats.streak_days} {stats.streak_days === 1 ? 'يوم' : 'أيام'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-theme-bg/60 border border-theme-border/50 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] text-theme-muted mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-theme-accent" />
              <span>إنجاز المسار</span>
            </div>
            <span className="text-sm font-bold font-cairo text-theme-text">
              {overallProgress}%
            </span>
          </div>
        </div>

        {/* Big Prominent Action Button (مضبوط لغوياً بحذف الألف: بِسْمِ اللَّهِ) */}
        <button
          onClick={onEnterApp}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-theme-accent to-theme-accentHover text-slate-950 font-cairo font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all hover:brightness-105"
        >
          <span>بِسْمِ اللَّهِ.. ابْدَأْ وِرْدَ الْيَوْمِ</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

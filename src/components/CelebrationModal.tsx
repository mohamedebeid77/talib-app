import React, { useEffect, useRef } from 'react';
import { Sparkles, Trophy, CheckCircle, Share2, ArrowLeft, X } from 'lucide-react';
import { Book } from '../types';

interface CelebrationModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onNextBook?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  book,
  isOpen,
  onClose,
  onNextBook,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Trigger haptic vibration if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 150, 50, 200]);
    }

    // Canvas Confetti Animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
    }> = [];

    const colors = ['#D4AF37', '#E6C66E', '#2DD4BF', '#10B981', '#FFFFFF', '#F59E0B'];

    // Spawn 100 particles
    for (let i = 0; i < 110; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 150,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }

    let animationId: number;
    let frame = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - frame / 180);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });

      frame++;
      if (frame < 180) {
        animationId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `تم بحمد الله ختم ${book.title_ar}`,
        text: `تم بحمد الله وتوفيقه ختم دراسة متن "${book.title_ar}" للشيخ ${book.author_ar} عبر تطبيق طالب. نسأل الله الإخلاص والقبول!`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Celebratory Dialog Card */}
      <div className="relative z-20 w-full max-w-sm rounded-3xl bg-gradient-to-b from-theme-surface to-theme-bg border border-theme-accent/40 p-6 text-center space-y-5 shadow-glow-gold">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 rounded-full bg-theme-bg/80 border border-theme-border text-theme-muted hover:text-theme-text transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Crown / Trophy Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-theme-accent/15 border border-theme-accent/30 text-theme-accent shadow-inner animate-bounce">
          <Trophy className="w-8 h-8 text-amber-400 stroke-[2.2]" />
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-theme-accent">
            <Sparkles className="w-4 h-4" />
            <span>مبارك ختم المتن</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-2xl font-amiri font-bold text-theme-text leading-tight">
            {book.title_ar}
          </h3>
          <p className="text-xs text-theme-muted font-medium">
            تأليف: الشيخ {book.author_ar}
          </p>
        </div>

        {/* Encouraging Hadith Card */}
        <div className="p-3.5 rounded-2xl bg-theme-surface border border-theme-border/70 text-xs font-amiri leading-relaxed text-theme-text text-justify">
          «مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ»
          <span className="block text-[10px] text-theme-muted font-cairo text-left mt-1">
            — رواه مسلم
          </span>
        </div>

        {/* Completion details */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-theme-bg border border-theme-border">
            <span className="text-[10px] text-theme-muted block mb-0.5">عدد الصفحات</span>
            <span className="font-bold font-cairo text-theme-text">{book.pages} صفحة كاملة</span>
          </div>
          <div className="p-2.5 rounded-xl bg-theme-bg border border-theme-border">
            <span className="text-[10px] text-theme-muted block mb-0.5">الحالة</span>
            <span className="font-bold font-cairo text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>مكتمل</span>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          {onNextBook && (
            <button
              onClick={() => {
                onClose();
                onNextBook();
              }}
              className="w-full py-3 px-4 rounded-xl bg-theme-accent hover:bg-theme-accentHover text-theme-bg font-cairo font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-all"
            >
              <span>متابعة المتن التالي في المسار</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-3 rounded-xl bg-theme-surface hover:bg-theme-surfaceHover border border-theme-border text-xs font-cairo font-bold text-theme-text flex items-center justify-center gap-1.5 transition-all"
            >
              <Share2 className="w-4 h-4 text-theme-accent" />
              <span>مشاركة الإنجاز</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-theme-bg border border-theme-border text-xs font-cairo font-medium text-theme-muted hover:text-theme-text transition-all"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Palette, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  Copy, 
  HardDrive, 
  Smartphone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { AppTheme, ReaderTheme, Book } from '../types';

interface SettingsScreenProps {
  theme: AppTheme;
  readerTheme: ReaderTheme;
  books: Book[];
  onThemeChange: (theme: AppTheme) => void;
  onReaderThemeChange: (rTheme: ReaderTheme) => void;
  onExport: () => string;
  onImport: (json: string) => boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  theme,
  readerTheme,
  books,
  onThemeChange,
  onReaderThemeChange,
  onExport,
  onImport,
}) => {
  const [copied, setCopied] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCopyBackup = () => {
    const json = onExport();
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadBackup = () => {
    const json = onExport();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `talib-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRunImport = () => {
    if (!importInput.trim()) return;
    const ok = onImport(importInput.trim());
    if (ok) {
      setImportStatus('تم استرجاع البيانات بنجاح!');
      setImportInput('');
    } else {
      setImportStatus('عذراً، صيغة الملف غير صالحة.');
    }
    setTimeout(() => setImportStatus(null), 3500);
  };

  const themesList = [
    {
      id: 'midnight' as AppTheme,
      name: 'سَحر الليالي',
      subtitle: 'Midnight Gold',
      bg: '#0A0B0E',
      accent: '#D4AF37',
    },
    {
      id: 'emerald' as AppTheme,
      name: 'رَوْض الزمرد',
      subtitle: 'Imperial Emerald',
      bg: '#06130E',
      accent: '#2DD4BF',
    },
    {
      id: 'parchment' as AppTheme,
      name: 'نَفح المخطوطات',
      subtitle: 'Scholarly Parchment',
      bg: '#F8F4EB',
      accent: '#0F5132',
    },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-cairo font-bold text-theme-text flex items-center gap-2">
          <Palette className="w-5 h-5 text-theme-accent" />
          <span>الإعدادات والمظهر</span>
        </h2>
        <p className="text-xs text-theme-muted">
          تخصيص الواجهة، إدارة الذاكرة، والنسخ الاحتياطي.
        </p>
      </div>

      {/* Theme Picker */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-3">
        <h4 className="text-xs font-cairo font-bold text-theme-text">
          الثيم البصري للتطبيق
        </h4>

        <div className="grid grid-cols-1 gap-2.5">
          {themesList.map((t) => {
            const isSelected = theme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => onThemeChange(t.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-theme-accent bg-theme-accentMuted'
                    : 'border-theme-border bg-theme-bg/60 hover:border-theme-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg border border-white/20 flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: t.bg }}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: t.accent }}
                    />
                  </div>
                  <div>
                    <h5 className="font-cairo font-bold text-sm text-theme-text">
                      {t.name}
                    </h5>
                    <span className="text-[11px] text-theme-muted">{t.subtitle}</span>
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-theme-accent text-theme-bg flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reader Mode Selection */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-3">
        <h4 className="text-xs font-cairo font-bold text-theme-text">
          وضع عارض القراءة الافتراضي
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'dark' as ReaderTheme, label: 'ليلي نقي', bg: '#090A0C', fg: '#E5E0D8' },
            { id: 'sepia' as ReaderTheme, label: 'ورقي عتيق', bg: '#F4EEDD', fg: '#241E15' },
            { id: 'slate' as ReaderTheme, label: 'رمادي صخري', bg: '#181B20', fg: '#E2E5EB' },
          ].map((rm) => (
            <button
              key={rm.id}
              onClick={() => onReaderThemeChange(rm.id)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                readerTheme === rm.id
                  ? 'border-theme-accent ring-1 ring-theme-accent'
                  : 'border-theme-border'
              }`}
              style={{ backgroundColor: rm.bg, color: rm.fg }}
            >
              <span className="text-xs font-cairo font-bold block">{rm.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Backup & Export */}
      <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-3">
        <h4 className="text-xs font-cairo font-bold text-theme-text flex items-center gap-1.5">
          <HardDrive className="w-4 h-4 text-theme-accent" />
          <span>النسخ الاحتياطي ومزامنة التقدم</span>
        </h4>
        <p className="text-xs text-theme-muted leading-relaxed">
          جميع بيانات قراءتك وفوائدك ومواظبتك محفوظة محلياً على جهازك. يمكنك تصديرها كملف أو نص واسترجاعها في أي وقت.
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleCopyBackup}
            className="flex-1 py-2.5 px-3 rounded-xl bg-theme-bg border border-theme-border hover:border-theme-accent text-xs font-cairo font-bold flex items-center justify-center gap-1.5 transition-all text-theme-text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ للحافظة!' : 'نسخ البيانات'}</span>
          </button>

          <button
            onClick={handleDownloadBackup}
            className="flex-1 py-2.5 px-3 rounded-xl bg-theme-bg border border-theme-border hover:border-theme-accent text-xs font-cairo font-bold flex items-center justify-center gap-1.5 transition-all text-theme-text"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل ملف JSON</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="pt-2 border-t border-theme-border/50 space-y-2">
          <textarea
            value={importInput}
            onChange={(e) => setImportInput(e.target.value)}
            placeholder="الصق نص النسخة الاحتياطية هنا للاسترجاع..."
            rows={2}
            className="w-full p-2.5 rounded-xl bg-theme-bg border border-theme-border text-xs text-theme-text placeholder:text-theme-muted/50 focus:outline-none focus:border-theme-accent font-mono"
          />
          <button
            onClick={handleRunImport}
            disabled={!importInput.trim()}
            className="w-full py-2 rounded-xl bg-theme-accent/20 hover:bg-theme-accent/30 text-theme-accent disabled:opacity-40 text-xs font-bold font-cairo flex items-center justify-center gap-1.5 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>استرجاع البيانات الآن</span>
          </button>

          {importStatus && (
            <p className="text-xs text-center font-bold text-theme-accent pt-1">
              {importStatus}
            </p>
          )}
        </div>
      </div>

      {/* App Info & Privacy */}
      <div className="text-center space-y-1 text-xs text-theme-muted pt-2">
        <div className="flex items-center justify-center gap-1.5 font-bold text-theme-text">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>تطبيق طالب • إصدار 1.0.0</span>
        </div>
        <p className="text-[11px]">يعمل 100% بدون إنترنت • خصوصية تامة • بدون إعلانات</p>
      </div>
    </div>
  );
};

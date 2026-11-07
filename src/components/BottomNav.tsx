import React from 'react';
import { Home, Compass, BarChart2, Settings } from 'lucide-react';

export type NavTab = 'home' | 'path' | 'progress' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'الرئيسية', icon: Home },
    { id: 'path' as NavTab, label: 'المسار', icon: Compass },
    { id: 'progress' as NavTab, label: 'الإنجاز', icon: BarChart2 },
    { id: 'settings' as NavTab, label: 'الإعدادات', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-theme-surface/95 border-t border-theme-border/80 backdrop-blur-xl pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.18)]">
      <div className="max-w-md mx-auto px-4 pt-2 pb-1 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'text-theme-accent'
                  : 'text-theme-muted hover:text-theme-text'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-theme-accent/15 scale-105' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.2]' : 'stroke-[1.7]'}`} />
              </div>
              <span
                className={`text-[11px] mt-0.5 font-cairo transition-all ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-theme-accent" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

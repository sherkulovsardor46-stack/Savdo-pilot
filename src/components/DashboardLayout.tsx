import React, { useState } from 'react';
import {
  ArrowLeft,
  Bot,
  LayoutDashboard,
  Menu,
  Package,
  TrendingUp,
  X,
} from 'lucide-react';
import { getTranslations } from '../i18n/translations';
import { DashboardTab, Language } from '../types';
import { SavdoPilotMark } from './ChannelIcons';

interface DashboardLayoutProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onBackToLanding: () => void;
  children: React.ReactNode;
}

export function DashboardLayout({
  lang,
  onToggleLang,
  activeTab,
  onSelectTab,
  onBackToLanding,
  children,
}: DashboardLayoutProps) {
  const t = getTranslations(lang);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{ id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'overview', label: t.dashboard.sidebar.overview, icon: LayoutDashboard },
    { id: 'bot', label: t.dashboard.sidebar.bot, icon: Bot },
    { id: 'inventory', label: t.dashboard.sidebar.inventory, icon: Package },
    { id: 'forecast', label: t.dashboard.sidebar.forecast, icon: TrendingUp },
  ];

  const activeLabel = navItems.find((i) => i.id === activeTab)?.label || '';

  const SidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 w-64 shrink-0">
      <div className="px-5 h-16 flex items-center justify-between border-b border-slate-800">
        <button
          type="button"
          onClick={onBackToLanding}
          className="flex items-center gap-2.5 text-white font-display font-bold text-lg tracking-tight cursor-pointer"
        >
          <SavdoPilotMark className="w-7 h-7" />
          <span>{t.brand}</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden p-1.5 text-slate-400 hover:text-white cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Store Identity */}
      <div className="px-5 py-4 border-b border-slate-800/80">
        <div className="text-sm font-semibold text-white">
          {t.dashboard.sidebar.storeName}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">
          {t.dashboard.sidebar.storeBranch}
        </div>
      </div>

      {/* 4 Main Tabs */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Switch back to Landing Page */}
      <div className="p-3 border-t border-slate-800">
        <button
          type="button"
          onClick={onBackToLanding}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{t.dashboard.sidebar.backToLanding}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex">{SidebarContent}</aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 flex">{SidebarContent}</div>
        </div>
      )}

      {/* Main Content Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-slate-400 hidden sm:inline">{t.brand}</span>
              <span className="text-slate-300 hidden sm:inline">/</span>
              <span className="font-semibold text-slate-900 truncate">{activeLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline-block text-xs text-slate-500">
              {t.dashboard.header.liveSync}
            </span>

            <div
              className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200"
              role="group"
              aria-label="Language switch"
            >
              <button
                type="button"
                onClick={() => onToggleLang('uz')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'uz'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                UZ
              </button>
              <button
                type="button"
                onClick={() => onToggleLang('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

import React from 'react';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  Layers,
  MessageSquare,
  PackageCheck,
  TrendingUp,
} from 'lucide-react';
import { getTranslations } from '../i18n/translations';
import { DashboardTab, Language, Product } from '../types';
import { formatUZS } from '../utils/format';
import { PlatformBadge, SavdoPilotMark } from './ChannelIcons';

interface LandingPageProps {
  lang: Language;
  onToggleLang: (lang: Language) => void;
  onEnterDashboard: (initialTab?: DashboardTab) => void;
  products: Product[];
  todayRevenue: number;
}

export function LandingPage({
  lang,
  onToggleLang,
  onEnterDashboard,
  products,
  todayRevenue,
}: LandingPageProps) {
  const t = getTranslations(lang);
  const kurtka = products.find((p) => p.id === 'prod-kurtka') || products[0];
  const krossovka = products.find((p) => p.id === 'prod-krossovka') || products[1];
  const koylak = products.find((p) => p.id === 'prod-koylak') || products[3];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Top Navigation Bar — strict 3-zone structure */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 font-display"
          >
            <SavdoPilotMark className="w-7 h-7" />
            <span>{t.brand}</span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.features}
            </a>
            <a
              href="#how-it-works"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.howItWorks}
            </a>
            <a
              href="#pricing"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.pricing}
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <div
              className="inline-flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200"
              role="group"
              aria-label="Language switch"
            >
              <button
                type="button"
                onClick={() => onToggleLang('uz')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
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
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  lang === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={() => onEnterDashboard('overview')}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.nav.demoCta}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-14 pb-20 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium text-indigo-700 mb-4 tracking-wide">
                {t.hero.regionNote}
              </p>

              <h1
                className="font-display font-bold tracking-tight text-slate-900 leading-[1.12] mb-5"
                style={{ fontSize: 'clamp(2.15rem, 3.6vw, 3.25rem)', textWrap: 'balance' }}
              >
                {t.hero.headline}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
                {t.hero.subheadline}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 mb-10">
                <button
                  type="button"
                  onClick={() => onEnterDashboard('overview')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{t.hero.primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onEnterDashboard('bot')}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>{t.hero.secondaryCta}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 border-t border-slate-200 text-xs sm:text-sm text-slate-600 font-medium">
                <span className="tabular-nums">{t.hero.proofMetric1}</span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="tabular-nums">{t.hero.proofMetric2}</span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="tabular-nums">{t.hero.proofMetric3}</span>
              </div>
            </div>

            {/* Right Column: Live Omnichannel Sync Dashboard Preview */}
            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900 font-display">
                      {t.hero.previewTitle}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">{t.hero.previewSyncNote}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[11px] text-slate-500">
                      {t.dashboard.overview.kpis.todaySales}
                    </span>
                    <span className="text-sm font-semibold text-slate-900 font-mono tabular-nums">
                      {formatUZS(todayRevenue, lang)}
                    </span>
                  </div>
                </div>

                {/* Live Chat-to-Stock Sync Stream */}
                <div className="my-4 space-y-3">
                  {/* IG Order Example */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <PlatformBadge platform="instagram" />
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          Aziza Karimova
                        </span>
                        <span className="text-xs text-slate-400">· 14:22</span>
                      </div>
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                        {t.dashboard.bot.statusOrderConfirmed}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {lang === 'uz'
                        ? '"Qora oversize kurtka L razmerni Chilonzor 5-kvartalga yuboring"'
                        : '"Send the Black Oversize Jacket size L to Chilonzor 5"'}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                      <span className="font-medium text-slate-700">
                        {lang === 'uz' ? kurtka.nameUz : kurtka.nameEn}
                      </span>
                      <span className="font-mono tabular-nums text-amber-700 font-medium">
                        {lang === 'uz'
                          ? `Qoldiq: ${kurtka.stock} dona`
                          : `Stock: ${kurtka.stock} pcs`}
                      </span>
                    </div>
                  </div>

                  {/* TG Inquiry Example */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <PlatformBadge platform="telegram" />
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          @sardor_uz
                        </span>
                        <span className="text-xs text-slate-400">· 14:09</span>
                      </div>
                      <span className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200/70 px-2 py-0.5 rounded-md whitespace-nowrap shrink-0">
                        {t.dashboard.bot.statusAiReplied}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {lang === 'uz'
                        ? 'AI: "Nike Air Krossovka 42 razmer mavjud (650,000 so‘m)"'
                        : 'AI: "Nike Air Sneakers size 42 in stock (650,000 UZS)"'}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 text-slate-500">
                      <span className="font-medium text-slate-700">
                        {lang === 'uz' ? krossovka.nameUz : krossovka.nameEn}
                      </span>
                      <span className="font-mono tabular-nums text-emerald-700 font-medium">
                        {lang === 'uz'
                          ? `Qoldiq: ${krossovka.stock} dona`
                          : `Stock: ${krossovka.stock} pcs`}
                      </span>
                    </div>
                  </div>

                  {/* Dead-stock Smart Pricing Preview */}
                  <div className="bg-white border border-slate-200 rounded-lg p-3.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-xs text-rose-700 font-medium mb-0.5">
                        <span>
                          {lang === 'uz'
                            ? `Dead-stock · ${koylak.daysUnsold} kun`
                            : `Dead-stock · ${koylak.daysUnsold} days`}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {lang === 'uz' ? koylak.nameUz : koylak.nameEn}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="block text-xs font-mono tabular-nums text-slate-900 font-semibold">
                        {formatUZS(koylak.price, lang)}
                      </span>
                      <span className="text-[11px] text-indigo-600 font-medium">
                        {lang === 'uz' ? 'AI tavsiya: -18%' : 'AI suggestion: -18%'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>{t.dashboard.sidebar.storeName}</span>
                  <button
                    type="button"
                    onClick={() => onEnterDashboard('bot')}
                    className="font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t.hero.secondaryCta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features Section */}
        <section id="features" className="border-t border-slate-200 bg-slate-50/70 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold text-indigo-600 mb-2">
                {t.features.sectionKicker}
              </p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3"
                style={{ textWrap: 'balance' }}
              >
                {t.features.sectionTitle}
              </h2>
              <p className="text-slate-600 leading-relaxed">{t.features.sectionSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {t.features.cards.map((card, idx) => {
                const Icon = idx === 0 ? Bot : idx === 1 ? PackageCheck : TrendingUp;
                const colSpan = idx === 0 ? 'lg:col-span-5' : idx === 1 ? 'lg:col-span-4' : 'lg:col-span-3';
                return (
                  <div
                    key={card.title}
                    className={`${colSpan} bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          {card.index}
                        </span>
                        <Icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-slate-900 mb-2.5">
                        {card.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-semibold text-emerald-700 tabular-nums">
                      {card.outcome}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="border-t border-slate-200 bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold text-indigo-600 mb-2">
                {t.howItWorks.sectionKicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {t.howItWorks.sectionTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.howItWorks.steps.map((s, idx) => {
                const Icon = idx === 0 ? MessageSquare : idx === 1 ? Layers : BarChart3;
                return (
                  <div key={s.step} className="pt-5 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-sm font-semibold text-indigo-600">
                        {s.step}
                      </span>
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <h3 className="font-display text-base font-bold text-slate-900 mb-2">
                      {s.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="border-t border-slate-200 bg-slate-50/70 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-2xl mb-12">
              <p className="text-xs font-semibold text-indigo-600 mb-2">
                {t.pricing.sectionKicker}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                {t.pricing.sectionTitle}
              </h2>
              <p className="text-slate-600">{t.pricing.sectionSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {t.pricing.plans.map((plan) => {
                const isPopular = 'popular' in plan && plan.popular;
                return (
                  <div
                    key={plan.name}
                    className={`rounded-xl bg-white p-6 flex flex-col justify-between ${
                      isPopular
                        ? 'border-2 border-indigo-600'
                        : 'border border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-display text-lg font-bold text-slate-900">
                          {plan.name}
                        </h3>
                        {isPopular && (
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                            {t.pricing.popularLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mb-5">{plan.audience}</p>

                      <div className="pb-5 mb-5 border-b border-slate-100">
                        <span className="font-display text-3xl font-bold text-slate-900 tabular-nums">
                          {plan.price}
                        </span>
                        <span className="text-xs text-slate-500 ml-1.5">{plan.period}</span>
                      </div>

                      <ul className="space-y-3 mb-8">
                        {plan.limits.map((limit) => (
                          <li key={limit} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{limit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => onEnterDashboard('overview')}
                      className={`w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                        isPopular
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>{t.footer.copyright}</span>
          <a href="#top" className="hover:text-slate-900 transition-colors font-medium">
            {t.footer.backToTop}
          </a>
        </div>
      </footer>
    </div>
  );
}

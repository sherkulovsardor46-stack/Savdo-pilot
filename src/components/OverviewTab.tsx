import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Package,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getTranslations } from '../i18n/translations';
import { DashboardTab, Language, Product, SalesPoint } from '../types';
import { formatCompactUZS, formatUZS } from '../utils/format';

interface OverviewTabProps {
  lang: Language;
  products: Product[];
  salesSeries: SalesPoint[];
  todayRevenue: number;
  aiResolvedCount: number;
  onNavigateTab: (tab: DashboardTab) => void;
  onOpenOptimizer: (productId: string) => void;
}

export function OverviewTab({
  lang,
  products,
  salesSeries,
  todayRevenue,
  aiResolvedCount,
  onNavigateTab,
  onOpenOptimizer,
}: OverviewTabProps) {
  const t = getTranslations(lang).dashboard.overview;

  const lowStockItems = products.filter((p) => p.stock <= p.lowStockThreshold);
  const kurtka = products.find((p) => p.id === 'prod-kurtka') || products[0];
  const koylak = products.find((p) => p.id === 'prod-koylak') || products[3];

  const chartData = salesSeries.map((pt, idx) =>
    idx === 13
      ? {
          ...pt,
          actual: todayRevenue,
          forecast: todayRevenue,
        }
      : pt
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      {/* 4 KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">{t.kpis.todaySales}</span>
            <Wallet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatUZS(todayRevenue, lang)}
          </div>
          <p className="text-xs font-medium text-emerald-700 mt-2 tabular-nums">
            {t.kpis.vsYesterday}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">{t.kpis.aiHandled}</span>
            <Bot className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {aiResolvedCount} {lang === 'uz' ? 'ta' : ''}
          </div>
          <p className="text-xs font-medium text-indigo-700 mt-2 tabular-nums">
            {t.kpis.aiRate}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">{t.kpis.lowStock}</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {lowStockItems.length} {t.kpis.lowStockUnit}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
            <AlertTriangle className="w-3 h-3" />
            <span>{t.kpis.lowStockWarn}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-medium">{t.kpis.forecast7d}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {formatUZS(94200000, lang)}
          </div>
          <p className="text-xs font-medium text-slate-500 mt-2">{t.kpis.forecastSub}</p>
        </div>
      </div>

      {/* Main Chart + Actionable Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Recharts Area + Line Chart */}
        <div className="xl:col-span-8 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">
                {t.chartTitle}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{t.chartSubtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-0.5 bg-indigo-600 inline-block" />
                {t.actualLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-0.5 border-t-2 border-dashed border-emerald-500 inline-block" />
                {t.forecastLabel}
              </span>
            </div>
          </div>

          <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-emerald-800">{t.spikeBanner}</span>
            <span className="font-mono text-emerald-700 tabular-nums shrink-0">
              01 Dec – 08 Dec
            </span>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.14} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={{ stroke: '#E2E8F0' }}
                  interval={3}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickLine={false}
                  axisLine={false}
                  width={56}
                  tickFormatter={(val) => formatCompactUZS(Number(val), lang)}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null;
                    const actualItem = payload.find((p) => p.dataKey === 'actual');
                    const forecastItem = payload.find((p) => p.dataKey === 'forecast');
                    return (
                      <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-lg text-xs shadow-lg border border-slate-700">
                        <div className="font-semibold mb-1.5 text-slate-200">{label}</div>
                        {actualItem && actualItem.value != null && (
                          <div className="flex items-center justify-between gap-4 font-mono tabular-nums">
                            <span className="text-indigo-300">{t.actualLabel}:</span>
                            <span>{formatUZS(Number(actualItem.value), lang)}</span>
                          </div>
                        )}
                        {forecastItem && forecastItem.value != null && (
                          <div className="flex items-center justify-between gap-4 font-mono tabular-nums mt-0.5">
                            <span className="text-emerald-300">{t.forecastLabel}:</span>
                            <span>{formatUZS(Number(forecastItem.value), lang)}</span>
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <ReferenceLine x="24 Nov" stroke="#CBD5E1" strokeDasharray="3 3" />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fill="url(#actualFill)"
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  strokeDasharray="6 5"
                  dot={false}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Tavsiyalari (Actionable Alerts) */}
        <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col">
          <div className="mb-4 pb-3 border-b border-slate-100">
            <h2 className="font-display text-base font-bold text-slate-900">{t.alertsTitle}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{t.alertsSubtitle}</p>
          </div>

          <div className="space-y-4 flex-1">
            {/* Alert 1: Low stock */}
            <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {lang === 'uz' ? 'Qoldiq ogohlantirishi' : 'Low Stock Alert'}
                </span>
                <span className="text-xs font-mono font-semibold text-amber-700 tabular-nums">
                  {kurtka.stock} {lang === 'uz' ? 'dona' : 'pcs'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                {lang === 'uz'
                  ? `Qora Oversize Kurtka (L razmer) atigi ${kurtka.stock} dona qoldi — 4 kun ichida tugaydi. 20 dona buyurtma berish tavsiya etiladi.`
                  : `Black Oversize Jacket (Size L) has only ${kurtka.stock} pcs left — runs out in 4 days. AI recommends ordering 20 pcs.`}
              </p>
              <button
                type="button"
                onClick={() => onNavigateTab('forecast')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer"
              >
                <span>{t.actionRestock}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alert 2: Dead-stock */}
            <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-800">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {koylak.discountApplied
                    ? lang === 'uz'
                      ? `Chegirma faol (-${koylak.discountApplied}%)`
                      : `Promo Active (-${koylak.discountApplied}%)`
                    : lang === 'uz'
                    ? `Dead-stock · ${koylak.daysUnsold} kun`
                    : `Dead-stock · ${koylak.daysUnsold} days`}
                </span>
                <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
                  {formatUZS(koylak.price, lang)}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                {koylak.discountApplied
                  ? lang === 'uz'
                    ? `Klassik Oq Ko'ylak narxi ${formatUZS(koylak.price, 'uz')} ga tushirildi va Telegram kanalga e'lon qilindi.`
                    : `Classic White Shirt price updated to ${formatUZS(koylak.price, 'en')} and posted to Telegram channel.`
                  : lang === 'uz'
                  ? `Klassik Oq Ko'ylak ${koylak.daysUnsold} kundan beri sotilmayapti (Dead-stock). 20% chegirma yoki 'Kurtka + Ko'ylak' komplekti qilib sotish tavsiya etiladi.`
                  : `Classic White Shirt has remained unsold for ${koylak.daysUnsold} days (Dead-stock). Recommend an 18–20% markdown or a 'Jacket + Shirt' bundle.`}
              </p>
              <button
                type="button"
                onClick={() => onOpenOptimizer(koylak.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-800 cursor-pointer"
              >
                <span>{t.actionDiscount}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

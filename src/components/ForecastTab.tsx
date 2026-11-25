import React, { useMemo, useState } from 'react';
import { Calendar, Download, Minus, Plus } from 'lucide-react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getTranslations } from '../i18n/translations';
import { Language, Product, ProductCategory } from '../types';
import { formatUZS } from '../utils/format';

interface ForecastTabProps {
  lang: Language;
  products: Product[];
  onExportPlan: (summaryText: string) => void;
}

export function ForecastTab({ lang, products, onExportPlan }: ForecastTabProps) {
  const t = getTranslations(lang).dashboard.forecast;
  const invT = getTranslations(lang).dashboard.inventory;

  const [timeframe, setTimeframe] = useState<'7' | '14' | '30'>('14');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ProductCategory>('all');
  const [qtyOverrides, setQtyOverrides] = useState<Record<string, number>>({});

  const tfNum = Number(timeframe);

  // Build Category Forecast chart data based on selected timeframe & category
  const chartData = useMemo(() => {
    const multiplier = tfNum === 7 ? 0.55 : tfNum === 14 ? 1 : 2.15;
    const baseData = [
      {
        category: 'ustki' as ProductCategory,
        labelUz: 'Ustki kiyim',
        labelEn: 'Outerwear',
        units: Math.round(92 * multiplier),
        revenueM: Number((33.4 * multiplier).toFixed(1)),
      },
      {
        category: 'oyoq' as ProductCategory,
        labelUz: 'Oyoq kiyim',
        labelEn: 'Footwear',
        units: Math.round(58 * multiplier),
        revenueM: Number((31.2 * multiplier).toFixed(1)),
      },
      {
        category: 'aksessuar' as ProductCategory,
        labelUz: 'Aksessuarlar',
        labelEn: 'Accessories',
        units: Math.round(46 * multiplier),
        revenueM: Number((11.8 * multiplier).toFixed(1)),
      },
    ];

    const filtered =
      categoryFilter === 'all'
        ? baseData
        : baseData.filter((d) => d.category === categoryFilter);

    return filtered.map((d) => ({
      name: lang === 'uz' ? d.labelUz : d.labelEn,
      units: d.units,
      revenueM: d.revenueM,
    }));
  }, [tfNum, categoryFilter, lang]);

  // Build Restock Planner rows dynamically from products
  const plannerRows = useMemo(() => {
    const candidates = products.filter((p) => {
      const catMatch = categoryFilter === 'all' || p.category === categoryFilter;
      const daysUntilOut = p.dailyVelocity > 0 ? p.stock / p.dailyVelocity : 99;
      return catMatch && (p.stock <= 10 || daysUntilOut <= tfNum);
    });

    return candidates.map((p) => {
      const daysLeft = Math.max(
        1,
        Math.round(p.dailyVelocity > 0 ? p.stock / p.dailyVelocity : 14)
      );
      const defaultQty =
        p.id === 'prod-kurtka'
          ? 20
          : p.id === 'prod-shim'
          ? 25
          : Math.max(10, Math.round(p.dailyVelocity * tfNum * 1.4));

      const recQty = qtyOverrides[p.id] ?? defaultQty;
      const budget = recQty * p.costPrice;
      const profit = recQty * (p.price - p.costPrice);

      return {
        product: p,
        daysLeft,
        recQty,
        budget,
        profit,
      };
    });
  }, [products, categoryFilter, tfNum, qtyOverrides]);

  const totalBudget = plannerRows.reduce((sum, r) => sum + r.budget, 0);
  const totalProfit = plannerRows.reduce((sum, r) => sum + r.profit, 0);

  const adjustQty = (id: string, current: number, delta: number) => {
    setQtyOverrides((prev) => ({
      ...prev,
      [id]: Math.max(5, current + delta),
    }));
  };

  const handleDownload = () => {
    // Generate real CSV download + toast
    const headers = ['SKU', 'Product', 'Stock', 'DaysLeft', 'RestockQty', 'BudgetUZS', 'ExpectedProfitUZS'];
    const lines = [
      headers.join(','),
      ...plannerRows.map((r) =>
        [
          r.product.sku,
          `"${lang === 'uz' ? r.product.nameUz : r.product.nameEn}"`,
          r.product.stock,
          r.daysLeft,
          r.recQty,
          r.budget,
          r.profit,
        ].join(',')
      ),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `savdopilot_restock_${timeframe}d.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    onExportPlan(
      lang === 'uz'
        ? `${timeframe} kunlik xarid rejasi (CSV) yuklab olindi`
        : `${timeframe}-day restock plan (CSV) downloaded`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
        </div>

        {/* Timeframe + Category Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            {(['7', '14', '30'] as const).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.timeframes[tf]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
            {(['all', 'ustki', 'oyoq', 'aksessuar'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {invT.categories[cat]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Forecast Chart Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              {t.chartTitle}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-medium text-slate-700">{t.seasonalFactorsTitle}</span>
              {t.seasonalFactors.map((factor, i) => (
                <React.Fragment key={factor}>
                  {i > 0 && <span className="text-slate-300">·</span>}
                  <span>{factor}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium shrink-0">
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
              {t.unitsLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-700">
              <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
              {t.revenueTrendLabel}
            </span>
          </div>
        </div>

        <div className="h-[270px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#475569' }}
                tickLine={false}
                axisLine={{ stroke: '#E2E8F0' }}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: '#64748B' }}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: '#059669' }}
                tickLine={false}
                axisLine={false}
                width={48}
                tickFormatter={(v) => `${v}M`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload || payload.length === 0) return null;
                  const units = payload.find((p) => p.dataKey === 'units')?.value;
                  const rev = payload.find((p) => p.dataKey === 'revenueM')?.value;
                  return (
                    <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-lg text-xs shadow-lg border border-slate-700">
                      <div className="font-semibold mb-1.5">{label}</div>
                      <div className="font-mono tabular-nums text-indigo-300">
                        {t.unitsLabel}: {units} {lang === 'uz' ? 'dona' : 'pcs'}
                      </div>
                      <div className="font-mono tabular-nums text-emerald-300 mt-0.5">
                        {t.revenueTrendLabel}: {rev}M
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="units"
                fill="#4F46E5"
                radius={[6, 6, 0, 0]}
                barSize={48}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenueM"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10B981' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Restock Planner Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-display text-base font-bold text-slate-900">
            {t.plannerTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.plannerSubtitle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-500">
                <th className="py-3 px-4">{t.columns.product}</th>
                <th className="py-3 px-4 text-right">{t.columns.currentStock}</th>
                <th className="py-3 px-4">{t.columns.daysLeft}</th>
                <th className="py-3 px-4 text-right">{t.columns.recommendedQty}</th>
                <th className="py-3 px-4 text-right">{t.columns.budget}</th>
                <th className="py-3 px-4 text-right">{t.columns.expectedProfit}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {plannerRows.map(({ product, daysLeft, recQty, budget, profit }) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">
                      {lang === 'uz' ? product.nameUz : product.nameEn}
                    </div>
                    <div className="text-xs font-mono text-slate-400">{product.sku}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-slate-900">
                    {product.stock} {lang === 'uz' ? 'dona' : 'pcs'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-md tabular-nums ${
                        daysLeft <= 4
                          ? 'text-rose-700 bg-rose-50 border border-rose-200/80'
                          : 'text-amber-700 bg-amber-50 border border-amber-200/80'
                      }`}
                    >
                      {daysLeft} {t.daysLeftSuffix}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => adjustQty(product.id, recQty, -5)}
                        className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-semibold text-indigo-700 tabular-nums px-1.5">
                        +{recQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjustQty(product.id, recQty, 5)}
                        className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-800 tabular-nums">
                    {formatUZS(budget, lang)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                    +{formatUZS(profit, lang)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Summary Bar */}
        <div className="bg-slate-900 text-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm">
            <div>
              <span className="text-slate-300 mr-2">
                {t.summaryBudgetLabel.replace('{days}', timeframe)}
              </span>
              <span className="font-mono font-bold text-white tabular-nums">
                {formatUZS(totalBudget, lang)}
              </span>
            </div>
            <span className="hidden sm:inline text-slate-600">|</span>
            <div>
              <span className="text-slate-300 mr-2">{t.summaryProfitLabel}</span>
              <span className="font-mono font-bold text-emerald-400 tabular-nums">
                +{formatUZS(totalProfit, lang)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>{t.downloadBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

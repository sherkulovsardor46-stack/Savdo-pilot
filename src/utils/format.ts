import { Language } from '../types';

export function formatUZS(amount: number, lang: Language = 'uz'): string {
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return lang === 'uz' ? `${formatted} so'm` : `${formatted} UZS`;
}

export function formatCompactUZS(amount: number, lang: Language = 'uz'): string {
  if (amount >= 1_000_000) {
    const millions = (amount / 1_000_000).toFixed(1).replace(/\.0$/, '');
    return lang === 'uz' ? `${millions} mln` : `${millions}M`;
  }
  if (amount >= 1_000) {
    const thousands = Math.round(amount / 1_000);
    return lang === 'uz' ? `${thousands} ming` : `${thousands}K`;
  }
  return `${amount}`;
}

export function calcMarginPercent(cost: number, price: number): number {
  if (price <= 0) return 0;
  return Math.round(((price - cost) / price) * 100);
}

import React from 'react';
import { ChannelPlatform } from '../types';

export function SavdoPilotMark({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="#4F46E5" />
      <path
        d="M9.5 16.5L14 21L22.5 11.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 11.5H22.5V16.5"
        stroke="#A5B4FC"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlatformBadge({
  platform,
  size = 'sm',
}: {
  platform: ChannelPlatform;
  size?: 'sm' | 'md';
}) {
  const dim = size === 'md' ? 'w-7 h-7' : 'w-5 h-5';
  const iconDim = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';

  if (platform === 'instagram') {
    return (
      <span
        title="Instagram DM"
        className={`inline-flex items-center justify-center rounded-md bg-rose-50 text-rose-600 border border-rose-200/80 shrink-0 ${dim}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconDim}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      </span>
    );
  }

  return (
    <span
      title="Telegram Bot"
      className={`inline-flex items-center justify-center rounded-md bg-sky-50 text-sky-600 border border-sky-200/80 shrink-0 ${dim}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={iconDim}>
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    </span>
  );
}

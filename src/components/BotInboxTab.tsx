import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, PackageCheck, Send, Sparkles } from 'lucide-react';
import { getTranslations } from '../i18n/translations';
import { ChannelPlatform, Conversation, Language, Product } from '../types';
import { formatUZS } from '../utils/format';
import { PlatformBadge } from './ChannelIcons';

interface BotInboxTabProps {
  lang: Language;
  products: Product[];
  conversations: Conversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onSendTestMessage: (conversationId: string, text: string) => void;
}

export function BotInboxTab({
  lang,
  products,
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendTestMessage,
}: BotInboxTabProps) {
  const t = getTranslations(lang).dashboard.bot;
  const [platformFilter, setPlatformFilter] = useState<'all' | ChannelPlatform>('all');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredConversations = conversations.filter((c) =>
    platformFilter === 'all' ? true : c.platform === platformFilter
  );

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const trackedProduct =
    products.find((p) => p.id === activeConv.lastDiscussedProductId) || products[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv.messages.length, activeConv.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendTestMessage(activeConv.id, trimmed);
    setInputText('');
  };

  const handleChipClick = (chipText: string) => {
    onSendTestMessage(activeConv.id, chipText);
  };

  const renderStatusLabel = (status: Conversation['status']) => {
    if (status === 'order_confirmed') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md whitespace-nowrap">
          <CheckCircle2 className="w-3 h-3" />
          {t.statusOrderConfirmed}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md whitespace-nowrap">
        <Sparkles className="w-3 h-3" />
        {t.statusAiReplied}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {t.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      {/* Split-screen Inbox */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left Column: Conversation List */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-slate-900">
                {t.conversationsTitle}
              </h2>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {filteredConversations.length}
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['all', 'instagram', 'telegram'] as const).map((pf) => (
                <button
                  key={pf}
                  type="button"
                  onClick={() => setPlatformFilter(pf)}
                  className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-md transition-colors capitalize cursor-pointer ${
                    platformFilter === pf
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {pf === 'all' ? (lang === 'uz' ? 'Barchasi' : 'All') : pf}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[540px]">
            {filteredConversations.map((conv) => {
              const lastMsg = conv.messages[conv.messages.length - 1];
              const isSelected = conv.id === activeConv.id;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => onSelectConversation(conv.id)}
                  className={`w-full text-left p-4 transition-colors cursor-pointer ${
                    isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <PlatformBadge platform={conv.platform} />
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {conv.customerName}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
                      {conv.lastActive}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                    {lastMsg?.text}
                  </p>
                  <div>{renderStatusLabel(conv.status)}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Chat Thread & Interactive Demo Box */}
        <div className="lg:col-span-8 flex flex-col bg-slate-50/50">
          {/* Chat Header */}
          <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <PlatformBadge platform={activeConv.platform} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 truncate">
                    {activeConv.customerName}
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    {activeConv.handle}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {t.liveInventoryHint}
                </div>
              </div>
            </div>

            {/* Live Linked Stock Chip */}
            <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
              <PackageCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="font-medium text-slate-700 truncate max-w-[160px]">
                {lang === 'uz' ? trackedProduct.nameUz : trackedProduct.nameEn}
              </span>
              <span className="text-slate-300">·</span>
              <span
                className={`font-mono font-semibold tabular-nums ${
                  trackedProduct.stock <= trackedProduct.lowStockThreshold
                    ? 'text-amber-700'
                    : 'text-emerald-700'
                }`}
              >
                {trackedProduct.stock} {t.pcs}
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-slate-700 tabular-nums">
                {formatUZS(trackedProduct.price, lang)}
              </span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[380px]">
            {activeConv.messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                      isCustomer
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-indigo-600 text-white'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.orderMeta && (
                      <div className="mt-2.5 pt-2.5 border-t border-indigo-500/50 text-xs flex flex-wrap items-center justify-between gap-3 text-indigo-100">
                        <span className="font-semibold text-white">
                          {t.orderReceipt} {msg.orderMeta.orderId}
                        </span>
                        <span className="font-mono tabular-nums">
                          {t.remainingLabel} {msg.orderMeta.remainingStock} {t.pcs}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 mt-1 px-1 tabular-nums">
                    {isCustomer ? activeConv.customerName : 'SavdoPilot AI'} · {msg.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Interactive Test Input & Quick Chips */}
          <div className="bg-white border-t border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
              <span>{t.demoHint}</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {t.quickChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.testPlaceholder}
                className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{t.sendBtn}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useCallback, useState } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';
import { BotInboxTab } from './components/BotInboxTab';
import { DashboardLayout } from './components/DashboardLayout';
import { ForecastTab } from './components/ForecastTab';
import { InventoryTab } from './components/InventoryTab';
import { LandingPage } from './components/LandingPage';
import { OverviewTab } from './components/OverviewTab';
import {
  INITIAL_CONVERSATIONS,
  INITIAL_PRODUCTS,
  INITIAL_SALES_SERIES,
} from './data/initialData';
import {
  AppView,
  Conversation,
  DashboardTab,
  Language,
  Product,
  ToastMessage,
} from './types';
import { generateAiBotReply } from './utils/aiBotEngine';
import { formatUZS } from './utils/format';

export default function App() {
  const [lang, setLang] = useState<Language>('uz');
  const [view, setView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string>(
    INITIAL_CONVERSATIONS[0].id
  );
  const [todayRevenue, setTodayRevenue] = useState<number>(12450000);
  const [aiResolvedCount, setAiResolvedCount] = useState<number>(148);
  const [optimizerProductId, setOptimizerProductId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback(
    (title: string, description?: string, tone: ToastMessage['tone'] = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const handleEnterDashboard = (initialTab: DashboardTab = 'overview') => {
    setActiveTab(initialTab);
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOptimizerFromAlert = (productId: string) => {
    setActiveTab('inventory');
    setOptimizerProductId(productId);
  };

  const handleSendTestMessage = (conversationId: string, text: string) => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (!conv) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const reply = generateAiBotReply(text, products, conv.lastDiscussedProductId, lang);

    const customerMsgId = `msg-c-${Date.now()}`;
    const aiMsgId = `msg-a-${Date.now() + 1}`;
    const targetProduct = products.find((p) => p.id === reply.matchedProductId);

    if (reply.orderConfirmed && targetProduct && targetProduct.stock > 0) {
      const updatedStock = targetProduct.stock - 1;
      setProducts((prev) =>
        prev.map((p) =>
          p.id === targetProduct.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p
        )
      );
      setTodayRevenue((prev) => prev + (reply.orderAmount || targetProduct.price));

      pushToast(
        lang === 'uz'
          ? `Buyurtma ${reply.orderId} tasdiqlandi`
          : `Order ${reply.orderId} confirmed`,
        lang === 'uz'
          ? `${targetProduct.nameUz}: qoldiq ${updatedStock} donaga tushdi (+${formatUZS(
              targetProduct.price,
              'uz'
            )})`
          : `${targetProduct.nameEn}: stock updated to ${updatedStock} pcs (+${formatUZS(
              targetProduct.price,
              'en'
            )})`,
        'success'
      );
    }

    setAiResolvedCount((prev) => prev + 1);

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        const nextStock =
          reply.orderConfirmed && targetProduct
            ? Math.max(0, targetProduct.stock - 1)
            : targetProduct?.stock ?? 0;

        return {
          ...c,
          lastActive: timeStr,
          lastDiscussedProductId: reply.matchedProductId,
          status: reply.orderConfirmed ? 'order_confirmed' : 'ai_replied',
          messages: [
            ...c.messages,
            {
              id: customerMsgId,
              sender: 'customer',
              text,
              timestamp: timeStr,
            },
            {
              id: aiMsgId,
              sender: 'ai',
              text: reply.replyText,
              timestamp: timeStr,
              orderMeta: reply.orderConfirmed
                ? {
                    orderId: reply.orderId || '#SP-2055',
                    productName:
                      lang === 'uz'
                        ? targetProduct?.nameUz || ''
                        : targetProduct?.nameEn || '',
                    amount: reply.orderAmount || 0,
                    remainingStock: nextStock,
                  }
                : undefined,
            },
          ],
        };
      })
    );
  };

  const handleApplyDiscount = (productId: string, newPrice: number, discountPct: number) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          originalPrice: p.originalPrice || p.price,
          price: newPrice,
          discountApplied: discountPct,
          telegramAnnounced: true,
        };
      })
    );

    if (target) {
      pushToast(
        lang === 'uz'
          ? "Chegirma qo'llandi va Telegram kanalga e'lon qilindi"
          : 'Discount applied & posted to Telegram channel',
        lang === 'uz'
          ? `${target.nameUz}: yangi narx ${formatUZS(newPrice, 'uz')} (-${discountPct}%)`
          : `${target.nameEn}: new price ${formatUZS(newPrice, 'en')} (-${discountPct}%)`,
        'success'
      );
    }
  };

  const handleRestockProduct = (productId: string, amount: number) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + amount } : p))
    );
    if (target) {
      pushToast(
        lang === 'uz' ? 'Ombor qoldig‘i yangilandi' : 'Inventory restocked',
        lang === 'uz'
          ? `${target.nameUz}: +${amount} dona qo'shildi (jami ${target.stock + amount} dona)`
          : `${target.nameEn}: +${amount} pcs added (total ${target.stock + amount} pcs)`,
        'info'
      );
    }
  };

  const handleAddProduct = (
    newProd: Omit<Product, 'id' | 'daysUnsold' | 'dailyVelocity'>
  ) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      daysUnsold: 0,
      dailyVelocity: 0.6,
    };
    setProducts((prev) => [created, ...prev]);
    pushToast(
      lang === 'uz' ? "Yangi tovar omborga qo'shildi" : 'New SKU added to inventory',
      `${lang === 'uz' ? created.nameUz : created.nameEn} · ${created.stock} ${
        lang === 'uz' ? 'dona' : 'pcs'
      }`,
      'success'
    );
  };

  return (
    <>
      {view === 'landing' ? (
        <LandingPage
          lang={lang}
          onToggleLang={setLang}
          onEnterDashboard={handleEnterDashboard}
          products={products}
          todayRevenue={todayRevenue}
        />
      ) : (
        <DashboardLayout
          lang={lang}
          onToggleLang={setLang}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onBackToLanding={handleBackToLanding}
        >
          {activeTab === 'overview' && (
            <OverviewTab
              lang={lang}
              products={products}
              salesSeries={INITIAL_SALES_SERIES}
              todayRevenue={todayRevenue}
              aiResolvedCount={aiResolvedCount}
              onNavigateTab={setActiveTab}
              onOpenOptimizer={handleOpenOptimizerFromAlert}
            />
          )}

          {activeTab === 'bot' && (
            <BotInboxTab
              lang={lang}
              products={products}
              conversations={conversations}
              activeConversationId={activeConversationId}
              onSelectConversation={setActiveConversationId}
              onSendTestMessage={handleSendTestMessage}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTab
              lang={lang}
              products={products}
              optimizerProductId={optimizerProductId}
              onOpenOptimizer={setOptimizerProductId}
              onApplyDiscount={handleApplyDiscount}
              onRestockProduct={handleRestockProduct}
              onAddProduct={handleAddProduct}
            />
          )}

          {activeTab === 'forecast' && (
            <ForecastTab
              lang={lang}
              products={products}
              onExportPlan={(msg) =>
                pushToast(
                  lang === 'uz' ? 'Hisobot tayyor' : 'Report exported',
                  msg,
                  'info'
                )
              }
            />
          )}
        </DashboardLayout>
      )}

      {/* Toast Notification Stack */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto bg-slate-900 text-white border border-slate-700 rounded-xl p-4 shadow-xl flex items-start gap-3"
              role="status"
            >
              {toast.tone === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-white">{toast.title}</div>
                {toast.description && (
                  <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  setToasts((prev) => prev.filter((item) => item.id !== toast.id))
                }
                className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

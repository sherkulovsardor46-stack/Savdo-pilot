export type Language = 'uz' | 'en';
export type AppView = 'landing' | 'dashboard';
export type DashboardTab = 'overview' | 'bot' | 'inventory' | 'forecast';
export type ProductCategory = 'ustki' | 'oyoq' | 'aksessuar';
export type ChannelPlatform = 'instagram' | 'telegram';
export type ChatStatus = 'ai_replied' | 'order_confirmed' | 'waiting';

export interface Product {
  id: string;
  sku: string;
  nameUz: string;
  nameEn: string;
  category: ProductCategory;
  variants: string;
  stock: number;
  lowStockThreshold: number;
  costPrice: number;
  price: number;
  originalPrice?: number;
  daysUnsold: number;
  dailyVelocity: number;
  discountApplied?: number;
  telegramAnnounced?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai';
  text: string;
  timestamp: string;
  orderMeta?: {
    orderId: string;
    productName: string;
    amount: number;
    remainingStock: number;
  };
}

export interface Conversation {
  id: string;
  customerName: string;
  handle: string;
  platform: ChannelPlatform;
  status: ChatStatus;
  lastActive: string;
  lastDiscussedProductId: string;
  messages: ChatMessage[];
}

export interface SalesPoint {
  date: string;
  actual: number | null;
  forecast: number | null;
  noteUz?: string;
  noteEn?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone: 'success' | 'info' | 'warning';
}

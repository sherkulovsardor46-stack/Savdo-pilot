import { Language, Product } from '../types';
import { formatUZS } from './format';

export interface BotReplyResult {
  replyText: string;
  matchedProductId: string;
  orderConfirmed: boolean;
  orderAmount?: number;
  orderId?: string;
}

const PRODUCT_KEYWORDS: Array<{ keywords: string[]; id: string }> = [
  { keywords: ['kurtka', 'oversize', 'jacket', 'qora'], id: 'prod-kurtka' },
  { keywords: ['krossovka', 'nike', 'air', 'oyoq', 'sneaker', '41', '42', '43'], id: 'prod-krossovka' },
  { keywords: ['sumka', 'charm', 'bag', 'handbag'], id: 'prod-sumka' },
  { keywords: ["ko'ylak", 'koylak', 'oq', 'klassik', 'shirt'], id: 'prod-koylak' },
  { keywords: ['sviter', 'bej', 'sweater'], id: 'prod-sviter' },
  { keywords: ['shim', 'jinsi', 'jeans', '30', '32', '34'], id: 'prod-shim' },
  { keywords: ['etik', 'boots', '39', '40'], id: 'prod-etik' },
  { keywords: ['sharf', 'kashmir', 'scarf'], id: 'prod-sharf' },
  { keywords: ['palto', 'coat', 'tuya'], id: 'prod-palto' },
];

export function generateAiBotReply(
  userText: string,
  products: Product[],
  lastProductId: string,
  lang: Language
): BotReplyResult {
  const lower = userText.toLowerCase();

  // 1. Identify which product the user is asking about
  let matchedProduct = products.find((p) => p.id === lastProductId) || products[0];

  for (const entry of PRODUCT_KEYWORDS) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      const found = products.find((p) => p.id === entry.id);
      if (found) {
        matchedProduct = found;
        break;
      }
    }
  }

  // Also check dynamic product names added by user
  for (const p of products) {
    const tokens = p.nameUz.toLowerCase().split(/\s+/);
    if (tokens.some((t) => t.length > 3 && lower.includes(t))) {
      matchedProduct = p;
      break;
    }
  }

  const productName = lang === 'uz' ? matchedProduct.nameUz : matchedProduct.nameEn;

  // 2. Check if user is confirming an order
  const isConfirming =
    lower.includes('ha') ||
    lower.includes('yuboring') ||
    lower.includes('olaman') ||
    lower.includes('rasmiylashtir') ||
    lower.includes('zakaz') ||
    lower.includes('buyurtma') ||
    lower.includes('chilonzor') ||
    lower.includes('yunusobod') ||
    lower.includes('toshkent') ||
    lower.includes('order') ||
    lower.includes('confirm') ||
    lower.includes('yes');

  if (isConfirming) {
    if (matchedProduct.stock <= 0) {
      return {
        replyText:
          lang === 'uz'
            ? `Kechirasiz, ${productName} hozirda omborimizda tugagan (0 dona). Yangi partiya 3 kundan keyin keladi — oldindan band qilib qo'yaymi?`
            : `Sorry, ${productName} is currently out of stock (0 pcs). A new shipment arrives in 3 days — would you like to pre-order?`,
        matchedProductId: matchedProduct.id,
        orderConfirmed: false,
      };
    }

    const newStock = matchedProduct.stock - 1;
    const orderNum = Math.floor(2050 + Math.random() * 899);
    const orderId = `#SP-${orderNum}`;

    return {
      replyText:
        lang === 'uz'
          ? `Buyurtmangiz ${orderId} muvaffaqiyatli rasmiylashtirildi! ${productName} narxi: ${formatUZS(matchedProduct.price, 'uz')} (+25,000 so'm yetkazish). Ombor qoldig'i avtomatik yangilandi: ${newStock} dona qoldi.`
          : `Order ${orderId} confirmed! ${productName} price: ${formatUZS(matchedProduct.price, 'en')} (+25,000 UZS delivery). Inventory synced automatically: ${newStock} pcs remaining.`,
      matchedProductId: matchedProduct.id,
      orderConfirmed: true,
      orderAmount: matchedProduct.price,
      orderId,
    };
  }

  // 3. Check if user asks about discount
  if (lower.includes('chegirma') || lower.includes('skidka') || lower.includes('discount') || lower.includes('aksiya')) {
    const discountedItems = products.filter((p) => p.discountApplied || p.daysUnsold >= 30);
    const promo = discountedItems[0] || matchedProduct;
    const promoName = lang === 'uz' ? promo.nameUz : promo.nameEn;

    if (promo.discountApplied) {
      return {
        replyText:
          lang === 'uz'
            ? `Ha! Hozir ${promoName} uchun -${promo.discountApplied}% maxsus chegirma amal qilmoqda: yangi narx ${formatUZS(promo.price, 'uz')} (omborda ${promo.stock} dona). Shuningdek, 2 ta tovar olsangiz yetkazib berish bepul!`
            : `Yes! ${promoName} currently has a -${promo.discountApplied}% special discount: now ${formatUZS(promo.price, 'en')} (${promo.stock} pcs in stock). Plus free delivery on 2+ items!`,
        matchedProductId: promo.id,
        orderConfirmed: false,
      };
    }

    return {
      replyText:
        lang === 'uz'
          ? `Albatta! Hozir "${promoName}" tovarimizga 20% gacha chegirma yoki "${matchedProduct.nameUz} + ${promo.nameUz}" komplekti uchun maxsus narx mavjud. Qaysi birini ko'rib chiqamiz?`
          : `Certainly! We currently offer up to 20% off "${promoName}" or a bundle deal with "${matchedProduct.nameEn}". Which one would you like to order?`,
      matchedProductId: promo.id,
      orderConfirmed: false,
    };
  }

  // 4. Check if user asks about price only
  if (
    (lower.includes('narx') || lower.includes('qancha') || lower.includes('necha') || lower.includes('price')) &&
    !lower.includes('bormi') &&
    !lower.includes('razmer')
  ) {
    return {
      replyText:
        lang === 'uz'
          ? `${productName} hozirgi narxi: ${formatUZS(matchedProduct.price, 'uz')}${matchedProduct.discountApplied ? ` (-${matchedProduct.discountApplied}% chegirma bilan)` : ''}. Omborimizda ${matchedProduct.stock} dona qolgan. Buyurtma beramizmi?`
          : `Current price for ${productName} is ${formatUZS(matchedProduct.price, 'en')}${matchedProduct.discountApplied ? ` (with -${matchedProduct.discountApplied}% discount)` : ''}. ${matchedProduct.stock} pcs left in stock. Would you like to order?`,
      matchedProductId: matchedProduct.id,
      orderConfirmed: false,
    };
  }

  // 5. Default stock & availability check
  if (matchedProduct.stock <= 0) {
    return {
      replyText:
        lang === 'uz'
          ? `Assalomu alaykum! Afsuski, ${productName} hozir omborda tugagan (0 dona). Muqobil variantlarni yuboraymi?`
          : `Hello! Unfortunately, ${productName} is currently sold out (0 pcs). Would you like to see similar alternatives?`,
      matchedProductId: matchedProduct.id,
      orderConfirmed: false,
    };
  }

  return {
    replyText:
      lang === 'uz'
        ? `Assalomu alaykum! Ha, ${productName} (${matchedProduct.variants}) omborimizda hozir ${matchedProduct.stock} dona mavjud. Narxi: ${formatUZS(matchedProduct.price, 'uz')}. Toshkent bo'ylab yetkazib berish 25,000 so'm. Rasmiylashtiramizmi?`
        : `Hello! Yes, ${productName} (${matchedProduct.variants}) is in stock with ${matchedProduct.stock} pcs available. Price: ${formatUZS(matchedProduct.price, 'en')}. Delivery across Tashkent is 25,000 UZS. Shall we place the order?`,
    matchedProductId: matchedProduct.id,
    orderConfirmed: false,
  };
}

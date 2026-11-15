export interface SocialLink {
  label: string;
  icon: string;
  url: string;
}

/**
 * Single source of truth for business/marketing content.
 * TODO: replace every value marked "TODO" with the real business data.
 * (Eventually this can be served from Supabase without touching components.)
 */

// Real WhatsApp number, digits only, international format (+243 828 498 126).
export const WHATSAPP_E164 = '243828498126';

export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const SITE = {
  brand: 'Merkey',
  contact: {
    whatsappE164: WHATSAPP_E164,
    phoneDisplay: '+243 828 498 126',
    email: 'merkeyrdc@gmail.com',
    city: 'Kinshasa',
    country: 'République Démocratique du Congo',
    address: 'Kinshasa, République Démocratique du Congo',
    hours: 'Toujours ouvert — 24h/24, 7j/7'
  },
  socials: [
    { label: 'Facebook', icon: 'pi-facebook', url: 'https://web.facebook.com/merkeyrdc' },
    { label: 'WhatsApp', icon: 'pi-whatsapp', url: `https://wa.me/${WHATSAPP_E164}` }
  ] as SocialLink[],
  commerce: {
    currency: '$',
    freeShippingThreshold: 50,
    flatShippingFee: 3.5,
    // TODO: list only the payment methods actually available
    paymentMethods: ['Paiement à la livraison'],
    promo: { code: 'MERKEY10', percent: 10, label: 'Bienvenue -10%' }
  },
  /**
   * Toggle unverified social-proof UI. Keep false until backed by real data.
   */
  features: {
    showRatings: false,
    showSalesCount: false,
    showTestimonials: false,
    showStats: false
  }
};

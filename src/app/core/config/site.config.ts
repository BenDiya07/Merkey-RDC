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

// TODO: replace with the real WhatsApp number, digits only, international format.
export const WHATSAPP_E164 = '243000000000';

export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const SITE = {
  brand: 'Merkey',
  contact: {
    whatsappE164: WHATSAPP_E164,
    // TODO: display format of the real number
    phoneDisplay: '+243 000 000 000',
    email: 'contact@merkeyrdc.com',
    city: 'Kinshasa',
    country: 'République Démocratique du Congo',
    address: 'Kinshasa, République Démocratique du Congo',
    hours: 'Lundi – Samedi : 9h – 19h'
  },
  socials: [
    { label: 'Instagram', icon: 'pi-instagram', url: 'https://instagram.com' },
    { label: 'Facebook', icon: 'pi-facebook', url: 'https://web.facebook.com/merkeyrdc' },
    { label: 'WhatsApp', icon: 'pi-whatsapp', url: `https://wa.me/${WHATSAPP_E164}` },
    { label: 'TikTok', icon: 'pi-mobile', url: 'https://tiktok.com' }
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

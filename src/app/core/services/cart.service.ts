import { computed, effect, Injectable, signal } from '@angular/core';
import { SITE } from '../config/site.config';
import { CartItem, Product } from '../models/product';

interface PromoCode {
  code: string;
  percent: number;
  label: string;
}

const PROMO_CODES: PromoCode[] = [
  { code: SITE.commerce.promo.code, percent: SITE.commerce.promo.percent, label: SITE.commerce.promo.label }
];

const STORAGE_KEY = 'merkey_cart';
const PROMO_KEY = 'merkey_promo';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly itemsSignal = signal<CartItem[]>([]);
  private readonly promoSignal = signal<PromoCode | null>(null);

  readonly items = this.itemsSignal.asReadonly();
  readonly promo = this.promoSignal.asReadonly();

  readonly itemsCount = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.itemsSignal().reduce((sum, item) => sum + item.quantity * item.product.price, 0)
  );

  readonly fullPrice = computed(() =>
    this.itemsSignal().reduce(
      (sum, item) => sum + item.quantity * (item.product.oldPrice ?? item.product.price),
      0
    )
  );

  readonly saving = computed(() => Math.max(0, this.fullPrice() - this.subtotal()));

  readonly discount = computed(() =>
    this.promoSignal() ? Math.round((this.subtotal() * this.promoSignal()!.percent) / 100) : 0
  );

  readonly total = computed(() => Math.max(0, this.subtotal() - this.discount()));

  readonly shipping = computed(() =>
    this.subtotal() >= SITE.commerce.freeShippingThreshold || this.subtotal() === 0
      ? 0
      : SITE.commerce.flatShippingFee
  );

  readonly grandTotal = computed(() => this.total() + this.shipping());

  constructor() {
    this.loadFromStorage();
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsSignal()));
    });
    effect(() => {
      const promo = this.promoSignal();
      localStorage.setItem(PROMO_KEY, promo ? JSON.stringify(promo) : '');
    });
  }

  add(product: Product, quantity = 1): void {
    const current = this.itemsSignal();
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) {
      this.itemsSignal.set(
        current.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        )
      );
    } else {
      this.itemsSignal.set([...current, { product, quantity: Math.min(quantity, product.stock) }]);
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.itemsSignal.set(
      this.itemsSignal().map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }

  remove(productId: string): void {
    this.itemsSignal.set(this.itemsSignal().filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.itemsSignal.set([]);
    this.promoSignal.set(null);
  }

  applyPromo(code: string): boolean {
    const normalized = code.trim().toUpperCase();
    const found = PROMO_CODES.find((promo) => promo.code === normalized);
    if (found) {
      this.promoSignal.set(found);
      return true;
    }
    return false;
  }

  removePromo(): void {
    this.promoSignal.set(null);
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const promoRaw = localStorage.getItem(PROMO_KEY);
      if (raw) {
        const parsed: CartItem[] = JSON.parse(raw);
        this.itemsSignal.set(Array.isArray(parsed) ? parsed : []);
      }
      if (promoRaw) {
        this.promoSignal.set(JSON.parse(promoRaw));
      }
    } catch {
      this.itemsSignal.set([]);
      this.promoSignal.set(null);
    }
  }
}
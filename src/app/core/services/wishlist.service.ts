import { computed, effect, Injectable, signal } from '@angular/core';
import { Product } from '../models/product';

const STORAGE_KEY = 'merkey_wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly idsSignal = signal<number[]>([]);

  readonly ids = this.idsSignal.asReadonly();
  readonly count = computed(() => this.idsSignal().length);

  constructor() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.idsSignal.set(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      this.idsSignal.set([]);
    }

    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.idsSignal()));
    });
  }

  isFavorite(id: number): boolean {
    return this.idsSignal().includes(id);
  }

  toggle(product: Product): boolean {
    if (this.isFavorite(product.id)) {
      this.idsSignal.set(this.idsSignal().filter((id) => id !== product.id));
      return false;
    }
    this.idsSignal.set([...this.idsSignal(), product.id]);
    return true;
  }

  remove(id: number): void {
    this.idsSignal.set(this.idsSignal().filter((fid) => fid !== id));
  }
}
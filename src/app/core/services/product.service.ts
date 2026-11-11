import { Injectable, inject } from '@angular/core';
import { defer, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { CATEGORIES, CategoryMeta, Product, ProductCategory, ProductSort } from '../models/product';
import { SupabaseService } from './supabase.service';

interface ProductRow {
  id: string | number;
  name: string;
  price: number | string | null;
  compare_at_price: number | string | null;
  description: string | null;
  image_url: string | null;
  gallery: string[] | null;
  features: string[] | null;
  stock: number | null;
  is_new: boolean | null;
  is_featured: boolean | null;
  categories: { slug: string | null; name: string | null } | null;
}

const SELECT = 'id,name,price,compare_at_price,description,image_url,gallery,features,stock,is_new,is_featured,categories(slug,name)';

const KNOWN_SLUGS: ProductCategory[] = ['ronde', 'jft', 'lumierebleue', 'photogrey'];
const FALLBACK_IMAGE = '/placeholder.jpg';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private supabase = inject(SupabaseService);
  private cache$?: Observable<Product[]>;

  get categories(): CategoryMeta[] {
    return CATEGORIES;
  }

  getAllProducts(): Observable<Product[]> {
    return this.fetchAll();
  }

  getProductById(id: string): Observable<Product | undefined> {
    return this.fetchAll().pipe(map((list) => list.find((p) => p.id === id)));
  }

  getFeatured(): Observable<Product[]> {
    return this.fetchAll().pipe(map((list) => list.filter((p) => p.featured)));
  }

  getNewArrivals(): Observable<Product[]> {
    return this.fetchAll().pipe(map((list) => list.filter((p) => p.isNew)));
  }

  getDeals(): Observable<Product[]> {
    return this.fetchAll().pipe(
      map((list) =>
        list
          .filter((p) => p.discount)
          .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
      )
    );
  }

  /**
   * No sales data is available on the storefront yet, so this returns
   * featured products first, then the most recent arrivals.
   */
  getBestSellers(limit = 4): Observable<Product[]> {
    return this.fetchAll().pipe(
      map((list) => {
        const featured = list.filter((p) => p.featured);
        const rest = list.filter((p) => !p.featured);
        return [...featured, ...rest].slice(0, limit);
      })
    );
  }

  search(params: {
    search?: string;
    category?: ProductCategory | 'all';
    sort?: ProductSort;
  }): Observable<Product[]> {
    return this.fetchAll().pipe(
      map((all) => {
        let result = [...all];

        const term = (params.search ?? '').trim().toLowerCase();
        if (term) {
          result = result.filter(
            (p) =>
              p.name.toLowerCase().includes(term) ||
              p.description.toLowerCase().includes(term) ||
              p.category.toLowerCase().includes(term) ||
              p.features.some((f) => f.toLowerCase().includes(term))
          );
        }

        if (params.category && params.category !== 'all') {
          result = result.filter((p) => p.category === params.category);
        }

        switch (params.sort) {
          case 'price-asc':
            result.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            result.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            result.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
            break;
          default:
            break;
        }

        return result;
      })
    );
  }

  getRelated(product: Product): Observable<Product[]> {
    return this.fetchAll().pipe(
      map((all) => {
        const sameCategory = all.filter((p) => p.id !== product.id && p.category === product.category);
        const others = all.filter((p) => p.id !== product.id && p.category !== product.category);
        return [...sameCategory, ...others].slice(0, 4);
      })
    );
  }

  private fetchAll(): Observable<Product[]> {
    if (!this.cache$) {
      this.cache$ = defer(() => this.queryAll()).pipe(
        shareReplay({ bufferSize: 1, refCount: false }),
        catchError((error) => {
          this.cache$ = undefined;
          return throwError(() => error);
        })
      );
    }
    return this.cache$;
  }

  private async queryAll(): Promise<Product[]> {
    const { data, error } = await this.supabase.client
      .from('products')
      .select(SELECT)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as unknown as ProductRow[]).map((row) => this.mapProduct(row));
  }

  private mapProduct(row: ProductRow): Product {
    const price = Number(row.price) || 0;
    const oldPrice = row.compare_at_price != null ? Number(row.compare_at_price) : undefined;
    const discount =
      oldPrice && oldPrice > price ? Math.round((1 - price / oldPrice) * 100) : undefined;

    const gallery = (row.gallery ?? [])
      .map((path) => this.imageUrl(path))
      .filter((url) => !!url);
    const image = this.imageUrl(row.image_url) || gallery[0] || FALLBACK_IMAGE;

    return {
      id: String(row.id),
      name: row.name,
      price,
      oldPrice: discount ? oldPrice : undefined,
      discount,
      image,
      images: gallery.length ? gallery : [image],
      description: row.description ?? '',
      features: row.features ?? [],
      category: this.resolveCategory(row.categories?.slug, row.categories?.name),
      stock: row.stock ?? 0,
      isNew: row.is_new ?? false,
      featured: row.is_featured ?? false
    };
  }

  private imageUrl(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    if (/^https?:\/\//i.test(value) || value.startsWith('/')) {
      return value;
    }
    return this.supabase.client.storage.from('product-images').getPublicUrl(value).data.publicUrl;
  }

  private resolveCategory(slug: string | null | undefined, name: string | null | undefined): ProductCategory {
    const normalizedSlug = (slug ?? '').trim().toLowerCase();
    if (KNOWN_SLUGS.includes(normalizedSlug as ProductCategory)) {
      return normalizedSlug as ProductCategory;
    }

    const normalizedName = (name ?? '').trim().toLowerCase();
    if (normalizedName.includes('jft')) return 'jft';
    if (normalizedName.includes('bleu') || normalizedName.includes('blue')) return 'lumierebleue';
    if (normalizedName.includes('photo')) return 'photogrey';
    return 'ronde';
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CategoryMeta,
  Product,
  ProductCategory,
  ProductSort
} from '../../core/models/product';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RevealAnimationDirective } from '../../shared/directives/reveal-animation.directive';

const SORTS: { value: ProductSort; label: string }[] = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'newest', label: 'Nouveautés' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' }
];

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, RevealAnimationDirective],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);

  categories: CategoryMeta[] = this.productService.categories;
  sortOptions = SORTS;

  selectedCategory = signal<ProductCategory | 'all'>('all');
  searchTerm = signal('');
  sort = signal<ProductSort>('relevance');
  products = signal<Product[]>([]);
  loading = signal(true);
  loadError = signal(false);

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          this.loading.set(true);
          this.loadError.set(false);
          return this.productService.search({
            search: (this.route.snapshot.queryParams['q'] as string) ?? '',
            category: (this.route.snapshot.queryParams['cat'] as ProductCategory) ?? 'all',
            sort: this.sort()
          });
        })
      )
      .subscribe({
        next: (result) => {
          this.searchTerm.set((this.route.snapshot.queryParams['q'] as string) ?? '');
          const cat = this.route.snapshot.queryParams['cat'] as ProductCategory | undefined;
          this.selectedCategory.set(cat ?? 'all');
          this.products.set(result);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadError.set(true);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectCategory(category: ProductCategory | 'all'): void {
    const query = { ...this.route.snapshot.queryParams, cat: category === 'all' ? undefined : category };
    this.router.navigate(['/produits'], { queryParams: this.cleanQuery(query) });
  }

  changeSort(): void {
    this.reload();
  }

  clearSearch(): void {
    const query = { ...this.route.snapshot.queryParams };
    delete query['q'];
    this.router.navigate(['/produits'], { queryParams: this.cleanQuery(query) });
  }

  private reload(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.productService
      .search({
        search: this.searchTerm(),
        category: this.selectedCategory(),
        sort: this.sort()
      })
      .subscribe({
        next: (result) => {
          this.products.set(result);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.loadError.set(true);
        }
      });
  }

  private cleanQuery(query: Record<string, unknown>): Record<string, string> {
    const cleaned: Record<string, string> = {};
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        cleaned[key] = String(value);
      }
    });
    return cleaned;
  }
}
import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RevealAnimationDirective } from '../../shared/directives/reveal-animation.directive';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, RevealAnimationDirective],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private wishlistService = inject(WishlistService);

  product = signal<Product | null>(null);
  related = signal<Product[]>([]);
  notFound = signal(false);

  selectedImage = signal('');
  quantity = 1;
  activeTab: 'description' | 'features' | 'shipping' = 'description';

  private destroy$ = new Subject<void>();

  categoryLabels: Record<Product['category'], string> = {
    ronde: 'Rondes',
    jft: 'JFT',
    lumierebleue: 'Lumière bleue',
    photogrey: 'Photogrey'
  };

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = Number(params.get('id'));
      this.loadProduct(id);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(id: number): void {
    this.productService.getProductById(id).pipe(takeUntil(this.destroy$)).subscribe((product) => {
      if (!product) {
        this.notFound.set(true);
        return;
      }
      this.notFound.set(false);
      this.product.set(product);
      this.quantity = 1;
      this.selectedImage.set(product.image);
      this.productService.getRelated(product).pipe(takeUntil(this.destroy$)).subscribe((rel) => {
        this.related.set(rel);
      });
    });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  get images(): string[] {
    const product = this.product();
    if (!product) return [];
    const list = [...product.images];
    if (product.personImage && !list.includes(product.personImage)) {
      list.push(product.personImage);
    }
    return list;
  }

  get stars(): number[] {
    return Array.from({ length: 5 }, (_, i) => i);
  }

  isFavorite(): boolean {
    const product = this.product();
    return product ? this.wishlistService.isFavorite(product.id) : false;
  }

  toggleFavorite(): void {
    const product = this.product();
    if (!product) return;
    const added = this.wishlistService.toggle(product);
    this.toastService.show(
      added ? 'Ajouté aux favoris' : 'Retiré des favoris',
      added ? 'pi-heart-fill' : 'pi-heart'
    );
  }

  decrement(): void {
    if (this.quantity > 1) this.quantity--;
  }

  increment(): void {
    const product = this.product();
    if (product && this.quantity < product.stock) this.quantity++;
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;
    this.cartService.add(product, this.quantity);
    this.toastService.show(`${product.name} ajouté au panier`);
  }

  buyNow(): void {
    const product = this.product();
    if (!product) return;
    this.cartService.add(product, this.quantity);
    this.router.navigate(['/panier']);
  }
}
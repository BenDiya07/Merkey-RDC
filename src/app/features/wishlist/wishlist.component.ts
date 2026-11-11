import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../core/models/product';
import { ProductService } from '../../core/services/product.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RevealAnimationDirective } from '../../shared/directives/reveal-animation.directive';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, RevealAnimationDirective],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  private productService = inject(ProductService);
  readonly wishlistService = inject(WishlistService);

  products = signal<Product[]>([]);

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe({
      next: (all) => {
        this.products.set(all.filter((p) => this.wishlistService.isFavorite(p.id)));
      },
      error: () => this.products.set([])
    });
  }
}
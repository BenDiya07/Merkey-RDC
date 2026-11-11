import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  product = input.required<Product>();

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private toastService = inject(ToastService);

  categoryLabels: Record<Product['category'], string> = {
    ronde: 'Rondes',
    jft: 'JFT',
    lumierebleue: 'Lumière bleue',
    photogrey: 'Photogrey'
  };

  get categoryLabel(): string {
    return this.categoryLabels[this.product().category];
  }

  get formattedPrice(): string {
    return `${this.product().price.toFixed(2)} $`;
  }

  get formattedOldPrice(): string {
    const oldPrice = this.product().oldPrice;
    return oldPrice ? `${oldPrice.toFixed(2)} $` : '';
  }

  isFavorite(): boolean {
    return this.wishlistService.isFavorite(this.product().id);
  }

  toggleFavorite(): void {
    const added = this.wishlistService.toggle(this.product());
    this.toastService.show(
      added ? `${this.product().name} ajouté aux favoris` : `${this.product().name} retiré des favoris`,
      added ? 'pi-heart-fill' : 'pi-heart'
    );
  }

  addToCart(): void {
    this.cartService.add(this.product());
    this.toastService.show(`${this.product().name} ajouté au panier`);
  }
}
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SITE, whatsappLink } from '../../core/config/site.config';
import { CartService } from '../../core/services/cart.service';
import { OrderConfirmation, OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  readonly cartService = inject(CartService);
  private toastService = inject(ToastService);
  private orderService = inject(OrderService);

  readonly site = SITE;

  promoCode = '';
  promoError = signal('');

  customerName = '';
  customerPhone = '';
  customerCity = '';
  note = '';
  readonly submitting = signal(false);
  readonly orderError = signal('');
  readonly lastOrder = signal<OrderConfirmation | null>(null);

  get totalUnits(): number {
    const promotions = this.cartService.items().filter((item) => item.product.discount).length;
    return promotions;
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string, name: string): void {
    this.cartService.remove(productId);
    this.toastService.show(`${name} retiré du panier`, 'pi-trash');
  }

  applyPromo(): void {
    if (!this.promoCode.trim()) return;
    const applied = this.cartService.applyPromo(this.promoCode);
    if (applied) {
      this.promoError.set('');
      this.toastService.show(`Code ${this.promoCode.trim().toUpperCase()} appliqué !`, 'pi-ticket');
      this.promoCode = '';
    } else {
      this.promoError.set(`Code promo invalide. Essayez ${SITE.commerce.promo.code}.`);
    }
  }

  removePromo(): void {
    this.cartService.removePromo();
  }

  placeOrder(): void {
    if (this.submitting()) return;

    if (this.customerName.trim().length < 2) {
      this.orderError.set('Veuillez saisir votre nom complet.');
      return;
    }
    if (this.customerPhone.replace(/\D/g, '').length < 7) {
      this.orderError.set('Veuillez saisir un numéro de téléphone valide.');
      return;
    }

    this.orderError.set('');
    this.submitting.set(true);

    this.orderService
      .createOrder({
        customerName: this.customerName.trim(),
        customerPhone: this.customerPhone.trim(),
        customerCity: this.customerCity.trim(),
        note: this.note.trim(),
        promoCode: this.cartService.promo()?.code ?? null,
        items: this.cartService.items().map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity
        }))
      })
      .subscribe({
        next: (order) => {
          this.submitting.set(false);
          this.lastOrder.set(order);
          this.cartService.clear();
          this.toastService.show(`Commande ${order.reference} enregistrée !`, 'pi-check-circle');
        },
        error: (error) => {
          this.submitting.set(false);
          this.orderError.set(
            error?.message ?? 'Impossible de passer la commande. Réessayez dans un instant.'
          );
        }
      });
  }

  orderViaWhatsApp(): void {
    const lines = this.cartService.items()
      .map(
        (item) =>
          `• ${item.product.name} × ${item.quantity} — ${(item.product.price * item.quantity).toFixed(2)} $`
      )
      .join('\n');

    const message =
      `Bonjour Merkey RDC, je souhaite passer cette commande :\n\n${lines}\n\n` +
      `Sous-total : ${this.cartService.subtotal().toFixed(2)} $\n` +
      (this.cartService.discount() > 0
        ? `Réduction : -${this.cartService.discount().toFixed(2)} $\n`
        : '') +
      (this.cartService.shipping() > 0
        ? `Livraison : ${this.cartService.shipping().toFixed(2)} $\n`
        : 'Livraison offerte 🎉\n') +
      `Total : ${this.cartService.grandTotal().toFixed(2)} $`;

    window.open(whatsappLink(message), '_blank');
  }
}
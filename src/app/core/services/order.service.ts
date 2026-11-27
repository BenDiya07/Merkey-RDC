import { Injectable, inject } from '@angular/core';
import { from, Observable, map } from 'rxjs';
import { SupabaseService } from './supabase.service';

export interface OrderLineInput {
  product_id: string;
  quantity: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  customerCity?: string;
  note?: string;
  promoCode?: string | null;
  items: OrderLineInput[];
}

export interface OrderConfirmation {
  id: string;
  reference: string;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private supabase = inject(SupabaseService);

  /**
   * Crée une commande en ligne via le RPC sécurisé `create_order`.
   * Les totaux et le contrôle de stock sont recalculés côté base de données.
   */
  createOrder(input: CreateOrderInput): Observable<OrderConfirmation> {
    return from(
      this.supabase.client.rpc('create_order', {
        p_customer_name: input.customerName,
        p_customer_phone: input.customerPhone,
        p_customer_city: input.customerCity ?? '',
        p_note: input.note ?? '',
        p_promo_code: input.promoCode ?? '',
        p_items: input.items
      })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data as OrderConfirmation;
      })
    );
  }
}

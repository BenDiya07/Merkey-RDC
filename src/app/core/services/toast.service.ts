import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  text: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<ToastMessage[]>([]);

  private counter = 0;

  show(text: string, icon = 'pi-check-circle'): void {
    const id = ++this.counter;
    this.toasts.update((toasts) => [...toasts, { id, text, icon }]);
    setTimeout(() => this.dismiss(id), 3200);
  }

  dismiss(id: number): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
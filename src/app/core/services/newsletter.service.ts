import { Injectable, inject } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private supabase = inject(SupabaseService);

  subscribe(email: string): Observable<void> {
    return from(
      this.supabase.client
        .from('newsletter_subscribers')
        .insert({ email: email.trim().toLowerCase() })
    ).pipe(
      map(({ error }) => {
        // 23505 = already subscribed; treat as success (idempotent).
        if (error && error.code !== '23505') {
          throw error;
        }
      }),
      catchError((error) => {
        if (error && error.code === '23505') {
          return of(void 0);
        }
        throw error;
      })
    );
  }
}

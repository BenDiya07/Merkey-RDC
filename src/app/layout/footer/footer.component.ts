import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/config/site.config';
import { NewsletterService } from '../../core/services/newsletter.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  newsletterEmail = '';
  newsletterError = '';
  newsletterSent = false;
  newsletterSubmitting = false;

  private toastService = inject(ToastService);
  private newsletterService = inject(NewsletterService);

  readonly site = SITE;

  quickLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'La boutique', path: '/produits' },
    { label: 'Mon panier', path: '/panier' },
    { label: 'À propos', path: '/a-propos' }
  ];

  categories = [
    { label: 'Rondes', category: 'ronde' },
    { label: 'JFT', category: 'jft' },
    { label: 'Lumière bleue', category: 'lumierebleue' },
    { label: 'Photogrey', category: 'photogrey' }
  ];

  socials = SITE.socials;

  subscribe(): void {
    const email = this.newsletterEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      this.newsletterError = 'Veuillez saisir une adresse email valide.';
      return;
    }
    this.newsletterError = '';
    this.newsletterSubmitting = true;
    this.newsletterService.subscribe(email).subscribe({
      next: () => {
        this.newsletterSubmitting = false;
        this.newsletterEmail = '';
        this.newsletterSent = true;
        this.toastService.show('Inscription confirmée. Merci !', 'pi-envelope');
        setTimeout(() => {
          this.newsletterSent = false;
        }, 6000);
      },
      error: () => {
        this.newsletterSubmitting = false;
        this.newsletterError = 'Une erreur est survenue. Merci de réessayer.';
      }
    });
  }

  goToCategory(category: string): void {
    this.toastService.show('Boutique bientôt disponible', 'pi-info-circle');
  }
}
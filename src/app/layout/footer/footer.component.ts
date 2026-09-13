import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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

  private toastService = inject(ToastService);

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

  socials = [
    { label: 'Instagram', icon: 'pi-instagram', url: 'https://instagram.com' },
    { label: 'Facebook', icon: 'pi-facebook', url: 'https://web.facebook.com/merkeyrdc' },
    { label: 'WhatsApp', icon: 'pi-whatsapp', url: 'https://wa.me/243000000000' },
    { label: 'TikTok', icon: 'pi-mobile', url: 'https://tiktok.com' }
  ];

  subscribe(): void {
    const email = this.newsletterEmail.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      this.newsletterError = 'Veuillez saisir une adresse email valide.';
      return;
    }
    this.newsletterError = '';
    this.newsletterEmail = '';
    this.newsletterSent = true;
    this.toastService.show('Inscription confirmée. Merci !', 'pi-envelope');
    setTimeout(() => {
      this.newsletterSent = false;
    }, 6000);
  }

  goToCategory(category: string): void {
    this.toastService.show('Boutique bientôt disponible', 'pi-info-circle');
  }
}
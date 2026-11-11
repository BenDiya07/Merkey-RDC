import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SITE } from '../../core/config/site.config';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';

interface NavLink {
  label: string;
  path: string;
  exact?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  mobileMenuOpen = false;
  mobileSearchOpen = false;
  scrolled = false;
  searchTerm = '';
  categoryDropdownOpen = false;

  private router = inject(Router);
  readonly cartService = inject(CartService);
  readonly wishlistService = inject(WishlistService);
  readonly site = SITE;

  navLinks: NavLink[] = [
    { label: 'Accueil', path: '/', exact: true },
    { label: 'Boutique', path: '/produits' },
    { label: 'À propos', path: '/a-propos' },
    { label: 'Contact', path: '/contact' }
  ];

  categories = [{ label: 'Rondes', path: '/produits', category: 'ronde' },
    { label: 'JFT', path: '/produits', category: 'jft' },
    { label: 'Lumière bleue', path: '/produits', category: 'lumierebleue' },
    { label: 'Photogrey', path: '/produits', category: 'photogrey' }];

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 10;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.mobileSearchOpen = false;
    }
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
    this.mobileSearchOpen = false;
    this.categoryDropdownOpen = false;
  }

  toggleCategoryDropdown(): void {
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
  }

  onSearch(): void {
    const term = this.searchTerm.trim();
    this.router.navigate(['/produits'], {
      queryParams: term ? { q: term } : {}
    });
    this.closeMenu();
  }

  goToCategory(category: string): void {
    this.router.navigate(['/produits'], { queryParams: { cat: category } });
    this.closeMenu();
  }
}
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CATEGORIES, Product, ProductCategory, Testimonial } from '../../core/models/product';
import { ProductService } from '../../core/services/product.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RevealAnimationDirective } from '../../shared/directives/reveal-animation.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent, RevealAnimationDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private productService = inject(ProductService);

  categories = CATEGORIES.filter((c) => c.value !== 'all');

  searchInput = '';
  deals = signal<Product[]>([]);
  bestSellers = signal<Product[]>([]);
  newArrivals = signal<Product[]>([]);

  popularTags: { label: string; category: ProductCategory }[] = [
    { label: 'Rondes', category: 'ronde' },
    { label: 'JFT', category: 'jft' },
    { label: 'Lumière bleue', category: 'lumierebleue' },
    { label: 'Photogrey', category: 'photogrey' }
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Awa D.',
      role: 'Cliente vérifiée',
      content: 'Je recommande à 100% ! Des lunettes magnifiques, confortables et très bien finies. Le service client est au top.',
      rating: 5
    },
    {
      name: 'Jean-Marc K.',
      role: 'Client vérifié',
      content: 'La paire Photogrey est géniale, elle s\u2019adapte à la lumière et j\u2019ai l\u2019impression d\u2019avoir payé 3 fois le prix.',
      rating: 5
    },
    {
      name: 'Fatima B.',
      role: 'Cliente vérifiée',
      content: 'Livraison rapide à Kinshasa et monture identique aux photos. Merkey est devenu mon fournisseur de lunettes préféré.',
      rating: 4
    }
  ];

  testimonialStars(n: number): number[] {
    return Array.from({ length: n }, (_, i) => i);
  }

  ngOnInit(): void {
    this.productService.getDeals().subscribe((items) => this.deals.set(items.slice(0, 3)));
    this.productService.getBestSellers(4).subscribe((items) => this.bestSellers.set(items));
    this.productService.getNewArrivals().subscribe((items) => this.newArrivals.set(items.slice(0, 4)));
  }

  onSearch(): void {
    const term = this.searchInput.trim();
    this.router.navigate(['/produits'], { queryParams: term ? { q: term } : {} });
  }

  goToCategory(category: string): void {
    this.router.navigate(['/produits'], { queryParams: { cat: category } });
  }
}
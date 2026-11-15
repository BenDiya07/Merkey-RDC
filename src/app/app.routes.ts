import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProductsComponent } from './features/products/products.component';
import { ProductDetailComponent } from './features/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { WishlistComponent } from './features/wishlist/wishlist.component';
import { AboutComponent } from './features/about/about.component';
import { ContactComponent } from './features/contact/contact.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
  { path: '', title: 'Merkey — Lunettes non médicales stylées', component: HomeComponent },
  { path: 'produits', title: 'Boutique | Merkey', component: ProductsComponent },
  { path: 'produits/:id', title: 'Fiche produit | Merkey', component: ProductDetailComponent },
  { path: 'panier', title: 'Mon panier | Merkey', component: CartComponent },
  { path: 'favoris', title: 'Mes favoris | Merkey', component: WishlistComponent },
  { path: 'a-propos', title: 'À propos | Merkey', component: AboutComponent },
  { path: 'contact', title: 'Contact | Merkey', component: ContactComponent },
  { path: '**', title: 'Page introuvable | Merkey', component: NotFoundComponent }
];
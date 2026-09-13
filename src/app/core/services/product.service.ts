import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CATEGORIES,
  CategoryMeta,
  Product,
  ProductCategory,
  ProductSort
} from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Ronde Classic',
      price: 15,
      oldPrice: 20,
      discount: 25,
      image: '/merkeywebp/MERKEY_24.webp',
      images: ['/merkeywebp/MERKEY_24.webp', '/merkeywebp/MERKEY_36.webp', '/merkeywebp/MERKEY_31.webp'],
      personImage: '/merkeywebp/MERKEY_36.webp',
      description:
        'La monture ronde intemporelle, légère et confortable. Un classique qui met en valeur tous les visages.',
      features: ['Verres légers et résistants', 'Monture légère en acétate', 'Confort de port prolongé', 'Garantie 12 mois'],
      category: 'ronde',
      rating: 4.8,
      reviewsCount: 214,
      sold: 1520,
      stock: 45,
      featured: true
    },
    {
      id: 2,
      name: 'Ronde Dorée Éclat',
      price: 17,
      image: '/merkeywebp/MERKEY_6.webp',
      images: ['/merkeywebp/MERKEY_6.webp', '/merkeywebp/MERKEY_32.webp', '/merkeywebp/MERKEY_35.webp'],
      personImage: '/merkeywebp/MERKEY_31.webp',
      description:
        'Des finitions dorées pour un look solaire et affirmé. Le détail qui fait toute la différence.',
      features: ['Finitions métal dorées', 'Charnières renforcées', 'Plaquettes ajustables', 'Étui offert'],
      category: 'ronde',
      rating: 4.7,
      reviewsCount: 132,
      sold: 890,
      stock: 38,
      isNew: true
    },
    {
      id: 3,
      name: 'Ronde Noire Chic',
      price: 16,
      oldPrice: 21,
      discount: 24,
      image: '/merkeywebp/MERKEY_3.webp',
      images: ['/merkeywebp/MERKEY_3.webp', '/merkeywebp/MERKEY_7.webp', '/merkeywebp/MERKEY_10.webp'],
      personImage: '/merkeywebp/MERKEY_7.webp',
      description:
        'Le noir profond et mat, un caméléon du style. Idéal du bureau aux sorties entre amis.',
      features: ['Monture noire mate', 'Design unisexe', 'Ajustement nasal rapide', 'Garantie 12 mois'],
      category: 'ronde',
      rating: 4.6,
      reviewsCount: 98,
      sold: 760,
      stock: 25
    },
    {
      id: 4,
      name: 'JFT White',
      price: 15,
      image: '/merkeywebp/IMG-20230516-WA0048.webp',
      images: ['/merkeywebp/IMG-20230516-WA0048.webp', '/merkeywebp/IMG-20230516-WA0034.webp', '/merkeywebp/IMG-20230516-WA0033.webp'],
      personImage: '/merkeywebp/IMG-20230516-WA0034.webp',
      description:
        'La monture blanche, nette et éclatante. Une pièce maîtresse pour un style lumineux et moderne.',
      features: ['Blanc éclatant', 'Branches flexibles', 'Protection UV400', 'Idéal à porter au quotidien'],
      category: 'jft',
      rating: 4.9,
      reviewsCount: 168,
      sold: 1240,
      stock: 30,
      featured: true
    },
    {
      id: 5,
      name: 'JFT Black',
      price: 15,
      oldPrice: 19,
      discount: 21,
      image: '/merkeywebp/IMG-20230516-WA0049.webp',
      images: ['/merkeywebp/IMG-20230516-WA0049.webp', '/merkeywebp/jftnoir.jpg', '/merkeywebp/jft.jpg'],
      personImage: '/merkeywebp/jftnoir.jpg',
      description:
        'Le noir sophistiqué pour les esprits audacieux. Un accessoire de caractère qui ne passe pas inaperçu.',
      features: ['Monture noire élégante', 'Charnières à ressort', 'Poids plume', 'Étui rigide offert'],
      category: 'jft',
      rating: 4.8,
      reviewsCount: 145,
      sold: 1090,
      stock: 27
    },
    {
      id: 6,
      name: 'JFT Désert',
      price: 18,
      image: '/merkeywebp/jft.jpg',
      images: ['/merkeywebp/jft.jpg', '/merkeywebp/jftnoir.jpg', '/merkeywebp/IMG-20230516-WA0034.webp'],
      personImage: '/merkeywebp/IMG-20230516-WA0034.webp',
      description:
        'Des teintes sable sur une monture structurée. Pour celles et ceux qui aiment sortir du lot.',
      features: ['Teinte sable', 'Finitions premium', 'Plaquettes en silicone', 'Édition limitée'],
      category: 'jft',
      rating: 4.7,
      reviewsCount: 76,
      sold: 540,
      stock: 18,
      isNew: true
    },
    {
      id: 7,
      name: 'Blue Shield XL',
      price: 13,
      oldPrice: 18,
      discount: 28,
      image: '/merkeywebp/IMG-20230516-WA0050.webp',
      images: ['/merkeywebp/IMG-20230516-WA0050.webp', '/merkeywebp/IMG-20230516-WA0049.webp', '/merkeywebp/IMG-20230516-WA0048.webp'],
      description:
        'Le bouclier anti lumière bleue, conçu pour les longues heures devant les écrans sans fatigue oculaire.',
      features: ['Filtre lumière bleue', 'Longueur optimale', 'Confort au bureau', 'Léger et moderne'],
      category: 'lumierebleue',
      rating: 4.8,
      reviewsCount: 256,
      sold: 1980,
      stock: 60,
      featured: true
    },
    {
      id: 8,
      name: 'Screen Pro Max',
      price: 14,
      image: '/images/blue.webp',
      images: ['/images/blue.webp', '/merkeywebp/IMG-20230516-WA0050.webp', '/images/model-with-glasses.png'],
      description:
        'La protection premium pour gamers et professionnels. Style affirmé, protection maximale.',
      features: ['Filtre anti reflets', 'Verres teintés bleutés', 'Adapté aux visages larges', 'Étui de transport'],
      category: 'lumierebleue',
      rating: 4.6,
      reviewsCount: 112,
      sold: 870,
      stock: 41,
      isNew: true
    },
    {
      id: 9,
      name: 'Ice Blue Flex',
      price: 12,
      image: '/merkeywebp/IMG-20230516-WA0041.webp',
      images: ['/merkeywebp/IMG-20230516-WA0041.webp', '/merkeywebp/IMG-20230516-WA0043.webp', '/merkeywebp/IMG-20230516-WA0045.webp'],
      description:
        'Légèreté extrême et flexibilité totale pour un confort qui dure toute la journée.',
      features: ['Branches flexibles', 'Très léger', 'Protection écran', 'Idéal étudiants'],
      category: 'lumierebleue',
      rating: 4.5,
      reviewsCount: 64,
      sold: 430,
      stock: 55
    },
    {
      id: 10,
      name: 'Photogrey Classic',
      price: 23,
      oldPrice: 32,
      discount: 28,
      image: '/images/hero-glasses.png',
      images: [
        '/images/hero-glasses.png',
        '/images/model-with-glasses.png',
        '/images/model-photo.png'
      ],
      personImage: '/images/model-with-glasses.png',
      description:
        'Des verres photochromatiques qui foncent à la lumière et s\u2019éclaircissent à l\u2019intérieur. 2-en-1, toujours parfait.',
      features: ['Verres photochromatiques', 'Transition automatique', 'Protection UV400', 'Étui premium'],
      category: 'photogrey',
      rating: 4.9,
      reviewsCount: 301,
      sold: 2340,
      stock: 22,
      featured: true
    },
    {
      id: 11,
      name: 'Photogrey Urban',
      price: 25,
      image: '/images/model-photo.png',
      images: ['/images/model-photo.png', '/images/model-with-glasses.png', '/images/red.webp'],
      personImage: '/images/model-with-glasses.png',
      description:
        'La paire technique et branchée. Une monture assertive pour la ville, des verres qui s\u2019adaptent partout.',
      features: ['Design urbain', 'Verres réactifs', 'Structure renforcée', 'Édition limitée'],
      category: 'photogrey',
      rating: 4.8,
      reviewsCount: 88,
      sold: 610,
      stock: 15,
      isNew: true
    },
    {
      id: 12,
      name: 'Photogrey Rose',
      price: 21,
      oldPrice: 27,
      discount: 22,
      image: '/images/red.webp',
      images: ['/images/red.webp', '/images/model-photo.png', '/images/hero-glasses.png'],
      description:
        'Une touche de couleur assumée : des verres intelligents sur une monture qui sort du rang.',
      features: ['Monture colorée', 'Verres photochromatiques', 'Plaquettes confort', 'Garantie 12 mois'],
      category: 'photogrey',
      rating: 4.7,
      reviewsCount: 71,
      sold: 520,
      stock: 20
    }
  ];

  get categories(): CategoryMeta[] {
    return CATEGORIES;
  }

  getAllProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find((p) => p.id === id));
  }

  getFeatured(): Observable<Product[]> {
    return of(this.products.filter((p) => p.featured));
  }

  getNewArrivals(): Observable<Product[]> {
    return of(this.products.filter((p) => p.isNew));
  }

  getDeals(): Observable<Product[]> {
    return of(
      this.products
        .filter((p) => p.discount)
        .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
    );
  }

  getBestSellers(limit = 4): Observable<Product[]> {
    return of([...this.products].sort((a, b) => b.sold - a.sold).slice(0, limit));
  }

  search(params: {
    search?: string;
    category?: ProductCategory | 'all';
    sort?: ProductSort;
  }): Observable<Product[]> {
    let result = [...this.products];

    const term = (params.search ?? '').trim().toLowerCase();
    if (term) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.category.toLowerCase().includes(term) ||
          p.features.some((f) => f.toLowerCase().includes(term))
      );
    }

    if (params.category && params.category !== 'all') {
      result = result.filter((p) => p.category === params.category);
    }

    switch (params.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'sold':
        result.sort((a, b) => b.sold - a.sold);
        break;
      default:
        break;
    }

    return of(result);
  }

  getRelated(product: Product): Observable<Product[]> {
    const sameCategory = this.products.filter((p) => p.id !== product.id && p.category === product.category);
    const others = this.products.filter((p) => p.id !== product.id && p.category !== product.category);
    return of([...sameCategory, ...others].slice(0, 4));
  }
}
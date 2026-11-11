export type ProductCategory = 'ronde' | 'jft' | 'lumierebleue' | 'photogrey';

export type ProductSort = 'relevance' | 'price-asc' | 'price-desc' | 'newest';

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  personImage?: string;
  description: string;
  features: string[];
  category: ProductCategory;
  stock: number;
  isNew?: boolean;
  featured?: boolean;
}

export interface CategoryMeta {
  value: ProductCategory | 'all';
  label: string;
  image?: string;
  description?: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    value: 'all',
    label: 'Tous les modèles'
  },
  {
    value: 'ronde',
    label: 'Rondes',
    image: '/merkeywebp/MERKEY_24.webp',
    description: 'Le charme intemporel des montures rondes.'
  },
  {
    value: 'jft',
    label: 'JFT',
    image: '/merkeywebp/IMG-20230516-WA0048.webp',
    description: 'Élégance et sobriété, le style signature.'
  },
  {
    value: 'lumierebleue',
    label: 'Lumière bleue',
    image: '/merkeywebp/IMG-20230516-WA0050.webp',
    description: 'Protégez vos yeux devant les écrans.'
  },
  {
    value: 'photogrey',
    label: 'Photogrey',
    image: '/images/hero-glasses.png',
    description: 'Des verres qui s\u2019adaptent à la lumière.'
  }
];

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
export type ProductCategory = 'lumierebleue' | 'photogrey' | 'soleil' | 'accessoires';

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
    value: 'lumierebleue',
    label: 'Lumière bleue',
    image: '/merkeywebp/IMG-20230516-WA0050.webp',
    description: 'Protégez vos yeux devant les écrans.'
  },
  {
    value: 'photogrey',
    label: 'Photogrey',
    image: '/merkeywebp/MERKEY_24.webp',
    description: 'Des verres qui s\u2019adaptent à la lumière.'
  },
  {
    value: 'soleil',
    label: 'Lunettes de soleil',
    image: '/merkeywebp/IMG-20230516-WA0048.webp',
    description: 'Protection UV et style pour les journées ensoleillées.'
  },
  {
    value: 'accessoires',
    label: 'Accessoires',
    image: '/images/hero-glasses.png',
    description: 'Étuis et accessoires pour prendre soin de vos lunettes.'
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
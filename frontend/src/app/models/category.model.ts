export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  type: 'window' | 'door' | 'realization';
  imageUrl: string;
}

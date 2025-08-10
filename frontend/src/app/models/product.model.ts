export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  mainImageUrl: string;
  images: { url: string }[];
}

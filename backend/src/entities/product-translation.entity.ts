import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, Index } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_translations')
@Unique(['productId', 'languageCode'])
export class ProductTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  productId: number;

  @ManyToOne(() => Product, product => product.translations, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ length: 8 })
  @Index()
  languageCode: string; // e.g., 'sk', 'en'

  @Column()
  name: string;

  @Column()
  @Index()
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  specifications: string | null;
}



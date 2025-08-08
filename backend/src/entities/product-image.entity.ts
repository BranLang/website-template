import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, Unique } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
@Unique(['productId', 'hash'])
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  @Index()
  hash: string | null;

  @Column({ nullable: true })
  altText: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isMain: boolean;

  @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
  product: Product;

  @Column()
  productId: number;

  @CreateDateColumn()
  createdAt: Date;
}

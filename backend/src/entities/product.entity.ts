import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';

export enum ProductMaterial {
  WOOD = 'wood',
  ALUMINUM = 'aluminum',
  WOOD_ALUMINUM = 'wood_aluminum',
  HISTORICAL = 'historical',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', nullable: true })
  specifications: string;

  @Column({
    type: 'varchar',
    enum: ProductMaterial,
  })
  material: ProductMaterial;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ nullable: true })
  mainImageUrl: string;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images: ProductImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

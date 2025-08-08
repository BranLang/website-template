import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { ProductImage } from './product-image.entity';
import { Site } from './site.entity';
import { ProductTranslation } from './product-translation.entity';

export enum ProductMaterial {
  WOOD = 'wood',
  ALUMINUM = 'aluminum',
  WOOD_ALUMINUM = 'wood_aluminum',
  HISTORICAL = 'historical',
}

export enum Language {
  SK = 'sk',
  EN = 'en',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => Site, site => site.products)
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column()
  siteId: number;

  @ManyToOne(() => Category, category => category.products)
  category: Category;

  @Column()
  categoryId: number;

  @OneToMany(() => ProductImage, image => image.product, { cascade: true })
  images: ProductImage[];

  @OneToMany(() => ProductTranslation, t => t.product, { cascade: true })
  translations: ProductTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

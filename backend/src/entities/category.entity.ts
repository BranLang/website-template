import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Site } from './site.entity';
import { CategoryTranslation } from './category-translation.entity';

export enum CategoryType {
  WINDOW = 'window',
  DOOR = 'door',
  ACCESSORY = 'accessory',
  REALIZATION = 'realization',
}

export enum Language {
  SK = 'sk',
  EN = 'en',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    enum: CategoryType,
  })
  type: CategoryType;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Category, category => category.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent?: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @Column({ nullable: true })
  parentId?: number;

  @ManyToOne(() => Site, site => site.categories)
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column()
  siteId: number;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @OneToMany(() => CategoryTranslation, t => t.category, { cascade: true })
  translations: CategoryTranslation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { Site } from './site.entity';

export enum CategoryType {
  WINDOW = 'window',
  DOOR = 'door',
  ACCESSORY = 'accessory',
}

export enum Language {
  SK = 'sk',
  EN = 'en',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

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

  @ManyToOne(() => Site, site => site.categories)
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column()
  siteId: number;

  @Column({
    type: 'varchar',
    enum: Language,
    default: Language.SK,
  })
  language: Language;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

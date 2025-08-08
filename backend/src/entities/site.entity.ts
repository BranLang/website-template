import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { Page } from './page.entity';
import { SiteImage } from './site-image.entity';

@Entity('sites')
export class Site {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  logoUrl: string;

  @Column({ nullable: true })
  faviconUrl: string;

  @Column({ nullable: true })
  domain: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  contactAddress: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 'classic' })
  theme: string;

  @Column({ type: 'json', nullable: true })
  settings: any; // For site-specific settings like theme, features, etc.

  @OneToMany(() => Category, category => category.site)
  categories: Category[];

  @OneToMany(() => Product, product => product.site)
  products: Product[];

  @OneToMany(() => Page, page => page.site)
  pages: Page[];

  @OneToMany(() => SiteImage, image => image.site)
  images: SiteImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

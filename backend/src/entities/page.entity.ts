import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Site } from './site.entity';
import { PageTranslation } from './page-translation.entity';

export enum PageType {
  STATIC = 'static',
  BLOG = 'blog',
  FAQ = 'faq',
}

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  // Textual fields moved to PageTranslation

  @Column({
    type: 'varchar',
    enum: PageType,
    default: PageType.STATIC,
  })
  type: PageType;

  @Column({ nullable: true })
  featuredImageUrl: string;

  @Column({ default: true })
  isPublished: boolean;

  @Column({ default: 0 })
  sortOrder: number;

  // Meta moved to PageTranslation

  @ManyToOne(() => Site, site => site.pages)
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column()
  siteId: number;

  // language removed; translations handle language

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PageTranslation, t => t.page, { cascade: true })
  translations: PageTranslation[];
}

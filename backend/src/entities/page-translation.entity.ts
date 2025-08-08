import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, Index } from 'typeorm';
import { Page } from './page.entity';

@Entity('page_translations')
@Unique(['pageId', 'languageCode'])
export class PageTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  pageId: number;

  @ManyToOne(() => Page, page => page.translations, { onDelete: 'CASCADE' })
  page: Page;

  @Column({ length: 8 })
  @Index()
  languageCode: string;

  @Column()
  title: string;

  @Column()
  @Index()
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string | null;

  @Column({ type: 'text', nullable: true })
  metaDescription: string | null;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string | null;
}



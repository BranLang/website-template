import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PageType {
  STATIC = 'static',
  BLOG = 'blog',
  FAQ = 'faq',
}

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

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

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Site } from './site.entity';

export interface CarouselSlideTranslation {
  titleTranslationId: string;
  subtitleTranslationId: string;
}

@Entity('carousel_slides')
export class CarouselSlide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column()
  imageAlt: string;

  @Column()
  titleTranslationId: string;

  @Column()
  subtitleTranslationId: string;

  @Column()
  category: string;

  @Column()
  productType: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Site, { nullable: true })
  @JoinColumn({ name: 'siteId' })
  site: Site;

  @Column({ nullable: true })
  siteId: number;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}

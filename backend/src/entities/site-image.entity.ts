import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Site } from './site.entity';

@Entity('site_images')
export class SiteImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  altText: string;

  @ManyToOne(() => Site, site => site.images, { onDelete: 'CASCADE' })
  site: Site;

  @Column()
  siteId: number;

  @CreateDateColumn()
  createdAt: Date;
}


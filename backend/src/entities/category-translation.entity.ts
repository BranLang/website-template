import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique, Index } from 'typeorm';
import { Category } from './category.entity';

@Entity('category_translations')
@Unique(['categoryId', 'languageCode'])
export class CategoryTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  categoryId: number;

  @ManyToOne(() => Category, category => category.translations, { onDelete: 'CASCADE' })
  category: Category;

  @Column({ length: 8 })
  @Index()
  languageCode: string;

  @Column()
  name: string;

  @Column()
  @Index()
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}



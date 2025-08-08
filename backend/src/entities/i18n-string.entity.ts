import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity('i18n_strings')
@Unique(['key', 'languageCode', 'siteId'])
export class I18nString {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  key: string; // e.g., 'COMMON.HOME'

  @Column({ length: 8 })
  @Index()
  languageCode: string; // 'sk', 'en'

  @Column('text')
  value: string;

  @Column({ nullable: true })
  @Index()
  namespace?: string | null; // optional grouping

  @Column({ nullable: true })
  @Index()
  siteId?: number | null;
}



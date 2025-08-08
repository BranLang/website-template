import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('media_files')
export class MediaFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @Index({ unique: true })
  hash: string;

  @Column()
  url: string; // public URL starting with /uploads/...

  @Column()
  relativePath: string; // path under uploads/, e.g., files/abcd.jpg

  @Column()
  originalName: string;

  @Column({ nullable: true })
  mimeType: string | null;

  @Column({ type: 'integer', default: 0 })
  size: number;

  @CreateDateColumn()
  createdAt: Date;
}



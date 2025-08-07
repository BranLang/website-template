import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsUrl } from 'class-validator';
import { PageType } from '../../../entities/page.entity';

export class CreatePageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsEnum(PageType)
  @IsOptional()
  type?: PageType;

  @IsUrl()
  @IsOptional()
  featuredImageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsOptional()
  sortOrder?: number;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;
}

import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsBoolean, IsUrl } from 'class-validator';
import { ProductMaterial } from '../../../entities/product.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  specifications?: string;

  @IsEnum(ProductMaterial)
  material: ProductMaterial;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsUrl()
  @IsOptional()
  mainImageUrl?: string;

  @IsNumber()
  categoryId: number;
}

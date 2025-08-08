import { IsString, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteDto {
  @ApiProperty({ description: 'Unique slug for the site' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Site name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Site description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Logo URL', required: false })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiProperty({ description: 'Favicon URL', required: false })
  @IsOptional()
  @IsString()
  faviconUrl?: string;

  @ApiProperty({ description: 'Domain', required: false })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiProperty({ description: 'Meta description', required: false })
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiProperty({ description: 'Meta keywords', required: false })
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiProperty({ description: 'Contact email', required: false })
  @IsOptional()
  @IsString()
  contactEmail?: string;

  @ApiProperty({ description: 'Contact phone', required: false })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ description: 'Contact address', required: false })
  @IsOptional()
  @IsString()
  contactAddress?: string;

  @ApiProperty({ description: 'Site theme', required: false, default: 'classic' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiProperty({ description: 'Site settings', required: false })
  @IsOptional()
  @IsObject()
  settings?: any;
}

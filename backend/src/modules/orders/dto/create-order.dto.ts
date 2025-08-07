import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsNumber } from 'class-validator';
import { OrderType } from '../../../entities/order.entity';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsEmail()
  customerEmail: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(OrderType)
  @IsOptional()
  type?: OrderType;

  @IsOptional()
  productDetails?: any;

  @IsNumber()
  @IsOptional()
  estimatedPrice?: number;
}

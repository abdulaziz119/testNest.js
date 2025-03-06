import { IsNotEmpty, IsDefined, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsOptional()
  image?: string;

  @IsNumber()
  categoryId: number;
}

export class UpdateProductDto {
  @IsDefined()
  id: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  image?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

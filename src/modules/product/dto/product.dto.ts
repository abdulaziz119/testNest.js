import { IsNotEmpty, IsDefined, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  stock: number;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  image?: string;
  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;
}

export class UpdateProductDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  id: number;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 2000 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ example: 12 })
  @IsOptional()
  @IsNumber()
  stock?: number;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}

import { IsNotEmpty, IsOptional, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  parentId?: number;
}

export class UpdateCategoryDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  id: number;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'test' })
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  parentId?: number;
}

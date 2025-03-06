import { IsNotEmpty, IsOptional, IsDefined } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  parentId?: number;
}

export class UpdateCategoryDto {
  @IsDefined()
  id: number;

  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  parentId?: number;
}

import { IsNumber, Min, IsDefined } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToBasketDto {
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateBasketDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  id: number;

  @ApiProperty({ example: 1 })
  @IsDefined()
  user_id: number;

  @ApiProperty({ example: 2000 })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class PaginationBasketParams {
  @ApiProperty({ example: 1 })
  @IsDefined()
  id: number;

  @ApiProperty({ example: 1 })
  @IsDefined()
  page: number;

  @ApiProperty({ example: 10, examples: [10, 20, 30, 40, 50] })
  @IsDefined()
  limit: number;
}

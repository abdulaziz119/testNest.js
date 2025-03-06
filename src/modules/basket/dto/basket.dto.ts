import { IsNumber, Min, IsDefined } from 'class-validator';

export class AddToBasketDto {
  userId: number;

  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class UpdateBasketDto {
  @IsDefined()
  id: number;

  @IsDefined()
  user_id: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class PaginationBasketParams {
  @IsDefined()
  id: number;
  @IsDefined()
  page: number;
  @IsDefined()
  limit: number;
}

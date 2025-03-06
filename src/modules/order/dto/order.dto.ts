import { OrderStatus } from '../../../entity/order.entity';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  userId: number;

  @IsNumber()
  @IsOptional()
  basketId?: number;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING;
}

export class OrderResponseDto {
  id: number;

  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };

  product: {
    id: number;
    name: string;
    price: number;
  };

  quantity: number;

  status: OrderStatus;
}

import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from './cart.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get(':userId')
  getCart(@Param('userId') userId: string) {
    return this.service.getCart(userId);
  }

  @Put(':userId')
  saveCart(@Param('userId') userId: string, @Body() cart: CartItem[]) {
    return this.service.saveCart(userId, cart);
  }

  @Delete(':userId')
  clearCart(@Param('userId') userId: string) {
    return this.service.clearCart(userId);
  }
}

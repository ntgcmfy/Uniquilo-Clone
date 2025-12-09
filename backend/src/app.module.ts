import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [ProductModule, UserModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

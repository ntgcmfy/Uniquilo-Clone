import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import type { Profile } from './profile.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly service: ProfileService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id/dashboard')
  getDashboard(@Param('id') id: string) {
    return this.service.getDashboard(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() profile: Profile) {
    return this.service.create(profile);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() profile: Partial<Profile>) {
    return this.service.update(id, profile);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Put(':id/wishlist')
  updateWishlist(@Param('id') id: string, @Body() body: { wishlist: any[] }) {
    return this.service.updateWishlist(id, body.wishlist);
  }

  @Put(':id/addresses')
  updateAddresses(@Param('id') id: string, @Body() body: { addresses: any[] }) {
    return this.service.updateAddresses(id, body.addresses);
  }

  @Put(':id/payment-methods')
  updatePaymentMethods(@Param('id') id: string, @Body() body: { paymentMethods: any[] }) {
    return this.service.updatePaymentMethods(id, body.paymentMethods);
  }

  @Put(':id/notifications')
  updateNotifications(@Param('id') id: string, @Body() body: { notifications: any[] }) {
    return this.service.updateNotifications(id, body.notifications);
  }
}
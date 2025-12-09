import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { Patch } from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() body: { email: string; password: string; name: string }) {
    return await this.userService.register(body.email, body.password, body.name);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.userService.login(body.email, body.password);
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh_token: string }) {
    return await this.userService.refreshToken(body.refresh_token);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return await this.userService.getProfile(id);
  }

  @Patch(':id/role')
//   @UseGuards(AuthGuard, AdminGuard) // Chỉ admin mới được đổi quyền
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return await this.userService.updateRole(id, role);
  }
}
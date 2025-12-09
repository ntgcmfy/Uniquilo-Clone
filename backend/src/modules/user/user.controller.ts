import { Controller, Post, Body, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    return await this.userService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return await this.userService.login(dto.email, dto.password);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refresh_token: string) {
    return await this.userService.refreshToken(refresh_token);
  }

  @Get(':id')
  async getProfile(@Param('id') id: string) {
    return await this.userService.getProfile(id);
  }

  @Patch(':id/role')
  @UseGuards(AuthGuard, AdminGuard)
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return await this.userService.updateRole(id, role);
  }

}
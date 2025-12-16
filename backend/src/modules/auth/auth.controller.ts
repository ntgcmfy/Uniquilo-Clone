import { Controller, Post, Body, Headers, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto, SignupDto } from './auth.dto';
import { AuthGuard } from '../../common/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Post('signup')
  signup(@Body() dto: SignupDto) {
    return this.service.signup(dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  logout(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.service.logout(token);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@Headers('authorization') auth: string) {
    const token = auth?.replace('Bearer ', '');
    return this.service.getUser(token);
  }
}

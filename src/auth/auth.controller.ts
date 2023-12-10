import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signIn.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Request() req, @Body() signInDto: SignInDto) {
    const publicIp =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return this.authService.signIn(
      signInDto.email,
      signInDto.password,
      publicIp,
    );
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  async getMe(@Request() req) {
    return req['user'];
  }
}

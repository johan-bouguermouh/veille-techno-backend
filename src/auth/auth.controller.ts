import {
  Body,
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Headers,
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
    return this.authService.signIn(req, signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  async getMe(@Request() req) {
    return req['user'];
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Request() req,
    @Headers('X-Refresh-Token') refreshToken: string,
  ) {
    return this.authService.useRefreshToken(refreshToken, req);
  }
}

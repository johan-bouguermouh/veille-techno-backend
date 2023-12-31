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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentification')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Login with email and password, return a JWT token and a refresh token',
  })
  async signIn(@Request() req, @Body() signInDto: SignInDto) {
    return this.authService.signIn(req, signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Payload of JWT token',
    description: 'Get payload of JWT token',
  })
  async getMe(@Request() req) {
    return req['user'];
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh JWT token',
    description:
      'Refresh JWT token with refresh token, use it in headers with key X-Refresh-Token name',
  })
  async refresh(
    @Request() req,
    @Headers('X-Refresh-Token') refreshToken: string,
  ) {
    return this.authService.useRefreshToken(refreshToken, req);
  }
}

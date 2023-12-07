import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async encrypt(text: string): Promise<string> {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(
      process.env.CRYPTO_KEY,
      'salt',
      32,
    )) as Buffer;

    const cipher = createCipheriv('aes-256-gcm', key, iv);

    const encrypted = Buffer.concat([
      cipher.update(text),
      cipher.final(),
    ]).toString('hex');

    return encrypted;
  }

  async decrypt(encrypted: string): Promise<string> {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(
      process.env.CRYPTO_KEY,
      'salt',
      32,
    )) as Buffer;
    const decipher = createCipheriv('aes-256-gcm', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encrypted, 'hex'),
      decipher.final(),
    ]).toString('utf8');

    return decrypted;
  }

  async signIn(email: string, pass: string, publicIp: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const hashPublicIp = await bcrypt.hash(publicIp, process.env.SALT_ROUNDS);
    await this.usersService.updateRefreshToken(user.id, hashPublicIp);

    const payload = { sub: user.id, username: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}

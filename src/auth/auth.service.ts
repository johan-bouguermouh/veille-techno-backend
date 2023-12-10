import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createCipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserResponseDto } from 'src/user/dto/create-user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * Encrypt the text with the crypto key
   * @param text
   * @returns {Promise<string>} encrypted text
   */
  async encrypt(text: string): Promise<string> {
    const iv = randomBytes(16);
    const key = (await promisify(scrypt)(
      process.env.CRYPTO_KEY,
      'salt',
      32,
    )) as Buffer;
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    return iv.toString('hex') + encrypted.toString('hex');
  }

  /**
   * Decrypt the encrypted text with the crypto key
   * @param encrypted
   * @returns {Promise<string>} decrypted text
   */
  async decrypt(encrypted: string): Promise<string> {
    const iv = Buffer.from(encrypted.slice(0, 32), 'hex');
    const encryptedData = encrypted.slice(32);
    const key = (await promisify(scrypt)(
      process.env.CRYPTO_KEY,
      'salt',
      32,
    )) as Buffer;
    const decipher = createCipheriv('aes-256-gcm', key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedData, 'hex'),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  }

  /**
   * Sign in the user with the email and password
   * @param req
   * @param email
   * @param pass
   * @returns {Promise<CreateUserResponseDto>}
   */
  async signIn(
    req: Request,
    email: string,
    pass: string,
  ): Promise<CreateUserResponseDto> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }
    const refreshToken = await this.generateRefreshToken(user.id, req);

    /** We do not re-execute a new request but directly create the token with the return */
    const payload = { sub: user.id, username: user.name };

    /** A instance of the user is created to return the token */
    const userResponse = new CreateUserResponseDto({
      id: user.id,
      email: user.email,
      name: user.name,
      refreshToken,
      token: await this.jwtService.signAsync(payload),
    });
    // userResponse.id = user.id;
    // userResponse.email = user.email;
    // userResponse.name = user.name;
    // userResponse.refreshToken = refreshToken;
    // userResponse.token = await this.jwtService.signAsync(payload);

    return userResponse;
  }
  /**
   * Validate the refresh token with the user session in the database
   * @param id
   * @param subDecrypted
   * @returns {Promise<boolean>} true if the refresh token is valid
   */
  async validateRefreshToken(
    id: string,
    subDecrypted: string,
  ): Promise<boolean> {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      return false;
    }

    const isMatch = await bcrypt.compare(subDecrypted, user.session);
    return isMatch;
  }

  /**
   * Generate a new access token
   * @param id
   * @returns {Promise<string>} access token
   */
  async generateAccessToken(id: number): Promise<string> {
    const user = await this.usersService.findOne(id);
    const payload = { sub: user.id, username: user.name };
    return await this.jwtService.signAsync(payload);
  }

  /**
   * Use the refresh token to generate a new access token
   * @param refreshToken
   * @param req
   * @returns {Promise<string>} access token
   */
  async useRefreshToken(refreshToken: string, req: any): Promise<string> {
    const { sub } = await this.jwtService.verifyAsync(refreshToken);
    const userAgentReq = req.headers['user-agent'] || '';
    const ipReq =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const subDecrypted = await this.decrypt(sub);
    //on met le sub au format json pour pouvoir le comparer avec le publicIp
    const { id, userAgent, ip } = JSON.parse(subDecrypted);
    if (userAgentReq !== userAgent || ipReq !== ip) {
      throw new UnauthorizedException({ message: 'Invalid refresh token' });
    }

    const isRefreshTokenValid = await this.validateRefreshToken(
      id,
      subDecrypted,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException({ message: 'Invalid refresh token' });
    }

    const user = await this.usersService.findOne(id);
    const payload = { sub: user.id, username: user.name };
    return await this.jwtService.signAsync(payload);
  }

  /**
   * Generate a refresh token for the user
   * @param id
   * @param req
   * @returns {Promise<string>} refresh token
   */
  async generateRefreshToken(id: number, req: Request): Promise<string> {
    const sub = await this.encrypt(this.generateUserSession(id, req));
    const payload = { sub };
    return await this.jwtService.signAsync(payload, { expiresIn: '30d' });
  }

  /**
   * Generate a user session for compare with the refresh token
   * @param id
   * @param req
   * @returns {string} user session in json format
   */
  generateUserSession(id: number, req: any): string {
    const userAgent = req.headers['user-agent'] || '';
    const publicIp =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    return JSON.stringify({ id, userAgent, ip: publicIp });
  }
}

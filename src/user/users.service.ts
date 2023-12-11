import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { CreateUserDto } from './dto/createUser.dto';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { AuthService } from './../auth/auth.service';
import { Session } from 'inspector';
import e from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(
    req: Request,
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const newUser = new User();
    newUser.email = createUserDto.email;
    newUser.password = createUserDto.password;
    newUser.name = createUserDto.name;

    const result = await this.usersRepository.save(newUser);

    /** User is created, we can generate the token */
    const response = new CreateUserResponseDto();
    response.id = result.id;
    response.email = result.email;
    response.name = result.name;
    response.token = await this.authService.generateAccessToken(result.id);
    response.refreshToken = await this.authService.generateRefreshToken(
      result.id,
      req,
    );

    /** A session save in the database */
    const newSession = this.authService.generateUserSession(result.id, req);
    this.updateRefreshToken(result.id, newSession);

    return response;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async updateRefreshToken(
    id: number,
    session: User['session'],
  ): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) {
      user.session = session;
      await this.usersRepository.save(user);
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async logout(id: number): Promise<void> {
    await this.usersRepository.update(id, { session: null });
  }
}

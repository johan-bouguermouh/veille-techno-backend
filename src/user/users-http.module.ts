import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UsersModule, forwardRef(() => AuthModule)],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UserHttpModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { User } from './user/users.entity';
import { UserHttpModule } from './user/users-http.module';
import { UsersModule } from './user/users.module';
import { WorkspacesHttpModule } from './workspace/workspaces-http.module';
import { AuthModule } from './auth/auth.module';
import { RolesService } from './roles/roles.service';
import { RolesModule } from './roles/roles.module';
import { ColumnModule } from './column/column.module';
import { ColumnHttpModule } from './column/column-http.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserHttpModule,
    WorkspacesHttpModule,
    AuthModule,
    RolesModule,
    ColumnHttpModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesService],
})
export class AppModule {}
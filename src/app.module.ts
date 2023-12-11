import {
  Module,
  NestModule,
  RequestMethod,
  MiddlewareConsumer,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { UserHttpModule } from './user/users-http.module';
import { WorkspacesHttpModule } from './workspace/workspaces-http.module';
import { AuthModule } from './auth/auth.module';
import { RolesService } from './roles/roles.service';
import { RolesModule } from './roles/roles.module';
import { ColumnHttpModule } from './column/column-http.module';
import { TaskModule } from './task/task.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundInterceptor } from './errors/not-found.interceptor';
import { typeOrmConfig } from './typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(typeOrmConfig),
    UserHttpModule,
    WorkspacesHttpModule,
    AuthModule,
    RolesModule,
    ColumnHttpModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    RolesService,
    { provide: APP_INTERCEPTOR, useClass: NotFoundInterceptor },
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

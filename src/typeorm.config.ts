import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/users.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
  migrations: ['dist/migrations/*{.ts,.js}'],
};

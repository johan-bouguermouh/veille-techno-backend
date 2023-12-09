import { Module, forwardRef } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { ColumnModule } from 'src/column/column.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), forwardRef(() => ColumnModule)],
  exports: [TypeOrmModule.forFeature([Task]), TaskService],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}

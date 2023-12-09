import { Module } from '@nestjs/common';
import { ColumnModule } from './column.module';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { WorkspacesModule } from 'src/workspace/workspaces.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [ColumnModule, WorkspacesModule, TaskModule],
  providers: [ColumnService],
  controllers: [ColumnController],
})
export class ColumnHttpModule {}

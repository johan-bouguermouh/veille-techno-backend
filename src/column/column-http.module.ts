import { Module } from '@nestjs/common';
import { ColumnModule } from './column.module';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { WorkspacesService } from 'src/workspace/workspaces.service';
import { WorkspacesModule } from 'src/workspace/workspaces.module';

@Module({
  imports: [ColumnModule, WorkspacesModule],
  providers: [ColumnService],
  controllers: [ColumnController],
})
export class ColumnHttpModule {}

import { Module, forwardRef } from '@nestjs/common';
import { WorkspacesModule } from './workspaces.module';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { ColumnService } from 'src/column/column.service';
import { ColumnModule } from 'src/column/column.module';

@Module({
  imports: [WorkspacesModule, forwardRef(() => ColumnModule)],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesHttpModule {}

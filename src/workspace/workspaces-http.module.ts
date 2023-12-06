import { Module } from '@nestjs/common';
import { WorkspacesModule } from './workspaces.module';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';

@Module({
  imports: [WorkspacesModule],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesHttpModule {}

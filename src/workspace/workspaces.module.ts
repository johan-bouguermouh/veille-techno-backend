import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { Workspace } from './workspaces.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Workspace])],
  exports: [TypeOrmModule.forFeature([Workspace]), WorkspacesService],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}

import { Module, Global, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';
import { Workspace } from './workspaces.entity';
import { ColumnModule } from 'src/column/column.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Workspace]),
    forwardRef(() => ColumnModule),
  ],
  exports: [TypeOrmModule.forFeature([Workspace]), WorkspacesService],
  providers: [WorkspacesService],
  controllers: [WorkspacesController],
})
export class WorkspacesModule {}

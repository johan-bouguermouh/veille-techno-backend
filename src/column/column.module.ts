import { Module } from '@nestjs/common';
import { ColumnService } from './column.service';
import { ColumnController } from './column.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColumnList } from './entities/columns.entity';
import { WorkspacesModule } from 'src/workspace/workspaces.module';

@Module({
  imports: [TypeOrmModule.forFeature([ColumnList]), WorkspacesModule],
  exports: [TypeOrmModule.forFeature([ColumnList]), ColumnService],
  controllers: [ColumnController],
  providers: [ColumnService],
})
export class ColumnModule {}

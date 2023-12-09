import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnList } from './entities/columns.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { WorkspacesService } from '../workspace/workspaces.service';
import { TaskService } from './../task/task.service';
import { GetInfoColumnDto } from './dto/get-info-column.dto';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnList)
    private columnsRepository: Repository<ColumnList>,
    private workspacesService: WorkspacesService,
    @Inject(forwardRef(() => TaskService))
    private taskService: TaskService,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<GetInfoColumnDto[]> {
    const { workspaceId, name, order } = createColumnDto;
    const column = new ColumnList();

    /**
     * Si order est défini
     * on récupère toutes les columns appartenant au workspace
     * et dont l'order est supérieur à celui de la nouvelle colonne
     * alors on les décale d'un cran
     */
    if (order !== undefined && order >= 0) {
      const columns = await this.columnsRepository.find({
        where: {
          workspace: {
            id: workspaceId,
          },
          order: MoreThanOrEqual(order),
        },
      });
      columns.forEach((column) => {
        column.order += 1;
        this.columnsRepository.save(column);
      });
    }

    column.name = name;
    column.order =
      typeof order == 'undefined'
        ? await this.columnsRepository.count()
        : order;
    column.workspace = { id: workspaceId } as any;

    await this.columnsRepository.save(column);

    const result = await this.findAllByWorkSpace(workspaceId);
    return result;
  }

  async findAllByWorkSpace(workspaceId: number): Promise<GetInfoColumnDto[]> {
    const targetedColumns = await this.columnsRepository.find({
      where: {
        workspace: {
          id: workspaceId,
        },
      },
      order: {
        order: 'ASC',
      },
    });
    if (targetedColumns.length === 0) {
      throw new Error('Workspace not found');
    }

    const result = await Promise.all(
      targetedColumns.map(async (column): Promise<GetInfoColumnDto> => {
        const tasks = await this.taskService.findAllByColumn(column.id);
        return { ...column, tasks };
      }),
    );

    return result;
  }

  async findOne(id: number): Promise<GetInfoColumnDto> {
    const targetColumn = await this.columnsRepository.findOne({
      where: { id },
    });
    if (!targetColumn) {
      throw new Error('Column not found');
    }

    const result = await this.taskService.findAllByColumn(targetColumn.id);
    return { ...targetColumn, tasks: result };
  }

  async update(
    id: number,
    updateColumnDto: UpdateColumnDto,
  ): Promise<ColumnList> {
    await this.columnsRepository.update({ id }, updateColumnDto);
    return this.columnsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.columnsRepository.delete({ id });
  }
}

import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
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
    @Inject(forwardRef(() => WorkspacesService))
    private workspacesService: WorkspacesService,
    @Inject(forwardRef(() => TaskService))
    private taskService: TaskService,
  ) {}

  /**
   * Create a column
   * If order is defined, all columns with an order greater than or equal to the new column are shifted by one,
   * if order is not defined, the new column is placed at the end of the list
   * @param createColumnDto
   * @returns {Promise<GetInfoColumnDto[]>} Array of columns with their tasks of first level
   */
  async create(createColumnDto: CreateColumnDto): Promise<GetInfoColumnDto[]> {
    const workspaceExist = await this.workspacesService.doesWorkspaceExist(
      createColumnDto.workspaceId,
    );
    if (!workspaceExist) {
      throw new NotFoundException(
        'Workspace not found, you cannot create a column in a non-existing workspace',
      );
    }
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

  /**
   * Get all columns of a workspace, ordered by order.
   * Takes the workspace id as a parameter and returns an array of columns with their tasks of first level.
   * @param {number} workspaceId
   * @returns {Promise<GetInfoColumnDto[]>} Array of columns with their tasks of first level
   */
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

    const result = await Promise.all(
      targetedColumns.map(async (column): Promise<GetInfoColumnDto> => {
        const tasks = await this.taskService.findAllByColumn(column.id);
        return { ...column, tasks };
      }),
    );

    return result;
  }

  /**
   * Get a column by its id and return it with its tasks of first level.
   * @param {number} id
   * @returns {Promise<GetInfoColumnDto>} A column with its tasks of first level
   */
  async findOne(id: number): Promise<GetInfoColumnDto> {
    const targetColumn = await this.columnsRepository.findOne({
      where: { id },
    });
    if (!targetColumn) {
      throw new NotFoundException('Column not found');
    }

    const result = await this.taskService.findAllByColumn(targetColumn.id);
    return { ...targetColumn, tasks: result };
  }

  /**
   * Update a column
   * @param {number} id Column id
   * @param {UpdateColumnDto} updateColumnDto Column data to update
   * @returns {Promise<ColumnList>} The updated column
   */
  async update(
    id: number,
    updateColumnDto: UpdateColumnDto,
  ): Promise<ColumnList> {
    await this.columnsRepository.update({ id }, updateColumnDto);
    return this.columnsRepository.findOneBy({ id });
  }

  /**
   * Delete a column
   * Be careful, this action is irreversible !
   * Cascade delete on all column's tasks
   * @param {number} id Column id
   * @returns {Promise<void>}
   */
  async remove(id: number): Promise<void> {
    await this.columnsRepository.delete({ id });
  }
}

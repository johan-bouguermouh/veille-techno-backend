import { Injectable } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColumnList } from './entities/columns.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { WorkspacesService } from '../workspace/workspaces.service';

@Injectable()
export class ColumnService {
  constructor(
    @InjectRepository(ColumnList)
    private columnsRepository: Repository<ColumnList>,
    private workspacesService: WorkspacesService,
  ) {}

  async create(createColumnDto: CreateColumnDto): Promise<ColumnList[]> {
    const { workspaceId, name, order } = createColumnDto;
    const column = new ColumnList();

    //Si order et défini on récupère toutes les columns appartenant au workspace et dont l'order est supérieur à celui de la nouvelle colonne et on les décale d'un cran
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

  async findAllByWorkSpace(workspaceId: number): Promise<ColumnList[]> {
    return this.columnsRepository.find({
      where: {
        workspace: {
          id: workspaceId,
        },
      },
      order: {
        order: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<ColumnList | null> {
    return this.columnsRepository.findOneBy({ id });
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

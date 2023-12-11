import {
  Injectable,
  Inject,
  forwardRef,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from './workspaces.entity';
import { ColumnService } from 'src/column/column.service';
import { GetInfoWorkspaceDto } from './dto/get-info-workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspace)
    private workspacesRepository: Repository<Workspace>,
    @Inject(forwardRef(() => ColumnService))
    private columnsService: ColumnService,
  ) {}

  findAll(userId: number): Promise<Workspace[]> {
    return this.workspacesRepository.find({
      where: { user: { id: userId } },
      relations: ['columns'],
    });
  }

  async findOne(workspaceId: number, userId): Promise<GetInfoWorkspaceDto> {
    const workspace = (await this.workspacesRepository.findOne({
      where: { id: workspaceId },
      relations: ['user'],
    })) as any;
    if (workspace.user.id !== userId) {
      throw new UnauthorizedException(
        'You are not allowed to access this workspace',
      );
    }
    const columnsDetails =
      await this.columnsService.findAllByWorkSpace(workspaceId);
    workspace.columns = columnsDetails;
    return workspace;
  }

  async create(workspace: Workspace): Promise<Workspace> {
    return this.workspacesRepository.save(workspace);
  }

  async remove(id: number): Promise<void> {
    await this.workspacesRepository.delete(id);
  }

  async doesWorkspaceExist(id: number): Promise<boolean> {
    const workspace = await this.workspacesRepository.findOneBy({ id });
    return !!workspace;
  }
}

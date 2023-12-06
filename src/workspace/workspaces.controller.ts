import { Controller } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './workspaces.entity';

@Controller('workspace')
export class WorkspacesController {
  constructor(private readonly workspaceService: WorkspacesService) {}

  async create(workspace: Workspace): Promise<Workspace> {
    return this.workspaceService.create(workspace);
  }
}

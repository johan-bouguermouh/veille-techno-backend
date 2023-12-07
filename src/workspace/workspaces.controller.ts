import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './workspaces.entity';
import { CreateWorkSpaceDto } from './dto/createWorkspace.dto';
import { UserAuth } from 'src/auth/auth.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('workspace')
export class WorkspacesController {
  constructor(private readonly workspaceService: WorkspacesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  async create(
    @UserAuth() user,
    @Body() CreateWorkSpaceDto: CreateWorkSpaceDto,
  ): Promise<Workspace> {
    const workspace = new Workspace();
    workspace.name = CreateWorkSpaceDto.name;
    workspace.user = user.sub;
    return this.workspaceService.create(workspace);
  }
}

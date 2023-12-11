import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { Workspace } from './workspaces.entity';
import { CreateWorkSpaceDto } from './dto/createWorkspace.dto';
import { UserAuth } from 'src/auth/auth.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetInfoWorkspaceDto } from './dto/get-info-workspace.dto';

@ApiTags('Workspace')
@Controller('workspace')
export class WorkspacesController {
  constructor(private readonly workspaceService: WorkspacesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a workspace',
    description: 'Create a workspace and return it.',
  })
  async create(
    @UserAuth() user,
    @Body() CreateWorkSpaceDto: CreateWorkSpaceDto,
  ): Promise<Workspace> {
    const workspace = new Workspace();
    workspace.name = CreateWorkSpaceDto.name;
    workspace.user = user.sub;
    return this.workspaceService.create(workspace);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get all workspaces',
    description:
      'Get all workspaces of a user, this workspace get first level columns.',
  })
  async findAll(@UserAuth() user): Promise<Workspace[]> {
    return this.workspaceService.findAll(user.sub);
  }

  @Get(':workspaceId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: 'Get a workspace',
    description:
      'Get a workspace by its id and return it with its first level columns and tasks.',
  })
  async findOne(
    @UserAuth() user,
    @Param('workspaceId') workspaceId: string,
  ): Promise<GetInfoWorkspaceDto> {
    return this.workspaceService.findOne(+workspaceId, user.sub);
  }
}

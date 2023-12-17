import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserAuth } from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Task')
@Controller('task')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT-auth')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a task',
    description:
      'Create a task and return it. The user must be authenticated. We would like to return the most detailed information related to this new task. When creating a new task, the client can choose to link it to parentId, which defines a Parent Task for the new task. Or add it to a column. If a parent task is defined in el Body, it will take precedence over columnId.',
  })
  create(@UserAuth() user, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(user, createTaskDto);
  }

  @Get('/column/:columnId')
  @ApiOperation({
    summary: 'Get all tasks of a column',
    description:
      'Get all tasks of a column, ordered by order. Takes the column id as a parameter and returns an array of tasks. Tasks is detailed in the GetInfoTaskDto.',
  })
  findAll(@Param('columnId') columnId: string) {
    return this.taskService.findAllByColumn(+columnId);
  }

  @Get(':taskId')
  @ApiOperation({
    summary: 'Get a task',
    description:
      'Get a task by its id and return it. The task is detailed in the GetInfoTaskDto in the first level.',
  })
  findOne(@Param('taskId') taskId: string) {
    return this.taskService.findOne(+taskId);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a task',
    description:
      'Update a task by its id and return it. The task is detailed in the GetInfoTaskDto in the first level.',
  })
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a task',
    description:
      'Delete a task by its id and return it. Becareful, if the task has children, they will be deleted too.',
  })
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}

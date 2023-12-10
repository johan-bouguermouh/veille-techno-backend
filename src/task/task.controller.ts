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
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create a task',
    description:
      'Create a task and return it. The user must be authenticated. We would like to return the most detailed information related to this new task. When creating a new task, the client can choose to link it to parentId, which defines a Parent Task for the new task. Or add it to a column. If a parent task is defined in el Body, it will take precedence over columnId.',
  })
  create(@UserAuth() user, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(user, createTaskDto);
  }

  @Get('/column/:columnId')
  findAll(@Param('columnId') columnId: string) {
    return this.taskService.findAllByColumn(+columnId);
  }

  @Get(':taskId')
  findOne(@Param('taskId') taskId: string) {
    return this.taskService.findOne(+taskId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}

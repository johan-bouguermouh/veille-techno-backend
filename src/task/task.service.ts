import { Injectable, Post, Response } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { ColumnService } from 'src/column/column.service';
import { UserAuth } from 'src/auth/auth.decorator';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private columnsService: ColumnService,
  ) {}

  async create(token: any, createTaskDto: CreateTaskDto) {
    const { title, description, order, columnId, parentTaskId } = createTaskDto;
    const task = new Task();
    let tasks: Task[] = [];
    let orderedBy: string = '';
    if (parentTaskId !== undefined) {
      orderedBy = 'parentTaskId';
      if (order !== undefined && order >= 0) {
        tasks = await this.tasksRepository.find({
          where: {
            parent: {
              id: parentTaskId,
            },
            order: MoreThanOrEqual(order),
          },
        });

        task.order = order;
      } else {
        task.order = await this.tasksRepository.count({
          where: {
            parent: {
              id: parentTaskId,
            },
          },
        });
      }
    } else if (columnId !== undefined) {
      orderedBy = 'columnId';
      if (order !== undefined && order >= 0) {
        tasks = (await this.tasksRepository.find({
          where: {
            column: {
              id: columnId,
            },
            order: MoreThanOrEqual(order),
          },
        })) as Task[];
        task.order = order;
      } else {
        task.order = await this.tasksRepository.count({
          where: {
            column: {
              id: columnId,
            },
          },
        });
      }
    } else {
      throw new Error('columnId or parentTaskId must be defined');
    }

    orderedBy =
      orderedBy === 'columnId'
        ? (task.column = { id: columnId } as any)
        : (task.parent = { id: parentTaskId } as any);

    if (tasks.length > 0) {
      tasks.forEach((task: Task) => {
        task.order += 1;
        this.tasksRepository.save(task);
      });
    }
    task.title = title;
    task.description = description;
    task.author = { id: token.sub } as any;

    const targetColumn = await this.columnsService.findOne(columnId);
    if (!targetColumn) {
      //on créer un retour de réponse approprié pour l'utilisateur
      return {
        message: 'Column not found',
        status: 404,
      };
    }

    console.log('task =>', task);
    console.log('user =>', token.sub);
    return this.tasksRepository.save(task);
  }

  findAll() {
    return `This action returns all task`;
  }

  findAllByColumn(columnId: number) {
    return this.tasksRepository.find({
      where: {
        column: {
          id: columnId,
        },
      },
      order: {
        order: 'ASC',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}

import {
  Injectable,
  Post,
  Inject,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository, MoreThanOrEqual, IsNull } from 'typeorm';
import { ColumnService } from 'src/column/column.service';
import { UserAuth } from 'src/auth/auth.decorator';
import { GetInfoTaskDto } from './dto/get-info-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @Inject(forwardRef(() => ColumnService))
    private columnsService: ColumnService,
  ) {}

  async create(token: any, createTaskDto: CreateTaskDto): Promise<Task> {
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
      throw new BadRequestException('columnId or parentTaskId must be defined');
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
      throw new NotFoundException('Column not found');
    }

    console.log('task =>', task);
    console.log('user =>', token.sub);
    return this.tasksRepository.save(task);
  }

  findAll() {
    return `This action returns all task`;
  }

  async findAllByColumn(columnId: number): Promise<GetInfoTaskDto[]> {
    const targetedTasks = await this.tasksRepository.find({
      where: {
        column: {
          id: columnId,
        },
      },
      relations: ['author'],
      order: {
        order: 'ASC',
      },
    });

    if (!targetedTasks) {
      throw new NotFoundException('Tasks not found');
    }
    const result = await Promise.all(
      targetedTasks.map(async (task: Task) => {
        return new GetInfoTaskDto(
          task,
          await this.countChildren(task),
          await this.countOpenChildren(task),
        );
      }),
    );
    return result;
  }

  async findOne(taskId: number): Promise<GetInfoTaskDto> {
    const targetedTask = await this.tasksRepository.findOne({
      where: { id: taskId },
      relations: ['author'],
    });
    if (!targetedTask) {
      throw new NotFoundException('Task not found');
    }
    return new GetInfoTaskDto(
      targetedTask,
      await this.countChildren(targetedTask),
      await this.countOpenChildren(targetedTask),
    );
  }

  /**
   * Permets de compter le nombre d'enfants d'une tâche
   * @param task Tâche cible sur laquelle on souhaite compter les enfants
   * @returns {Promise<number>}
   */
  async countChildren(task: Task): Promise<number> {
    return await this.tasksRepository.count({ where: { parent: task } });
  }

  /**
   * Compte le nombre d'enfants ouverts d'une tâche
   * @param task Tâche cible sur laquelle on souhaite compter les enfants ouverts
   * @returns {Promise<number>}
   */
  async countOpenChildren(task: Task): Promise<number> {
    return await this.tasksRepository.count({
      where: { parent: task, completedAt: IsNull() },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}

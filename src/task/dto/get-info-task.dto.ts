import { User } from 'src/user/users.entity';
import { Task } from '../entities/task.entity';
import { ApiProperty } from '@nestjs/swagger';

export class GetInfoTaskDto {
  @ApiProperty({
    description: 'The id of the task',
    type: Number,
    example: 1,
    required: true,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the task',
    type: String,
    example: 'My task',
    required: true,
    minLength: 3,
    maxLength: 50,
  })
  title: string;

  @ApiProperty({
    description: 'The description of the task',
    type: String,
    example: 'My task description',
    required: false,
  })
  description: string;

  @ApiProperty({
    description: 'The author of the task',
    type: Object,
    example: {
      userId: 1,
      userName: 'John Doe',
    },
    required: true,
  })
  author: {
    userId: number;
    userName: string;
  };

  @ApiProperty({
    description: 'The order of the task',
    type: Number,
    example: 1,
    required: true,
  })
  order: number;

  @ApiProperty({
    description: 'The creation date of the task',
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the task',
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
    required: true,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The completion date of the task',
    type: Date,
    example: '2021-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  completedAt: Date;

  @ApiProperty({
    description: 'The column of the task',
    type: Number,
    example: 1,
    required: false,
    nullable: true,
  })
  column: number;

  @ApiProperty({
    description: 'The parent of the task',
    type: Number,
    example: 1,
    required: false,
    nullable: true,
  })
  parent: number;

  @ApiProperty({
    description: 'The number of children of the task',
    type: Number,
    example: 1,
    required: true,
  })
  childrenCount: number;

  @ApiProperty({
    description: 'The number of open children of the task',
    type: Number,
    example: 1,
    required: true,
  })
  openChildrenCount: number;

  constructor(task: Task, childrenCount: number, openChildrenCount: number) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.author = {
      userId: task.author.id,
      userName: task.author.name,
    };
    order: task.order;
    createdAt: task.createdAt;
    updatedAt: task.updatedAt;
    completedAt: task.completedAt;
    column: task.column;
    parent: task.parent;
    // assigner les autres champs de Task...

    this.childrenCount = childrenCount;
    this.openChildrenCount = openChildrenCount;
  }
}

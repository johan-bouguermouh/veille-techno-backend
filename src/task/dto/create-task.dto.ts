//define the data transfer object for creating a task

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

// défini documentation swagger
export class CreateTaskDto {
  @ApiProperty({
    description: 'Title of the task',
    type: String,
    required: true,
    example: 'Do the dishes',
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the task',
    type: String,
    required: true,
    example: 'Do the dishes before 10pm',
  })
  description: string;

  @IsOptional()
  @ApiProperty({
    description: 'Order of the task',
    type: Number,
    required: false,
    example: 0,
  })
  order: number;

  @IsOptional({
    groups: ['Column'],
    message: 'If columnId is defined, parentTaskId must be undefined',
  })
  @ApiProperty({
    description:
      'Column id of the task, If columnId is defined, parentTaskId must be undefined',
    type: Number,
    required: false,
    example: 1,
  })
  columnId: number | undefined;

  @IsOptional({
    groups: ['Task'],
    message: 'If parentTaskId is defined, columnId must be undefined',
  })
  @ApiProperty({
    description:
      'Parent task id of the task, If parentTaskId is defined, columnId must be undefined',
    type: Number,
    required: false,
    example: 1,
  })
  parentTaskId: number | undefined;
}

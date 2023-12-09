import { User } from 'src/user/users.entity';
import { Task } from '../entities/task.entity';

export class GetInfoTaskDto {
  id: number;
  title: string;
  description: string;
  author: {
    userId: number;
    userName: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date;
  column: number;
  parent: number;
  childrenCount: number;
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

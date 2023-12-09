import { Task } from 'src/task/entities/task.entity';
import { Workspace } from 'src/workspace/workspaces.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class ColumnList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  order: number;

  @OneToMany((Type) => Task, (task) => task.column)
  tasks: Task[];

  @ManyToOne((Type) => Workspace, (workspace) => workspace.columns)
  workspace: Workspace;
}

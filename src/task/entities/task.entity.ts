import { ColumnList } from 'src/column/entities/columns.entity';
import { User } from 'src/user/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column()
  order: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @ManyToOne((Type) => ColumnList, (column) => column.tasks)
  column: ColumnList;

  @ManyToOne((Type) => Task, (task) => task.children)
  parent: Task;

  @OneToMany((Type) => Task, (task) => task.parent)
  children: Task[];

  @ManyToOne((Type) => User, (user) => user.tasks)
  author: User;
}

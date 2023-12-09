import { Role } from 'src/roles/roles.entity';
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
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  session: string;

  @OneToMany((Type) => Workspace, (workspace) => workspace.user)
  workspaces: Workspace[];

  @ManyToOne((Type) => Role, (role) => role.users)
  role: Role;

  @OneToMany((Type) => Task, (task) => task.author)
  tasks: Task[];
}

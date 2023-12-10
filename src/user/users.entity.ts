import { Exclude } from 'class-transformer';
import { Role } from 'src/roles/roles.entity';
import { Task } from 'src/task/entities/task.entity';
import { Workspace } from 'src/workspace/workspaces.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { MaxLength, MinLength } from 'class-validator';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, name: 'email' })
  email: string;

  @Column()
  @Exclude()
  @MaxLength(59)
  @MinLength(12)
  password: string;

  @Column({ nullable: true })
  @Exclude()
  session: string;

  @OneToMany((Type) => Workspace, (workspace) => workspace.user)
  workspaces: Workspace[];

  @ManyToOne((Type) => Role, (role) => role.users)
  role: Role;

  @OneToMany((Type) => Task, (task) => task.author)
  tasks: Task[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && this.password.length < 60) {
      // bcrypt hashes are 60 characters long
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashSession() {
    // If the session is not hashed do not prefix it with $2 to avoid double hashing
    if (this.session && !this.session.startsWith('$2')) {
      this.session = await bcrypt.hash(this.session, 10);
    }
  }
}

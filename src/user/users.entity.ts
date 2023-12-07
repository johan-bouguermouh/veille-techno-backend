import { Workspace } from 'src/workspace/workspaces.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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
}

import { MaxLength, MinLength } from 'class-validator';
import { ColumnList } from 'src/column/entities/columns.entity';
import { User } from 'src/user/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @ManyToOne((Type) => User, (user) => user.workspaces, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne((Type) => ColumnList, (column) => column.workspace, {
    onDelete: 'CASCADE',
  })
  columns: ColumnList[];
}

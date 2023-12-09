import { GetInfoTaskDto } from 'src/task/dto/get-info-task.dto';
import { Workspace } from 'src/workspace/workspaces.entity';

export class GetInfoColumnDto {
  id: number;
  name: string;
  order: number;
  workspace: Workspace;
  tasks: GetInfoTaskDto[];
}

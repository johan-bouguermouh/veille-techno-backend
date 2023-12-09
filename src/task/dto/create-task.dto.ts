export class CreateTaskDto {
  title: string;
  description: string;
  order: number;
  columnId: number | undefined;
  parentTaskId: number | undefined;
}

import { ApiProperty } from '@nestjs/swagger';
import { GetInfoColumnDto } from 'src/column/dto/get-info-column.dto';
import { User } from 'src/user/users.entity';

export class GetInfoWorkspaceDto {
  constructor(partial?: Partial<GetInfoWorkspaceDto>) {
    Object.assign(this, partial);
  }
  @ApiProperty({
    description: 'Id of the workspace',
    type: Number,
    required: true,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name of the workspace',
    type: String,
    required: true,
    example: 'My workspace',
    minimum: 3,
    maximum: 50,
  })
  name: string;

  @ApiProperty({
    description: 'The author of the workspace',
    type: Object,
    example: {
      userId: 1,
      userName: 'John Doe',
    },
    required: true,
  })
  user: Partial<User>;

  @ApiProperty({
    description: 'Columns of the workspace',
    type: [GetInfoColumnDto],
    required: true,
  })
  columns: GetInfoColumnDto[];
}

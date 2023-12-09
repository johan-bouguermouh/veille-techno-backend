import {
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateColumnDto {
  @ApiProperty({
    description: 'Workspace id',
    type: Number,
    required: true,
    example: 1,
  })
  workspaceId: number;
  @ApiProperty({
    description: 'Name of the column',
    type: String,
    required: true,
    example: 'To do',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Order of the column',
    type: Number,
    required: false,
    example: 1,
  })
  order?: number | undefined;
}

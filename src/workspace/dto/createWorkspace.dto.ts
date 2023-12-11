import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkSpaceDto {
  @ApiProperty({
    description: 'The name of the workspace',
    type: String,
    example: 'My workspace',
    required: true,
    minLength: 3,
    maxLength: 50,
  })
  name: string;
}

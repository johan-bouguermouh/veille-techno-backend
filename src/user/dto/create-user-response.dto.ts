import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './createUser.dto';

export class CreateUserResponseDto {
  constructor(partial?: Partial<CreateUserResponseDto>) {
    Object.assign(this, partial);
  }

  @ApiProperty({
    description: 'Id of the user',
    type: Number,
    required: true,
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Email of the user',
    type: String,
    required: true,
    example: 'jhon.doe@mail.fr',
    pattern: '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
    uniqueItems: true,
  })
  email: string;

  @ApiProperty({
    description: 'Name of the user',
    type: String,
    required: true,
    example: 'Jhon Doe',
    minimum: 3,
    maximum: 64,
  })
  name: string;

  @ApiProperty({
    description: 'Authentication token of the user',
    type: String,
    required: true,
    pattern: 'Bearer ^[a-zA-Z0-9-_=]+.[a-zA-Z0-9-_=]+.[a-zA-Z0-9-_.+/=]*$',
  })
  token: string;

  @ApiProperty({
    description: 'Refresh token of the user',
    type: String,
    required: true,
    pattern: '^[a-zA-Z0-9-_=]+.[a-zA-Z0-9-_=]+.[a-zA-Z0-9-_.+/=]*$',
  })
  refreshToken: string;
}

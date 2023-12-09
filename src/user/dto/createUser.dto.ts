import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    required: true,
    example: 'jhon.doe@mail.fr',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(64)
  @ApiProperty({
    description: 'Name of the user',
    type: String,
    required: true,
    example: 'Jhon Doe',
  })
  name: string;

  @IsNotEmpty()
  @MinLength(12)
  @ApiProperty({
    description: 'Password of the user',
    type: String,
    required: true,
    example: 'Password_123!NotSimple',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}

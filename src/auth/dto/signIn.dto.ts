import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

// on défini les décorateurs pour l'usage de la documentation swagger
export class SignInDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    required: true,
    example: 'jhon.doe@mail.fr',
    minimum: 3,
    maximum: 64,
    uniqueItems: true,
  })
  @IsEmail({ allow_display_name: true }, { message: 'Email is not valid' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    type: String,
    required: true,
    example: 'Password_123!NotSimple',
    minimum: 12,
    pattern: '((?=.*d)|(?=.*W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$',
  })
  @IsNotEmpty()
  password: string;
}

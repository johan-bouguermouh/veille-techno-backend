import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

// on défini les décorateurs pour l'usage de la documentation swagger
export class SignInDto {
  @ApiProperty({
    description: 'Email of the user',
    type: String,
    required: true,
    example: 'jhon.doe@mail.fr',
  })
  @IsEmail({ allow_display_name: true }, { message: 'Email is not valid' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Password of the user',
    type: String,
    required: true,
    example: 'Password_123!NotSimple',
  })
  @IsNotEmpty()
  password: string;
}

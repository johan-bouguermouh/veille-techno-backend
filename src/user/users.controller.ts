import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { CreateUserForm } from './interfaces/user.interface';
import { CreateUserDto } from './dto/createUser.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserResponseDto } from './dto/create-user-response.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Create a user',
    description:
      'Create a user and return it with its Token and Refresh Token to authenticate it.',
  })
  async create(
    @Request() req: Request,
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.userService.create(req, createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user',
    description: 'Get a user',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Update a user',
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserForm,
  ): Promise<User> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
    description:
      "Delete a user. Be careful, this action is irreversible ! Cascade delete on all user's posts, workspaces, columns, tasks of columns, just, tasks in other workspaces where the user is assigned set to null",
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(+id);
  }
}

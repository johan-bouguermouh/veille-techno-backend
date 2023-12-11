import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ColumnService } from './column.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Column')
@Controller('column')
@ApiBearerAuth('JWT-auth')
export class ColumnController {
  constructor(private readonly columnService: ColumnService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a column',
    description:
      'If order is defined, all columns with an order greater than or equal to the new column are shifted by one,if order is not defined, the new column is placed at the end of the list',
  })
  create(@Body() createColumnDto: CreateColumnDto) {
    return this.columnService.create(createColumnDto);
  }

  @Get('/workspace/:workspaceId')
  @ApiOperation({
    summary: 'Get all columns of a workspace',
    description:
      'Get all columns of a workspace, ordered by order. Takes the workspace id as a parameter and returns an array of columns with their tasks of first level.',
  })
  @ApiParam({
    name: 'workspaceId',
    type: Number,
    description: 'Workspace id',
    required: true,
  })
  findAll(@Param('workspaceId') workspaceId: number) {
    return this.columnService.findAllByWorkSpace(+workspaceId);
  }

  @Get(':columnId')
  @ApiOperation({
    summary: 'Get a column',
    description:
      'Get a column by its id and return it with its tasks of first level.',
  })
  @ApiParam({
    name: 'columnId',
    type: Number,
    description: 'Column id',
    required: true,
  })
  findOne(@Param('columnId') columnId: string) {
    return this.columnService.findOne(+columnId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return this.columnService.update(+id, updateColumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.columnService.remove(+id);
  }
}

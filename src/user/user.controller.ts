import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user-dto';
import { UpdateUserDTO } from './dto/update-user-dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user-dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDTO,
  ) {
    return this.userService.update(id, data);
  }

  @Patch(':id')
  async updatePartial(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePatchUserDTO,
  ) {
    return this.userService.updatePartial(id, data);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      method: 'delete',
      id,
    };
  }
}

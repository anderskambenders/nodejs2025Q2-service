import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import UsersService from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guard/auth.guard';

@UseGuards(JwtGuard)
@Controller('user')
class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async findUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async findUser(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersService.getUserById(id);
    if (user) return user;
    throw new NotFoundException(`User with id ${id} not found`);
  }

  @Post()
  @Header('content-type', 'application/json')
  @HttpCode(HttpStatus.CREATED)
  @Header('content-type', 'application/json')
  async createUser(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.createUser(createUserDto);
    if (newUser) return newUser;
    throw new InternalServerErrorException('Something went wrong');
  }

  @Put(':id')
  async updateUser(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userToUpdate = await this.usersService.updateUserPassword(
      id,
      updatePasswordDto,
    );
    if (userToUpdate) return userToUpdate;
    throw new NotFoundException(`User with id ${id} not found`);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}

export default UsersController;

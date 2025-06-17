import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { compare, hash } from 'bcrypt';

@Injectable()
class UsersService {
  constructor(private prismaDB: PrismaService) {}

  public async getAllUsers() {
    const users = await this.prismaDB.user.findMany();
    return users.map((user) => this.formatUser(user));
  }

  public async getUserById(id: string) {
    const user = await this.prismaDB.user.findUnique({
      where: { id },
    });
    if (user) {
      return this.formatUser(user);
    } else {
      return;
    }
  }

  public async createUser(user: CreateUserDto) {
    const salt = parseInt(process.env.CRYPT_SALT) || 10;
    const hashedPassword = await hash(user.password, salt);
    const userToDb = await this.prismaDB.user.create({
      data: {
        login: user.login,
        password: hashedPassword,
      },
    });
    return this.formatUser(userToDb);
  }

  public async updateUserPassword(
    id: string,
    { oldPassword, newPassword }: UpdatePasswordDto,
  ) {
    const user = await this.prismaDB.user.findUnique({
      where: { id },
    });
    if (!user) return;
    const passwordValid = await compare(oldPassword, user.password);
    if (passwordValid) {
      const salt = parseInt(process.env.CRYPT_SALT) || 10;
      const hashedPassword = await hash(newPassword, salt);
      const updatedUser = await this.prismaDB.user.update({
        where: { id },
        data: {
          password: hashedPassword,
          version: {
            increment: 1,
          },
        },
      });
      return this.formatUser(updatedUser);
    }
    throw new HttpException('Wrong old password', HttpStatus.FORBIDDEN);
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await this.prismaDB.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    await this.prismaDB.user.delete({
      where: { id },
    });
  }
  formatUser(user: User) {
    const newUser = Object.fromEntries(
      Object.entries(user).filter(([key]) => !['password'].includes(key)),
    );
    return {
      ...newUser,
      createdAt: new Date(newUser.createdAt).getTime(),
      updatedAt: new Date(newUser.updatedAt).getTime(),
    };
  }
}

export default UsersService;

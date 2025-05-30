import { Injectable } from '@nestjs/common';
import { User } from './types/users.interface';
import users from 'src/db/database';

@Injectable()
class UsersService {
  public getAll(): User[] {
    return users;
  }
}

export default UsersService;

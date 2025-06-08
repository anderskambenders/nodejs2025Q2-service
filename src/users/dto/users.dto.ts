export class User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UserResponse {
  id: string;
  login: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.login = user.login;
    this.version = user.version;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

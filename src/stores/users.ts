import { DBTable, dbTable, type DBTableSchema } from '@/tools';
import classInstanceProvider from '@/tools/classInstanceProvider';

export interface User extends DBTableSchema {
  id: number;
  title: string;
  completed: boolean;
}

export class UsersModel extends DBTable<User, string> {
  constructor() {
    super('users', dbTable);
  }

  addUser(): void {
    const item = {
      id: Math.random() * (100 - 1) + 1,
      title: 'Supriya',
      completed: true,
    };
    console.log(item);
    // this.insert(item);
  }
}

export const userModel = classInstanceProvider.getInstance(UsersModel);

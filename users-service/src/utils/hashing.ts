import { Injectable } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcryptjs');
const saltRounds = 10;

@Injectable()
export class Hashing {
  generateHash = async (password: string): Promise<string> => {
    return bcrypt.hash(password, saltRounds);
  };
}

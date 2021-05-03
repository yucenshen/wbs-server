import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { loginDto } from './dto/login.dto';
import { userDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class AppService {
  [x: string]: any;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }
  async create(data: any): Promise<User> {
    // const user = data[0];
    return await this.userRepository.save(data);
  }

  async findOne(condition: any){
    return this.userRepository.findOne(condition);
  }
}


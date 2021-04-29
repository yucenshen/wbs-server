import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

/**
 * @description user相關api
 * @author yucenshen
 * 
 */


@Injectable()
export class UserService {
  [x: string]: any;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }
  async findOne(condition: any){
    return this.userRepository.findOne(condition);
  }
}


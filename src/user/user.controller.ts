import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { userDto } from 'src/dto/user.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService
  ) { }

  /**
   * @description 需要login拿到token(在res裡)才可拿取[登入者]資料"
   * @param request 
   * @returns 
   */
   @Get()
   @ApiCreatedResponse({description: 'User Registration'})
   async user(@Req() request: Request) {
     try {
       //todo:改成抓header:auth....
       const cookie = request.cookies['jwt'];
       const data = await this.jwtService.verifyAsync(cookie);
       
       if (!data) {
         throw new UnauthorizedException();
       }
       // {"id": 2,"iat": 1619588900,"exp": 1620193700}
       const user = await this.userService.findOne({ id: data['id'] })
       // {"id": 2,"name": "b","email": "b@b.com","password": hash pwd}
       const { password, ...result } = user; //將pwd濾掉不往前送
       return result;
     } catch (e) {
       throw new UnauthorizedException();
     }
   }
  
}


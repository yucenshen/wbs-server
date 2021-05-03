import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { PassThrough } from 'node:stream';
import { userDto } from './dto/user.dto';
import { loginDto } from './dto/login.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private jwtService: JwtService
  ) { }

  /**
   * 
   * @description 新增使用者，PWD用hash型態儲存
   * @param name 
   * @param email 
   * @param password 
   * @returns 帳號資訊[user]
   * 
   */

  @Post('register')
  @ApiCreatedResponse({description: 'User Registration'})
  async register(@Body() userDto: userDto) {
    const hashPassword = await bcrypt.hash(userDto.password, 12);
    userDto.password = hashPassword;
    const user = await this.appService.create(userDto);
  
    // const { password, ...result } = user; //將pwd濾掉不往前送
    delete user.password;
    return user;
  }


  /**
   * @description login認證成功回傳token
   * @param email 
   * @param password 
   * @returns token
   */
  @Post('login')
  @ApiOkResponse({description: 'User login'})
  @ApiUnauthorizedResponse({description: 'invalid'})
  async login(
    @Body() loginUser: loginDto, @Res({ passthrough: true }) response: Response
  ) {
    const email = loginUser.email;
    const pwd = loginUser.password;
    const user = await this.appService.findOne(email);

    if (!user) {
      throw new BadRequestException('invalid user');
    }
    if (!await bcrypt.compare(pwd, user.password)) {
      throw new BadRequestException('invalid pwd');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });
    return jwt;

    // response.cookie('jwt', jwt, { httpOnly: true }); //將token存於res cookie中的jwt欄位
    // return {
    //   message: 'success'
    // };
  }

  @Post('logout')
  async logout(@Res({passthrough:true}) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success'
    }
  }

}


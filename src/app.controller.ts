import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Request, Response } from 'express';
import { PassThrough } from 'node:stream';

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
  async register(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    const hashPassword = await bcrypt.hash(password, 12);

    const user = this.appService.create({
      name,
      email,
      password: hashPassword
    })
    // const { password, ...result } = user; //將pwd濾掉不往前送
    delete (await user).password;
    return user;
  }


  /**
   * @description login認證成功回傳token
   * @param email 
   * @param password 
   * @returns 
   */
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.appService.findOne({ email })

    if (!user) {
      throw new BadRequestException('invalid user');
    }

    if (!await bcrypt.compare(password, user.password)) {
      throw new BadRequestException('invalid pwd');
    }

    const jwt = await this.jwtService.signAsync({ id: user.id });

    response.cookie('jwt', jwt, { httpOnly: true }); //將token存於res cookie中的jwt欄位

    return {
      message: 'success'
    };

  }


  /**
   * @description 需要login拿到token(在res裡)才可拿取資料
   * @param request 
   * @returns 
   */
  @Get('user')
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies['jwt'];
      const data = await this.jwtService.verifyAsync(cookie);

      if (!data) {
        throw new UnauthorizedException();
      }

      // {
      //  "id": 2,
      //  "iat": 1619588900,
      //  "exp": 1620193700
      //  }
      const user = await this.appService.findOne({ id: data['id'] })
      // {
      // "id": 2,
      // "name": "b",
      // "email": "b@b.com",
      // "password": hash pwd
      // }
      const { password, ...result } = user; //將pwd濾掉不往前送
      return result;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  @Post('logout')
  async logout(@Res({passthrough:true}) response: Response) {
    response.clearCookie('jwt');

    return {
      message: 'success'
    }
  }

}


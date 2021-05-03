import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { UserModule } from 'src/user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://local:8080',
    credentials:true
  })

  // //connect swagger aip document services
  const config = new DocumentBuilder()
    .setTitle('WBS-server api example')
    .setDescription('The API description')
    .setVersion('1.0') // match tags in controllers
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api/', app, document);



  const userApiOptions = new DocumentBuilder()
  .setTitle('WBS-server user api')
  .setDescription('User API Info')
  .setVersion('1.0')
  .addTag('/user') // match tags in controllers
  .build();

const userApiDocument= SwaggerModule.createDocument(app, userApiOptions, {include: [UserModule]});
SwaggerModule.setup('v1/api/user/', app, userApiDocument);

// const authApiOptions = new DocumentBuilder()
//   .setTitle('WBS-server Auth API Doc')
//   .setDescription('Auth API Info')
//   .setVersion('1.0')
//   .addTag('') // match tags in controllers
//   .build();
// const authApiDocument= SwaggerModule.createDocument(app, authApiOptions, {include: [AppModule]});
// SwaggerModule.setup('v1/api/auth', app, authApiDocument);


  await app.listen(8000);
}
bootstrap();

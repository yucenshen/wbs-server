import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: 'http://local:8080',
    credentials:true
  })

  //connect swagger aip document services
  const config = new DocumentBuilder()
    .setTitle('WBS-server api example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('') // match tags in controllers
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api/', app, document);

  await app.listen(8000);
}
bootstrap();

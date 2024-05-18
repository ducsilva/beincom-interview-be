/** @format */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './exception';

dotenv.config({
  path: `${process.cwd()}/.env`,
});

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      bufferLogs: true,
    });
    const configService: ConfigService = app.get(ConfigService);

    // API prefix version
    app.setGlobalPrefix('api/v1');

    // Transform response
    // app.useGlobalInterceptors(new TransformInterceptor());

    // Handle exceptions (Catch all exceptions)
    app.useGlobalFilters(new AllExceptionsFilter());

    // Cors
    const options = {
      origin: '*',
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    };
    app.enableCors(options);

    // Static folder
    app.useStaticAssets(`${__dirname}/public`);

    // // Body Parser
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    // // Telegram bot
    // const successBot = app.get(getBotToken('success'));
    // app.use(successBot.webhookCallback('/secret-path-success'));

    // const failureBot = app.get(getBotToken('failure'));
    // app.use(failureBot.webhookCallback('/secret-path-error'));

    // // Logger application
    // app.useLogger(new AppLogService(configService, failureBot));

    // Swagger document
    const config = new DocumentBuilder()
      .setTitle('TrungKa  Swagger')
      .setDescription('TrungKa API description')
      .addBearerAuth()
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    // // Multi Languages
    // i18n.configure({
    //   locales: LANGUAGES,
    //   directory: path.resolve('./src/locales'),
    //   updateFiles: false,
    //   autoReload: true,
    //   defaultLocale: configService.get('BASE_LANGUAGE') || 'en',
    // });
    // app.use(i18n.init);
    // app.use((req, res, next) => {
    //   const language = req.header('Accept-Language');
    //   req.lang = language || configService.get('BASE_LANGUAGE') || 'en';
    //   next();
    // });

    // await app.startAllMicroservices();

    await app.listen(configService.get('PORT') || 3032);

    // console.table([
    //   {
    //     title: 'App Start'.toUpperCase(),
    //     body: `${`http://localhost:${process.env.PORT}/`}`,
    //   },
    //   {
    //     title: 'Swagger Documentation'.toUpperCase(),
    //     body: `${`http://localhost:${process.env.PORT}/docs`}`,
    //   },
    // ]);
  } catch (error) {
    console.log('error:', error);
  }
}

bootstrap();

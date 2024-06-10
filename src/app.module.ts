import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HilevelModule } from './hilevel/hilevel.module';
import { RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseConfigService } from './config/database.config';
import { BullConfigService } from './config/queue.config';
import { MongoConfigService } from './config/mongo.config';
import {
  I18nModule,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { BullModule } from '@nestjs/bull';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    HilevelModule,
    CloudinaryModule,
    RouterModule.register([
      {
        path: '/:version',
        module: HilevelModule,
      },
    ]),
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    SequelizeModule.forRootAsync({
      name: 'high-level',
      useClass: DatabaseConfigService,
    }),

    I18nModule.forRootAsync({
      imports: undefined,
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        {
          use: QueryResolver,
          options: ['lang'],
        },
        new HeaderResolver(['x-language']),
        AcceptLanguageResolver,
      ],
      inject: [ConfigService],
    }),

    BullModule.forRootAsync({
      imports: undefined,
      useClass: BullConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, BullModule],
})
export class AppModule {}

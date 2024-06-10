import { Injectable } from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';

@Injectable()
export class DatabaseConfigService implements SequelizeOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions {
    return <SequelizeModuleOptions>{
      dialect: this.configService.get('DIALECT'),
      host: this.configService.get('APP_HOST'),
      port: this.configService.get('APP_PORT'),
      database: this.configService.get('APP_DATABASE'),
      username: this.configService.get('APP_USER_NAME'),
      password: this.configService.get('APP_PASSWORD'),
      synchronize: false,
      benchmark: true,
      logQueryParameters: true,
      pool: {
        max: 5,
        min: 1,
        idle: 10000,
        acquire: 60000,
        evict: 10000,
      },
      autoLoadModels: true,
      logging: true,
    };
  }
}

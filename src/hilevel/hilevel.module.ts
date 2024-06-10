import { Logger, Module } from '@nestjs/common';
import { ContactController } from './controllers/contact.controller';
import { ContactService } from './services/contact.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactModel, ContactSchema } from './models/contact.model';
import { ContactRepository } from './repository/contact.repository';
import { ResponseService } from '../common/service/response/response.services';
import { TranslateService } from '../common/service/response/translate.service';
import { BullModule } from '@nestjs/bull';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { RequestLogModel, RequestLogSchema } from './models/request.logs.model';
import { EntityLogModel, EntityLogSchema } from './models/entity.logs.model';
import { ContactConsumer } from './consumers/contacts.consumer';
import { RequestLogRepository } from './repository/request.log.repository';
import { EntityLogsRepository } from './repository/entity.logs.repository';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: ContactModel.name,
        useFactory: () => {
          const schema = ContactSchema;
          schema.plugin(require('mongoose-unique-validator'));
          return ContactSchema;
        },
      },
      {
        name: RequestLogModel.name,
        useFactory: () => {
          return RequestLogSchema;
        },
      },
      {
        name: EntityLogModel.name,
        useFactory: () => {
          return EntityLogSchema;
        },
      },
    ]),
    BullModule.registerQueue({
      name: 'contacts',
    }),
    CloudinaryModule,
  ],
  controllers: [ContactController],
  providers: [
    ContactService,
    AnalyticsService,
    ContactRepository,
    RequestLogRepository,
    EntityLogsRepository,
    RequestLogModel,
    EntityLogModel,
    Logger,
    ResponseService,
    TranslateService,
    ContactModel,
    ContactConsumer,
  ],
})
export class HilevelModule {}

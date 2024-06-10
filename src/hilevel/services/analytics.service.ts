import { Injectable } from '@nestjs/common';
import { ContactRepository } from '../repository/contact.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

import { RequestLogRepository } from '../repository/request.log.repository';
import { EntityLogsRepository } from '../repository/entity.logs.repository';
import { RequestLogModel } from '../models/request.logs.model';
import { EntityLogModel } from '../models/entity.logs.model';
import { FindOneWithLimit } from '../dto/contact.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly contactRepository: ContactRepository,
    @InjectQueue('contacts') private contactQueue: Queue,
    private readonly cloudinaryService: CloudinaryService,
    private readonly requestLogRepository: RequestLogRepository,
    private readonly entityLogsRepository: EntityLogsRepository,
  ) {}

  async getStatusByRequestID(request_id: number): Promise<RequestLogModel> {
    return this.requestLogRepository.findOne(request_id);
  }

  async getAllRequest(): Promise<RequestLogModel[]> {
    return this.requestLogRepository.findAll();
  }

  async getEntityStatusByRequestID(
    findOneWithLimit: FindOneWithLimit,
  ): Promise<EntityLogModel[]> {
    return this.entityLogsRepository.findAllByRequestId(findOneWithLimit);
  }

  async getEntity(FindAllDto): Promise<EntityLogModel[]> {
    return this.entityLogsRepository.findAll(FindAllDto);
  }
}

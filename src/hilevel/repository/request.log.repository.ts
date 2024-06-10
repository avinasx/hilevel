import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLogModel } from '../models/request.logs.model';

@Injectable()
export class RequestLogRepository {
  constructor(
    @InjectModel(RequestLogModel.name)
    private requestLogModel: Model<RequestLogModel>,
  ) {}

  async create(requestLogModel: any): Promise<RequestLogModel> {
    const created = new this.requestLogModel(requestLogModel);
    return created.save();
  }

  async findAll(): Promise<RequestLogModel[]> {
    return this.requestLogModel.find().exec();
  }

  async findOne(request_id: number): Promise<RequestLogModel> {
    return this.requestLogModel.findOne({ request_id: request_id });
  }

  async update(cond: any, param: any): Promise<any> {
    return this.requestLogModel.updateOne(cond, param);
  }

  async updateOne(cond: any, param: any): Promise<any> {
    return this.requestLogModel.updateOne(cond, param);
  }
}

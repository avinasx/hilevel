import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityLogModel } from '../models/entity.logs.model';

@Injectable()
export class EntityLogsRepository {
  constructor(
    @InjectModel(EntityLogModel.name)
    private entityLogModel: Model<EntityLogModel>,
  ) {}

  async create(entityLogModel: any): Promise<EntityLogModel> {
    const created = new this.entityLogModel(entityLogModel);
    return created.save();
  }

  async findAll(): Promise<EntityLogModel[]> {
    return this.entityLogModel.find().exec();
  }

  async findOne(): Promise<EntityLogModel> {
    return this.entityLogModel.findOne().exec();
  }

  async update(params: any): Promise<any> {
    return this.entityLogModel.updateOne(params);
  }

  async updateOne(params: any): Promise<any> {
    return this.entityLogModel.updateOne(params);
  }
}

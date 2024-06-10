import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ProgressStatusEnum } from '../enums/status.enum';

export type ContactDocument = HydratedDocument<RequestLogModel>;

@Schema({
  autoIndex: true,
  collection: 'request_Logs',
  strict: false,
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
})
export class RequestLogModel {
  @Prop()
  request_id: number;

  @Prop()
  progressPercentage?: number;

  @Prop({ type: String, default: ProgressStatusEnum.QUEUED })
  status?: ProgressStatusEnum;

  @Prop()
  remark?: string;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLogModel);

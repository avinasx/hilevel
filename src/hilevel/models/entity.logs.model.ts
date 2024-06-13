import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose } from 'mongoose';
import { ProgressStatusEnum } from '../enums/status.enum';

export type ContactDocument = HydratedDocument<EntityLogModel>;

@Schema({
  autoIndex: true,
  collection: 'entity_Logs',
  strict: false,
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },
})
export class EntityLogModel {
  @Prop()
  request_id?: number;

  @Prop()
  entities?: SchemaMongoose.Types.Mixed;

  @Prop({ type: String, default: ProgressStatusEnum.IN_PROGRESS })
  status?: ProgressStatusEnum;

  @Prop()
  remark?: string;
}

export const EntityLogSchema = SchemaFactory.createForClass(EntityLogModel);

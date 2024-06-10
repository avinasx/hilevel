import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserStatusEnum } from '../enums/status.enum';

export type ContactDocument = HydratedDocument<ContactModel>;

@Schema({
  autoIndex: true,
  collection: 'contacts',
  strict: false,
  timestamps: {
    createdAt: 'created_at', // Use `created_at` to store the created date
    updatedAt: 'updated_at', // and `updated_at` to store the last updated date
  },

})
export class ContactModel {
  @Prop({ required: true })
  user_id: number;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  age: number;

  @Prop({ type: String, default: UserStatusEnum.ACTIVE })
  status: UserStatusEnum;
}

export const ContactSchema = SchemaFactory.createForClass(ContactModel);

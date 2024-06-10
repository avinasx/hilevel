import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ContactModel } from '../models/contact.model';
import { CreateContactDto } from '../dto/contact.dto';

@Injectable()
export class ContactRepository {
  constructor(
    @InjectModel(ContactModel.name) private contactModel: Model<ContactModel>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<ContactModel> {
    const createdCat = new this.contactModel(createContactDto);
    return createdCat.save();
  }

  async createRaw(createContactDto: any): Promise<ContactModel> {
    return this.contactModel.findOneAndUpdate(
      { user_id: createContactDto['user_id'] },
      createContactDto,
      { upsert: true },
    );
  }

  async createBulk(
    createContactDto: [CreateContactDto],
  ): Promise<ContactModel> {
    const createdCat = new this.contactModel(createContactDto);
    return createdCat.save();
  }

  async findAll(): Promise<ContactModel[]> {
    return this.contactModel.find().exec();
  }

  async findOne(): Promise<ContactModel> {
    return this.contactModel.findOne().exec();
  }
}

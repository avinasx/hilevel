import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { ContactService } from '../services/contact.service';

@Processor('contacts')
export class ContactConsumer {
  constructor(
    private readonly contactService: ContactService,
  ) {}


  @Process()
  async transcode(job: Job<unknown>) {
    this.contactService.readCsv(job).then();
    return {};
  }
}
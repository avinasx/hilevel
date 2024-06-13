import { Injectable } from '@nestjs/common';
import { ContactRepository } from '../repository/contact.repository';
import { CreateBulkContactDto, CreateContactDto } from '../dto/contact.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { ContactModel } from '../models/contact.model';
import { Job } from 'bull';
import axios from 'axios';
import { ProgressStatusEnum } from '../enums/status.enum';
import { RequestLogRepository } from '../repository/request.log.repository';
import { EntityLogsRepository } from '../repository/entity.logs.repository';
import { parse } from 'csv-parse';

@Injectable()
export class ContactService {
  constructor(
    private readonly contactRepository: ContactRepository,
    @InjectQueue('contacts') private contactQueue: Queue,
    private readonly cloudinaryService: CloudinaryService,
    private readonly requestLogRepository: RequestLogRepository,
    private readonly entityLogsRepository: EntityLogsRepository,
  ) {}

  async create(contactCreate: CreateContactDto): Promise<ContactModel> {
    return this.contactRepository.create(contactCreate);
  }

  async bulkCreate(contactCreate: [CreateContactDto]): Promise<ContactModel> {
    return await this.contactRepository.createBulk(contactCreate);
  }

  async uploadFile(
    files: Express.Multer.File[],
    body: CreateBulkContactDto,
  ): Promise<Array<number>> {
    const responses: Array<number> = [];
    let delay = 0;
    if (body.scheduled) {
      const sec = body.scheduled - Math.round(Date.now() / 1000);
      delay = sec < 0 ? 0 : sec;
    }
    for (const file of files) {
      const uploadApiResponse = await this.cloudinaryService.uploadCsv(file);
      const response = await this.contactQueue.add(
        {
          publicId: uploadApiResponse.public_id,
          url: uploadApiResponse.url,
        },
        {
          delay: delay * 1000,
          removeOnComplete: {
            age: 24 * 3600, // keep up to 1 hour
          },
          removeOnFail: {
            age: 24 * 3600, // keep up to 24 hours
          },
        },
      );
      const jobId = parseInt(response.id.toString());
      responses.push(jobId);
      this.requestLogRepository.create({ request_id: jobId }).then(() => {
        console.log('job added to queue');
      });
    }
    return responses;
  }

  async readCsv(job: Job): Promise<Array<string>> {
    const responses: Array<string> = [];
    const csvUrl = job.data.url;
    const jobId = parseInt(job.id.toString());

    await this.requestLogRepository
      .updateOne(
        { request_id: jobId },
        { status: ProgressStatusEnum.IN_PROGRESS },
      )
      .then(() => {
        console.log('job is in progress');
      });

    try {
      const response = await axios.get(csvUrl);
      const csvData = response.data;
      const lineCount = csvData.split('\n').length;

      // Parse the CSV data
      let rowCount = 0;
      let header = [];
      parse(csvData, { skipRecordsWithError: true })
        .on('data', async (row: any) => {
          rowCount = rowCount + 1;
          if (rowCount == 1) {
            header = row;
          } else {
            const obj = {};
            for (let i: number = 0; i < header.length; i++) {
              obj[header[i]] = row[i] ?? '';
            }

            try {
              await this.contactRepository.createRaw(obj);
              await this.entityLogsRepository.create({
                request_id: jobId,
                entity: obj,
                status: ProgressStatusEnum.DONE,
              });
            } catch (err) {
              await this.entityLogsRepository.create({
                request_id: jobId,
                entities: obj,
                status: ProgressStatusEnum.SKIPPED,
                remark: err.toString(),
              });
            } finally {
              await this.requestLogRepository.updateOne(
                { request_id: jobId },
                {
                  progressPercentage: Math.round(
                    (rowCount / (lineCount - 1)) * 100,
                  ),
                },
              );
              console.log('*******************');
            }
          }
        })
        .on('end', async () => {
          console.log('CSV file successfully processed');
          await job.progress(1);
        })
        .on('error', async (err: any) => {
          await this.requestLogRepository
            .updateOne(
              { request_id: jobId },
              {
                status: ProgressStatusEnum.FAILED,
                remark: err.toString(),
              },
            )
            .then(() => {
              console.log('job is in progress');
            });
        });
    } catch (err) {
      await this.requestLogRepository
        .updateOne(
          { request_id: jobId },
          {
            status: ProgressStatusEnum.FAILED,
            remark: err.toString(),
          },
        )
        .then(() => {
          console.log('job is failed');
        });
    } finally {
      await this.requestLogRepository
        .updateOne({ request_id: jobId }, { status: ProgressStatusEnum.DONE })
        .then(() => {
          console.log('job is done');
        });
    }

    return responses;
  }
}

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
  Headers,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ContactService } from '../services/contact.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateBulkContactDto, CreateContactDto } from '../dto/contact.dto';
import { Response } from 'src/common/dto/response.dto';
import { ResponseService } from 'src/common/service/response/response.services';
import {
  HeaderParam,
  VersionParam,
} from '../../common/decorators/params.decorators';
import { HeaderDto } from '../../common/dto/header.dto';
import { TranslateService } from '../../common/service/response/translate.service';
import { FilesInterceptor } from '@nestjs/platform-express';

const allowedMimeTypes = ['text/csv'];

@Controller('contact')
@ApiTags('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private responseService: ResponseService,
    private readonly translate: TranslateService,
  ) {}

  /**
   * @param body
   * @param headers
   * @param i18n
   */
  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @VersionParam()
  @HeaderParam()
  async create(
    @Body() body: CreateContactDto,
    @Headers() headers: HeaderDto,
  ): Promise<Response> {
    try {
      const response = await this.contactService.create(body);
      return this.responseService.onSuccess({
        code: HttpStatus.CREATED,
        msg: this.translate.t('msg.success'),
        data: response,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: this.translate.t('msg.wentWrong'),
          message: (error as Error).message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/create-bulk')
  @VersionParam()
  @HeaderParam()
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    required: true,
    type: CreateBulkContactDto,
  })
  async createBulk(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateBulkContactDto,
  ): Promise<Response> {
    try {
      if (!files || !files.length) {
        throw new BadRequestException(
          'At least one CSV is required are required.',
        );
      }
      if (files && files.length) {
        for (const file of files) {
          if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new BadRequestException('only CSV is allowed');
          }
        }
      }
      const responses = await this.contactService.uploadFile(files, body);
      return this.responseService.onSuccess({
        code: HttpStatus.CREATED,
        msg: this.translate.t('msg.success'),
        data: {
          requestIds: responses,
        },
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: this.translate.t('msg.wentWrong'),
          message: (error as Error).message,
          code: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

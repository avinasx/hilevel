import { IsEmail, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProgressStatusEnum } from '../enums/status.enum';

export class CreateContactDto {
  @IsNotEmpty()
  @ApiProperty()
  user_id: number;

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  age: number;
}

export class FindOneDto {
  @ApiProperty()
  request_id: number;
}

export class FindOneWithLimit {
  @ApiProperty()
  request_id: number;

  @ApiProperty({ enum: ProgressStatusEnum })
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  offset: number;
}

export class FindAllDto {
  @ApiProperty({ enum: ProgressStatusEnum })
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsNotEmpty()
  limit: number;

  @ApiProperty()
  @IsNotEmpty()
  offset: number;
}

export class CreateBulkContactDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'file',
      format: 'binary',
    },
    description: 'Files to upload',
    required: true,
  })
  files: any[];

  @Type(() => Number)
  @ApiProperty({
    description: 'epoch timestamp of scheduling, [0 means instant]',
    type: Number,
    required: true,
  })
  scheduled?: number;
}

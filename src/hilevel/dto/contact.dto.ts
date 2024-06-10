import { IsEmail, IsNotEmpty, IsNumber, IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from "class-transformer";

export class CreateContactDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  age: number;
}

export class FindOneContactDto {
  @IsNumberString()
  id: number;
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

import { IsDefined } from 'class-validator';
import { Expose } from 'class-transformer';

export class HeaderDto {
  @IsDefined()
  @Expose({ name: 'Accept-Language' })
  language: string; // note the param here is in double quotes
}

import { I18nContext, I18nService } from 'nestjs-i18n';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslateService {
  constructor(private readonly i18n: I18nService) {}

  t(msg: string, _lang?: string): string {
    return this.i18n.t(msg, {
      lang: _lang ?? I18nContext.current().lang,
    });
  }
}

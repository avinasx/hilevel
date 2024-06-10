// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

/**
 * Class to handle the response for unexpected exception
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  /**
   * Method to handle the response for unexpected response
   * @param exception HttpException
   * @param host ArgumentsHost
   */
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResp = exception.getResponse();

    response.status(status).json({
      status: 0,
      code: 400,
      msg:
        exceptionResp && exceptionResp['error'] ? exceptionResp['error'] : '',
      data: [],
      error: {
        code:
          exceptionResp && exceptionResp['code'] ? exceptionResp['code'] : 4001,
        msg: this.buildErrorMessage(exceptionResp),
        data:
          exceptionResp && exceptionResp['message']
            ? exceptionResp['message']
            : '',
      },
      action: null,
      tooltips: [],
    });
  }

  buildErrorMessage(exceptionResp: unknown): string {
    if (exceptionResp && exceptionResp['message']) {
      if (exceptionResp['message'] instanceof Array) {
        return exceptionResp['message'][0];
      } else {
        return exceptionResp['message'];
      }
    } else if (exceptionResp && exceptionResp['error']) {
      return exceptionResp['error'];
    } else {
      return '';
    }
  }
}

import { Injectable } from '@nestjs/common';
import {
  InputFailure,
  InputSuccess,
  Response,
} from 'src/common/dto/response.dto';

@Injectable()
export class ResponseService {
  /**
   * On Success, send response on success
   * @param inputObject InputSuccess
   */
  onSuccess(inputObject: InputSuccess): Response {
    return {
      status: 1,
      code: inputObject.code,
      msg: inputObject.msg,
      data: inputObject.data,
      error: null,
    };
  }

  /**
   * On Failure, send response on failure
   * @param inputObject InputFailure
   */
  onFailure(inputObject: InputFailure): Response {
    return {
      status: 0,
      code: 400,
      msg: '',
      data: null,
      error: {
        code: inputObject.code,
        msg: inputObject.msg,
        data: inputObject.data,
      },
    };
  }
}

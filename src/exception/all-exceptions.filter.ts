import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import type { Response } from 'express';
import { capitalize } from 'utils';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = <any>exception.getResponse();

    // Get message from exception
    let message = exception.message;
    if (exceptionResponse instanceof Object) {
      if (exceptionResponse.message instanceof Array) {
        message = exceptionResponse.message[0];
      } else {
        message = exceptionResponse.message;
      }
    }

    // Capitalize first letter
    message = capitalize(message);

    response.status(statusCode).json({ statusCode, message, data: null });
  }
}

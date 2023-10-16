import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message
      ? exception.message
      : `${status >= 500 ? 'Service Error' : 'Client Error'}`;

    const nowTime = new Date().getTime();

    const errorResponse = {
      data: {},
      message,
      code: -1,
      date: nowTime,
      path: request.url,
    };
    this.logger.error(
      `【${nowTime}】${request.method} ${request.url} query:${JSON.stringify(
        request.query,
      )} params:${JSON.stringify(request.params)} body:${JSON.stringify(
        request.body,
      )}`,
      JSON.stringify(errorResponse),
      'HttpExceptionFilter',
    );
    response.status(status);
    response.header('Content-Type', 'application/json; charset=utf-8');
    response.send(errorResponse);
  }
}

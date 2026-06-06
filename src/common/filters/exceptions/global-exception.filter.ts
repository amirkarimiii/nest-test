import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from "@nestjs/common";
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    catch(exception: unknown, host: ArgumentsHost) {

        const ctx = host.switchToHttp();

        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        let message = 'internal server error';

        if (exception instanceof HttpException) {

            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {

                message = exceptionResponse;

            } else {

                const body = exceptionResponse as any;
                message = body.message ?? exception.message;

            }

        }

        response.status(status).json({
            success: false,
            statusCode: status,
            message,
            path: request.url,
            timestamp:
                new Date().toISOString(),
        });

    }

}
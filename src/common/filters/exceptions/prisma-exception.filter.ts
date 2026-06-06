import {ArgumentsHost, Catch, ExceptionFilter, HttpStatus} from "@nestjs/common";
import {Response} from 'express';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/client";

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch (exception.code) {
            case 'P2002':
                response.status(HttpStatus.CONFLICT).json({
                    success: false,
                    statusCode: 409,
                    message: 'Resource already exists',
                    timestamp: new Date().toISOString(),
                    path: ctx.getRequest<Request>().url,
                });
                break;
            case 'P2003':
                response.status(HttpStatus.BAD_REQUEST).json({
                    success: false,
                    statusCode: 400,
                    message: 'Related resource not found',
                    timestamp: new Date().toISOString(),
                    path: ctx.getRequest<Request>().url,
                });
                break;

            default:
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    success: false,
                    statusCode: 500,
                    message: 'internal server error',
                    timestamp: new Date().toISOString(),
                    path: ctx.getRequest<Request>().url,
                });
        }
    }
}
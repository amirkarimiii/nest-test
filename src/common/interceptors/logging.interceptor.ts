import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from "@nestjs/common";
import {catchError, Observable, tap, throwError} from "rxjs";


@Injectable()
export class LoggingInterceptor implements NestInterceptor {

    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

        const request = context.switchToHttp().getRequest();
        const {method, originalUrl} = request;

        const startTime = Date.now();

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - startTime;
                this.logger.log(`${method} ${originalUrl} ${duration}ms`);
            }),
            catchError((error) => {

                const duration = Date.now() - startTime;

                this.logger.error(`${method} ${originalUrl} FAILED ${duration}ms`);

                return throwError(
                    () => error,
                );
            })
        );

    }

}
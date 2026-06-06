import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class InternalServerTokenGuard implements CanActivate {

    constructor( private readonly configService: ConfigService ) {}

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const isn = request.headers['x-internal-service'];
        const expectedIsn = this.configService.get<string>("security.internalServiceToken");

        if (!isn) {
            throw new ForbiddenException(
                'Missing Internal Service Token',
            );
        }

        if (isn !== expectedIsn) {
            throw new ForbiddenException(
                'Invalid Internal Service Token',
            );
        }

        return true;
    }

}
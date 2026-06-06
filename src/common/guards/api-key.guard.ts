import {CanActivate, ExecutionContext, ForbiddenException, Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";


@Injectable()
export class ApiKeyGuard implements CanActivate {

    constructor( private readonly configService: ConfigService ) {}

    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];
        const expectedKey = this.configService.get<string>('security.apiKey');

        if (!apiKey) {
            throw new ForbiddenException(
                'Missing API key',
            );
        }

        if (apiKey !== expectedKey) {
            throw new ForbiddenException(
                'Invalid API key',
            );
        }

        return true;

    }

}
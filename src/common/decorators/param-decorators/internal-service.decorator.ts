import {createParamDecorator, ExecutionContext} from "@nestjs/common";


export const InternalService = createParamDecorator((data: unknown, ctx: ExecutionContext) => {

    const request = ctx.switchToHttp().getRequest();
    return request.headers['internal-service'];

})
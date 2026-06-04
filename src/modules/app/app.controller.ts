import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiOkResponse
} from '@nestjs/swagger';
import {MessageResponseDto} from "../../common/dto/app.dto";

@ApiTags('General')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }

    @Get()
    @ApiOperation({
        summary: 'welcome',
        description: 'this endpoint returns a welcome message',
    })
    @ApiOkResponse({
        description: 'message has been successfully received',
        type: MessageResponseDto,
    })
    @ApiResponse({
        status: 500,
        description: 'internal server error',
    })
    getHello() {
        return this.appService.getHello();
    }
}

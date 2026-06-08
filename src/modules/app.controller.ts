import {Controller, Get} from '@nestjs/common';
import {AppService} from './app.service';
import {CacheService} from "./cache/cache.service";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly cacheService: CacheService
    ) {}

    @Get()
    getHello() {
        return this.appService.getHello();
    }

    @Get('test')
    getCache(){
        return this.cacheService.getOptions();
    }
}

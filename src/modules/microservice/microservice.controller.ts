import {Controller, Get, Injectable} from "@nestjs/common";
import {MicroserviceService} from "./microservice.service";


@Controller('micro')
export class MicroserviceController {

    constructor(private readonly microService: MicroserviceService) {}

    @Get('test')
    getHello() {
        return this.microService.getHello();
    }

}
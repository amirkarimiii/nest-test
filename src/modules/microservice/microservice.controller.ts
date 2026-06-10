import {Controller, Get, Injectable, Param} from "@nestjs/common";
import {MicroserviceService} from "./microservice.service";


@Controller('micro')
export class MicroserviceController {

    constructor(private readonly microService: MicroserviceService) {}

    @Get('test')
    gerUsers() {
        return this.microService.getUser();
    }

    @Get('test-id')
    getUserById() {
        return this.microService.getUserById();
    }

    @Get('test-msg')
    getUserMessage() {
        return this.microService.getUserMessage();
    }

}
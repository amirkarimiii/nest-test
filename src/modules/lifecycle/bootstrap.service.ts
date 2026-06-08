import {Injectable, OnApplicationBootstrap, OnModuleInit} from "@nestjs/common";


@Injectable()
export class BootstrapService implements OnModuleInit, OnApplicationBootstrap {

    onModuleInit() {
        console.log("BootstrapService initialized");
    }

    onApplicationBootstrap() {
        console.log("BootstrapService fully bootstrapped");
    }

}
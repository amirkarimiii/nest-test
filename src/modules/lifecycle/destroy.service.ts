import {Injectable, OnApplicationBootstrap, OnModuleDestroy, OnModuleInit} from "@nestjs/common";


@Injectable()
export class DestroyService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy {


    onModuleInit() {
        console.log("DestroyService Initialized");
    }

    onApplicationBootstrap() {
        console.log("DestroyService fully bootstrapped");
    }

    onModuleDestroy() {
        console.log("DestroyService fully destroyed");
    }

}
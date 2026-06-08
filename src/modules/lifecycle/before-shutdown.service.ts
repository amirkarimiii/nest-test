import {
    BeforeApplicationShutdown,
    Injectable,
    OnApplicationBootstrap,
    OnModuleDestroy,
    OnModuleInit
} from "@nestjs/common";


@Injectable()
export class BeforeShutdownService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown{

    onModuleInit() {
        console.log("BeforeShutdownService initialized");
    }

    onApplicationBootstrap() {
        console.log("BeforeShutdownService fully bootstrapped");
    }

    onModuleDestroy() {
        console.log("BeforeShutdownService fully destroyed");
    }

    beforeApplicationShutdown(signal?: string) {
        console.log(`signal ${signal} received`);
    }

}
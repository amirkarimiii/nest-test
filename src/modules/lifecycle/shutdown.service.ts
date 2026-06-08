import {
    BeforeApplicationShutdown,
    Injectable,
    OnApplicationBootstrap, OnApplicationShutdown,
    OnModuleDestroy,
    OnModuleInit
} from "@nestjs/common";


@Injectable()
export class ShutdownService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {

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

    onApplicationShutdown(signal?: string) {
        console.log(`App stopped by ${signal}`)
    }

}
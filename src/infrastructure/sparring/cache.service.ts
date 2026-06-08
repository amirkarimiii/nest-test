import {
    BeforeApplicationShutdown,
    Injectable,
    OnApplicationBootstrap, OnApplicationShutdown,
    OnModuleDestroy,
    OnModuleInit
} from "@nestjs/common";


@Injectable()
export class CacheService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, OnApplicationShutdown {

    onModuleInit() {
        console.log("CacheService initialized");
    }

    onApplicationBootstrap() {
        console.log("CacheService fully bootstrapped");
    }

    onModuleDestroy() {
        console.log("CacheService fully destroyed");
    }

    onApplicationShutdown(signal?: string) {
        console.log(`App stopped by ${signal}`)
    }

}
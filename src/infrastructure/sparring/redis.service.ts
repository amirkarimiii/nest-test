import {Injectable, OnModuleDestroy, OnModuleInit} from "@nestjs/common";


@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {

    async onModuleInit() {
        console.log("RedisService is connecting...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("RedisService is connected");
    }

    onModuleDestroy() {
        console.log("RedisService is disconnected");
    }

}
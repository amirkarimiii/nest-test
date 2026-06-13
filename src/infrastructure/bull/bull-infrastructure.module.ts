import {DynamicModule, Module} from "@nestjs/common";
import {BullModule} from "@nestjs/bullmq";
import {ConfigService} from "@nestjs/config";
import {OUTBOX_QUEUE} from "../../common/constants/queue.constants";
import {OutboxQueue} from "./queue/outbox.queue";
import {OutboxProcessor} from "./processors/outbox.processor";


@Module({})
export class BullInfrastructureModule {
    static forRootAsync(): DynamicModule {
        return {
            module: BullInfrastructureModule,
            imports: [
                BullModule.forRootAsync({
                    useFactory: async (configService: ConfigService) => ({
                        connection: {
                            host: configService.get<string>('redis.host'),
                            port: configService.get<number>('redis.port'),
                            maxRetriesPerRequest: null,
                            enableReadyCheck: false,
                        },
                        defaultJobOptions: {
                            removeOnComplete: {count: 100},
                            removeOnFail: {count: 50},
                            attempts: 3,
                            backoff: {
                                type: 'fixed',
                                delay: 1000,
                            },
                        },
                    }),
                    inject: [ConfigService],
                }),
                BullModule.registerQueue({
                    name: OUTBOX_QUEUE,
                }),
            ],
            providers: [OutboxQueue, OutboxProcessor],
            exports: [OutboxQueue]
        }
    }

}
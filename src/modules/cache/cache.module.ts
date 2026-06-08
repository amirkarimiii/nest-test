import {DynamicModule, Module} from "@nestjs/common";
import {CacheOptions} from "../../common/interfaces/cache-options.interface";
import {CacheService} from "./cache.service";
import {ConfigService} from "@nestjs/config";


@Module({})
export class CacheModule {

    static forRootAsync(): DynamicModule {
        return {
            module: CacheModule,
            providers: [
                {
                    provide: "CACHE_OPTIONS",
                    inject: [ConfigService],
                    useFactory: (configService: ConfigService) => ({
                        host: configService.get('cache.host'),
                        port: configService.get('cache.port'),
                        ttl: configService.get('cache.ttl'),
                    })
                },
                CacheService
            ],
            exports: [
                CacheService
            ]
        }
    }

}
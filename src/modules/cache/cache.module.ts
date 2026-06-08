import {DynamicModule, Module} from "@nestjs/common";
import {CacheOptions} from "../../common/interfaces/cache-options.interface";
import {CacheService} from "./cach.service";


@Module({})
export class CacheModule {

    static forRoutes(options: CacheOptions): DynamicModule {
        return {
            module: CacheModule,
            providers: [
                {
                    provide: "CACHE_OPTIONS",
                    useValue: options,
                },
                CacheService
            ],
            exports: [
                CacheService
            ]
        }
    }

}
import {Inject, Injectable} from "@nestjs/common";
import type {CacheOptions} from "../../common/interfaces/cache-options.interface";


@Injectable()
export class CacheService {
    constructor(@Inject('CACHE_OPTIONS') private readonly options: CacheOptions) {}

    getConfig(){
        return this.options;
    }
}
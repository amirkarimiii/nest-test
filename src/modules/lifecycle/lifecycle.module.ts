import {Module} from "@nestjs/common";
import {StartupService} from "./startup.service";
import {BootstrapService} from "./bootstrap.service";
import {DestroyService} from "./destroy.service";


@Module({
    providers: [
        StartupService,
        BootstrapService,
        DestroyService
    ]
})

export class LifecycleModule {}
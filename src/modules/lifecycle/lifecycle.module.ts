import {Module} from "@nestjs/common";
import {StartupService} from "./startup.service";
import {BootstrapService} from "./bootstrap.service";
import {DestroyService} from "./destroy.service";
import {BeforeShutdownService} from "./before-shutdown.service";


@Module({
    providers: [
        StartupService,
        BootstrapService,
        DestroyService,
        BeforeShutdownService
    ]
})

export class LifecycleModule {}
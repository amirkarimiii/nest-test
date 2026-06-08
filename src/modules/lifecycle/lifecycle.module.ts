import {Module} from "@nestjs/common";
import {StartupService} from "./startup.service";
import {BootstrapService} from "./bootstrap.service";
import {DestroyService} from "./destroy.service";
import {BeforeShutdownService} from "./before-shutdown.service";
import {ShutdownService} from "./shutdown.service";


@Module({
    providers: [
        StartupService,
        BootstrapService,
        DestroyService,
        BeforeShutdownService,
        ShutdownService
    ]
})

export class LifecycleModule {}
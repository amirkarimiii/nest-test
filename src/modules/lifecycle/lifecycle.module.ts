import {Module} from "@nestjs/common";
import {StartupService} from "./startup.service";
import {BootstrapService} from "./bootstrap.service";


@Module({
    providers: [
        StartupService,
        BootstrapService
    ]
})

export class LifecycleModule {}
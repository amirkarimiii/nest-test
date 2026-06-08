import {Injectable, OnModuleInit} from "@nestjs/common";

@Injectable()
export class StartupService implements OnModuleInit {

    onModuleInit() {
        console.log('StartupService initialized');
    }
}
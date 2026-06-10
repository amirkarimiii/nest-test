import {Module} from "@nestjs/common";
import {ClientsModule, Transport} from "@nestjs/microservices";
import {MicroserviceService} from "./microservice.service";
import {MicroserviceController} from "./microservice.controller";


@Module({
    imports: [
        ClientsModule.register([
            {
                name: "MICROSERVICE_SERVICE",
                transport: Transport.TCP,
                options: {
                    host: "127.0.0.1",
                    port: 3001
                }
            }
        ]),
    ],
    providers: [MicroserviceService],
    controllers: [MicroserviceController],
    exports: [MicroserviceService],
})
export class MicroserviceModule {}
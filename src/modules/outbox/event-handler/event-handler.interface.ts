import {EventTypesEnum} from "../../../common/enums/event-types.enum";

export interface EventHandlerInterface {

    readonly eventType: EventTypesEnum;
    handle(payload: unknown, eventId: string): Promise<void>;

}
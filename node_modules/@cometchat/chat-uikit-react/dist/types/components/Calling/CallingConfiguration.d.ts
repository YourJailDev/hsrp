import { CometChatUIKitCalls } from "../../CometChatUIKit/CometChatCalls";
import { CalendarObject } from "../../utils/CalendarObject";
import { CallButtonConfiguration } from "./CallButtonConfiguration";
export declare class CallingConfiguration {
    groupCallSettingsBuilder?: (message: CometChat.CustomMessage) => typeof CometChatUIKitCalls.CallSettingsBuilder;
    callButtonConfiguration?: CallButtonConfiguration;
    callInitiatedDateTimeFormat?: CalendarObject;
    constructor(configuration?: CallingConfiguration);
}

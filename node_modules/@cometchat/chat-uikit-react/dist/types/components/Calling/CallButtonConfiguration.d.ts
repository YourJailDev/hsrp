import { CometChatUIKitCalls } from "../../CometChatUIKit/CometChatCalls";
import { OutgoingCallConfiguration } from "./OutgoingCallConfiguration";
export declare class CallButtonConfiguration {
    callSettingsBuilder?: (isAudioOnlyCall: boolean, user?: CometChat.User, group?: CometChat.Group) => typeof CometChatUIKitCalls.CallSettingsBuilder;
    onVoiceCallClick?: () => void;
    onVideoCallClick?: () => void;
    onError?: ((error: CometChat.CometChatException) => void) | null;
    outgoingCallConfiguration?: OutgoingCallConfiguration;
    constructor(configuration?: CallButtonConfiguration);
}

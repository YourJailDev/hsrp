import { Subject } from 'rxjs';
/**
 * Call event subjects for handling various call-related actions (like outgoing calls, call acceptance, rejections, etc.)
 */
export declare class CometChatCallEvents {
    static ccOutgoingCall: Subject<CometChat.Call>;
    static ccCallAccepted: Subject<CometChat.Call>;
    static ccCallRejected: Subject<CometChat.Call>;
    static ccCallEnded: Subject<CometChat.Call>;
}

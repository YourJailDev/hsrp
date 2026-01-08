import { Subject } from "rxjs";
import { MouseEventSource, PanelAlignment } from "../Enums/Enums";
import { ComposerId } from "../utils/MessagesDataSource";
/**
 * UI event subjects for handling various UI-related actions (e.g., showing panels, modals, dialogs, etc.)

 */
export declare class CometChatUIEvents {
    static ccHidePanel: Subject<PanelAlignment | void>;
    static ccShowPanel: Subject<IPanel>;
    static ccShowModal: Subject<IModal>;
    static ccHideModal: Subject<void>;
    static ccShowDialog: Subject<IDialog>;
    static ccHideDialog: Subject<void>;
    static ccActiveChatChanged: Subject<IActiveChatChanged>;
    static ccShowOngoingCall: Subject<IShowOngoingCall>;
    static ccOpenChat: Subject<IOpenChat>;
    static ccComposeMessage: Subject<string>;
    static ccMouseEvent: Subject<IMouseEvent>;
    static ccShowMentionsCountWarning: Subject<IMentionsCountWarning>;
    static ccActivePopover: Subject<string>;
}
/**
* Interface for ui-related events
*/
export interface IOpenChat {
    user?: CometChat.User;
    group?: CometChat.Group;
}
export interface IShowOngoingCall {
    child: any;
    message?: CometChat.CustomMessage;
}
export interface IPanel {
    child?: any;
    configuration?: any;
    message?: CometChat.BaseMessage;
    position?: PanelAlignment;
    composerId?: ComposerId;
}
export interface IModal {
    child?: any;
    composerId?: ComposerId;
}
export interface IActiveChatChanged {
    user?: CometChat.User;
    group?: CometChat.Group;
    message?: CometChat.BaseMessage;
    unreadMessageCount?: number;
}
export interface IDialog {
    child: any;
    confirmCallback: any;
}
export interface IMouseEvent {
    event: Event;
    source: MouseEventSource;
    body?: {};
}
export interface IMentionsCountWarning {
    showWarning: boolean;
    id?: string;
}

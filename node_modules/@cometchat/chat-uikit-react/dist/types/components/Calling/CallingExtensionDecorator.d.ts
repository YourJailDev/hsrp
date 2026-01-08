import { DataSource } from "../../utils/DataSource";
import { DataSourceDecorator } from "../../utils/DataSourceDecorator";
import { CallingConfiguration } from "./CallingConfiguration";
import { MessageBubbleAlignment } from "../../Enums/Enums";
import { CometChatMessageTemplate } from "../../modals";
import { CalendarObject } from "../../utils/CalendarObject";
export declare class CallingExtensionDecorator extends DataSourceDecorator {
    loggedInUser: CometChat.User | null;
    configuration?: CallingConfiguration;
    constructor(dataSource: DataSource, configuration?: CallingConfiguration);
    addLoginListener(): void;
    getLoggedInUser(): Promise<void>;
    getAllMessageTypes(): string[];
    getId(): string;
    getAllMessageCategories(additionalConfigurations?: Object | undefined): string[];
    checkIfTemplateTypeExist(template: CometChatMessageTemplate[], type: string): boolean;
    checkIfTemplateCategoryExist(template: CometChatMessageTemplate[], category: string): boolean;
    getAllMessageTemplates(additionalConfigurations?: any): CometChatMessageTemplate[];
    getDirectCallTemplate(): CometChatMessageTemplate;
    getDefaultCallTemplate(): CometChatMessageTemplate[];
    getSessionId(_message: CometChat.CustomMessage): any;
    /**
   *  Function for displaying the call initiation time in call logs.
   * @returns CalendarObject
    */
    getDateFormat(): CalendarObject;
    getDirectCallMessageBubble(_message: CometChat.CustomMessage, _alignment: MessageBubbleAlignment): import("react/jsx-runtime").JSX.Element;
    startDirectCall(sessionId: string, message: CometChat.CustomMessage): void;
    getCallActionMessage(_message: CometChat.Call): string;
    getCallStatusClass(message: CometChat.Call): "" | "cometchat-message-bubble__outgoing-call" | "cometchat-message-bubble__incoming-call" | "cometchat-message-bubble__cancelled-call" | "cometchat-message-bubble__rejected-call" | "cometchat-message-bubble__busy-call" | "cometchat-message-bubble__ended-call" | "cometchat-message-bubble__answered-call" | "cometchat-message-bubble__unanswered-call" | "cometchat-message-bubble__missed-call";
    getDefaultAudioCallMessageBubble(_message: CometChat.Call, _alignment: MessageBubbleAlignment): import("react/jsx-runtime").JSX.Element;
    getDefaultVideoCallMessageBubble(_message: CometChat.Call, _alignment: MessageBubbleAlignment): import("react/jsx-runtime").JSX.Element;
    getLastConversationMessage(conversation: CometChat.Conversation, loggedInUser: CometChat.User, additionalParams?: any): string;
    getAuxiliaryHeaderMenu(user?: CometChat.User, group?: CometChat.Group, additionalConfigurations?: any): any[];
}

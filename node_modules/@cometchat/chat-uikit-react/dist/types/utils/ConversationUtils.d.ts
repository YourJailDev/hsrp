import { CometChatTextFormatter } from '../formatters/CometChatFormatters/CometChatTextFormatter';
import { MessageBubbleAlignment } from '../Enums/Enums';
import { CometChatOption } from '../modals';
import { CometChatMentionsFormatter } from '../formatters/CometChatFormatters/CometChatMentionsFormatter/CometChatMentionsFormatter';
export interface additionalParams {
    disableMentions?: boolean;
    mentionsTargetElement?: number;
    textFormatters?: [];
    alignment?: MessageBubbleAlignment;
    textFormattersList?: CometChatTextFormatter[];
}
export interface lastConversationParams {
    textFormatters: CometChatMentionsFormatter[];
    disableMentions?: boolean;
    mentionsTargetElement?: number;
    alignment?: MessageBubbleAlignment;
    textFormattersList?: CometChatTextFormatter[];
}
/**
 * Utility class for handling conversations in CometChat.
 * It is used in CometChatConversations component and dataSource utils.
 */
export declare class ConversationUtils {
    private static additionalParams?;
    /**
     * Returns the default conversation options.
     *
     * @returns {CometChatOption[]} - An array of default conversation options.
     */
    static getDefaultOptions(): CometChatOption[];
    /**
     * Retrieves the last conversation message for a given conversation object.
     *
     * @param {CometChat.Conversation} conversationObject - The conversation object.
     * @param {CometChat.User} loggedInUser - The logged-in user.
     * @param {additionalParams} [additionalParams] - Additional parameters for message formatting.
     * @returns {string} - The last conversation message as a string.
     */
    static getLastConversationMessage(conversationObject: CometChat.Conversation, loggedInUser: CometChat.User, additionalParams?: lastConversationParams): string;
    /**
     * Retrieves the last message for a given conversation.
     *
     * @param {CometChat.Conversation} conversation - The conversation object.
     * @returns {string} - The last message as a string.
     */
    static getLastMessage(conversation: CometChat.Conversation): string;
    /**
     * Retrieves the last custom message for a given conversation.
     *
     * @param {CometChat.Conversation} conversation - The conversation object.
     * @returns {string} - The custom message type as a string.
     */
    static getLastMessageCustom(conversation: CometChat.Conversation): string;
    /**
    * Retrieves the last action message for a given conversation.
    *
    * @param {CometChat.Conversation} conversation - The conversation object.
    * @returns {string} - The action message as a string.
    */
    static getLastMessageAction(conversation: CometChat.Conversation): string;
    /**
     * Retrieves the last call message from a conversation.
     * Differentiates between audio and video calls.
     *
     * @param {CometChat.Conversation} conversation - The conversation object to retrieve the last call message from.
     * @returns {string} - A localized string indicating the type of call (audio or video).
     */
    static getLastMessageCall(conversation: CometChat.Conversation): any;
}

import { DataSource } from "../../../utils/DataSource";
import { DataSourceDecorator } from "../../../utils/DataSourceDecorator";
import { CometChatActionsIcon, CometChatActionsView } from "../../../modals";
import { MessageBubbleAlignment } from "../../../Enums/Enums";
/**
 * Decorator class for extending the functionality of message translation in a chat application.
 *
 * @extends {DataSourceDecorator}
 */
export declare class MessageTranslationExtensionDecorator extends DataSourceDecorator {
    newDataSource: DataSource;
    /**
     * Creates an instance of MessageTranslationExtensionDecorator.
     *
     * @param {DataSource} dataSource - The data source to decorate.
     * @param {MessageTranslationConfiguration} [configuration] - Optional configuration for message translation.
     */
    constructor(dataSource: DataSource);
    /**
     * Retrieves options for text message actions, including a translation option if not already present.
     *
     * @override
     * @param {CometChat.User} loggedInUser - The currently logged-in user.
     * @param {CometChat.BaseMessage} messageObject - The message object for which options are retrieved.
     * @param {CometChat.Group} [group] - Optional group associated with the message.
     * @returns {(CometChatActionsIcon | CometChatActionsView)[]} The array of action options for the message.
     */
    getTextMessageOptions(loggedInUser: CometChat.User, messageObject: CometChat.BaseMessage, group?: CometChat.Group, additionalParams?: {
        hideTranslateMessageOption: boolean;
    }): (CometChatActionsIcon | CometChatActionsView)[];
    /**
     * Retrieves the content view for a text message, including translated content if available.
     *
     * @override
     * @param {CometChat.TextMessage} message - The text message for which content view is retrieved.
     * @param {MessageBubbleAlignment} alignment - The alignment of the message bubble.
     * @param {any} [additionalConfigurations] - Optional additional configurations for the content view.
     * @returns {JSX.Element} The content view for the text message.
     */
    getTextMessageContentView(message: CometChat.TextMessage, alignment: MessageBubbleAlignment, additionalConfigurations?: any): import("react/jsx-runtime").JSX.Element | Element;
    /**
     * Checks if an option with the specified ID already exists in the options list.
     *
     * @param {(CometChatActionsIcon | CometChatActionsView)[]} template - The list of options to check.
     * @param {string} id - The ID of the option to check for.
     * @returns {boolean} `true` if the option exists, otherwise `false`.
     */
    checkIfOptionExist(template: (CometChatActionsIcon | CometChatActionsView)[], id: string): boolean;
    /**
     * Retrieves the unique ID for this decorator.
     *
     * @returns {string} The ID of this decorator.
     */
    getId(): string;
}

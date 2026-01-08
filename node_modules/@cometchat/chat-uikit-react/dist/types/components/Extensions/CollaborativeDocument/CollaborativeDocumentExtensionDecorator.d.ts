import { DataSource } from "../../../utils/DataSource";
import { DataSourceDecorator } from "../../../utils/DataSourceDecorator";
import { CollaborativeDocumentConfiguration } from "./CollaborativeDocumentConfiguration";
import { MessageBubbleAlignment } from "../../../Enums/Enums";
import { CometChatMessageComposerAction, CometChatMessageTemplate } from "../../../modals";
/**
 * The `CollaborativeDocumentExtensionDecorator` class extends `DataSourceDecorator`
 * to provide additional features and customizations for the collaborative document extension.
 * It integrates with the CometChat UIKit to enable document collaboration in chat.
 */
export declare class CollaborativeDocumentExtensionDecorator extends DataSourceDecorator {
    /**
    * The configuration for the collaborative document extension.
    * This configuration object allows customizing the appearance and behavior
    * of the document collaboration features.
    *
    * @type {CollaborativeDocumentConfiguration | undefined}
    */
    configuration?: CollaborativeDocumentConfiguration;
    /**
     * The new data source object.
     * This is used to manage and manipulate the data for the collaborative document extension.
     *
     * @type {DataSource}
     */
    newDataSource: DataSource;
    /**
    * The user who is currently logged in.
    */
    protected loggedInUser?: CometChat.User | null | undefined;
    /**
     * Creates an instance of `CollaborativeDocumentExtensionDecorator`.
     *
     * @param {DataSource} dataSource - The data source object to be decorated.
     * @param {CollaborativeDocumentConfiguration} [configuration] - An optional configuration object for the extension.
     */
    constructor(dataSource: DataSource, configuration?: CollaborativeDocumentConfiguration);
    /**
    * Retrieves all message types supported by the extension, including custom document messages.
    *
    * @returns {string[]} An array of message types.
    * @override
    */
    getAllMessageTypes(): string[];
    /**
    * Retrieves the unique ID of the collaborative document extension.
    *
    * @returns {string} The unique ID for the extension.
    * @override
    */
    getId(): string;
    /**
     * Retrieves all message categories supported by the extension, including custom categories.
     *
     * @returns {string[]} An array of message categories.
     * @override
     */
    getAllMessageCategories(additionalConfigurations?: Object | undefined): string[];
    /**
     * Checks if a message template with the specified type already exists.
     *
     * @param {CometChatMessageTemplate[]} template - An array of message templates.
     * @param {string} type - The message type to check for.
     * @returns {boolean} `true` if the template exists, otherwise `false`.
     */
    checkIfTemplateExist(template: CometChatMessageTemplate[], type: string): boolean;
    /**
     * Retrieves all message templates, including the custom document template.
     *
     * @param {any} [additionalConfigurations] - Additional configurations for the templates.
     * @returns {CometChatMessageTemplate[]} An array of message templates.
     * @override
     */
    getAllMessageTemplates(additionalConfigurations?: any): CometChatMessageTemplate[];
    /**
     * Creates a custom message template for the collaborative document extension.
     *
     * @returns {CometChatMessageTemplate} A message template for the document extension.
     */
    getDocumentTemplate(): CometChatMessageTemplate;
    /**
     * Retrieves the content view for the document message bubble.
     *
     * @param {CometChat.CustomMessage} documentMessage - The document message to display.
     * @returns {JSX.Element} The document content view component.
     */
    getDocumentContentView(documentMessage: CometChat.CustomMessage, alignment?: MessageBubbleAlignment): import("react/jsx-runtime").JSX.Element;
    /**
    * Launches the collaborative document in a new fullscreen window.
    *
    * @param {string} documentURL - The URL of the document to open.
    */
    launchCollaborativeDocument(documentURL: string): void;
    /**
     * Retrieves the URL for a collaborative document or board from a custom message.
     *
     * @param {CometChat.CustomMessage} message - The custom message containing the document or board data.
     * @returns {string | undefined} The URL of the document or board, or undefined if not found.
     */
    getDocumentURL(message: CometChat.CustomMessage): any;
    /**
     * Overrides the attachment options to include a new action for creating a collaborative document.
     *
     * @param {any} id - The identifier object containing user or group information.
     * @returns {CometChatMessageComposerAction[]} The list of attachment options including the new document action.
     */
    getAttachmentOptions(id: any, additionalConfigurations?: any): CometChatMessageComposerAction[];
    /**
     * Retrieves the last message from a conversation, checking if it's a collaborative document.
     *
     * @param {CometChat.Conversation} conversation - The conversation object containing the last message.
     * @param {CometChat.User} loggedInUser - The currently logged-in user.
     * @param {any} [additionalConfigurations] - Optional additional configurations for the message retrieval.
     * @returns {string} A string representing the last message, or a custom message if it's a collaborative document.
     */
    getLastConversationMessage(conversation: CometChat.Conversation, loggedInUser: CometChat.User, additionalConfigurations?: any): string;
}

import { DataSource } from "../../../utils/DataSource";
import { DataSourceDecorator } from "../../../utils/DataSourceDecorator";
import { CollaborativeWhiteboardConfiguration } from "./CollaborativeWhiteboardConfiguration";
import { MessageBubbleAlignment } from "../../../Enums/Enums";
import { CometChatMessageComposerAction, CometChatMessageTemplate } from "../../../modals";
/**
 * Decorator class for extending functionality related to collaborative whiteboard.
 * @extends DataSourceDecorator
 */
export declare class CollaborativeWhiteBoardExtensionDecorator extends DataSourceDecorator {
    /**
     * Configuration for the collaborative whiteboard extension.
     * @type {CollaborativeWhiteboardConfiguration | undefined}
     */
    configuration?: CollaborativeWhiteboardConfiguration;
    /**
     * Data source used for fetching and managing data.
     * @type {DataSource}
     */
    newDataSource: DataSource;
    /**
     * The user who is currently logged in.
     */
    protected loggedInUser?: CometChat.User | null | undefined;
    /**
     * Creates an instance of the CollaborativeWhiteBoardExtensionDecorator.
     * @param {DataSource} dataSource - The data source to be decorated.
     * @param {CollaborativeWhiteboardConfiguration} [configuration] - The configuration for the whiteboard extension.
     */
    constructor(dataSource: DataSource, configuration?: CollaborativeWhiteboardConfiguration);
    /**
     * Gets all message types including the whiteboard extension type.
     * @returns {string[]} Array of message types.
     */
    getAllMessageTypes(): string[];
    getId(): string;
    /**
     * Gets the unique identifier for the collaborative whiteboard extension.
     * @returns {string} The extension ID.
     */
    getAllMessageCategories(additionalConfigurations?: Object | undefined): string[];
    /**
     * Checks if a message template of a given type exists.
     * @param {CometChatMessageTemplate[]} template - Array of message templates.
     * @param {string} type - Type of the template to check.
     * @returns {boolean} True if the template exists, otherwise false.
     */
    checkIfTemplateExist(template: CometChatMessageTemplate[], type: string): boolean;
    /**
     * Gets all message templates, including the whiteboard template if not already present.
     * @param {any} [additionalConfigurations] - Additional configurations.
     * @returns {CometChatMessageTemplate[]} Array of message templates.
     */
    getAllMessageTemplates(additionalConfigurations?: any): CometChatMessageTemplate[];
    /**
     * Creates the whiteboard message template.
     * @returns {CometChatMessageTemplate} The whiteboard message template.
     */
    getWhiteBoardTemplate(): CometChatMessageTemplate;
    /**
     * Generates the content view for the whiteboard message.
     * @param {CometChat.CustomMessage} whiteboardMessage - The whiteboard message.
     * @returns {JSX.Element} The content view for the whiteboard message.
     */
    getWhiteboardContentView(whiteboardMessage: CometChat.CustomMessage, alignment?: MessageBubbleAlignment): import("react/jsx-runtime").JSX.Element;
    /**
     * Opens the collaborative whiteboard document in a new fullscreen window.
     * @param {string} whiteboardURL - The URL of the whiteboard document.
     */
    launchCollaborativeWhiteboardDocument(whiteboardURL: string): void;
    /**
     * Retrieves the URL of the whiteboard document from the message data.
     * @param {CometChat.CustomMessage} message - The message containing whiteboard data.
     * @returns {string | undefined} The URL of the whiteboard document.
     */
    getWhiteboardDocument(message: CometChat.CustomMessage): any;
    /**
     * Overrides the method to get attachment options for the message composer.
     * Adds an option for a collaborative whiteboard if the parent message ID is not present.
     *
     * @param {any} id - The ID object containing user or group information.
     * @returns {CometChatMessageComposerAction[]} An array of message composer actions.
     */
    getAttachmentOptions(id: any, additionalConfigurations?: any): CometChatMessageComposerAction[];
    /**
    * Overrides the method to get the last message from a conversation.
    * Checks if the last message is related to the collaborative whiteboard extension
    * and returns a custom message if it matches.
    * @param {CometChat.Conversation} conversation - The conversation object from which to get the last message.
    * @param {CometChat.User} loggedInUser - The currently logged-in user.
    * @param {any} additionalConfigurations - Additional configurations if any.
    * @returns {string} A string representing the last conversation message.
    */
    getLastConversationMessage(conversation: CometChat.Conversation, loggedInUser: CometChat.User, additionalConfigurations: any): string;
}

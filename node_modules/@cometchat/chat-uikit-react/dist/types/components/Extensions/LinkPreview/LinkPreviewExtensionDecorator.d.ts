import { DataSource } from "../../../utils/DataSource";
import { DataSourceDecorator } from "../../../utils/DataSourceDecorator";
import { MessageBubbleAlignment } from "../../../Enums/Enums";
/**
 * The `LinkPreviewExtensionDecorator` class is responsible for adding link preview functionality
 * to text messages within the chat. It decorates the data source with the ability to handle link previews.
 */
export declare class LinkPreviewExtensionDecorator extends DataSourceDecorator {
    /**
     * The data source that the decorator wraps, adding link preview capabilities.
     * @type {DataSource}
     */
    newDataSource: DataSource;
    /**
     * Creates an instance of the `LinkPreviewExtensionDecorator` class.
     *
     * @param {DataSource} dataSource - The data source that the decorator will wrap.
     * @param {LinkPreviewConfiguration} [configuration] - Optional configuration settings for the link preview extension.
     */
    constructor(dataSource: DataSource);
    /**
     * Returns the unique identifier for this decorator.
     * @returns {string} The ID of the decorator.
     */
    getId(): string;
    /**
     * Retrieves the content view for a text message with potential link preview enhancements.
     * @param {CometChat.TextMessage} message - The text message to be displayed.
     * @param {MessageBubbleAlignment} alignment - The alignment of the message bubble.
     * @param {any} [additionalConfigurations] - Additional configurations for formatting.
     * @returns {JSX.Element} The JSX element representing the message content view.
     */
    getTextMessageContentView(message: CometChat.TextMessage, alignment: MessageBubbleAlignment, additionalConfigurations?: any): import("react/jsx-runtime").JSX.Element | Element;
    /**
     * Retrieves the style for the link preview wrapper.
     * @returns {object} The style object for the link preview wrapper.
     */
    getLinkPreviewWrapperStyle(): {
        height: string;
        width: string;
    };
    /**
     * Opens the provided URL in a new browser tab.
     * @param {string} url - The URL to open.
     */
    openLink(url: string): void;
    /**
     * Extracts the link preview object from the message metadata, if available.
     * @param {CometChat.TextMessage} message - The message object containing metadata.
     * @returns {object|null} The link preview object if available, otherwise null.
     */
    getLinkPreview(message: CometChat.TextMessage): any;
    /**
     * Retrieves a specific detail from the link preview object.
     * @param {object} linkPreviewObject - The link preview object containing various details.
     * @param {string} key - The key corresponding to the detail to retrieve.
     * @returns {string} The detail value corresponding to the provided key.
     */
    getLinkPreviewDetails(linkPreviewObject: any, key: string): string;
}

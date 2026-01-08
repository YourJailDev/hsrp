import { ExtensionsDataSource } from "../ExtensionsDataSource";
/**
 * The `LinkPreviewExtension` class is responsible for enabling the link preview feature within the chat application.
 * It extends the `ExtensionsDataSource` class and utilizes a configuration object to customize the behavior of the link preview extension.
 */
export declare class LinkPreviewExtension extends ExtensionsDataSource {
    /**
     * Creates an instance of the `LinkPreviewExtension` class.
     *
     * @param {LinkPreviewConfiguration} [configuration] - Optional configuration settings for the link preview extension.
     */
    constructor();
    /**
     * Adds the link preview extension to the chat application by enabling it within the `ChatConfigurator`.
     * This method overrides the base class method to provide specific implementation for the link preview extension.
     */
    addExtension(): void;
    /**
     * Retrieves the unique identifier for the link preview extension.
     *
     * @returns {string} The unique identifier for the link preview extension.
     */
    getExtensionId(): string;
}

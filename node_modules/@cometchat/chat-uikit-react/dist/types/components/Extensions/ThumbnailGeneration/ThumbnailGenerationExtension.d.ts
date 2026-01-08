import { ExtensionsDataSource } from "../ExtensionsDataSource";
/**
 * Class representing a Thumbnail Generation extension for managing thumbnail generation functionality.
 *
 * @extends {ExtensionsDataSource}
 */
export declare class ThumbnailGenerationExtension extends ExtensionsDataSource {
    /**
     * Adds the Thumbnail Generation extension by configuring the ChatConfigurator.
     *
     * This method enables the Thumbnail Generation extension by creating and adding a
     * `ThumbnailGenerationExtensionDecorator` to the `ChatConfigurator`.
     */
    addExtension(): void;
    /**
     * Gets the unique identifier for the Thumbnail Generation extension.
     *
     * @returns {string} The unique identifier for the Thumbnail Generation extension.
     */
    getExtensionId(): string;
}

import { ExtensionsDataSource } from "../ExtensionsDataSource";
import { CollaborativeWhiteboardConfiguration } from "./CollaborativeWhiteboardConfiguration";
/**
 * Class representing a Collaborative Whiteboard Extension.
 * This class extends the `ExtensionsDataSource` to add support for collaborative whiteboard functionality.
 */
export declare class CollaborativeWhiteboardExtension extends ExtensionsDataSource {
    /**
     * Configuration for the collaborative whiteboard extension.
     * @type {CollaborativeWhiteboardConfiguration | undefined}
     */
    private configuration?;
    /**
     * Creates an instance of the CollaborativeWhiteboardExtension.
     * @param {CollaborativeWhiteboardConfiguration} [configuration] - The configuration for the whiteboard extension.
     */
    constructor(configuration?: CollaborativeWhiteboardConfiguration);
    /**
     * Adds the collaborative whiteboard extension to the chat configurator.
     * This method enables the extension by passing a new `CollaborativeWhiteBoardExtensionDecorator`
     * instance to the `ChatConfigurator`.
     */
    addExtension(): void;
    /**
     * Gets the unique identifier for the whiteboard extension.
     * @returns {string} The extension ID for the whiteboard.
     */
    getExtensionId(): string;
}

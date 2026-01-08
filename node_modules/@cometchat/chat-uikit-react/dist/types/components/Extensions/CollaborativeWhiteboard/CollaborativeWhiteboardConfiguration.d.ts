/**
 * Configuration class for Collaborative Whiteboard.
 * This class provides methods to retrieve styles and URLs associated with the whiteboard component.
 */
export declare class CollaborativeWhiteboardConfiguration {
    /**
     * The URL of the icon to be used for the whiteboard.
     * @type {string}
     */
    private iconURL;
    /**
     * The URL of the icon to be used for the whiteboard option.
     * @type {string}
     */
    private optionIconURL;
    /**
     * Creates an instance of CollaborativeWhiteboardConfiguration.
     */
    constructor(configuration: {
        iconURL?: string;
        optionIconURL?: string;
    });
    /**
     * Retrieves the URL of the icon used for the whiteboard.
     *
     * @returns {string} The URL of the icon.
     */
    getIconURL(): string;
    /**
     * Retrieves the URL of the icon used for the whiteboard option.
     *
     * @returns {string} The URL of the option icon.
     */
    getOptionIconURL(): string;
}

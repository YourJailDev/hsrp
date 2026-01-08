import { ExtensionsDataSource } from "../ExtensionsDataSource";
/**
 * The StickersExtension class extends the ExtensionsDataSource and is responsible for
 * configuring and adding the Stickers extension to the chat application.
 *
 * @class
 * @extends {ExtensionsDataSource}
 */
export declare class StickersExtension extends ExtensionsDataSource {
    /**
     * Creates an instance of StickersExtension.
     *
     * @param {StickersConfiguration} [configuration] - Optional configuration for the Stickers extension.
     */
    constructor();
    /**
     * Adds the Stickers extension by enabling it in the ChatConfigurator.
     * This method is called to register the Stickers extension with the chat application.
     *
     * @override
     * @returns {void}
     */
    addExtension(): void;
    /**
    * Returns the unique ID of the Stickers extension.
    *
    * @override
    * @returns {string} The ID of the Stickers extension.
    */
    getExtensionId(): string;
}

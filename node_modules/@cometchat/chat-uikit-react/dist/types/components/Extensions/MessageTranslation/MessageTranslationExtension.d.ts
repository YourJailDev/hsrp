import { ExtensionsDataSource } from "../ExtensionsDataSource";
/**
 * Class for handling message translation extensions.
 *
 * @class MessageTranslationExtension
 * @extends {ExtensionsDataSource}
 */
export declare class MessageTranslationExtension extends ExtensionsDataSource {
    /**
    * Creates an instance of MessageTranslationExtension.
    *
    * @param {MessageTranslationConfiguration} [configuration] - Optional configuration for message translation.
    */
    constructor();
    /**
     * Adds the message translation extension by enabling the ChatConfigurator with
     * a new MessageTranslationExtensionDecorator instance.
     *
     * @override
     * @returns {void}
     */
    addExtension(): void;
    /**
     * Retrieves the unique identifier for the message translation extension.
     *
     * @override
     * @returns {string} The unique identifier for the message translation extension.
     */
    getExtensionId(): string;
}

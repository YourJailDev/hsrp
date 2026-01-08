import { CallingExtension } from "../components/Calling/CallingExtension";
import { ExtensionsDataSource } from "../components/Extensions/ExtensionsDataSource";
import { CometChatLocalize } from "../resources/CometChatLocalize/cometchat-localize";
import { UIKitSettings } from "./UIKitSettings";
import { CometChatSoundManager } from "../resources/CometChatSoundManager/CometChatSoundManager";
import { DataSource } from "../utils/DataSource";
interface CometChatUiKit {
    name: string;
    version: string;
}
declare global {
    interface Window {
        CometChatUiKit: CometChatUiKit;
    }
}
/**
 * `CometChatUIKit` is a class that provides an interface for initializing and interacting with the CometChat UI Kit.
 * It handles various aspects of the UI Kit, including configuration, messaging, and extension management.
 * It is used in Calling, Conversations, Groups and Users components.
 * @class
 */
declare class CometChatUIKit {
    /**
     * `CometChatUIKit` is a class that provides an interface for initializing and interacting with the CometChat UI Kit.
     * It handles various aspects of the UI Kit, including configuration, messaging, and extension management.
     *
     * @class
     */
    static uiKitSettings: UIKitSettings | null;
    /**
     * The sound manager for handling sound-related functionalities in the UI Kit.
     * @type {typeof CometChatSoundManager}
     */
    static SoundManager: typeof CometChatSoundManager;
    /**
    * The localizer for internationalization.
    * @type {typeof CometChatLocalize}
    */
    static Localize: typeof CometChatLocalize;
    /**
    * Settings related to conversation updates.
    * @type {CometChat.ConversationUpdateSettings}
    */
    static conversationUpdateSettings: CometChat.ConversationUpdateSettings;
    /**
    * Variable for storing theme mode of the UIKit.
    */
    static themeMode: "light" | "dark";
    /**
     * Initializes the CometChat UI Kit with the provided settings.
     * @param {UIKitSettings | null} uiKitSettings - The settings for initializing the UI Kit.
     * @returns {Promise<Object> | undefined} - A promise that resolves with an object if initialization is successful, otherwise `undefined`.
     */
    static init(uiKitSettings: UIKitSettings | null): Promise<Object> | undefined;
    /**
    * Default extensions included in the UI Kit.
    * @type {ExtensionsDataSource[]}
    */
    static defaultExtensions: ExtensionsDataSource[];
    /**
* Default callingExtension included in the UI Kit.
* @type {CallingExtension}
*/
    static defaultCallingExtension: CallingExtension;
    /**
     * Checking if the SDK is initialized.
     */
    static isInitialized(): boolean | undefined;
    /**
     * Enables calling functionality in the UI Kit.
     */
    static enableCalling(): void;
    /**
     * Performs post-login initialization tasks.
     * @private
     */
    private static initiateAfterLogin;
    /**
     * Logs in a user with the specified UID.
     * @param {string} uid - The UID of the user to log in.
     * @returns {Promise<CometChat.User>} - A promise that resolves with the logged-in user.
     */
    static login(uid: string): Promise<CometChat.User>;
    /**
    * Logs in a user with the specified authentication token.
    * @param {string} authToken - The authentication token for the user.
    * @returns {Promise<CometChat.User>} - A promise that resolves with the logged-in user.
    */
    static loginWithAuthToken(authToken: string): Promise<CometChat.User>;
    /**
    * Retrieves the currently logged-in user.
    * @returns {Promise<CometChat.User | null>} - A promise that resolves with the logged-in user or `null` if no user is logged in.
    */
    static getLoggedinUser(): Promise<CometChat.User | null>;
    /**
    * Creates a new user with the specified details.
    * @param {CometChat.User} user - The user details to create.
    * @returns {Promise<CometChat.User>} - A promise that resolves with the created user.
    */
    static createUser(user: CometChat.User): Promise<CometChat.User>;
    /**
    * Updates the details of an existing user.
    * @param {CometChat.User} user - The user details to update.
    * @returns {Promise<CometChat.User>} - A promise that resolves with the updated user.
    */
    static updateUser(user: CometChat.User): Promise<CometChat.User>;
    /**
     * Logs out the current user.
     * @returns {Promise<Object>} - A promise that resolves with a message object upon successful logout.
     */
    static logout(): Promise<Object>;
    /**
     * Checks if the UI Kit settings are properly configured.
     * @returns {boolean} - `true` if UI Kit settings are available and valid, otherwise `false`.
     */
    static checkAuthSettings(): boolean;
    /**
    * Sends a custom message and returns a promise with the result.
    * @param {CometChat.CustomMessage} message - The custom message to be sent.
    * @returns {Promise<CometChat.BaseMessage>} - A promise that resolves with the sent message.
    */
    static sendCustomMessage(message: CometChat.CustomMessage): Promise<unknown>;
    /**
    * Sends a text message and returns a promise with the result.
    * @param {CometChat.TextMessage} message - The text message to be sent.
    * @returns {Promise<CometChat.BaseMessage>} - A promise that resolves with the sent message.
    */
    static sendTextMessage(message: CometChat.TextMessage): Promise<CometChat.BaseMessage>;
    /**
     * Sends a media message and returns a promise with the result.
     * @param {CometChat.MediaMessage} message - The media message to be sent.
     * @returns {Promise<CometChat.BaseMessage>} - A promise that resolves with the sent message.
     */
    static sendMediaMessage(message: CometChat.MediaMessage): Promise<CometChat.BaseMessage>;
    /**
     * Retrieves the data source for chat configuration.
     * @returns {DataSource} - The chat data source.
     */
    static getDataSource(): DataSource;
}
export { CometChatUIKit };

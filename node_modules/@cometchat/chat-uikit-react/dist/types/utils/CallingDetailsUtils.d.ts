/**
 * Utility class for handling call-related details in CometChat.
 * It is used in CallingExtensionDecorator component.
 */
export declare class CallingDetailsUtils {
    /**
     * Retrieves the default message types used in calling.
     *
     * @returns {string[]} An array of default message types for audio, video, and meeting calls.
     */
    static getDefaultMessageTypes: () => string[];
    /**
     * Retrieves the default categories associated with calling.
     *
     * @returns {string[]} An array of default message categories for calls and custom messages.
     */
    static getDefaultCategories: () => string[];
    /**
     * Checks if the call was sent by the logged-in user.
     *
     * @param {CometChat.Call} call - The call object.
     * @param {CometChat.User} loggedInUser - The logged-in user object.
     * @returns {boolean} True if the call was sent by the logged-in user, otherwise false.
     */
    static isSentByMe(call: CometChat.Call, loggedInUser: CometChat.User): boolean;
    /**
    * Checks if the call is a missed call for the logged-in user.
    *
    * @param {CometChat.Call} call - The call object.
    * @param {CometChat.User} loggedInUser - The logged-in user object.
    * @returns {boolean} True if the call is missed, otherwise false.
    */
    static isMissedCall(call: CometChat.Call, loggedInUser: CometChat.User): boolean;
    /**
     * Retrieves the localized call status message based on the call status and the user.
     *
     * @param {CometChat.Call} call - The call object.
     * @param {CometChat.User} loggedInUser - The logged-in user object.
     * @returns {string} The localized call status message.
     */
    static getCallStatus(call: CometChat.Call, loggedInUser: CometChat.User): string;
}

/**
 * Manages the login state and listener attachment for CometChat users.
 * It is used in CometChatMessageComposer, CometChatMessageList, CometChatMessageInformation components.
 */
export declare class CometChatUIKitLoginListener {
    private static loggedInUser;
    private static listenerID;
    private static isAttached;
    /**
     * Sets the currently logged-in user.
     * @param user - The logged-in CometChat user.
     */
    static setLoggedInUser(user: CometChat.User): void;
    /**
     * Retrieves the currently logged-in user.
     * @returns The logged-in CometChat user or null.
     */
    static getLoggedInUser(): import("@cometchat/chat-sdk-javascript").User | null;
    /**
     * Removes the logged-in user.
     */
    static removeLoggedInUser(): void;
    /**
     * Attaches the login listener for CometChat.
     * If a listener is already attached, it is removed before attaching a new one.
     */
    static attachListener(): void;
    /**
     * Removes the attached login listener.
     */
    static removeListener(): void;
}

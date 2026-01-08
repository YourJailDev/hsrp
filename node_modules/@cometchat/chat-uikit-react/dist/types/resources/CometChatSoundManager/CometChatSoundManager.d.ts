/**
 * Manages and plays various types of audio for CometChat events.
 * The class provides methods to play sounds for incoming and outgoing messages and calls.
 * It is used in CometChatCallButtons, CometChatIncomingCall, CometChatConversations, CometChatMessageComposer components.
 */
export declare class CometChatSoundManager {
    static audio: string | null | HTMLAudioElement;
    static Sound: sounds;
    /**
     * Plays the sound for an incoming message.
     * @param {string|null} customSound - The custom sound URL or null to use the default.
     *
     * @example
     * // Trigger the audio sound for an incoming message
     * CometChatSoundManager.onIncomingMessage();
     *
     * @example
     * // Trigger the audio sound of your choice for an incoming message
     * CometChatSoundManager.onIncomingMessage("MP3_FILE_ASSET_PATH");
     */
    static onIncomingMessage: (customSound?: string | null) => void;
    /**
     * Plays the sound for an incoming message from another user.
     * @param {string|null} customSound - The custom sound URL or null to use the default.
     *
     * @example
     * // Trigger the audio sound for an incoming message from another user
     * CometChatSoundManager.onIncomingOtherMessage();
     *
     * @example
     * // Trigger the audio sound of your choice for an incoming message from another user
     * CometChatSoundManager.onIncomingOtherMessage("MP3_FILE_ASSET_PATH");
     */
    static onIncomingOtherMessage: (customSound?: string | null) => void;
    /**
     * Plays the sound for an outgoing message.
     * @param {string|null} customSound - The custom sound URL or null to use the default.
     *
     * @example
     * // Trigger the audio sound for an outgoing message
     * CometChatSoundManager.onOutgoingMessage();
     *
     * @example
     * // Trigger the audio sound of your choice for an outgoing message
     * CometChatSoundManager.onOutgoingMessage("MP3_FILE_ASSET_PATH");
     */
    static onOutgoingMessage: (customSound?: string | null) => void;
    /**
     * Plays the sound for an incoming call.
     * @param {string|null} customSound - The custom sound URL or null to use the default.
     *
     * @example
     * // Trigger the audio sound for an incoming call
     * CometChatSoundManager.onIncomingCall();
     *
     * @example
     * // Trigger the audio sound of your choice for an incoming call
     * CometChatSoundManager.onIncomingCall("MP3_FILE_ASSET_PATH");
     */
    static onIncomingCall: (customSound?: string | null) => void;
    /**
     * Plays the sound for an outgoing call.
     * @param {string|null} customSound - The custom sound URL or null to use the default.
     *
     * @example
     * // Trigger the audio sound for an outgoing call
     * CometChatSoundManager.onOutgoingCall();
     *
     * @example
     * // Trigger the audio sound of your choice for an outgoing call
     * CometChatSoundManager.onOutgoingCall("MP3_FILE_ASSET_PATH");
     */
    static onOutgoingCall: (customSound?: string | null) => void;
    /**
     * Contains mappings of sound types to their respective handler functions.
     *
     * The handlers are functions that trigger the playback of sounds for different events.
     *
     * @type {Object}
     * @property {Function} incomingCall - Handler function for playing the incoming call sound.
     * @property {Function} outgoingCall - Handler function for playing the outgoing call sound.
     * @property {Function} incomingMessage - Handler function for playing the incoming message sound.
     * @property {Function} incomingMessageFromOther - Handler function for playing the incoming message from other sound.
     * @property {Function} outgoingMessage - Handler function for playing the outgoing message sound.
     */
    static handlers: {
        incomingCall: (customSound?: string | null) => void;
        outgoingCall: (customSound?: string | null) => void;
        incomingMessage: (customSound?: string | null) => void;
        incomingMessageFromOther: (customSound?: string | null) => void;
        outgoingMessage: (customSound?: string | null) => void;
    };
    /**
    * Plays a predefined sound based on the provided sound type.
    * @param {"incomingCall" | "incomingMessage" | "incomingMessageFromOther" | "outgoingCall" | "outgoingMessage"} sound - The sound type to play.
    * @param {string|null} customSound - The custom sound URL or null to use the default.
    * @returns {boolean} - Returns false if the sound handler is not found.
    *
    * @example
    * // Play the sound for incoming messages
    * CometChatSoundManager.play("incomingMessage");
    *
    * @example
    * // Play a custom sound for outgoing messages
    * CometChatSoundManager.play("outgoingMessage", "MP3_FILE_ASSET_PATH");
    */
    static play(sound: "incomingCall" | "incomingMessage" | "incomingMessageFromOther" | "outgoingCall" | "outgoingMessage", customSound?: string | null): false | void;
    /**
     * Pauses the currently playing sound and resets its position.
     *
     * @example
     * // Pause the ongoing audio sound
     * CometChatSoundManager.pause();
     */
    static pause(): void;
    /**
     * Checks if the user has interacted with the page.
     * @returns {boolean} True if the user has interacted, false otherwise.
     */
    static hasInteracted(): boolean;
}
export interface sounds {
    incomingCall?: "incomingCall";
    incomingMessage?: "incomingMessage";
    incomingMessageFromOther: "incomingMessageFromOther";
    outgoingCall?: "outgoingCall";
    outgoingMessage?: "outgoingMessage";
}

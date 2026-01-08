import { Subject } from 'rxjs';
/**
 * Class to handle user-related events such as blocking and unblocking users
 */
export declare class CometChatUserEvents {
    static ccUserBlocked: Subject<CometChat.User>;
    static ccUserUnblocked: Subject<CometChat.User>;
    /**
     * Publishes a user event (like blocking/unblocking a user).
     * This function will emit the event using the 'next()' method of the Subject.
     *
     * @param {Subject<CometChat.User>} event - The user event to be published (e.g., block or unblock).
     * @param {any} item - The item (user) associated with the event.
     */
    static publishEvent(event: Subject<CometChat.User>, item: any): void;
}
